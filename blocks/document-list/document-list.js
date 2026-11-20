/**
 * document-list — the "Urkunden" documents table: heading, search + filter tools, an account
 * notice, a paginated table of documents (live .documents-container document table).
 * Authoring: a one-cell row with the heading; a one-cell row with the notice paragraph and its
 * link; a row of column labels (Dokument, Typ, Datei, Zugriffsrechte, Sprache, Version, Größe,
 * Datum); then one row per document with the same cells — the name cell is a link to the file,
 * or plain text for a gated (account-only) document.
 * Decode tier: reconstructive — rows classified by content (one cell + heading = head, one cell
 * = notice, first multi-cell row = labels, other multi-cell rows = documents); authored cell
 * nodes MOVED into the table cells (EW1). Below 992px the same table restyles as cards (CSS).
 * Behaviour (live parity): 8 documents per page with a pager, text filter, Dokumenttyp /
 * Sprache filters built from the authored values, reset.
 * @ew-exempt tool labels "Ergebnisse filtern", "Dokumenttyp", "Sprache", "Alle zurücksetzen",
 *   the filter count and the page numbers (block-built UI of the source widget)
 */

const PER_PAGE = 8;
const COLS = ['name', 'type', 'format', 'access', 'lang', 'version', 'size', 'date'];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function dropdown(label, values, onPick) {
  const dd = el('div', 'document-list-dd');
  const btn = el('button', 'document-list-dd-btn', label);
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.append(el('span', 'document-list-chev'));
  const menu = el('ul', 'document-list-dd-menu');
  menu.hidden = true;
  values.forEach((v) => {
    const li = el('li');
    const a = el('a', null, v);
    a.href = '#';
    a.setAttribute('role', 'button');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      onPick(v);
    });
    li.append(a);
    menu.append(li);
  });
  btn.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    btn.setAttribute('aria-expanded', String(!menu.hidden));
  });
  dd.append(btn, menu);
  return dd;
}

