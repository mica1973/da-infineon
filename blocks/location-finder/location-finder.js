/**
 * location-finder — "Unsere Standorte": heading, world map, country / site-type filters, an
 * accordion of locations and a pager (live .contactlocationmap, a React widget on the source).
 * Authoring: a one-cell row with the heading; then one row per location group — label cell
 * ("City, Country") | details cell (per site: bold name, address, phone, e-mail link, and a
 * last paragraph with the site type(s), e.g. "R&D, Sales").
 * Decode tier: reconstructive — rows classified by content (one cell = head, two cells =
 * location); authored nodes MOVED (EW1); the open / close toggle is a text-less button (EW7).
 * The map is an embedded Google map (the source's map carries a marker per site; markers are
 * not migrated). Shares its section with info-boxes: the section becomes a two-column grid.
 * @ew-exempt filter labels "Alle Länder / Territories", "Art des Standorts", the "N Standorte"
 *   count, "Einträge pro Seite", page numbers and the map frame title (block-built widget UI)
 */

const TYPES = /^(R&D|Production|Sales|Representative Office|Other|Headquarters)(,\s*(R&D|Production|Sales|Representative Office|Other|Headquarters))*$/;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function buildItem(cells) {
  const item = el('div', 'location-finder-item');
  const head = el('div', 'location-finder-head');
  const label = el('div', 'location-finder-label');
  const detail = el('div', 'location-finder-detail');
  label.append(...cells[0].children);
  cells.slice(1).forEach((c) => detail.append(...c.children));
  const toggle = el('button', 'location-finder-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Details ein- oder ausblenden');
  toggle.setAttribute('aria-expanded', 'false');
  head.append(label, toggle);
  item.append(head, detail);
  head.addEventListener('click', () => {
    const open = !item.classList.contains('open');
    item.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  const text = label.textContent.trim();
  const types = new Set();
  detail.querySelectorAll('p').forEach((p) => {
    const t = p.textContent.trim();
    if (TYPES.test(t)) t.split(/,\s*/).forEach((x) => types.add(x));
  });
  return {
    item, country: text.slice(text.indexOf(',') + 1).trim(), types,
  };
}

function dropdown(label, options, multi, onChange) {
  const dd = el('div', 'location-finder-dd');
  const btn = el('button', 'location-finder-dd-btn');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  const text = el('span', null, label);
  btn.append(text, el('span', 'location-finder-chev'));
  const menu = el('ul', 'location-finder-dd-menu');
  menu.hidden = true;
  const picked = new Set();
  options.forEach((opt) => {
    const li = el('li');
    const b = el('button', 'location-finder-opt', opt);
    b.type = 'button';
    b.addEventListener('click', () => {
      if (multi) {
        if (picked.has(opt)) picked.delete(opt);
        else picked.add(opt);
        b.classList.toggle('is-picked', picked.has(opt));
      } else {
        picked.clear();
        if (opt !== label) picked.add(opt);
        text.textContent = opt;
        menu.hidden = true;
      }
      onChange(picked);
    });
    li.append(b);
    menu.append(li);
  });
  btn.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    btn.setAttribute('aria-expanded', String(!menu.hidden));
  });
  dd.append(btn, menu);
  return dd;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .location-finder-inner')) return;
  const inner = el('div', 'location-finder-inner');
  const head = el('div', 'location-finder-title');
  const rows = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) rows.push(buildItem(cells));
    else head.append(...cells[0].children);
  });

  const map = el('div', 'location-finder-map');
  const frame = el('iframe');
  frame.title = 'Unsere Standorte';
  frame.loading = 'lazy';
  frame.src = 'https://maps.google.com/maps?ll=28,12&z=2&t=m&hl=de&output=embed';
  map.append(frame);

  const state = {
    country: null, types: new Set(), page: 0, size: 10,
  };
  const tools = el('div', 'location-finder-tools');
  const countries = [...new Set(rows.map((r) => r.country))].sort((a, b) => a.localeCompare(b));
  const allTypes = [...new Set(rows.flatMap((r) => [...r.types]))];
  const count = el('div', 'location-finder-count');
  const list = el('div', 'location-finder-list');
  const foot = el('div', 'location-finder-foot');
  const sizeWrap = el('label', 'location-finder-size');
  const sizeSel = el('select', 'location-finder-size-select');
  [10, 20, 50].forEach((n) => {
    const o = el('option', null, String(n));
    o.value = String(n);
    sizeSel.append(o);
  });
  sizeWrap.append(el('span', 'location-finder-size-label', 'Einträge pro Seite'), sizeSel);
  const pager = el('nav', 'location-finder-pager');
  pager.setAttribute('aria-label', 'Pagination');
  const prev = el('button', 'location-finder-prev');
  const next = el('button', 'location-finder-next');
  prev.type = 'button';
  next.type = 'button';
  prev.setAttribute('aria-label', 'Previous page');
  next.setAttribute('aria-label', 'Next page');
  const pages = el('ul', 'location-finder-pages');
  pager.append(prev, pages, next);
  foot.append(sizeWrap, pager);

  const render = () => {
    const hits = rows.filter((r) => (!state.country || r.country === state.country)
      && (!state.types.size || [...state.types].some((t) => r.types.has(t))));
    const total = Math.max(1, Math.ceil(hits.length / state.size));
    state.page = Math.min(state.page, total - 1);
    const shown = hits.slice(state.page * state.size, (state.page + 1) * state.size);
    rows.forEach((r) => { r.item.hidden = !shown.includes(r); });
    count.textContent = `${hits.length} Standorte`;
    const start = Math.max(0, Math.min(state.page - 1, total - 3));
    const win = Array.from({ length: Math.min(3, total) }, (_, i) => start + i);
    pages.replaceChildren(...win.map((i) => {
      const li = el('li', i === state.page ? 'is-active' : null, String(i + 1));
      li.addEventListener('click', () => {
        state.page = i;
        render();
      });
      return li;
    }));
    prev.disabled = state.page === 0;
    next.disabled = state.page >= total - 1;
  };
  tools.append(
    dropdown('Alle Länder / Territories', ['Alle Länder / Territories', ...countries], false, (set) => {
      [state.country] = [...set];
      state.page = 0;
      render();
    }),
    dropdown('Art des Standorts', allTypes, true, (set) => {
      state.types = new Set(set);
      state.page = 0;
      render();
    }),
    count,
  );
  sizeSel.addEventListener('change', () => {
    state.size = Number(sizeSel.value);
    state.page = 0;
    render();
  });
  prev.addEventListener('click', () => {
    state.page -= 1;
    render();
  });
  next.addEventListener('click', () => {
    state.page += 1;
    render();
  });

  list.append(...rows.map((r) => r.item));
  inner.append(head, map, tools, list, foot);
  block.replaceChildren(inner);
  render();
}
