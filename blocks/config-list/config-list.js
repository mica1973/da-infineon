/**
 * config-list — a plain configuration listing (live /de/config): unstyled text lines, lists and
 * headings followed by a bordered data table.
 *
 * Authored content: rows with ONE cell hold the prose (paragraphs, lists, headings) and are
 * moved, in order, into the body wrapper; rows with TWO or more cells are table rows — the
 * first of them is the header row (th), the rest are data rows (td).
 *
 * Decode tier: reconstructive (rows classified by cell count, never by index). Authored nodes
 * are MOVED into the body wrapper and into the table cells (EW1). Re-entrant (EW9).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .config-list-body')) return;

  const body = el('div', 'config-list-body');
  const scroller = el('div', 'config-list-table');
  const table = el('table');
  const thead = el('thead');
  const tbody = el('tbody');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      const head = !thead.children.length && !tbody.children.length;
      const tr = el('tr');
      cells.forEach((cell) => {
        const td = el(head ? 'th' : 'td');
        td.append(...cell.childNodes);
        tr.append(td);
      });
      (head ? thead : tbody).append(tr);
    } else if (cells.length === 1) {
      body.append(...cells[0].childNodes);
    }
  });

  const parts = [];
  if (body.childNodes.length) parts.push(body);
  if (thead.children.length || tbody.children.length) {
    if (thead.children.length) table.append(thead);
    if (tbody.children.length) table.append(tbody);
    scroller.append(table);
    parts.push(scroller);
  }
  block.replaceChildren(...parts);
}
