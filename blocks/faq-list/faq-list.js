/**
 * faq-list — the FAQ finder: heading, a category facet, a search field, a sort control, an
 * accordion of questions and a pager (live .faq-compoment, Coveo Atomic on the source).
 * Authoring: a one-cell row with the heading; a one-cell row with the facet label paragraph and
 * a list of categories ("Name (count)", the first is the active one); then one row per FAQ —
 * question cell | answer cell.
 * Decode tier: reconstructive — rows classified by content (heading row = head, row with a list
 * = facet, two-cell rows = items); authored nodes MOVED (EW1). The open / close toggle is a
 * text-less button beside the question (EW7).
 * Behaviour: first item open, toggles, text filter over the authored items, 10 per page pager.
 * @ew-exempt search placeholder "Suchen", "Sortieren nach: Relevanz", "Ergebnisse pro Seite",
 *   page numbers (block-built UI of the source search widget)
 */

const PER_PAGE = 10;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function buildItem(cells, index) {
  const item = el('div', 'faq-list-item');
  const head = el('div', 'faq-list-head');
  const question = el('div', 'faq-list-question');
  const answer = el('div', 'faq-list-answer');
  question.append(...cells[0].children);
  cells.slice(1).forEach((c) => answer.append(...c.children));
  const toggle = el('button', 'faq-list-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Antwort ein- oder ausblenden');
  head.append(question, toggle);
  item.append(head, answer);
  const set = (open) => {
    item.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  set(index === 0);
  head.addEventListener('click', () => set(!item.classList.contains('open')));
  return item;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .faq-list-inner')) return;
  const inner = el('div', 'ifx-fixed faq-list-inner');
  const head = el('div', 'faq-list-title');
  const layout = el('div', 'faq-list-layout');
  const facet = el('div', 'faq-list-facet');
  const main = el('div', 'faq-list-main');
  const list = el('div', 'faq-list-items');
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      items.push(buildItem(cells, items.length));
      return;
    }
    const nodes = [...cells[0].children];
    if (nodes.some((n) => n.matches('ul, ol'))) facet.append(...nodes);
    else head.append(...nodes);
  });
  const firstCat = facet.querySelector('li');
  if (firstCat) firstCat.setAttribute('aria-current', 'true');

  const tools = el('div', 'faq-list-tools');
  const search = el('div', 'faq-list-search');
  const input = el('input', 'faq-list-input');
  input.type = 'search';
  input.placeholder = 'Suchen';
  input.setAttribute('aria-label', 'Suchen');
  search.append(el('span', 'faq-list-search-icon'), input);
  const sort = el('div', 'faq-list-sort');
  sort.append(el('span', 'faq-list-sort-label', 'Sortieren nach:'), el('span', 'faq-list-sort-value', 'Relevanz'), el('span', 'faq-list-chev'));
  const filterBtn = el('button', 'faq-list-filter-btn');
  filterBtn.type = 'button';
  filterBtn.setAttribute('aria-label', 'Filter');
  filterBtn.setAttribute('aria-expanded', 'false');
  filterBtn.addEventListener('click', () => {
    const open = !layout.classList.contains('is-filtering');
    layout.classList.toggle('is-filtering', open);
    filterBtn.setAttribute('aria-expanded', String(open));
  });
  tools.append(search, filterBtn, sort);

  const foot = el('div', 'faq-list-foot');
  const per = el('div', 'faq-list-per');
  per.append(el('span', 'faq-list-per-label', 'Ergebnisse pro Seite'), el('span', 'faq-list-per-value', String(PER_PAGE)));
  const pager = el('nav', 'faq-list-pager');
  pager.setAttribute('aria-label', 'Pagination');
  const prev = el('button', 'faq-list-prev');
  const next = el('button', 'faq-list-next');
  prev.type = 'button';
  next.type = 'button';
  prev.setAttribute('aria-label', 'Previous page');
  next.setAttribute('aria-label', 'Next page');
  const pages = el('ul', 'faq-list-pages');
  pager.append(prev, pages, next);
  foot.append(per, pager);

  let page = 0;
  let query = '';
  const render = () => {
    const hits = items.filter((it) => !query || it.textContent.toLowerCase().includes(query));
    const total = Math.max(1, Math.ceil(hits.length / PER_PAGE));
    page = Math.min(page, total - 1);
    const shown = hits.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    items.forEach((it) => { it.hidden = !shown.includes(it); });
    pages.replaceChildren(...Array.from({ length: total }, (_, i) => {
      const li = el('li', i === page ? 'is-active' : null, String(i + 1));
      li.addEventListener('click', () => {
        page = i;
        render();
      });
      return li;
    }));
    prev.disabled = page === 0;
    next.disabled = page >= total - 1;
  };
  input.addEventListener('input', () => {
    query = input.value.trim().toLowerCase();
    page = 0;
    render();
  });
  prev.addEventListener('click', () => {
    page -= 1;
    render();
  });
  next.addEventListener('click', () => {
    page += 1;
    render();
  });

  list.append(...items);
  main.append(tools, list, foot);
  layout.append(facet, main);
  inner.append(head, layout);
  block.replaceChildren(inner);
  render();
}
