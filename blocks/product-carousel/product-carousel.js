/**
 * product-carousel — "New products" rail (reconstructive: repeat group).
 * Authoring: a heading-only row is the rail title; every row with a picture is one
 * product card — picture cell (optional <p> badge such as "NEW") plus a text cell:
 * <p> before the heading = product family, heading (usually linked) = part name,
 * <p> after it = subtitle, <p>s holding a link = card links. A row holding only
 * link paragraphs is the rail CTA ("View all products"). The first card is featured.
 * Prev / next arrows are presentational controls built here.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/**
 * Direct children of a cell. A <p> wrapping a picture plus text (the loader's
 * wrapTextNodes shape) keeps its identity: the picture is lifted out before it.
 */
function cellNodes(cell) {
  const out = [];
  [...cell.children].forEach((n) => {
    const pic = n.matches('p') && n.children.length > 1 ? n.querySelector('picture') : null;
    if (pic) {
      n.before(pic);
      out.push(pic);
    }
    out.push(n);
  });
  return out;
}

function wrapAll(className, nodes) {
  const wrap = el('div', className);
  nodes.forEach((n) => wrap.append(n));
  return wrap;
}

function buildCard(row) {
  const card = el('article', 'np-card');
  const media = el('div', 'np-card-media');
  const body = el('div', 'np-card-body');
  const picture = row.querySelector('picture');
  const roles = {
    badge: [], family: [], title: [], sub: [], links: [], rest: [],
  };
  [...row.children].forEach((cell) => {
    const isMedia = picture && cell.contains(picture);
    cellNodes(cell).forEach((node) => {
      if (picture && node.contains(picture)) return;
      if (isMedia && node.matches('p')) roles.badge.push(node);
      else if (node.matches(HEADING) && !roles.title.length) roles.title.push(node);
      else if (node.matches('p') && node.querySelector('a[href]')) roles.links.push(node);
      else if (node.matches('p') && !roles.title.length) roles.family.push(node);
      else if (node.matches(`p, ${HEADING}`)) roles.sub.push(node);
      else roles.rest.push(node);
    });
  });
  if (picture) media.append(picture);
  if (roles.badge.length) media.append(wrapAll('np-card-badge', roles.badge));
  body.append(
    wrapAll('np-card-family', roles.family),
    wrapAll('np-card-title', roles.title),
    wrapAll('np-card-sub', roles.sub),
    wrapAll('np-card-links', roles.links),
  );
  roles.rest.forEach((n) => body.append(n));
  card.append(media, body);
  return card;
}

function arrow(label, icon) {
  const btn = el('button', 'np-arrow', { type: 'button', 'aria-label': label });
  btn.append(el('span', `icon icon-${icon}`, { 'aria-hidden': 'true' }));
  return btn;
}

function wire(track, prev, next) {
  let index = 0;
  const cards = () => [...track.querySelectorAll('.np-card')];
  const update = () => {
    const list = cards();
    if (!list.length) return;
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
    index = Math.min(cards().length - 1, index + 1);
    update();
  });
  prev.classList.add('is-disabled');
}

export default function decorate(block) {
  if (block.querySelector('.np')) return;
  const np = el('div', 'np ifx-band-grey');
  const inner = el('div', 'np-inner ifx-fixed', { 'aria-label': 'Products' });
  const head = el('div', 'np-title');
  const track = el('div', 'np-track');
  const cta = el('div', 'np-cta');
  [...block.children].forEach((row) => {
    if (row.querySelector('picture')) {
      track.append(buildCard(row));
    } else {
      [...row.children].forEach((cell) => {
        [...cell.children].forEach((node) => {
          if (node.matches('p') && node.querySelector('a[href]')) cta.append(node);
          else head.append(node);
        });
      });
    }
    row.remove();
  });
  track.querySelector('.np-card')?.classList.add('np-card-featured');
  const foot = el('div', 'np-foot');
  const arrows = el('div', 'np-arrows');
  const prev = arrow('Previous', 'left-arrow');
  const next = arrow('Next', 'right-arrow');
  arrows.append(prev, next);
  foot.append(cta, arrows);
  if (head.children.length) inner.append(head);
  inner.append(track, foot);
  np.append(inner);
  block.append(np);
  wire(track, prev, next);
}
