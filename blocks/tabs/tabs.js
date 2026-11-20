/**
 * tabs — numbered vertical tabs on the teal band (live .functionTabbedContent); an accordion
 * below 992px.
 * Authoring: a head row (title paragraph or heading), then one row per tab: text cell (heading +
 * paragraphs) and media cell (image).
 * Decode tier: reconstructive — rows classified by content (a row with two cells is a tab); the
 * authored heading, paragraphs and picture are MOVED into the panel (EW1). Tab and accordion
 * buttons carry a number and a presentational clone of the heading text (EW4, instrumentation
 * stripped) — the authored heading stays in the panel (EW7).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function isMedia(node) {
  if (node.matches('picture, img')) return true;
  return node.tagName === 'P' && !!node.querySelector('picture, img') && !node.textContent.trim();
}

let seq = 0;

export default function decorate(block) {
  if (block.querySelector(':scope > .tabs-inner')) return;
  seq += 1;
  const inner = el('div', 'ifx-fixed tabs-inner');
  const head = el('div', 'tabs-head');
  const body = el('div', 'tabs-body');
  const list = el('div', 'tabs-list');
  list.setAttribute('role', 'tablist');
  const panels = el('div', 'tabs-panels');
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      cells.forEach((c) => head.append(...c.children));
      return;
    }
    const index = items.length;
    const num = String(index + 1).padStart(2, '0');
    const text = el('div', 'tabs-panel-text');
    const media = el('div', 'tabs-panel-media');
    cells.forEach((c) => [...c.children].forEach((n) => (isMedia(n) ? media : text).append(n)));
    const heading = text.querySelector('h1, h2, h3, h4, h5, h6');
    const label = heading ? heading.textContent : '';
    const makeButton = (className) => {
      const b = el('button', className);
      b.type = 'button';
      const n = el('span', 'tabs-num');
      n.textContent = num;
      const t = el('span', 'tabs-label');
      t.textContent = label;
      b.append(n, t);
      return b;
    };
    const tab = makeButton('tabs-tab');
    tab.setAttribute('role', 'tab');
    tab.id = `tabs-${seq}-tab-${index}`;
    tab.setAttribute('aria-controls', `tabs-${seq}-panel-${index}`);
    const bar = makeButton('tabs-bar');
    bar.setAttribute('aria-hidden', 'true');
    bar.tabIndex = -1;
    const panel = el('div', 'tabs-panel');
    panel.id = `tabs-${seq}-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    const content = el('div', 'tabs-panel-content');
    [media, text].forEach((slot) => {
      if (slot.children.length) content.append(slot);
    });
    panel.append(bar, content);
    list.append(tab);
    panels.append(panel);
    items.push({ tab, bar, panel });
  });
  const select = (i) => items.forEach((item, k) => {
    const on = k === i;
    item.tab.setAttribute('aria-selected', String(on));
    item.tab.tabIndex = on ? 0 : -1;
    item.panel.classList.toggle('active', on);
  });
  items.forEach((item, i) => {
    item.tab.addEventListener('click', () => select(i));
    item.bar.addEventListener('click', () => {
      if (item.panel.classList.contains('active')) item.panel.classList.remove('active');
      else select(i);
    });
  });
  if (items.length) select(0);
  body.append(list, panels);
  [head, body].forEach((slot) => {
    if (slot.children.length) inner.append(slot);
  });
  block.replaceChildren(inner);
}
