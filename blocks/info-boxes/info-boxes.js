/**
 * info-boxes — a stack of grey contact boxes: eyebrow heading, optional text, an outline button
 * (italic link) and arrow links; links to other hosts get the launch glyph
 * (live .secondary-infobox-cmp). An absolute (off-site) link gets the launch glyph.
 * Authoring: one row per box — heading, paragraphs, link paragraphs.
 * Decode tier: template-slotted — authored nodes MOVED into the box slots (EW1/EW3).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .info-boxes-box')) return;
  const boxes = [...block.children].map((row) => {
    const box = el('div', 'info-boxes-box');
    const head = el('div', 'info-boxes-head');
    const text = el('div', 'info-boxes-text');
    const actions = el('div', 'info-boxes-actions');
    const links = el('div', 'info-boxes-links');
    [...row.querySelectorAll(':scope > div > *')].forEach((node) => {
      const a = node.querySelector('a[href]');
      if (/^H[1-6]$/.test(node.tagName)) head.append(node);
      else if (a && node.querySelector('em a, a.button')) actions.append(node);
      else if (a) links.append(node);
      else text.append(node);
      if (a && /^https?:/.test(a.getAttribute('href'))) a.classList.add('is-external');
    });
    [head, text, actions, links].forEach((slot) => {
      if (slot.children.length) box.append(slot);
    });
    return box;
  });
  block.replaceChildren(...boxes);
}
