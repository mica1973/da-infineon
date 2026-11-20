/**
 * story-hub — the structured parts of a story / pillar page column. Prose (headings,
 * paragraphs, single images) stays default content in the section; the parts below are
 * blocks, one variant each (author-selectable; when the variant is missing it is inferred
 * from the content: blockquote → quote, video link → video, otherwise columns).
 *
 *   quote    blockquote (or the paragraphs before a heading) + the source line (heading / p).
 *   video    poster picture + a link to the video file (Scene7 `is/content/…` or .mp4):
 *            click-to-play player with native controls and a share menu (no autoplay).
 *   box      grey box. Rows: prose rows (heading + paragraphs, e.g. an FAQ) and fact rows
 *            (two cells: icon image | heading + text).
 *   columns  optional head row (one cell: heading + intro), then rows of 2 cells; each cell:
 *            heading, picture, text paragraphs (a paragraph starting in bold opens a new
 *            group: "Herausforderung" / "Lösung"), link-only paragraphs (arrow links).
 *   links    head row (heading + intro), then one row per item: subject paragraph,
 *            description paragraph(s), link-only paragraph.
 *   rail     head row (heading), then one row per card: image | type, title, link paragraphs.
 *            Static when the cards fit; drag / swipe (and arrows on large screens) when not.
 *   gallery  head row (heading), then one picture per row: thumbnail grid + a stage showing a
 *            presentational clone of the selected picture, prev / next arrows.
 *   articles head row (eyebrow paragraph + heading), then one row per card: picture | title,
 *            description, topic, type, date paragraphs (roles by order).
 *   checks   intro paragraph(s) + a list rendered as a two-column check list.
 *   timeline prose whose lists render as a dotted timeline (teal dots joined by a rule).
 *   figure   one picture at a share of the column (`w25` / `w50` / `w75`).
 *   Modifiers: columns `icons` (small pictograms instead of photos), quote `portrait`
 *   (speaker picture beside the quote), box `flat` (fact rows without the grey box),
 *   box `cta` (prose box ending in a button paragraph), rail `described` (title +
 *   description cards), `mb-16` / `mb-32` / `mb-64` (bottom spacing of the source instance).
 *
 * Decode tier: template-slotted (quote, video) and reconstructive (box, columns, links, rail —
 * classified by content, never by row index). Authored nodes are MOVED (EW1); glyphs, the
 * quote rule, the play button and the rail arrows are presentational. Re-entrant (EW9).
 * @ew-exempt video share menu labels (E-Mail, Link kopieren, Einbetten) and the rail arrow /
 *   play button aria-labels — player chrome baked into the block, not page copy.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';
const VIDEO_HREF = /\.(mp4|webm|m3u8)(\?|$)|\/is\/content\//i;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function icon(name) {
  const span = el('span', `icon icon-${name}`);
  span.setAttribute('aria-hidden', 'true');
  return span;
}

function nodesOf(cell) {
  const nodes = [];
  [...cell.childNodes].forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) {
      nodes.push(n);
    } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
      const p = document.createElement('p');
      p.append(n);
      nodes.push(p);
    }
  });
  return nodes;
}

function rowsOf(block) {
  return [...block.children].map((row) => {
    const cells = [...row.children];
    return cells.length ? cells : [row];
  });
}

function isMedia(node) {
  if (node.matches('picture, img')) return true;
  return node.matches('p') && !!node.querySelector('picture, img') && !node.textContent.trim();
}

function isLinkOnly(node) {
  if (!node.matches('p')) return false;
  const links = node.querySelectorAll('a[href]');
  if (links.length !== 1) return false;
  return node.textContent.trim() === links[0].textContent.trim() && !!links[0].textContent.trim();
}

function mediaOnly(cell) {
  const nodes = nodesOf(cell);
  return nodes.length > 0 && nodes.every(isMedia);
}

function opensGroup(node) {
  if (!node.matches('p')) return false;
  const first = node.firstElementChild;
  if (!first || !first.matches('strong, b')) return false;
  const lead = node.textContent.trimStart();
  return lead.startsWith(first.textContent.trim());
}

function arrowLink(p) {
  const a = p.querySelector('a[href]');
  if (a && !a.querySelector('.icon')) a.append(icon('arrow-right'));
  return p;
}

/* ---------- quote ---------- */
function decorateQuote(block) {
  let nodes = rowsOf(block).flat().flatMap(nodesOf);
  // portrait: the speaker picture sits beside the quote (live 64 px avatar)
  const pic = block.classList.contains('portrait') && nodes.some(isMedia)
    ? el('div', 'story-hub-quote-pic') : null;
  if (pic) {
    nodes.filter(isMedia).forEach((n) => pic.append(n));
    nodes = nodes.filter((n) => !pic.contains(n));
  }
  const line = el('div', 'story-hub-quote-line');
  line.setAttribute('aria-hidden', 'true');
  line.append(icon('quote'), el('div', 'story-hub-quote-rule'));
  const text = el('div', 'story-hub-quote-text');
  const name = el('div', 'story-hub-quote-name');
  let quote = nodes.find((n) => n.matches('blockquote'));
  const firstHeading = nodes.findIndex((n) => n.matches(HEADING));
  nodes.forEach((n, i) => {
    if (n === quote) return;
    const beforeHeading = firstHeading < 0 || i < firstHeading;
    if (!nodes.some((m) => m.matches('blockquote')) && beforeHeading && n.matches('p')) {
      if (!quote) quote = el('blockquote');
      quote.append(n);
    } else {
      name.append(n);
    }
  });
  if (pic) text.append(pic);
  if (quote) text.append(quote);
  block.replaceChildren(line, text);
  if (name.children.length) block.append(name);
}

