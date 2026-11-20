/**
 * market-cards — "key markets" teaser row (reconstructive: repeat group).
 * Authoring: a row with a heading only is the section title; every row with a picture
 * is one card — picture cell (optional <p> badge, e.g. "Made with AI") plus a text cell
 * (heading or first plain <p> = card title, next <p> = description, <p> with a link =
 * the card CTA).
 * Roles are classified by content; anything unclassified is kept in the card body.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
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
  const card = el('div', 'mk-card');
  const media = el('div', 'mk-card-media');
  const body = el('div', 'mk-card-body');
  const picture = row.querySelector('picture');
  const badges = [];
  const title = [];
  const desc = [];
  const cta = [];
  const rest = [];
  [...row.children].forEach((cell) => {
    const isMedia = picture && cell.contains(picture);
    cellNodes(cell).forEach((node) => {
      if (picture && node.contains(picture)) return;
      if (isMedia && node.matches('p')) badges.push(node);
      else if (node.matches('p') && node.querySelector('a[href]')) cta.push(node);
      else if (node.matches(`p, ${HEADING}`) && !title.length) title.push(node);
      else if (node.matches(`p, ${HEADING}`)) desc.push(node);
      else rest.push(node);
    });
  });
  if (picture) media.append(picture);
  if (badges.length) media.append(wrapAll('mk-card-ai', badges));
  if (title.length) body.append(wrapAll('mk-card-title', title));
  if (desc.length) body.append(wrapAll('mk-card-desc', desc));
  if (cta.length) body.append(wrapAll('mk-card-link', cta));
  rest.forEach((n) => body.append(n));
  card.append(media, body);
  return card;
}

export default function decorate(block) {
  if (block.querySelector('.markets')) return;
  const markets = el('div', 'markets');
  const wrap = el('div', 'markets-wrap ifx-shell');
  const head = el('div', 'markets-title');
  const grid = el('div', 'markets-grid');
  [...block.children].forEach((row) => {
    if (row.querySelector('picture')) {
      grid.append(buildCard(row));
    } else {
      [...row.children].forEach((cell) => head.append(...cell.children));
    }
    row.remove();
  });
  if (head.children.length) wrap.append(head);
  wrap.append(grid);
  markets.append(wrap);
  block.append(markets);
}
