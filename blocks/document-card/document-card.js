/**
 * document-card — one featured downloadable document: thumbnail, title, description, a meta line
 * (type · access · format · size · date) and a download link (live .singledocumentdownload).
 * Authoring: one row — image cell | text cell (heading, description paragraph, a list of meta
 * items in display order, a paragraph with the download link).
 * Decode tier: template-slotted — authored nodes MOVED into slots by role (EW1/EW3). Meta items
 * get a `data-role` (type, access, format) from their position so the type reads bold and the
 * format upper-case like the source; the file / download glyphs are CSS decoration.
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

const META_ROLES = ['type', 'access', 'format'];

export default function decorate(block) {
  if (block.querySelector(':scope > .document-card-inner')) return;
  const inner = el('div', 'ifx-fixed document-card-inner');
  const row = el('div', 'document-card-row');
  const media = el('div', 'document-card-media');
  const body = el('div', 'document-card-body');
  const head = el('div', 'document-card-head');
  const desc = el('div', 'document-card-desc');
  const meta = el('div', 'document-card-meta');
  const link = el('div', 'document-card-link');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((node) => {
      if (isMedia(node)) media.append(node);
      else if (/^H[1-6]$/.test(node.tagName)) head.append(node);
      else if (node.matches('ul, ol')) meta.append(node);
      else if (node.querySelector('a')) link.append(node);
      else desc.append(node);
    });
  });
  meta.querySelectorAll('li').forEach((li, i) => {
    if (META_ROLES[i]) li.dataset.role = META_ROLES[i];
  });
  [head, desc, meta, link].forEach((slot) => {
    if (slot.children.length) body.append(slot);
  });
  if (media.children.length) row.append(media);
  row.append(body);
  inner.append(row);
  block.replaceChildren(inner);
}