/* ---------- video ---------- */
function shareMenu(url) {
  const wrap = el('div', 'story-hub-video-share');
  const btn = el('button', 'story-hub-video-share-btn');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Social Share');
  btn.setAttribute('aria-expanded', 'false');
  btn.append(icon('share'));
  const menu = el('ul', 'story-hub-video-share-menu');
  menu.hidden = true;
  const embed = `<video src="${url}" controls></video>`;
  [['mail', 'E-Mail', `mailto:?body=${encodeURIComponent(url)}`, null],
    ['link', 'Link kopieren', '#', url],
    ['code', 'Einbetten', '#', embed]].forEach(([name, label, href, copy]) => {
    const li = el('li');
    const a = el('a');
    a.href = href;
    if (copy) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(copy);
      });
    }
    a.append(icon(name), label);
    li.append(a);
    menu.append(li);
  });
  btn.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    btn.setAttribute('aria-expanded', String(!menu.hidden));
  });
  wrap.append(btn, menu);
  return wrap;
}

function decorateVideo(block) {
  const nodes = rowsOf(block).flat().flatMap(nodesOf);
  const stage = el('div', 'story-hub-video-stage');
  const label = el('div', 'story-hub-video-label');
  nodes.forEach((n) => {
    if (isMedia(n)) stage.append(n);
    else label.append(n);
  });
  const links = [...label.querySelectorAll('a[href]')];
  const source = links.find((a) => VIDEO_HREF.test(a.href)) || links[0];
  const href = source ? source.href : '';
  const play = el('button', 'story-hub-video-play');
  play.type = 'button';
  play.setAttribute('aria-label', 'Play or Pause Video');
  block.replaceChildren(stage, play, label);
  if (!href) return;
  play.addEventListener('click', () => {
    const img = stage.querySelector('img');
    const video = el('video', 'story-hub-video-player');
    video.src = href;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'auto';
    if (img) video.poster = img.currentSrc || img.src;
    stage.append(video);
    block.classList.add('is-playing');
    block.append(shareMenu(href));
    video.play().catch(() => {});
  }, { once: true });
}

