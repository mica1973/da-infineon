/**
 * locations — featured-locations panel: cut image beside a teal panel with a heading, lead,
 * a two-column list of location links and an outline button (live .featured-location).
 * Authoring: one row — media cell (image) and text cell (heading, lead, list, italic link).
 * Decode tier: template-slotted — authored nodes MOVED into the media / panel slots (EW1).
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function isMedia(node) {
  if (node.matches('picture, img')) return true;
  return node.tagName === 'P' && !!node.querySelector('picture, img') && !node.textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .locations-inner')) return;
  const inner = div('ifx-fixed locations-inner');
  const frame = div('locations-frame');
  const media = div('locations-media');
  const panel = div('locations-panel');
  [...block.children].forEach((row) => [...row.children].forEach((cell) => {
    [...cell.children].forEach((node) => (isMedia(node) ? media : panel).append(node));
  }));
  if (media.children.length) frame.append(media);
  frame.append(panel);
  inner.append(frame);
  block.replaceChildren(inner);
}
