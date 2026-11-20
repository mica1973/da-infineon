/**
 * article-toc — the in-page navigation box at the top of an article column
 * ("Auf dieser Seite zu finden:"): a label and a list of jump links to the article's
 * section headings.
 *
 * Authored content (rows / cells in any order):
 *   - a list (ul / ol) whose items are links → the jump links;
 *   - anything else (paragraph, heading) → the label above the list.
 * A link whose `#fragment` names no element on the page is pointed at the heading in <main>
 * with the same text (the delivery pipeline derives heading ids from the heading text, so
 * authors may keep the source anchors such as `#anch1`).
 *
 * Decode tier: template-slotted. Authored nodes are MOVED into empty slot wrappers (EW1);
 * only the href of an unresolved jump link is rewritten. Re-entrant (EW9).
 */

function div(className) {
  const node = document.createElement('div');
  node.className = className;
  return node;
}

const norm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

function resolveLinks(list) {
  const main = list.closest('main') || document;
  const headings = [...main.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .filter((h) => !h.closest('.article-toc'));
  list.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (id && document.getElementById(id)) return;
    const target = headings.find((h) => norm(h.textContent) === norm(a.textContent));
    if (!target) return;
    if (!target.id) target.id = id || norm(target.textContent).replace(/[^a-z0-9]+/g, '-');
    a.setAttribute('href', `#${target.id}`);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .article-toc-label, :scope > .article-toc-list')) return;
  const label = div('article-toc-label');
  const list = div('article-toc-list');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    (cells.length ? cells : [row]).forEach((cell) => {
      [...cell.children].forEach((node) => {
        if (node.matches('ul, ol') && node.querySelector('a[href]')) list.append(node);
        else label.append(node);
      });
    });
  });
  block.replaceChildren(...[label, list].filter((slot) => slot.children.length));
  block.setAttribute('role', 'navigation');
  const text = label.textContent.trim();
  if (text) block.setAttribute('aria-label', text.replace(/:$/, ''));
  resolveLinks(list);
}
