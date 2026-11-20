/**
 * newsletter-offramp — the full-bleed grey subscription band at the end of story pages:
 * a heading on the left, a short text and a subscribe call-to-action on the right.
 *
 * Authored content (one or two cells, any order; every part optional except the heading):
 *   - a heading → left column;
 *   - paragraphs / lists → right column text;
 *   - a paragraph holding only a link → the CTA (bold = primary button; an unformatted
 *     link is styled primary as well) — it gets the mail glyph.
 *
 * Decode tier: template-slotted. Authored nodes are MOVED into empty slot wrappers (EW1);
 * the glyph is presentational. Re-entrant (EW9).
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function isCta(el) {
  if (!el.matches('p')) return false;
  const links = el.querySelectorAll('a[href]');
  if (links.length !== 1) return false;
  return el.textContent.trim() === links[0].textContent.trim() && !!links[0].textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .newsletter-offramp-inner')) return;

  const nodes = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    (cells.length ? cells : [row]).forEach((cell) => {
      [...cell.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) {
          nodes.push(n);
        } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          nodes.push(p);
        }
      });
    });
  });

  const inner = div('newsletter-offramp-inner');
  const head = div('newsletter-offramp-head');
  const sub = div('newsletter-offramp-sub');
  const text = div('newsletter-offramp-text');
  const actions = div('newsletter-offramp-actions');

  nodes.forEach((el) => {
    if (el.matches(HEADING) && !head.children.length) head.append(el);
    else if (isCta(el)) actions.append(el);
    else text.append(el);
  });

  actions.querySelectorAll('a[href]').forEach((a) => {
    if (!a.classList.contains('button')) {
      a.classList.add('button', 'primary');
      a.closest('p').classList.add('button-wrapper');
    }
    if (!a.querySelector('.icon')) {
      const glyph = document.createElement('span');
      glyph.className = 'icon icon-mail';
      glyph.setAttribute('aria-hidden', 'true');
      a.prepend(glyph);
    }
  });

  if (text.children.length) sub.append(text);
  if (actions.children.length) sub.append(actions);
  inner.append(head, sub);
  block.replaceChildren(inner);
}