/* ---------- box ---------- */
function decorateBox(block) {
  const inner = el('div', 'story-hub-box-in');
  const parts = [];
  rowsOf(block).forEach((cells) => {
    if (cells.length > 1 && mediaOnly(cells[0])) {
      const fact = el('div', 'story-hub-fact');
      const iconCol = el('div', 'story-hub-fact-icon');
      const pic = el('div', 'story-hub-fact-pic');
      nodesOf(cells[0]).forEach((n) => pic.append(n));
      iconCol.append(pic);
      const body = el('div', 'story-hub-fact-body');
      const title = el('div', 'story-hub-fact-title');
      const rt = el('div', 'story-hub-rt');
      cells.slice(1).flatMap(nodesOf).forEach((n) => {
        if (n.matches(HEADING) && !title.children.length) title.append(n);
        else rt.append(n);
      });
      if (title.children.length) body.append(title);
      if (rt.children.length) body.append(rt);
      fact.append(iconCol, body);
      parts.push(fact);
      return;
    }
    let rt = null;
    cells.flatMap(nodesOf).forEach((n) => {
      if (n.matches(HEADING)) {
        const head = el('div', 'story-hub-box-head');
        head.append(n);
        parts.push(head);
        rt = null;
      } else {
        if (!rt) {
          rt = el('div', 'story-hub-rt');
          parts.push(rt);
        }
        rt.append(n);
      }
    });
  });
  parts.forEach((part, i) => {
    const next = parts[i + 1];
    if (part.matches('.story-hub-box-head') && next && next.matches('.story-hub-fact')) {
      part.classList.add('is-lead');
    }
    if (part.matches('.story-hub-fact') && !(next && next.matches('.story-hub-fact'))) {
      part.classList.add('is-last');
    }
  });
  inner.append(...parts);
  block.replaceChildren(inner);
}

/* ---------- columns ---------- */
/* a Scene7 / video-file link right under a cell picture turns that picture into a player
   (poster + play button, as the source video component); a bare-URL link is consumed */
function cellPlayer(pic, link) {
  const a = link.querySelector('a[href]');
  const { href } = a;
  pic.classList.add('is-video');
  const play = el('button', 'story-hub-video-play');
  play.type = 'button';
  play.setAttribute('aria-label', 'Play or Pause Video');
  pic.append(play);
  play.addEventListener('click', () => {
    const img = pic.querySelector('img');
    const video = el('video', 'story-hub-video-player');
    video.src = href;
    video.controls = true;
    video.playsInline = true;
    if (img) video.poster = img.currentSrc || img.src;
    pic.replaceChildren(video);
    video.play().catch(() => {});
  }, { once: true });
  return a.textContent.trim() !== a.getAttribute('href');
}

function buildCol(cell) {
  const col = el('div', 'story-hub-col');
  const nodes = nodesOf(cell);
  const hasTitle = nodes.some((n) => n.matches(HEADING));
  let group = null;
  nodes.forEach((n) => {
    if (n.matches(HEADING)) {
      const title = el('div', 'story-hub-col-title');
      title.append(n);
      col.append(title);
      group = null;
    } else if (isMedia(n)) {
      const pic = el('div', 'story-hub-pic');
      pic.append(n);
      col.append(pic);
      group = null;
    } else if (isLinkOnly(n) && VIDEO_HREF.test(n.querySelector('a').href)
      && col.lastElementChild && col.lastElementChild.matches('.story-hub-pic')
      && !cellPlayer(col.lastElementChild, n)) {
      group = null;
    } else if (isLinkOnly(n)) {
      const link = el('div', 'story-hub-ilink');
      link.append(arrowLink(n));
      col.append(link);
      group = null;
    } else {
      if (!group || opensGroup(n)) {
        group = el('div', 'story-hub-rt');
        col.append(group);
      }
      group.append(n);
    }
  });
  const kids = [...col.children];
  kids.forEach((kid, i) => {
    const after = kids.slice(i + 1);
    if (kid.matches('.story-hub-pic') && !after.length) kid.classList.add('is-end');
    if (kid.matches('.story-hub-rt') && !after.some((k) => k.matches('.story-hub-rt'))) {
      kid.classList.add('is-end');
    }
  });
  if (!hasTitle) col.classList.add('is-plain');
  return col;
}

