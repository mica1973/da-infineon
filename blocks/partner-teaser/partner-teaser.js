/**
 * partner-teaser — teal band with tabs (desktop) / open accordion (mobile).
 * Authoring: one row per tab. Tab cell: an icon <p> (:chips:, :code:, :medal: …),
 * a heading (tab title) and a <p> description. Panel cell: a heading, a <p> lead,
 * then either a list of links with icons (application tiles) or key figures — each a
 * <p> holding only <strong>value</strong> followed by a <p> label — and a <p> CTA.
 * The cell holding a list, key figures or a link is the panel; roles are read from
 * content. Tab and accordion chrome (chevron, circle) is presentational. Desktop
 * (>= 992px): tabs, first active. Mobile: accordion, every panel closed until opened.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function wrapAll(className, nodes) {
  const wrap = el('div', className);
  nodes.forEach((n) => wrap.append(n));
  return wrap;
}

function isPanelCell(cell) {
  return !!cell.querySelector('ul, ol, strong') || !!cell.querySelector('p a[href]');
}

function buildTab(cell) {
  const tab = el('div', 'pa-tab', { role: 'tab', tabindex: '0' });
  const icon = [];
  const title = [];
  const desc = [];
  [...cell.children].forEach((node) => {
    if (node.matches(HEADING) && !title.length) title.push(node);
    else if (!title.length && node.querySelector('.icon') && !node.textContent.trim()) {
      icon.push(node);
    } else desc.push(node);
  });
  if (icon.length) tab.append(wrapAll('pa-tab-ico', icon));
  const head = wrapAll('pa-tab-title', title);
  head.append(el('span', 'pa-tab-chevron icon icon-chevron-right', { 'aria-hidden': 'true' }));
  head.append(el('span', 'pa-tab-circle icon icon-accordion-circle', { 'aria-hidden': 'true' }));
  tab.append(head);
  if (desc.length) tab.append(wrapAll('pa-tab-desc', desc));
  return tab;
}

function buildPane(cell) {
  const pane = el('div', 'pa-pane', { role: 'tabpanel' });
  const heading = [];
  const lead = [];
  const cta = [];
  const figures = [];
  let list = null;
  const isKey = (n) => n.matches('p') && n.querySelector('strong')
    && n.textContent.trim() === n.querySelector('strong').textContent.trim();
  [...cell.children].forEach((node) => {
    const last = figures[figures.length - 1];
    if (node.matches(HEADING) && !heading.length) heading.push(node);
    else if (node.matches('ul, ol') && !list) list = node;
    else if (node.matches('p') && node.querySelector('a[href]')) cta.push(node);
    else if (isKey(node)) figures.push([node]);
    else if (last && last.length === 1 && node.matches('p')) last.push(node);
    else lead.push(node);
  });
  pane.classList.add(figures.length ? 'pa-pane-kpi' : 'pa-pane-apps');
  if (heading.length) pane.append(wrapAll('pa-heading', heading));
  if (lead.length) pane.append(wrapAll('pa-lead', lead));
  if (list) pane.append(wrapAll('pa-icons', [list]));
  if (figures.length) {
    const grid = el('div', 'pa-kpi-grid');
    figures.forEach((pair) => grid.append(wrapAll('pa-kpi', pair)));
    pane.append(grid);
  }
  if (cta.length) pane.append(wrapAll('pa-cta', cta));
  return pane;
}

export default function decorate(block) {
  if (block.querySelector('.pa')) return;
  const pa = el('div', 'pa ifx-band-teal');
  const inner = el('div', 'pa-inner ifx-fixed');
  const items = el('div', 'pa-items', { role: 'tablist' });
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const panelCell = cells.find(isPanelCell) || cells[cells.length - 1];
    const tabCell = cells.find((c) => c !== panelCell);
    const item = el('div', 'pa-item');
    if (tabCell) item.append(buildTab(tabCell));
    if (panelCell) item.append(buildPane(panelCell));
    items.append(item);
    row.remove();
  });
  const all = [...items.children];
  all[0]?.classList.add('is-active');
  items.style.setProperty('--pa-rows', String(Math.max(all.length, 1)));
  const desktop = window.matchMedia('(width >= 992px)');
  all.forEach((item) => {
    const tab = item.querySelector('.pa-tab');
    if (!tab) return;
    tab.setAttribute('aria-selected', String(item === all[0]));
    const activate = () => {
      if (desktop.matches) {
        all.forEach((i) => {
          i.classList.toggle('is-active', i === item);
          i.querySelector('.pa-tab')?.setAttribute('aria-selected', String(i === item));
        });
      } else {
        const open = item.classList.toggle('is-open');
        tab.setAttribute('aria-expanded', String(open));
      }
    };
    tab.addEventListener('click', activate);
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
  inner.append(items);
  pa.append(inner);
  block.append(pa);
}
