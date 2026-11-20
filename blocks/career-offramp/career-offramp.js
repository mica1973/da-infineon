/**
 * career-offramp — "Ready to get started?" off-ramp on the grey band (template-slotted).
 * Authoring: a heading-only row is the title; a row with one cell per column, each
 * cell holding a heading (eyebrow-style column head) and a <p> with the button link.
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector('.orc')) return;
  const orc = el('div', 'orc ifx-band-grey');
  const inner = el('div', 'orc-inner ifx-fixed');
  const title = el('div', 'orc-title');
  const cols = el('div', 'orc-row');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const isColumns = cells.some((c) => c.querySelector('a[href]'));
    if (isColumns) {
      cells.forEach((cell) => {
        const col = el('div', 'orc-col');
        [...cell.children].forEach((node) => {
          const wrap = el('div', node.querySelector('a[href]') ? 'orc-btn' : 'orc-head');
          wrap.append(node);
          col.append(wrap);
        });
        cols.append(col);
      });
    } else {
      cells.forEach((cell) => title.append(...cell.children));
    }
    row.remove();
  });
  if (title.children.length) inner.append(title);
  inner.append(cols);
  orc.append(inner);
  block.append(orc);
}