/* `rev tail-<n>-<m>…` (encoder): the source reverses a whole container on phones, including the
   full-width components after its columns (n, m… default-content nodes each), so below 768 px
   those nodes move into the block and stack above the columns; they move back at >= 768 */
function revTail(block) {
  const token = [...block.classList].find((c) => /^tail-[\d-]+$/.test(c));
  const next = block.parentElement?.nextElementSibling;
  if (!token || !next?.classList.contains('default-content-wrapper')) return;
  const tail = el('div', 'story-hub-tail');
  let i = 0;
  const groups = token.slice(5).split('-').map(Number).map((n) => {
    const nodes = [...next.children].slice(i, i + n);
    i += n;
    return nodes;
  });
  const boxes = groups.map(() => el('div', 'story-hub-tail-item default-content-wrapper'));
  const mq = window.matchMedia('(width < 768px)');
  const place = () => {
    if (mq.matches) {
      groups.forEach((nodes, k) => boxes[k].append(...nodes));
      tail.replaceChildren(...boxes);
      block.append(tail);
    } else if (tail.isConnected) {
      next.prepend(...groups.flat());
      tail.remove();
    }
  };
  place();
  mq.addEventListener('change', place);
}

function decorateColumns(block) {
  const out = [];
  rowsOf(block).forEach((cells) => {
    if (cells.length === 1) {
      const head = el('div', 'story-hub-cols-head');
      let intro = null;
      nodesOf(cells[0]).forEach((n) => {
        if (n.matches(HEADING)) {
          const title = el('div', 'story-hub-cols-title');
          title.append(n);
          head.append(title);
        } else {
          if (!intro) {
            intro = el('div', 'story-hub-rt');
            head.append(intro);
          }
          intro.append(n);
        }
      });
      out.push(head);
      return;
    }
    const row = el('div', 'story-hub-cols');
    cells.forEach((cell) => row.append(buildCol(cell)));
    if (!row.querySelector('.story-hub-col-title')) row.classList.add('is-compact');
    out.push(row);
  });
  block.replaceChildren(...out);
  revTail(block);
}

/* ---------- links ---------- */
function decorateLinks(block) {
  const head = el('div', 'story-hub-links-head');
  const list = el('div', 'story-hub-links-list');
  rowsOf(block).forEach((cells) => {
    const nodes = cells.flatMap(nodesOf);
    if (nodes.some((n) => n.matches(HEADING)) && !list.children.length) {
      let intro = null;
      nodes.forEach((n) => {
        if (n.matches(HEADING)) {
          const title = el('div', 'story-hub-links-title');
          title.append(n);
          head.append(title);
        } else {
          if (!intro) {
            intro = el('div', 'story-hub-links-intro');
            head.append(intro);
          }
          intro.append(n);
        }
      });
      return;
    }
    const item = el('div', 'story-hub-links-item');
    const subject = el('div', 'story-hub-links-subject');
    const desc = el('div', 'story-hub-links-desc');
    const cta = el('div', 'story-hub-links-cta');
    nodes.forEach((n) => {
      if (isLinkOnly(n)) cta.append(arrowLink(n));
      else if (!subject.children.length) subject.append(n);
      else desc.append(n);
    });
    [subject, desc, cta].forEach((part) => {
      if (part.children.length) item.append(part);
    });
    list.append(item);
  });
  block.replaceChildren(...[head, list].filter((p) => p.children.length));
}

