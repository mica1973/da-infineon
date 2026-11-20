/**
 * product-hero — grey title hero with a diagonal-cut image (live .myIfxHero producthero,
 * .ifx-career-hero). Variant `career`: adds the job-search bar (role + location inputs) in
 * front of the authored search link; variant `offramp`: text only (the career off-ramp band).
 * Authoring: one row — text cell (heading, lead paragraph, optional bold search link,
 * optional plain link) and an optional media cell (image).
 * Decode tier: template-slotted — authored nodes MOVED into slots by role (EW1/EW3).
 * Variant `plain` (listing pages): white two-column hero; an optional second image is the
 * art-directed crop shown below 576px (live 3x1 rendition).
 * @ew-exempt search input placeholders and the "in" joiner are block-built UI strings
 *   (the source renders them inside its search widget, not as page content)
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

function searchBar(ctaPara) {
  const form = el('form', 'product-hero-search');
  const fields = el('div', 'product-hero-fields');
  const role = el('input', 'product-hero-input product-hero-role');
  role.type = 'search';
  role.placeholder = 'Nach einer Rolle suchen';
  role.setAttribute('aria-label', role.placeholder);
  const joiner = el('span', 'product-hero-in');
  joiner.textContent = 'in';
  const where = el('input', 'product-hero-input product-hero-where');
  where.type = 'search';
  where.placeholder = 'Region, Land oder Ort';
  where.setAttribute('aria-label', where.placeholder);
  fields.append(role, joiner, where);
  form.append(fields);
  if (ctaPara) {
    ctaPara.classList.add('product-hero-submit');
    form.append(ctaPara);
  }
  const go = (event) => {
    const link = form.querySelector('a[href]');
    if (!link) return;
    event.preventDefault();
    const url = new URL(link.href);
    if (role.value.trim()) url.searchParams.set('query', role.value.trim());
    if (where.value.trim()) url.searchParams.set('location', where.value.trim());
    window.open(url.toString(), '_blank', 'noopener');
  };
  form.addEventListener('submit', go);
  if (ctaPara) ctaPara.addEventListener('click', go);
  return form;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .product-hero-inner')) return;
  const career = block.classList.contains('career');
  const inner = el('div', 'product-hero-inner');
  const text = el('div', 'product-hero-text');
  const media = el('div', 'product-hero-media');
  const more = el('div', 'product-hero-more');
  let cta = null;
  [...block.children].forEach((row) => [...row.children].forEach((cell) => {
    [...cell.children].forEach((node) => {
      if (isMedia(node)) media.append(node);
      else if (career && !cta && node.tagName === 'P'
        && node.querySelector('strong a, em a, a.button')) {
        cta = node;
      } else if (node.tagName === 'P' && node.querySelector('a')) more.append(node);
      else text.append(node);
    });
  }));
  const pics = [...media.querySelectorAll('picture')];
  if (block.classList.contains('plain') && pics.length > 1) {
    const wide = el('div', 'product-hero-wide');
    const narrow = el('div', 'product-hero-narrow');
    wide.append(pics[0]);
    narrow.append(...pics.slice(1));
    media.replaceChildren(wide, narrow);
  }
  if (career) text.append(searchBar(cta));
  if (more.children.length) text.append(more);
  inner.append(text);
  if (media.children.length) inner.append(media);
  block.replaceChildren(inner);
}
