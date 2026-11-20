/**
 * accordion — a heading over expandable items (live .accordion-comp, "Vorteile").
 * Authoring: a head row (heading only), then one row per item: title cell (heading) and body
 * cell. Decode tier: reconstructive — rows classified by content (a row with a body cell is an
 * item); the authored title heading and body nodes are MOVED (EW1). The toggle is a
 * block-built, text-less control beside the heading (EW7: no <button> hosts authored text).
 *
 * Variant `glossary` (reference pages, live /de/glossary): the whole A–Z body in one block.
 * One-cell rows are flow groups kept in authored order (the A–Z index paragraph of `#` links,
 * a letter heading, optionally a plain term heading + definition); runs of two-cell rows are
 * collapsible term groups. Index links resolve to the letter heading by id, else by matching
 * text (the id is assigned). The panel animates its height (.35s) like the source's Bootstrap
 * collapse; reduced motion skips the animation.
 *
 * Modifier `article` (reference siblings /de/opn, /de/support/service-center): no letter
 * classification; a flow group holding the h1 is the title row; a list of `#` links = jump box
 * (links resolve to headings by text); 2-cell rows without a heading in the first cell are table
 * rows (first row = header); a 1-cell row of a bold-only title paragraph + link-only CTA paragraph
 * is an aside box (right column >= 992, after the body below). `spacious` = the wider hotline
 * spacing; `regions` = 20px item titles, first item open.
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

let seq = 0;

const isIndex = (cell) => {
  const links = [...cell.querySelectorAll('a')];
  return links.length > 1
    && links.every((a) => (a.getAttribute('href') || '').startsWith('#'))
    && !cell.querySelector('h1, h2, h3, h4, h5, h6');
};

function animate(body, open, done) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    done();
    return;
  }
  const from = open ? 0 : body.scrollHeight;
  const to = open ? body.scrollHeight : 0;
  body.classList.add('collapsing');
  body.style.height = `${from}px`;
  body.getBoundingClientRect();
  requestAnimationFrame(() => {
    body.style.height = `${to}px`;
  });
  body.addEventListener('transitionend', () => {
    body.classList.remove('collapsing');
    body.style.height = '';
    done();
  }, { once: true });
}

function buildItem(cells, glossary) {
  seq += 1;
  const item = div('accordion-item');
  const bar = div('accordion-bar');
  const title = div('accordion-title');
  title.append(...cells[0].children);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'accordion-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', `accordion-body-${seq}`);
  const heading = title.querySelector('h1, h2, h3, h4, h5, h6');
  toggle.setAttribute('aria-label', heading ? heading.textContent : 'Toggle');
  const body = div('accordion-body');
  body.id = `accordion-body-${seq}`;
  body.hidden = true;
  cells.slice(1).forEach((c) => body.append(...c.children));
  let busy = false;
  const flip = () => {
    if (busy) return;
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    if (!glossary) {
      body.hidden = !open;
      item.classList.toggle('open', open);
      return;
    }
    busy = true;
    if (open) {
      body.hidden = false;
      item.classList.add('open');
    }
    animate(body, open, () => {
      if (!open) {
        body.hidden = true;
        item.classList.remove('open');
      }
      busy = false;
    });
  };
  toggle.addEventListener('click', flip);
  title.addEventListener('click', flip);
  bar.append(title, toggle);
  item.append(bar, body);
  return item;
}

function linkIndex(block) {
  const headings = [...block.querySelectorAll('.accordion-flow :is(h1, h2, h3, h4, h5, h6)')];
  block.querySelectorAll(':is(.accordion-index, .accordion-jump) a[href^="#"]').forEach((a) => {
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (!id || document.getElementById(id)) return;
    const label = a.textContent.trim().toLowerCase();
    const match = headings.find((h) => h.textContent.trim().toLowerCase() === label);
    if (match) match.id = id;
  });
}

const isJump = (cell) => {
  const list = cell.querySelector('ul, ol');
  const links = list ? [...list.querySelectorAll('a')] : [];
  return links.length > 0 && links.every((a) => (a.getAttribute('href') || '').startsWith('#'));
};

/** Aside box (article): a bold-only title paragraph and a link-only CTA paragraph last. */
const isBox = (cell) => {
  const els = [...cell.children];
  const first = els[0];
  const last = els[els.length - 1];
  if (els.length < 2 || !first.matches('p') || !last.matches('p')) return false;
  const strong = first.querySelector('strong, b');
  const link = last.querySelector('a');
  return !!strong && first.textContent.trim() === strong.textContent.trim()
    && !!link && last.textContent.trim() === link.textContent.trim();
};