/* ---------- rail ---------- */
function buildCard(cells) {
  const card = el('div', 'story-hub-card');
  const media = el('div', 'story-hub-card-img');
  const body = el('div', 'story-hub-card-body');
  const texts = [];
  let link = null;
  cells.flatMap(nodesOf).forEach((n) => {
    if (isMedia(n)) media.append(n);
    else if (isLinkOnly(n) && !link) link = n;
    else texts.push(n);
  });
  const title = el('div', 'story-hub-card-title');
  if (texts.length > 1) {
    const type = el('div', 'story-hub-card-type');
    type.append(texts.shift());
    body.append(type);
  }
  texts.forEach((n) => title.append(n));
  body.append(title);
  if (link) {
    const cta = el('div', 'story-hub-card-link');
    cta.append(arrowLink(link));
    body.append(cta);
  }
  if (media.children.length) card.append(media);
  card.append(body);
  return card;
}

function decorateRail(block) {
  const head = el('div', 'story-hub-rail-title');
  const viewport = el('div', 'story-hub-rail-viewport');
  const track = el('div', 'story-hub-rail-track');
  rowsOf(block).forEach((cells) => {
    const nodes = cells.flatMap(nodesOf);
    const isHead = nodes.some((n) => n.matches(HEADING)) && !nodes.some(isMedia);
    if (isHead && !track.children.length) nodes.forEach((n) => head.append(n));
    else track.append(buildCard(cells));
  });
  viewport.append(track);
  const nav = el('div', 'story-hub-rail-nav');
  const prev = el('button', 'story-hub-rail-prev');
  const next = el('button', 'story-hub-rail-next');
  prev.type = 'button';
  next.type = 'button';
  prev.setAttribute('aria-label', 'Previous slide');
  next.setAttribute('aria-label', 'Next slide');
  prev.append(icon('chevron-left'));
  next.append(icon('chevron-right'));
  nav.append(prev, next);
  block.replaceChildren(...(head.children.length ? [head] : []), viewport, nav);

  const cards = () => [...track.children];
  const mobile = window.matchMedia('(width < 768px)');
  let index = 0;
  let offset = 0;
  const overflowing = () => track.scrollWidth > viewport.clientWidth + 1;
  const maxIndex = () => {
    const all = cards();
    const limit = track.scrollWidth - viewport.clientWidth;
    const last = all.findIndex((c) => c.offsetLeft >= limit);
    return last < 0 ? all.length - 1 : last;
  };
  const apply = (dx = 0) => {
    const all = cards();
    const target = all[index];
    const limit = Math.max(0, track.scrollWidth - viewport.clientWidth);
    offset = target ? Math.min(target.offsetLeft - all[0].offsetLeft, limit) : 0;
    track.style.transform = offset || dx ? `translateX(${-offset + dx}px)` : '';
    // a card measured while its section is still hidden reads 0: leave the height natural
    const h = target ? target.offsetHeight : 0;
    track.style.height = mobile.matches && h ? `${h}px` : '';
    const locked = !overflowing();
    block.classList.toggle('is-locked', locked);
    prev.disabled = locked || index === 0;
    next.disabled = locked || index >= maxIndex();
  };
  const go = (i) => {
    index = Math.max(0, Math.min(i, maxIndex()));
    apply();
  };
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  let startX = null;
  viewport.addEventListener('pointerdown', (e) => {
    if (!overflowing()) return;
    startX = e.clientX;
    track.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    apply(e.clientX - startX);
  });
  const end = (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    track.classList.remove('is-dragging');
    if (dx < -40) go(index + 1);
    else if (dx > 40) go(index - 1);
    else apply();
  };
  viewport.addEventListener('pointerup', end);
  viewport.addEventListener('pointercancel', end);
  viewport.addEventListener('pointerleave', end);

  window.addEventListener('resize', () => go(index));
  track.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', () => apply(), { once: true });
  });
  // re-measure once cards get their real size (section reveal, late images)
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => { if (startX === null) apply(); });
    cards().forEach((c) => ro.observe(c));
  }
  requestAnimationFrame(() => apply());
}

