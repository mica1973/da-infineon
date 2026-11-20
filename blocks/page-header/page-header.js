/**
 * page-header — the grey title band of company / information pages.
 *
 * Authored rows (all optional except the heading; any order inside a cell):
 *   - a heading (h1) and an optional description paragraph;
 *   - an optional jump-nav cell: a list of in-page `#anchor` links, plus an optional
 *     paragraph used as the mobile dropdown label ("Springen zu").
 *
 * Decode tier: template-slotted. Authored nodes are MOVED into empty slot wrappers
 * (EW1); the mobile dropdown list is a presentational clone of the authored list (EW4).
 * Behaviour (live parity): scroll-spy `active` on the jump links, the jump nav pins to the
 * top once scrolled past (fixed + shadow, out of flow), mobile dropdown toggle.
 * @ew-exempt mobile dropdown label fallback when no label paragraph is authored
 */

const ANCHOR_LIST = (el) => el.matches('ul, ol')
  && el.querySelector('a[href^="#"]')
  && [...el.querySelectorAll('a')].every((a) => (a.getAttribute('href') || '').startsWith('#'));

function stripInstrumentation(root) {
  [root, ...root.querySelectorAll('*')].forEach((el) => {
    [...el.attributes].forEach(({ name }) => {
      if (name === 'data-prose-index' || name === 'data-image-index'
        || name.startsWith('data-aue-') || name.startsWith('data-richtext-')) {
        el.removeAttribute(name);
      }
    });
  });
  return root;
}

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

/** Resolve each `#id` link to a target, giving a matching heading the id when it has none. */
function resolveTargets(links) {
  const main = document.querySelector('main') || document.body;
  const headings = [...main.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  const ids = [];
  links.forEach((a) => {
    const id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
    if (!id) return;
    a.dataset.spy = id;
    if (!document.getElementById(id)) {
      const label = a.textContent.trim().toLowerCase();
      const match = headings.find((h) => !h.closest('.page-header')
        && h.textContent.trim().toLowerCase() === label);
      if (match) match.id = id;
    }
    if (!ids.includes(id)) ids.push(id);
  });
  return ids;
}

function wireBehaviour(block, comp, navBar, jump) {
  const links = [...block.querySelectorAll('a[href^="#"]')];
  const ids = resolveTargets(links);
  let pinAt = null;

  const measurePin = () => {
    const bar = [navBar, jump].find((b) => b && b.offsetParent !== null);
    pinAt = bar ? bar.getBoundingClientRect().top + window.scrollY : null;
  };

  const update = () => {
    if (!comp.classList.contains('is-stuck')) measurePin();
    const y = window.scrollY + 120;
    let current = null;
    ids.forEach((id) => {
      const t = document.getElementById(id);
      if (t && t.getBoundingClientRect().top + window.scrollY <= y) current = id;
    });
    links.forEach((a) => a.classList.toggle('active', a.dataset.spy === current));
    if (pinAt !== null) comp.classList.toggle('is-stuck', window.scrollY > pinAt);
  };

  window.addEventListener('resize', () => {
    comp.classList.remove('is-stuck');
    update();
  });
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function wireDropdown(bar, list) {
  const toggle = (open) => {
    list.hidden = !open;
    bar.setAttribute('aria-expanded', String(open));
  };
  bar.addEventListener('click', () => toggle(list.hidden));
  bar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(list.hidden);
    }
  });
  list.addEventListener('click', (e) => {
    if (e.target.closest('a')) toggle(false);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .page-header-inner')) return;

  const inner = div('ifx-fixed page-header-inner');
  const comp = div('page-header-comp');
  const head = div('page-header-head');
  comp.append(head);
  inner.append(comp);

  let list = null;
  let label = null;
  const leftovers = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const els = [...cell.children];
      const cellList = els.find((el) => ANCHOR_LIST(el));
      els.forEach((el) => {
        if (el === cellList && !list) {
          list = el;
        } else if (cellList && !label && el.tagName === 'P' && !el.querySelector('a')) {
          label = el;
        } else if (/^H[1-6]$/.test(el.tagName) || el.tagName === 'P') {
          head.append(el);
        } else {
          leftovers.push(el);
        }
      });
    });
  });
  head.append(...leftovers);

  let navBar = null;
  let jump = null;
  if (list) {
    navBar = document.createElement('nav');
    navBar.className = 'page-header-nav';
    navBar.append(list);
    comp.append(navBar);

    jump = div('page-header-jump');
    const bar = div('page-header-jump-bar');
    bar.setAttribute('role', 'button');
    bar.tabIndex = 0;
    bar.setAttribute('aria-expanded', 'false');
    if (label) {
      bar.append(label);
    } else {
      const text = document.createElement('span');
      text.textContent = document.documentElement.lang === 'de' ? 'Springen zu' : 'Jump to';
      bar.append(text);
    }
    const chev = document.createElement('span');
    chev.className = 'page-header-chev';
    chev.setAttribute('aria-hidden', 'true');
    bar.append(chev);
    const clone = stripInstrumentation(list.cloneNode(true));
    clone.classList.add('page-header-jump-list');
    clone.hidden = true;
    jump.append(bar, clone);
    comp.append(jump);
    wireDropdown(bar, clone);
  }

  block.replaceChildren(inner);
  if (list) wireBehaviour(block, comp, navBar, jump);
}
