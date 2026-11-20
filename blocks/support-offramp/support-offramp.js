/**
 * support-offramp — the closing grey "questions?" band: heading, eyebrow, text, a community
 * button and a row of support links with icons (live .supportOffRamps).
 * Authoring: one cell — a heading, a sub-heading paragraph, a description paragraph, a bold
 * button link paragraph, and a list of links each led by an `:ico-name:` icon.
 * Decode tier: template-slotted — authored nodes MOVED into slots by role (EW1/EW3).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .support-offramp-inner')) return;
  const inner = el('div', 'ifx-fixed support-offramp-inner');
  const head = el('div', 'support-offramp-head');
  const sub = el('div', 'support-offramp-sub');
  const desc = el('div', 'support-offramp-desc');
  const actions = el('div', 'support-offramp-actions');
  const cta = el('div', 'support-offramp-cta');
  const links = el('div', 'support-offramp-links');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((node) => {
      if (/^H[1-6]$/.test(node.tagName)) head.append(node);
      else if (node.matches('ul, ol')) links.append(node);
      else if (node.querySelector('a')) cta.append(node);
      else if (!sub.children.length) sub.append(node);
      else desc.append(node);
    });
  });
  [cta, links].forEach((slot) => {
    if (slot.children.length) actions.append(slot);
  });
  [head, sub, desc, actions].forEach((slot) => {
    if (slot.children.length) inner.append(slot);
  });
  block.replaceChildren(inner);
}
