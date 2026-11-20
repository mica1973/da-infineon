/**
 * image-hero — a full-width banner image (live .imagehero).
 * Authoring: one cell with the image. Decode tier: template-slotted — the authored picture is
 * MOVED into the frame (EW1).
 */

export default function decorate(block) {
  if (block.querySelector(':scope > .image-hero-frame')) return;
  const frame = document.createElement('div');
  frame.className = 'image-hero-frame';
  const pic = block.querySelector('picture') || block.querySelector('img');
  if (pic) frame.append(pic);
  block.replaceChildren(frame);
}