function buildTable(rows) {
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const body = document.createElement('tbody');
  rows.forEach((cells, i) => {
    const tr = document.createElement('tr');
    cells.forEach((cell) => {
      const td = document.createElement(i === 0 ? 'th' : 'td');
      td.append(...cell.children);
      tr.append(td);
    });
    (i === 0 ? head : body).append(tr);
  });
  table.append(head, body);
  const wrap = div('accordion-table');
  wrap.append(table);
  return wrap;
}

function decorateGlossary(block, inner) {
  const article = block.classList.contains('article');
  const main = article ? div('accordion-main') : inner;
  const aside = div('accordion-aside');
  let list = null;
  let tableRows = null;
  const flushTable = () => {
    if (tableRows) main.append(buildTable(tableRows));
    tableRows = null;
  };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      if (article && !cells[0].querySelector('h1, h2, h3, h4, h5, h6')) {
        list = null;
        if (!tableRows) tableRows = [];
        tableRows.push(cells);
        return;
      }
      flushTable();
      if (!list) {
        list = div('accordion-items');
        main.append(list);
      }
      list.append(buildItem(cells, true));
      return;
    }
    list = null;
    flushTable();
    const cell = cells[0] || row;
    const group = div('accordion-flow');
    if (article && isBox(cell)) {
      group.className = 'accordion-box';
      group.append(...cell.children);
      aside.append(group);
      return;
    }
    if (article && isJump(cell)) {
      group.classList.add('accordion-jump');
    } else if (isIndex(cell)) {
      group.classList.add('accordion-index');
    } else if (article) {
      if (cell.querySelector('h1')) group.classList.add('accordion-title-group');
    } else {
      const head = cell.querySelector('h1, h2, h3, h4, h5, h6');
      if (head && head.matches('h2, h3')) {
        group.classList.add('accordion-letter');
        if (head.matches('h3')) group.classList.add('accordion-letter-minor');
      }
      if (cell.querySelector('h4, h5, h6')) group.classList.add('accordion-plain');
    }
    group.append(...cell.children);
    main.append(group);
  });
  flushTable();
  if (article) {
    if (aside.children.length) {
      const title = main.querySelector(':scope > .accordion-title-group');
      if (title) inner.append(title);
      const cols = div('accordion-columns');
      cols.append(main, aside);
      inner.append(cols);
      block.classList.add('has-aside');
    } else {
      inner.append(main);
    }
  }
  block.replaceChildren(inner);
  linkIndex(block);
  if (block.classList.contains('regions')) {
    const first = block.querySelector('.accordion-item');
    if (first) {
      first.classList.add('open');
      first.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'true');
      first.querySelector('.accordion-body').hidden = false;
    }
  }
}

export default function decorate(block) {
  if (block.querySelector(':scope > .accordion-inner')) return;
  const inner = div('ifx-fixed accordion-inner');
  if (block.classList.contains('glossary')) {
    decorateGlossary(block, inner);
    return;
  }
  const head = div('accordion-head');
  const list = div('accordion-items');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      cells.forEach((c) => head.append(...c.children));
      return;
    }
    list.append(buildItem(cells, false));
  });
  [head, list].forEach((slot) => {
    if (slot.children.length) inner.append(slot);
  });
  block.replaceChildren(inner);
}
