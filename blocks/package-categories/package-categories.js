/**
 * package-categories — the grey "Paket-Kategorien" listing: a title, a package search, then
 * groups of package cards (live .packagecategorysection).
 * Authoring: a one-cell row with the h2 title; per group a one-cell row with an h3; per card a
 * row with an image cell and a text cell (title paragraph + list of package-family links).
 * Decode tier: reconstructive — rows classified by content (heading row = title / group head,
 * row with an image = card); card parts classified by role and MOVED (EW1).
 * Behaviour (live parity): a family list longer than five shows five plus a "zeigen +N mehr"
 * reveal; the search field filters cards by title / family name.
 * @ew-exempt search placeholder "Search package" and the "zeigen +N mehr" reveal label
 *   (block-built UI strings of the source widget)
 */

const VISIBLE = 5;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function isMedia(node) {
  if (node.matches('picture, img')) return true;
  return node.tagName === 'P' && !!node.querySelector('picture, img') && !node.textContent.trim();
}

function decorateFamilies(fams) {
  const list = fams.querySelector('ul, ol');
  const items = list ? [...list.children] : [];
  if (items.length <= VISIBLE) return;
  const extra = items.slice(VISIBLE);
  extra.forEach((li) => { li.hidden = true; });
  const more = el('div', 'package-categories-more');
  const btn = el('button', 'package-categories-more-btn');
  btn.type = 'button';
  btn.append('zeigen ', el('span'), ' mehr');
  btn.querySelector('span').textContent = `+${extra.length}`;
  btn.addEventListener('click', () => {
    extra.forEach((li) => { li.hidden = false; });
    more.hidden = true;
    fams.classList.add('is-open');
  });
  more.append(btn);
  fams.append(more);
}

function decorateCard(cells) {
  const card = el('li', 'package-categories-card');
  const media = el('div', 'package-categories-media');
  const body = el('div', 'package-categories-body');
  const title = el('div', 'package-categories-title');
  const fams = el('div', 'package-categories-fams');
  cells.forEach((cell) => [...cell.children].forEach((node) => {
    if (isMedia(node)) media.append(node);
    else if (node.matches('ul, ol') && !fams.children.length) fams.append(node);
    else if (fams.children.length) fams.append(node);
    else title.append(node);
  }));
  [title, fams].forEach((slot) => {
    if (slot.children.length) body.append(slot);
  });
  if (media.children.length) card.append(media);
  card.append(body);
  decorateFamilies(fams);
  return card;
}

function searchField(inner) {
  const wrap = el('div', 'package-categories-search');
  const input = el('input', 'package-categories-input');
  input.type = 'text';
  input.placeholder = 'Search package';
  input.setAttribute('aria-label', 'Search package');
  wrap.append(el('span', 'package-categories-search-icon'), input);
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    inner.querySelectorAll('.package-categories-group').forEach((group) => {
      let shown = 0;
      group.querySelectorAll('.package-categories-card').forEach((card) => {
        const hit = !q || card.textContent.toLowerCase().includes(q);
        card.hidden = !hit;
        if (hit) shown += 1;
      });
      group.hidden = shown === 0;
    });
  });
  return wrap;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .package-categories-inner')) return;
  const inner = el('div', 'package-categories-inner');
  const head = el('div', 'package-categories-head');
  let group = null;
  let grid = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('picture, img')) {
      if (!group) {
        group = el('div', 'package-categories-group');
        inner.append(group);
      }
      if (!grid) {
        grid = el('ul', 'package-categories-grid');
        group.append(grid);
      }
      grid.append(decorateCard(cells));
      return;
    }
    const nodes = cells.flatMap((c) => [...c.children]);
    const isGroupHead = nodes.some((n) => n.tagName === 'H3')
      || (head.children.length && nodes.some((n) => /^H[1-6]$/.test(n.tagName)));
    if (isGroupHead) {
      group = el('div', 'package-categories-group');
      const ghead = el('div', 'package-categories-group-head');
      ghead.append(...nodes);
      group.append(ghead);
      inner.append(group);
      grid = null;
    } else {
      head.append(...nodes);
    }
  });
  head.append(searchField(inner));
  inner.prepend(head);
  block.replaceChildren(inner);
}