/* ---------- gallery ---------- */
function stripInstrumentation(root) {
  [root, ...root.querySelectorAll('*')].forEach((node) => {
    [...node.attributes].forEach(({ name }) => {
      if (name === 'data-prose-index' || name === 'data-image-index'
        || name.startsWith('data-aue-') || name.startsWith('data-richtext-')) {
        node.removeAttribute(name);
      }
    });
  });
  return root;
}

function decorateGallery(block) {
  const head = el('div', 'story-hub-gallery-title');
  const thumbs = el('div', 'story-hub-gallery-thumbs');
  rowsOf(block).flat().flatMap(nodesOf).forEach((n) => {
    if (isMedia(n)) {
      const thumb = el('div', 'story-hub-gallery-thumb');
      thumb.append(n);
      thumbs.append(thumb);
    } else {
      head.append(n);
    }
  });
  // the stage shows a presentational clone of the selected thumbnail (EW4)
  const stage = el('div', 'story-hub-gallery-stage');
  stage.setAttribute('aria-hidden', 'true');
  const nav = el('div', 'story-hub-gallery-nav');
  const prev = el('button', 'story-hub-gallery-prev');
  const next = el('button', 'story-hub-gallery-next');
  prev.type = 'button';
  next.type = 'button';
  prev.setAttribute('aria-label', 'Previous image');
  next.setAttribute('aria-label', 'Next image');
  prev.append(icon('left-arrow'));
  next.append(icon('right-arrow'));
  nav.append(prev, next);
  const main = el('div', 'story-hub-gallery-main');
  main.append(stage, nav);
  const items = () => [...thumbs.children];
  let index = 0;
  const show = (i) => {
    const all = items();
    if (!all.length) return;
    index = Math.max(0, Math.min(i, all.length - 1));
    const media = all[index].querySelector('picture') || all[index].querySelector('img');
    const clone = stripInstrumentation(media.cloneNode(true));
    clone.querySelectorAll('img').forEach((img) => {
      img.alt = '';
      img.loading = 'eager';
    });
    stage.replaceChildren(clone);
    all.forEach((t, j) => t.classList.toggle('is-selected', j === index));
    prev.disabled = index === 0;
    next.disabled = index === all.length - 1;
  };
  items().forEach((t, i) => t.addEventListener('click', () => show(i)));
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  const body = el('div', 'story-hub-gallery-body');
  body.append(main, thumbs);
  block.replaceChildren(...(head.children.length ? [head] : []), body);
  show(0);
}

/* ---------- articles ---------- */
function decorateArticles(block) {
  const head = el('div', 'story-hub-articles-head');
  const list = el('div', 'story-hub-articles-list');
  rowsOf(block).forEach((cells) => {
    const nodes = cells.flatMap(nodesOf);
    if (!nodes.some(isMedia) && !list.children.length) {
      nodes.forEach((n) => {
        const part = el('div', n.matches(HEADING)
          ? 'story-hub-articles-title' : 'story-hub-articles-eyebrow');
        part.append(n);
        head.append(part);
      });
      return;
    }
    // card: picture | title, description, topic, type, date (by order)
    const card = el('div', 'story-hub-article');
    const media = el('div', 'story-hub-article-img');
    const body = el('div', 'story-hub-article-body');
    const meta = el('div', 'story-hub-article-meta');
    const roles = ['title', 'desc', 'topic'];
    nodes.forEach((n) => {
      if (isMedia(n)) {
        media.append(n);
        return;
      }
      const role = roles.shift();
      if (role) {
        const part = el('div', `story-hub-article-${role}`);
        part.append(n);
        body.append(part);
      } else {
        meta.append(n);
      }
    });
    if (meta.children.length) body.append(meta);
    card.append(media, body);
    list.append(card);
  });
  block.replaceChildren(...[head, list].filter((p) => p.children.length));
}

/* ---------- figure ---------- */
function decorateFigure(block) {
  const fig = el('div', 'story-hub-figure');
  rowsOf(block).flat().flatMap(nodesOf).forEach((n) => fig.append(n));
  block.replaceChildren(fig);
}

