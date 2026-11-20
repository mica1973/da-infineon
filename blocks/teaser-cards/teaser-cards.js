/**
 * teaser-cards — a heading over image teaser cards (live .teaserrowcards); variant `carousel`
 * slides the row with previous / next controls.
 * Authoring: a head row (heading only), then one row per card: image cell and text cell (bold
 * title paragraph, optional description paragraphs, link paragraph).
 * Decode tier: reconstructive — rows classified by content (a row with an image is a card); card
 * parts classified by role and MOVED (EW1). Arrow glyphs and slider controls are block-built.
 * Variant `tech` (package technologies row): head = heading + description paragraph; card text =
 * title, pre-title, description paragraphs in that order, then the link; the row is a slider at
 * every width (swipe below 992px, prev / next arrows with disabled ends at 992px and up).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function isMedia(node) {
  if (node.matches('picture, img')) return true;
  return node.tagName === 'P' && !!node.querySelector('picture, img') && !node.textContent.trim();
}

function decorateCard(cells, tech) {
  const card = el('li', 'teaser-cards-card');
  const media = el('div', 'teaser-cards-media');
  const body = el('div', 'teaser-cards-body');
  const title = el('div', 'teaser-cards-title');
  const pre = el('div', 'teaser-cards-pre');
  const desc = el('div', 'teaser-cards-desc');
  const link = el('div', 'teaser-cards-link');
  cells.forEach((cell) => [...cell.children].forEach((node) => {
    if (isMedia(node)) media.append(node);
    else if (node.querySelector('a')) link.append(node);
    else if (!title.children.length) title.append(node);
    else if (tech && !pre.children.length) pre.append(node);
    else desc.append(node);
  }));
  [title, pre, desc, link].forEach((slot) => {
    if (slot.children.length) body.append(slot);
  });
  if (media.children.length) card.append(media);
  card.append(body);
  return card;
}

function addControls(inner, track) {
  const nav = el('div', 'teaser-cards-nav');
  [['prev', 'Zurück', -1], ['next', 'Weiter', 1]].forEach(([name, label, dir]) => {
    const b = el('button', `teaser-cards-${name}`);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.addEventListener('click', () => {
      const card = track.querySelector('.teaser-cards-card');
      const step = card ? card.getBoundingClientRect().width + 36 : track.clientWidth;
      track.scrollBy({ left: dir * step, behavior: 'smooth' });
    });
    nav.append(b);
  });
  inner.append(nav);
}

function addTechControls(inner, track) {
  const nav = el('div', 'teaser-cards-nav');
  const prev = el('button', 'teaser-cards-prev');
  const next = el('button', 'teaser-cards-next');
  prev.type = 'button';
  next.type = 'button';
  prev.setAttribute('aria-label', 'Previous');
  next.setAttribute('aria-label', 'Next');
  const step = () => {
    const cards = track.querySelectorAll('.teaser-cards-card');
    return cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  };
  const sync = () => {
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  nav.append(prev, next);
  inner.append(nav);
  new ResizeObserver(sync).observe(track);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .teaser-cards-inner')) return;
  const inner = el('div', 'ifx-fixed teaser-cards-inner');
  const head = el('div', 'teaser-cards-head');
  const track = el('ul', 'teaser-cards-track');
  const tech = block.classList.contains('tech');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('picture, img')) track.append(decorateCard(cells, tech));
    else cells.forEach((c) => head.append(...c.children));
  });
  if (head.children.length) inner.append(head);
  inner.append(track);
  if (tech) addTechControls(inner, track);
  else if (block.classList.contains('carousel')) addControls(inner, track);
  block.replaceChildren(inner);
}
