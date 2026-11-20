/**
 * article-hero — the head of story / article pages: a breadcrumb bar with a share menu,
 * the key visual and a white title box overlapping it (title, lead, topic tags, type + date).
 *
 * Authored content (rows / cells in any order; every part optional except the heading):
 *   - a list whose items are links → breadcrumb (last item = this page; small screens show
 *     the item before it as a back link);
 *   - picture(s) → key visual; a second picture is the small-screen crop (< 576 px);
 *   - the h1 and the paragraph(s) after it → title + lead;
 *   - a list of plain items → topic tags;
 *   - a paragraph with an icon (`:article:`) or only a bold label → content type;
 *   - any other heading (h2–h6) → publication date.
 *
 * Decode tier: template-slotted. Authored nodes are MOVED by role into empty slot wrappers
 * (EW1); the mobile back link is a presentational clone (EW4). Re-entrant (EW9).
 * @ew-exempt share menu labels (Facebook, LinkedIn, E-Mail, Link kopieren) and the share
 *   button label — UI chrome baked into the block (ui-dictionary), not page copy.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

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

function isMedia(node) {
  if (node.matches('picture, img')) return true;
  return node.matches('p') && !!node.querySelector('picture, img') && !node.textContent.trim();
}

function isLinkList(node) {
  if (!node.matches('ul, ol')) return false;
  const items = [...node.children];
  return items.length > 0 && items.every((li) => {
    const a = li.querySelector('a[href]');
    return a && li.textContent.trim() === a.textContent.trim();
  });
}

function isTypeLabel(node) {
  if (!node.matches('p')) return false;
  if (node.querySelector('.icon') || /^\s*:[a-z0-9-]+:/.test(node.textContent)) return true;
  const strong = node.querySelector('strong, b');
  return !!strong && node.textContent.trim() === strong.textContent.trim();
}

function collect(block) {
  const nodes = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    (cells.length ? cells : [row]).forEach((cell) => {
      [...cell.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) {
          nodes.push(n);
        } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          nodes.push(p);
        }
      });
    });
  });
  return nodes;
}

function buildShare() {
  const wrap = el('div', 'article-hero-share');
  const btn = el('button', 'article-hero-share-btn');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'PageShare');
  btn.setAttribute('aria-expanded', 'false');
  btn.append(icon('share'));
  const menu = el('ul', 'article-hero-share-menu');
  menu.hidden = true;
  const url = encodeURIComponent(window.location.href.split('#')[0]);
  const title = encodeURIComponent(document.title);
  const items = [
    ['facebook', 'Facebook', `https://www.facebook.com/sharer/sharer.php?u=${url}`],
    ['linkedin', 'LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${url}`],
    ['mail', 'E-Mail', `mailto:?subject=${title}&body=${url}`],
    ['link', 'Link kopieren', '#'],
  ];
  items.forEach(([name, label, href]) => {
    const li = el('li');
    const a = el('a');
    a.href = href;
    if (href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    if (name === 'link') {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(window.location.href.split('#')[0]);
      });
    }
    a.append(icon(name), label);
    li.append(a);
    menu.append(li);
  });
  btn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target) && !menu.hidden) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  wrap.append(btn, menu);
  return wrap;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .article-hero-bar')) return;

  const nodes = collect(block);

  const bar = el('div', 'article-hero-bar');
  const crumbs = el('nav', 'article-hero-crumbs');
  crumbs.setAttribute('aria-label', 'Breadcrumb');
  const back = el('div', 'article-hero-back');
  const stage = el('div', 'article-hero-stage');
  const visual = el('div', 'article-hero-visual');
  const box = el('div', 'article-hero-box');
  const head = el('div', 'article-hero-head');
  const tags = el('div', 'article-hero-tags');
  const meta = el('div', 'article-hero-meta');
  const type = el('div', 'article-hero-type');
  const date = el('div', 'article-hero-date');

  let mediaCount = 0;
  nodes.forEach((node) => {
    if (isLinkList(node) && !crumbs.querySelector('ul, ol')) {
      crumbs.append(node);
    } else if (isMedia(node)) {
      // one slot per picture (the pipeline may wrap two pictures in one paragraph)
      const pics = node.matches('picture, img') ? [node]
        : [...node.querySelectorAll('picture, img')]
          .filter((p) => p.matches('picture') || !p.closest('picture'));
      pics.forEach((pic) => {
        const slot = el('div', mediaCount ? 'article-hero-visual-sm' : 'article-hero-visual-lg');
        slot.append(pics.length > 1 ? pic : node);
        visual.append(slot);
        mediaCount += 1;
      });
      if (pics.length > 1) node.remove();
    } else if (node.matches('h1')) {
      head.prepend(node);
    } else if (node.matches(HEADING)) {
      date.append(node);
    } else if (node.matches('ul, ol')) {
      tags.append(node);
    } else if (isTypeLabel(node)) {
      type.append(node);
    } else {
      head.append(node);
    }
  });
  if (mediaCount > 1) visual.classList.add('has-sm');

  // breadcrumb bar: trail (large screens) / back link to the parent (small screens)
  const trail = crumbs.querySelectorAll('li');
  if (trail.length > 1) {
    // parent = the nearest earlier crumb that does not link back to this page
    const here = window.location.pathname.replace(/\/$/, '');
    const parent = [...trail].slice(0, -1).reverse().map((li) => li.querySelector('a'))
      .find((a) => a && new URL(a.href, window.location.href).pathname.replace(/\/$/, '') !== here);
    if (parent) {
      const link = stripInstrumentation(parent.cloneNode(true));
      link.removeAttribute('aria-current');
      back.append(icon('chevron-left'), link);
      crumbs.append(back);
    }
  }
  bar.append(crumbs, buildShare());

  const first = visual.querySelector('img');
  if (first) {
    first.loading = 'eager';
    first.fetchPriority = 'high';
  }

  box.append(head);
  if (tags.children.length) box.append(tags);
  if (type.children.length || date.children.length) {
    if (type.children.length) meta.append(type);
    if (type.children.length && date.children.length) meta.append(icon('dot'));
    if (date.children.length) meta.append(date);
    box.append(meta);
  }
  if (visual.children.length) stage.append(visual);
  else stage.classList.add('no-media');
  stage.append(box);
  block.replaceChildren(bar, stage);
}
