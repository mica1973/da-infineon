/**
 * event-slider — "latest news & events" intro, tab rail and event card slider.
 * Authoring (rows classified by content):
 * - intro row: <p> eyebrow, heading, <p> lead;
 * - tab row (a row with two or more headings): each heading is a tab label, each
 *   <p> with a link is an overview link ("See all events");
 * - card rows (a picture): picture cell + text cell — <p> before the heading = date,
 *   heading with a link = card title (the link makes the whole card clickable),
 *   <ul> = location / format chips (:map-pin: / :online-event: icons allowed),
 *   <p> after the heading = teaser text.
 * Tabs and arrows are presentational controls; the first card is the active slide.
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

function buildIntro(row, inner) {
  const eyebrow = [];
  const title = [];
  const lead = [];
  row.querySelectorAll(':scope > div > *').forEach((node) => {
    if (node.matches(HEADING) && !title.length) title.push(node);
    else if (!title.length) eyebrow.push(node);
    else lead.push(node);
  });
  if (eyebrow.length) inner.append(wrapAll('ev-eyebrow', eyebrow));
  if (title.length) inner.append(wrapAll('ev-title', title));
  if (lead.length) inner.append(wrapAll('ev-lead', lead));
}

function buildTabs(row, nav, links) {
  const list = el('div', 'ev-tablist', { role: 'tablist' });
  row.querySelectorAll(':scope > div > *').forEach((node) => {
    if (node.matches(HEADING)) {
      const tab = el('div', 'ev-tab', { role: 'tab', tabindex: '0' });
      tab.append(node);
      list.append(tab);
    } else {
      links.append(node);
    }
  });
  const tabs = [...list.children];
  tabs[0]?.classList.add('is-active');
  tabs.forEach((tab) => {
    tab.setAttribute('aria-selected', String(tab === tabs[0]));
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
    });
  });
  nav.append(list);
}

function buildSlide(row) {
  const slide = el('div', 'ev-slide');
  const picture = row.querySelector('picture');
  const roles = {
    meta: [], title: [], loc: [], text: [], rest: [],
  };
  [...row.children].forEach((cell) => {
    [...cell.children].forEach((node) => {
      if (picture && node.contains(picture)) return;
      if (node.matches(HEADING) && !roles.title.length) roles.title.push(node);
      else if (node.matches('ul, ol')) roles.loc.push(node);
      else if (node.matches('p') && !roles.title.length) roles.meta.push(node);
      else if (node.matches(`p, ${HEADING}`)) roles.text.push(node);
      else roles.rest.push(node);
    });
  });
  const link = roles.title[0]?.querySelector('a[href]');
  const card = el(link ? 'a' : 'div', 'ev-card');
  if (link) {
    card.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
  }
  const media = el('div', 'ev-card-media');
  if (picture) media.append(picture);
  const body = el('div', 'ev-card-body');
  const head = el('div', 'ev-card-head');
  head.append(wrapAll('ev-card-meta', roles.meta), wrapAll('ev-card-title', roles.title));
  const foot = el('div', 'ev-card-foot');
  foot.append(wrapAll('ev-card-loc', roles.loc), wrapAll('ev-card-text', roles.text));
  roles.rest.forEach((n) => foot.append(n));
  body.append(head, foot);
  card.append(media, body);
  slide.append(card);
  return slide;
}

function arrow(label, icon) {
  const btn = el('button', `ev-arrow icon icon-${icon}`, { type: 'button', 'aria-label': label });
  return btn;
}

function wire(track, prev, next) {
  let index = 0;
  const slides = () => [...track.querySelectorAll('.ev-slide')];
  const update = () => {
    const list = slides();
    if (!list.length) return;
    list.forEach((s, i) => s.classList.toggle('is-active', i === index));
    const offset = list[index].offsetLeft - list[0].offsetLeft;
    track.style.transform = index ? `translateX(${-offset}px)` : '';
    prev.classList.toggle('is-disabled', index === 0);
    next.classList.toggle('is-disabled', index >= list.length - 1);
  };
  prev.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    update();
  });
  next.addEventListener('click', () => {
    index = Math.min(slides().length - 1, index + 1);
    update();
  });
  update();
}

export default function decorate(block) {
  if (block.querySelector('.ev')) return;
  const ev = el('div', 'ev');
  const inner = el('div', 'ev-inner ifx-fixed');
  const tabs = el('div', 'ev-tabs');
  const nav = el('div', 'ev-nav');
  const links = el('div', 'ev-links');
  const carousel = el('div', 'ev-carousel');
  const track = el('div', 'ev-track');
  [...block.children].forEach((row) => {
    if (row.querySelector('picture')) track.append(buildSlide(row));
    else if (row.querySelectorAll(HEADING).length > 1) buildTabs(row, nav, links);
    else buildIntro(row, inner);
    row.remove();
  });
  const arrows = el('div', 'ev-arrows');
  const prev = arrow('Previous', 'left-arrow');
  const next = arrow('Next', 'right-arrow');
  arrows.append(prev, next);
  carousel.append(track, arrows);
  tabs.append(nav, carousel);
  if (links.children.length) tabs.append(links);
  inner.append(tabs);
  ev.append(inner);
  block.append(ev);
  wire(track, prev, next);
}
