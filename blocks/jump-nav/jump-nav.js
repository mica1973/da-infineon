/**
 * jump-nav — the sticky "Auf dieser Seite" in-page navigation under a hero
 * (live .producthero inpage navigation).
 * Authoring: one cell — an optional label paragraph ("Auf dieser Seite") and a list of
 * `#anchor` links. A link resolves to the element with that id, else to the first heading
 * whose text equals the link text (the id is assigned to it).
 * Decode tier: template-slotted — the authored list and label are MOVED into the bar (EW1).
 * Behaviour (live parity): the bar pins to the viewport top once scrolled past (fixed +
 * shadow, a spacer keeps the flow), scroll-spy `active` link, mobile dropdown toggle.
 * @ew-exempt mobile toggle label: mirrors the active link text (live dropdown shows the current
 *   section), "Springen zu" / "Jump to" when the list is empty (block UI string)
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function resolveTargets(block, links) {
  const main = block.closest('main') || document.body;
  const headings = [...main.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  return links.map((a) => {
    const id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
    if (!id) return null;
    let target = document.getElementById(id);
    if (!target) {
      const label = a.textContent.trim().toLowerCase();
      target = headings.find((h) => !block.contains(h)
        && h.textContent.trim().toLowerCase() === label) || null;
      if (target) target.id = id;
    }
    return id;
  });
}

function wire(block, spacer, bar, links, toggleText) {
  const ids = resolveTargets(block, links);
  const update = () => {
    const stuck = spacer.getBoundingClientRect().top <= 0 && window.scrollY > 0;
    spacer.style.height = stuck ? `${bar.offsetHeight}px` : '0px';
    bar.classList.toggle('is-stuck', stuck);
    const line = bar.getBoundingClientRect().bottom + 1;
    let idx = 0;
    ids.forEach((id, i) => {
      const t = id ? document.getElementById(id) : null;
      if (t && t.getBoundingClientRect().top <= line) idx = i;
    });
    links.forEach((a, i) => a.classList.toggle('active', i === idx));
    if (links[idx]) toggleText.textContent = links[idx].textContent.trim();
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .jump-nav-spacer')) return;
  const spacer = el('div', 'jump-nav-spacer');
  const bar = el('nav', 'jump-nav-bar');
  const inner = el('div', 'ifx-fixed jump-nav-inner');
  const toggle = el('div', 'jump-nav-toggle');
  toggle.setAttribute('role', 'button');
  toggle.tabIndex = 0;
  toggle.setAttribute('aria-expanded', 'false');
  const toggleText = el('span', 'jump-nav-toggle-text');
  toggleText.textContent = document.documentElement.lang === 'en' ? 'Jump to' : 'Springen zu';
  toggle.append(toggleText, el('span', 'jump-nav-chev'));
  const label = el('div', 'jump-nav-label');
  const list = el('div', 'jump-nav-list');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((node) => {
      if (node.matches('ul, ol') && !list.children.length) list.append(node);
      else label.append(node);
    });
  });
  if (label.textContent.trim()) bar.setAttribute('aria-label', label.textContent.trim());
  inner.append(toggle, label, list);
  bar.append(inner);
  block.replaceChildren(spacer, bar);
  const setOpen = (open) => {
    bar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!bar.classList.contains('is-open')));
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!bar.classList.contains('is-open'));
    }
  });
  list.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  wire(block, spacer, bar, [...list.querySelectorAll('a[href^="#"]')], toggleText);
}