/* ---------- checks ---------- */
function decorateChecks(block) {
  const rt = el('div', 'story-hub-rt');
  rowsOf(block).flat().flatMap(nodesOf).forEach((n) => rt.append(n));
  block.replaceChildren(rt);
}

const KINDS = {
  quote: decorateQuote,
  video: decorateVideo,
  box: decorateBox,
  columns: decorateColumns,
  links: decorateLinks,
  rail: decorateRail,
  gallery: decorateGallery,
  articles: decorateArticles,
  checks: decorateChecks,
  timeline: decorateChecks,
  figure: decorateFigure,
};

function inferKind(block) {
  if (block.querySelector('blockquote')) return 'quote';
  const links = [...block.querySelectorAll('a[href]')];
  if (links.length === 1 && VIDEO_HREF.test(links[0].href)) return 'video';
  return 'columns';
}

/* article section Style tokens (encoder), one value per default-content node in order
   (`x` = template default): `hg-…` the source gap above each heading, `hm-…` the gap under each
   heading (its title marginBottom), `im-…` the gap under each image paragraph -> classes
   `hg-NN` / `hm-NN` / `im-NN`; story-hub.css maps NN to the source spacing scale */
function tagHeadingGaps(block) {
  const section = block.closest('main')?.querySelector('.section.article');
  if (!section || section.dataset.headingGaps) return;
  section.dataset.headingGaps = 'done';
  const wrap = ':scope > .default-content-wrapper > ';
  [['hg', ':is(h2, h3, h4, h5, h6)'], ['hm', ':is(h2, h3, h4, h5, h6)'], ['im', 'p:has(> picture)']]
    .forEach(([pre, sel]) => {
      const re = new RegExp(`^${pre}-[\\dx-]+$`);
      const token = [...section.classList].find((c) => re.test(c));
      if (!token) return;
      const gaps = token.slice(3).split('-');
      [...section.querySelectorAll(wrap + sel)].forEach((node, i) => {
        if (gaps[i] && gaps[i] !== 'x') node.classList.add(`${pre}-${gaps[i]}`);
      });
    });
  // `sp-<k>[b<j>]-…`: an empty spacer paragraph of the source rich text (26 px line + 16 px
  // margin) before top-level node k of the section (default nodes and blocks in order), or
  // before its j-th text element when k is a block
  const sp = [...section.classList].find((c) => /^sp-[\db-]+$/.test(c));
  if (sp) {
    const flat = [...section.children].flatMap((w) => (
      w.classList.contains('default-content-wrapper') ? [...w.children] : [w]));
    sp.slice(3).split('-').map((v) => v.split('b').map(Number)).forEach(([k, j]) => {
      let node = flat[k];
      if (!node) return;
      if (j !== undefined) node = node.querySelectorAll('p, ul, ol, h2, h3, h4, h5, h6')[j];
      if (!node) return;
      if (node.parentElement === section) {
        node.classList.add('sp-before');
        return;
      }
      const gap = document.createElement('p');
      gap.className = 'sp-gap';
      gap.setAttribute('aria-hidden', 'true');
      gap.textContent = '\u00a0';
      node.before(gap);
    });
  }
  // a paragraph that is one bare link = the source tertiary link (16/24 type)
  section.querySelectorAll(`${wrap}p`).forEach((p) => {
    const a = p.firstElementChild;
    if (p.children.length === 1 && a.tagName === 'A' && a.textContent.trim()
      && p.textContent.trim() === a.textContent.trim()) p.classList.add('is-tl');
  });
}

export default function decorate(block) {
  tagHeadingGaps(block);
  if (block.dataset.storyHub) return;
  const kind = Object.keys(KINDS).find((k) => block.classList.contains(k)) || inferKind(block);
  block.classList.add(kind);
  block.dataset.storyHub = kind;
  KINDS[kind](block);
}