function buildRow(cells) {
  const tr = el('tr', 'document-list-row');
  const data = {};
  cells.forEach((cell, i) => {
    const col = COLS[i] || `col-${i}`;
    const td = el('td', `document-list-cell document-list-${col}`);
    data[col] = cell.textContent.trim();
    if (col === 'name') {
      const link = cell.querySelector('a[href]');
      if (link) {
        const ico = el('a', 'document-list-ico document-list-ico-file');
        ico.href = link.href;
        ico.setAttribute('aria-label', 'download');
        td.append(ico);
      } else {
        td.append(el('span', 'document-list-ico document-list-ico-lock'));
        td.classList.add('is-gated');
      }
      const name = el('div', 'document-list-title');
      name.append(...cell.childNodes);
      td.append(name);
    } else {
      td.append(...cell.childNodes);
    }
    tr.append(td);
  });
  const act = el('td', 'document-list-cell document-list-act');
  const dl = el('a', 'document-list-dl');
  const file = tr.querySelector('.document-list-ico-file');
  if (file) dl.href = file.href;
  dl.setAttribute('aria-label', 'download');
  act.append(dl, el('span', 'document-list-share'));
  tr.append(act);
  return { tr, data, text: tr.textContent.toLowerCase() };
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

export default function decorate(block) {
  if (block.querySelector(':scope > .document-list-inner')) return;
  const inner = el('div', 'ifx-fixed document-list-inner');
  const head = el('div', 'document-list-head');
  const warn = el('div', 'document-list-warn');
  const table = el('table', 'document-list-table');
  const thead = el('thead');
  const tbody = el('tbody');
  table.append(thead, tbody);
  const rows = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      const nodes = [...cells[0].children];
      if (nodes.some((n) => /^H[1-6]$/.test(n.tagName))) head.append(...nodes);
      else warn.append(...nodes);
      return;
    }
    if (!thead.children.length) {
      const tr = el('tr');
      cells.forEach((cell) => {
        const th = el('th');
        const label = el('span', 'document-list-label');
        label.append(...cell.childNodes);
        th.append(label, el('span', 'document-list-sort'));
        tr.append(th);
      });
      const last = el('th');
      last.setAttribute('aria-label', 'table head');
      tr.append(last);
      thead.append(tr);
      return;
    }
    rows.push(buildRow(cells));
  });
  rows.forEach((r) => tbody.append(r.tr));
  const firstTh = thead.querySelector('th:last-child');
  if (firstTh && firstTh.previousElementSibling) firstTh.previousElementSibling.classList.add('is-sorted');

  const state = {
    q: '', type: null, lang: null, page: 0,
  };
  const tools = el('div', 'document-list-tools');
  const search = el('div', 'document-list-search');
  const input = el('input', 'document-list-input');
  input.type = 'search';
  input.placeholder = 'Ergebnisse filtern';
  input.setAttribute('aria-label', 'Filter results');
  search.append(el('span', 'document-list-search-icon'), input);
  const filterBtn = el('button', 'document-list-filter-btn');
  filterBtn.type = 'button';
  const count = el('span', 'document-list-count', '0');
  filterBtn.append(el('span', 'document-list-prefs'), count);
  const filters = el('div', 'document-list-filters');
  const reset = el('button', 'document-list-reset');
  reset.type = 'button';
  reset.append(el('span', 'document-list-reset-icon'), el('span', null, 'Alle zurücksetzen'));
  tools.append(search, filterBtn, filters, reset);

  const pager = el('nav', 'document-list-pager');
  pager.setAttribute('aria-label', 'Pagination');
  const prev = el('button', 'document-list-prev');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous page');
  const next = el('button', 'document-list-next');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next page');
  const pages = el('ul', 'document-list-pages');
  pager.append(prev, pages, next);

  const render = () => {
    const hits = rows.filter((r) => (!state.q || r.text.includes(state.q))
      && (!state.type || r.data.type.toLowerCase() === state.type)
      && (!state.lang || r.data.lang.toLowerCase() === state.lang));
    const total = Math.max(1, Math.ceil(hits.length / PER_PAGE));
    state.page = Math.min(state.page, total - 1);
    const shown = hits.slice(state.page * PER_PAGE, (state.page + 1) * PER_PAGE);
    rows.forEach((r) => {
      const i = shown.indexOf(r);
      r.tr.hidden = i < 0;
      r.tr.classList.toggle('is-alt', i % 2 === 1);
    });
    pages.replaceChildren(...Array.from({ length: total }, (_, i) => {
      const li = el('li', i === state.page ? 'is-active' : null, String(i + 1));
      if (i === state.page) li.setAttribute('aria-current', 'page');
      li.addEventListener('click', () => {
        state.page = i;
        render();
      });
      return li;
    }));
    prev.disabled = state.page === 0;
    next.disabled = state.page >= total - 1;
    count.textContent = String([state.type, state.lang].filter(Boolean).length);
  };
  filters.append(
    dropdown('Dokumenttyp', uniq(rows.map((r) => r.data.type.toLowerCase())), (v) => {
      state.type = v;
      state.page = 0;
      render();
    }),
    dropdown('Sprache', uniq(rows.map((r) => r.data.lang.toLowerCase())), (v) => {
      state.lang = v;
      state.page = 0;
      render();
    }),
  );
  input.addEventListener('input', () => {
    state.q = input.value.trim().toLowerCase();
    state.page = 0;
    render();
  });
  reset.addEventListener('click', () => {
    Object.assign(state, {
      q: '', type: null, lang: null, page: 0,
    });
    input.value = '';
    render();
  });
  filterBtn.addEventListener('click', () => tools.classList.toggle('is-open'));
  prev.addEventListener('click', () => {
    state.page -= 1;
    render();
  });
  next.addEventListener('click', () => {
    state.page += 1;
    render();
  });

  [head, tools, warn, table, pager].forEach((part) => {
    if (part !== warn || warn.children.length) inner.append(part);
  });
  block.replaceChildren(inner);
  render();
}
