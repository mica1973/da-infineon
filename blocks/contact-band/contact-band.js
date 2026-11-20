/**
 * contact-band — the support "Kontakt" off-ramp (live .application-main contact component).
 * Authoring: a head row (heading), then one row with one cell per column: an eyebrow
 * paragraph, a paragraph of button links (bold = filled, italic = outline) and a list whose
 * first plain item is the label and the other items are icon links (`:ico-name: link`).
 * Decode tier: template-slotted — authored nodes MOVED into column slots by role (EW1).
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .contact-band-inner')) return;
  const inner = div('ifx-fixed contact-band-inner');
  const head = div('contact-band-head');
  const cols = div('contact-band-cols');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!row.querySelector('a')) {
      cells.forEach((c) => head.append(...c.children));
      return;
    }
    cells.forEach((cell) => {
      const col = div('contact-band-col');
      const eyebrow = div('contact-band-eyebrow');
      const buttons = div('contact-band-buttons');
      const tools = div('contact-band-tools');
      [...cell.children].forEach((el) => {
        if (el.matches('ul, ol')) {
          const first = el.querySelector('li');
          if (first && !first.querySelector('a')) first.classList.add('contact-band-label');
          tools.append(el);
        } else if (el.querySelector('a')) buttons.append(el);
        else eyebrow.append(el);
      });
      [eyebrow, buttons, tools].forEach((slot) => {
        if (slot.children.length) col.append(slot);
      });
      cols.append(col);
    });
  });
  [head, cols].forEach((slot) => {
    if (slot.children.length) inner.append(slot);
  });
  block.replaceChildren(inner);
}
