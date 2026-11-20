/**
 * link-columns — a heading over columns of titled link lists (live "Hilfreiche Links",
 * .tertiary-comp columns).
 * Authoring: a head row (heading only), then one row with one cell per column (a heading and a
 * list of links). Decode tier: template-slotted — cells MOVED into column slots (EW1); link
 * arrows / launch glyphs are block-built decoration.
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function isExternal(a) {
  try {
    return new URL(a.href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}

export default function decorate(block) {
  if (block.querySelector(':scope > .link-columns-inner')) return;
  const inner = div('ifx-fixed link-columns-inner');
  const head = div('link-columns-head');
  const cols = div('link-columns-cols');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!row.querySelector('a')) {
      cells.forEach((c) => head.append(...c.children));
      return;
    }
    cells.forEach((cell) => {
      const col = div('link-columns-col');
      col.append(...cell.children);
      col.querySelectorAll('a').forEach((a) => {
        const icon = document.createElement('span');
        icon.className = `icon icon-${isExternal(a) ? 'launch' : 'arrow-right'} link-columns-icon`;
        icon.setAttribute('aria-hidden', 'true');
        a.append(icon);
      });
      cols.append(col);
    });
  });
  [head, cols].forEach((slot) => {
    if (slot.children.length) inner.append(slot);
  });
  block.replaceChildren(inner);
}
