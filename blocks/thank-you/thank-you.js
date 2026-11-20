/**
 * thank-you — the utility confirmation panel (order confirmation, logout, config result):
 * an illustration beside an eyebrow, a heading, optional message text and call-to-action(s).
 *
 * Authored content (one or two cells, any order; every part optional except the heading):
 *   - a picture / image (the illustration);
 *   - an eyebrow paragraph BEFORE the heading ("Auftragsbestätigung", "Thank you");
 *   - a heading (h1 on the page; any level is accepted);
 *   - message paragraphs / lists after the heading;
 *   - CTA paragraphs: a paragraph holding only a link (bold = primary button).
 *
 * Decode tier: template-slotted. Authored nodes are MOVED by role into empty slot wrappers
 * (EW1); the 48 px divider rule before the eyebrow is a presentational element (no text).
 * Re-entrant (EW9): a second call finds the slots already built and leaves them alone.
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

const HEADING = 'h1, h2, h3, h4, h5, h6';

function isMedia(el) {
  if (el.matches('picture, img')) return true;
  return el.matches('p') && !!el.querySelector('picture, img') && !el.textContent.trim();
}

function isCta(el) {
  if (!el.matches('p')) return false;
  const links = el.querySelectorAll('a[href]');
  if (links.length !== 1) return false;
  return el.textContent.trim() === links[0].textContent.trim() && !!links[0].textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .thank-you-inner')) return;

  // collect authored element nodes from every cell, in document order
  const nodes = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    (cells.length ? cells : [row]).forEach((cell) => {
      if (cell.matches('picture, img, p, ul, ol') || cell.matches(HEADING)) {
        nodes.push(cell);
        return;
      }
      [...cell.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) {
          nodes.push(n);
        } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
          // bare cell text (no paragraph): move the text node into a paragraph
          const para = document.createElement('p');
          para.append(n);
          nodes.push(para);
        }
      });
    });
  });

  const inner = div('thank-you-inner');
  const comp = div('thank-you-comp');
  const rowEl = div('thank-you-row');
  const media = div('thank-you-media');
  const body = div('thank-you-body');
  const content = div('thank-you-content');
  const pre = div('thank-you-pre');
  const divider = div('thank-you-divider');
  divider.setAttribute('aria-hidden', 'true');
  const head = div('thank-you-head');
  const text = div('thank-you-text');
  const actions = div('thank-you-actions');

  const heading = nodes.find((el) => el.matches(HEADING));
  let seenHeading = false;
  nodes.forEach((el) => {
    if (el === heading) {
      head.append(el);
      seenHeading = true;
    } else if (isMedia(el)) {
      media.append(el);
    } else if (isCta(el)) {
      actions.append(el);
    } else if (!seenHeading && heading && el.matches('p')) {
      pre.append(el);
    } else {
      text.append(el);
    }
  });

  if (pre.children.length) {
    pre.prepend(divider);
    content.append(pre);
  }
  if (head.children.length) content.append(head);
  if (text.children.length) content.append(text);
  if (actions.children.length) content.append(actions);

  // primary button when the author did not format the link (live: one ocean-filled CTA)
  actions.querySelectorAll('a[href]').forEach((a) => {
    if (!a.classList.contains('button')) {
      a.classList.add('button', 'primary');
      a.closest('p').classList.add('button-wrapper');
    }
  });

  body.append(content);
  if (media.children.length) rowEl.append(media);
  else comp.classList.add('no-media');
  rowEl.append(body);
  comp.append(rowEl);
  inner.append(comp);
  block.replaceChildren(inner, div('thank-you-spacer'));
}
