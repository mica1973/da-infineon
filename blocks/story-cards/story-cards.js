/**
 * story-cards — "Our stories" intro + story card grid (reconstructive: repeat group).
 * Authoring (rows classified by content):
 * - intro row: <p> eyebrow, heading, <p> lead;
 * - card rows (a picture): heading or first plain <p> = title, next <p> = teaser,
 *   <ul> = topic chips,
 *   a <p> with an icon (:article: / :video:) = content type, the <p> after it = date;
 * - a row holding only link paragraphs = the "Discover more" button.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function wrapAll(className, nodes) {
  const wrap = el('div', className);
  nodes.forEach((n) => wrap.append(n));
  return wrap;
}

function buildCard(row) {
  const card = el('div', 'st-card');
  const picture = row.querySelector('picture');
  const roles = {
    title: [], desc: [], topics: [], type: [], date: [], rest: [],
  };
  [...row.children].forEach((cell) => {
    [...cell.children].forEach((node) => {
      if (picture && node.contains(picture)) return;
      if (node.matches('ul, ol')) roles.topics.push(node);
      else if (node.matches('p') && node.querySelector('.icon')) roles.type.push(node);
      else if (node.matches('p') && roles.type.length) roles.date.push(node);
      else if (node.matches(`p, ${HEADING}`) && !roles.title.length) roles.title.push(node);
      else if (node.matches(`p, ${HEADING}`)) roles.desc.push(node);
      else roles.rest.push(node);
    });
  });
  const img = el('div', 'st-card-img');
  if (picture) img.append(picture);
  const body = el('div', 'st-card-body');
  if (roles.title.length) body.append(wrapAll('st-card-title', roles.title));
  if (roles.desc.length) body.append(wrapAll('st-card-desc', roles.desc));
  if (roles.topics.length) body.append(wrapAll('st-card-topics', roles.topics));
  const meta = el('div', 'st-card-meta');
  if (roles.type.length) meta.append(wrapAll('st-card-type', roles.type));
  if (roles.date.length) meta.append(wrapAll('st-card-date', roles.date));
  body.append(meta);
  roles.rest.forEach((n) => body.append(n));
  card.append(img, body);
  return card;
}

export default function decorate(block) {
  if (block.querySelector('.st')) return;
  const st = el('div', 'st');
  const inner = el('div', 'st-inner ifx-fixed');
  const grid = el('div', 'st-grid');
  const more = [];
  const eyebrow = [];
  const title = [];
  const lead = [];
  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const onlyLinks = nodes.length && nodes.every((n) => n.matches('p') && n.querySelector('a[href]'));
    if (row.querySelector('picture')) {
      grid.append(buildCard(row));
    } else if (onlyLinks) {
      more.push(...nodes);
    } else {
      nodes.forEach((node) => {
        if (node.matches(HEADING) && !title.length) title.push(node);
        else if (!title.length) eyebrow.push(node);
        else lead.push(node);
      });
    }
    row.remove();
  });
  if (eyebrow.length) inner.append(wrapAll('st-eyebrow', eyebrow));
  if (title.length) inner.append(wrapAll('st-title', title));
  if (lead.length) inner.append(wrapAll('st-lead', lead));
  inner.append(grid);
  if (more.length) inner.append(wrapAll('st-more', more));
  st.append(inner);
  block.append(st);
}
