/**
 * hub-band — a hub teaser band: heading, lead, primary CTA and a two-column link list beside a
 * masked image. Variant `events`: heading + lead, then one row per event card
 * (image cell | body cell: date list, title paragraph, facts list, link paragraphs) and an
 * optional CTA row. Variant `split`: text / media rows (one cell per column, authored order =
 * visual order); a row without media but with two cells is a text | text row; one-cell rows
 * before the first column row are the head, after it the foot.
 *
 * Decode tier: template-slotted (hub) / reconstructive (events cards — classified by content:
 * a row with an image is a card, a row with a heading is the head, the rest is the CTA row).
 * Authored nodes are MOVED into empty slot wrappers (EW1); link icons are block-built
 * decoration (arrow for internal links, launch glyph for external ones).
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function isMedia(el) {
  if (el.matches('picture, img')) return true;
  return el.tagName === 'P' && !!el.querySelector('picture, img') && !el.textContent.trim();
}

function isExternal(a) {
  try {
    return new URL(a.href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}

function addLinkIcon(a, internalIcon) {
  if (a.querySelector(':scope > .hub-band-icon')) return;
  const name = isExternal(a) ? 'launch' : internalIcon;
  if (!name) return;
  const icon = document.createElement('span');
  icon.className = `icon icon-${name} hub-band-icon`;
  icon.setAttribute('aria-hidden', 'true');
  a.append(icon);
}

function cellElements(block) {
  const els = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => els.push(...cell.children));
  });
  return els;
}

function decorateHub(block) {
  const inner = div('ifx-fixed hub-band-inner');
  const text = div('hub-band-text');
  const media = div('hub-band-media');
  cellElements(block).forEach((el) => {
    if (isMedia(el)) {
      media.append(el);
    } else {
      if (el.matches('ul, ol')) el.querySelectorAll('a').forEach((a) => addLinkIcon(a, 'arrow-right'));
      text.append(el);
    }
  });
  inner.append(text);
  if (media.children.length) inner.append(media);
  block.replaceChildren(inner);
}

function decorateCardBody(cell) {
  const date = div('hub-band-card-date');
  const title = div('hub-band-card-title');
  const facts = div('hub-band-card-facts');
  const links = div('hub-band-card-links');
  let titled = false;
  [...cell.children].forEach((el) => {
    if (el.matches('ul, ol')) {
      (titled ? facts : date).append(el);
    } else if (!titled && (el.tagName === 'P' || /^H[1-6]$/.test(el.tagName))
      && !el.querySelector('a, .icon')) {
      title.append(el);
      titled = true;
    } else {
      el.querySelectorAll('a').forEach((a) => addLinkIcon(a, null));
      links.append(el);
    }
  });
  const body = div('hub-band-card-body');
  [date, title, facts, links].forEach((slot) => {
    if (slot.children.length) body.append(slot);
  });
  return body;
}

function decorateEvents(block) {
  const inner = div('ifx-fixed hub-band-inner');
  const head = div('hub-band-head');
  const cards = document.createElement('ul');
  cards.className = 'hub-band-cards';
  const more = div('hub-band-more');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const mediaCell = cells.find((c) => [...c.children].some(isMedia));
    if (mediaCell) {
      const card = document.createElement('li');
      card.className = 'hub-band-card';
      const img = div('hub-band-card-img');
      img.append(...[...mediaCell.children].filter(isMedia));
      card.append(img);
      const bodyCell = div('');
      cells.forEach((c) => bodyCell.append(...c.children));
      card.append(decorateCardBody(bodyCell));
      cards.append(card);
    } else if (row.querySelector('h1, h2, h3, h4, h5, h6')) {
      cells.forEach((c) => head.append(...c.children));
    } else {
      cells.forEach((c) => more.append(...c.children));
    }
  });

  [head, cards, more].forEach((slot) => {
    if (slot.children.length) inner.append(slot);
  });
  block.replaceChildren(inner);
}

function decorateSplit(block) {
  const inner = div('ifx-fixed hub-band-inner');
  const head = div('hub-band-head');
  const foot = div('hub-band-foot');
  const rows = div('hub-band-rows');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      (rows.children.length ? foot : head).append(...(cells[0] ? cells[0].children : []));
      return;
    }
    const line = div('hub-band-row');
    cells.forEach((cell) => {
      const media = [...cell.children].some(isMedia);
      const slot = div(media ? 'hub-band-media' : 'hub-band-text');
      slot.append(...cell.children);
      if (slot.children.length) line.append(slot);
    });
    const slots = [...line.children];
    if (slots[0] && slots[0].classList.contains('hub-band-media')) {
      line.classList.add('media-first');
    }
    rows.append(line);
  });
  [head, rows, foot].forEach((slot) => {
    if (slot.children.length) inner.append(slot);
  });
  block.replaceChildren(inner);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hub-band-inner')) return;
  if (block.classList.contains('events')) decorateEvents(block);
  else if (block.classList.contains('split')) decorateSplit(block);
  else decorateHub(block);
}
