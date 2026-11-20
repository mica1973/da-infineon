/**
 * hero-carousel — the home stage slider (template-slotted).
 * Authoring: one row per slide; one cell holds the picture, the other the text:
 * an eyebrow <p>, a heading (the first slide's is the page h1), a description <p>
 * and a CTA <p> with a link. Roles are read from content, never from cell order.
 * Behaviour (restoreAtDelivery): auto-advance every 15 s, 1 s opacity crossfade,
 * a 15 s linear fill on the active counter, prev arrow turns brand teal after the
 * first advance, pause / resume.
 */

const INTERVAL = 15000;
const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function iconButton(className, icon, label) {
  const btn = el('button', className, { type: 'button', 'aria-label': label });
  btn.append(el('span', `icon icon-${icon}`, { 'aria-hidden': 'true' }));
  return btn;
}

/**
 * Direct children of each cell. A <p> wrapping a picture plus text (the loader's
 * wrapTextNodes shape) keeps its identity: the picture is lifted out before it.
 */
function cellNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div > *').forEach((n) => {
    const pic = n.matches('p') && n.children.length > 1 ? n.querySelector('picture') : null;
    if (pic) {
      n.before(pic);
      out.push(pic);
    }
    out.push(n);
  });
  return out;
}

/**
 * Splits one authored row into slide roles by content. With a heading: paragraphs before
 * it are the eyebrow, after it the description. Without one (titles authored as plain
 * paragraphs): three or more plain paragraphs read eyebrow, title, description; fewer
 * read title, description. A paragraph holding a link is the CTA.
 */
function readSlide(row) {
  const picture = row.querySelector('picture');
  const roles = {
    picture, eyebrow: [], title: null, desc: [], cta: [],
  };
  const plain = [];
  cellNodes(row).forEach((node) => {
    if (picture && node.contains(picture)) return;
    if (node.matches('p') && node.querySelector('a[href]')) roles.cta.push(node);
    else if (node.matches(HEADING) && !roles.title) roles.title = node;
    else if (roles.title) roles.desc.push(node);
    else plain.push(node);
  });
  if (roles.title) {
    roles.eyebrow = plain;
  } else if (plain.length >= 3) {
    [roles.eyebrow, roles.title, ...roles.desc] = [[plain[0]], ...plain.slice(1)];
  } else if (plain.length) {
    [roles.title, ...roles.desc] = plain;
  }
  return roles;
}

function buildSlide(roles, index) {
  const slide = el('div', `hero-slide${index === 0 ? ' showing' : ''}`);
  const content = el('div', 'hero-content');
  const groups = [
    ['hero-eyebrow', roles.eyebrow],
    ['hero-title', roles.title ? [roles.title] : []],
    ['hero-desc', roles.desc],
    ['hero-cta', roles.cta],
  ];
  groups.forEach(([cls, list]) => {
    if (!list.length) return;
    const wrap = el('div', cls);
    list.forEach((n) => wrap.append(n));
    content.append(wrap);
  });
  slide.append(content);
  const img = el('li', `hero-img${index === 0 ? ' show-img' : ''}`);
  if (roles.picture) {
    const host = roles.picture.parentElement;
    img.append(roles.picture);
    if (host && host.matches('p') && !host.textContent.trim() && !host.children.length) {
      host.remove();
    }
  }
  return { slide, img };
}

function buildControls(count) {
  const controls = el('div', 'hero-controls ifx-shell');
  const ctrl = el('div', 'hero-ctrl');
  const progress = el('div', 'hero-progress');
  progress.append(
    iconButton('hero-pause', 'media-pause', 'Pause'),
    iconButton('hero-resume', 'media-play', 'Play'),
  );
  const counter = el('div', 'hero-counter');
  for (let i = 0; i < count; i += 1) {
    const c = el('div', `hero-count${i === 0 ? ' active' : ''}`);
    c.append(el('div', 'hero-fill'));
    counter.append(c);
  }
  progress.append(counter);
  const desktop = el('div', 'hero-nav hero-nav-desktop');
  desktop.append(
    iconButton('hero-prev', 'left-arrow', 'button previous'),
    iconButton('hero-next', 'right-arrow', 'button next'),
  );
  const mobile = el('div', 'hero-nav hero-nav-mobile');
  const play = el('div', 'hero-mobplay');
  play.append(
    iconButton('hero-pause', 'media-pause', 'Pause'),
    iconButton('hero-resume', 'media-play', 'Play'),
  );
  mobile.append(
    iconButton('hero-prev', 'left-arrow', 'button previous'),
    play,
    iconButton('hero-next', 'right-arrow', 'button next'),
  );
  ctrl.append(progress, desktop, mobile);
  controls.append(ctrl);
  return controls;
}

function wire(block) {
  const slides = [...block.querySelectorAll('.hero-slide')];
  const imgs = [...block.querySelectorAll('.hero-img')];
  const counts = [...block.querySelectorAll('.hero-count')];
  const lists = [[slides, 'showing'], [imgs, 'show-img'], [counts, 'active']];
  let cur = 0;
  let timer = null;
  const go = (n) => {
    const len = slides.length;
    lists.forEach(([list, cls]) => list[cur]?.classList.remove(cls));
    cur = (n + len) % len;
    lists.forEach(([list, cls]) => list[cur]?.classList.add(cls));
    block.querySelectorAll('.hero-prev').forEach((b) => {
      b.classList.toggle('icon-brand-500', cur !== 0);
    });
  };
  const arm = () => {
    clearTimeout(timer);
    if (slides.length < 2 || block.classList.contains('is-paused')) return;
    timer = setTimeout(() => {
      go(cur + 1);
      arm();
    }, INTERVAL);
  };
  const on = (sel, fn) => block.querySelectorAll(sel).forEach((b) => b.addEventListener('click', fn));
  on('.hero-prev', () => {
    go(cur - 1);
    arm();
  });
  on('.hero-next', () => {
    go(cur + 1);
    arm();
  });
  on('.hero-pause', () => {
    block.classList.add('is-paused');
    arm();
  });
  on('.hero-resume', () => {
    block.classList.remove('is-paused');
    arm();
  });
  arm();
}

export default function decorate(block) {
  if (block.querySelector('.hero-stage')) return;
  const rows = [...block.children];
  const stage = el('div', 'hero-stage ifx-shell');
  const section = el('div', 'hero-section');
  const left = el('div', 'hero-left');
  const right = el('div', 'hero-right');
  const images = el('ul', 'hero-images');
  let n = 0;
  rows.forEach((row) => {
    const roles = readSlide(row);
    if (!roles.title && !roles.picture) return;
    const { slide, img } = buildSlide(roles, n);
    left.append(slide);
    images.append(img);
    n += 1;
    row.remove();
  });
  right.append(images);
  section.append(left, right);
  stage.append(section);
  block.prepend(stage, buildControls(n));
  block.setAttribute('aria-roledescription', 'carousel');
  wire(block);
}
