/**
 * link-cards — a section head and a grid of link cards
 * (live .ifxcard / .linkParentCardContainer).
 * Authoring: a head row (heading + lead), one row per card (optional icon paragraph `:ico-name:`,
 * a title — heading or bold paragraph —, description paragraphs, link paragraphs) and an
 * optional CTA row (a bold/italic link paragraph only). Variant `featured`: the first card is
 * the teal highlight card; variant `links`: two-column text cards.
 * Decode tier: reconstructive — rows classified by content, never by index; card parts
 * classified by role and MOVED into slot wrappers (EW1). Link arrows are block-built decoration.
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function isIconPara(el) {
  return el.tagName === 'P' && el.querySelector('.icon') && !el.textContent.trim();
}

function isTitle(el) {
  if (/^H[1-6]$/.test(el.tagName)) return true;
  return el.tagName === 'P' && el.children.length === 1 && el.firstElementChild.tagName === 'STRONG'
    && !el.querySelector('a') && el.textContent.trim() === el.firstElementChild.textContent.trim();
}

function isExternal(a) {
  try {
    return new URL(a.href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}

function addLinkIcon(a) {
  if (a.querySelector('.link-cards-icon')) return;
  const icon = document.createElement('span');
  icon.className = `icon icon-${isExternal(a) ? 'launch' : 'arrow-right'} link-cards-icon`;
  icon.setAttribute('aria-hidden', 'true');
  a.append(icon);
}

function isCtaRow(cells) {
  const els = cells.flatMap((c) => [...c.children]);
  return els.length > 0 && els.every((el) => el.tagName === 'P' && el.querySelector('a')
    && el.querySelector('strong, em, a.button') && !el.querySelector('img'));
}

function decorateCard(cells) {
  const card = document.createElement('li');
  card.className = 'link-cards-card';
  const head = div('link-cards-card-head');
  const body = div('link-cards-card-body');
  const links = div('link-cards-card-links');
  let titled = false;
  cells.forEach((cell) => [...cell.children].forEach((el) => {
    if (isIconPara(el)) {
      el.classList.add('link-cards-card-icon');
      head.append(el);
    } else if (!titled && isTitle(el)) {
      el.classList.add('link-cards-card-title');
      head.append(el);
      titled = true;
    } else if (el.querySelector('a')) {
      el.querySelectorAll('a').forEach(addLinkIcon);
      links.append(el);
    } else {
      body.append(el);
    }
  }));
  [head, body, links].forEach((slot) => {
    if (slot.children.length) card.append(slot);
  });
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .link-cards-inner')) return;
  const inner = div('ifx-fixed link-cards-inner');
  const head = div('link-cards-head');
  const grid = document.createElement('ul');
  grid.className = 'link-cards-grid';
  const foot = div('link-cards-foot');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!grid.children.length && !head.children.length
      && row.querySelector('h1, h2, h3, h4') && !row.querySelector('a, .icon')) {
      cells.forEach((c) => head.append(...c.children));
    } else if (isCtaRow(cells)) {
      cells.forEach((c) => foot.append(...c.children));
    } else {
      grid.append(decorateCard(cells));
    }
  });
  [head, grid, foot].forEach((slot) => {
    if (slot.children.length) inner.append(slot);
  });
  block.replaceChildren(inner);
}
