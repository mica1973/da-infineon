/**
 * breadcrumb — the trail band under the header (live .genericbreadcrumb).
 * Authoring: one list; linked items are ancestors, the unlinked last item is the current page.
 * Decode tier: template-slotted — the authored list is MOVED into the trail slot (EW1); the
 * share / bookmark glyphs on the right are block-built decoration (no authored text).
 * Variant `share` (live /de/glossary): the share glyph is a button opening the share menu
 * (Facebook, LinkedIn, E-Mail, Link kopieren) — block chrome.
 * @ew-exempt share menu labels (Facebook, LinkedIn, E-Mail, Link kopieren)
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function buildShareMenu(tool) {
  const btn = el('button', 'breadcrumb-tool breadcrumb-tool-share');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'PageShare');
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  const menu = el('ul', 'breadcrumb-share-menu');
  menu.hidden = true;
  const url = encodeURIComponent(window.location.href.split('#')[0]);
  const title = encodeURIComponent(document.title);
  [
    ['facebook', 'Facebook', `https://www.facebook.com/sharer/sharer.php?u=${url}`],
    ['linkedin', 'LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${url}`],
    ['mail', 'E-Mail', `mailto:?subject=${title}&body=${url}`],
    ['link', 'Link kopieren', '#'],
  ].forEach(([name, label, href]) => {
    const li = el('li');
    const a = el('a', `breadcrumb-share-${name}`);
    a.href = href;
    a.title = label;
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
    a.append(label);
    li.append(a);
    menu.append(li);
  });
  btn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!tool.contains(e.target) && !menu.hidden) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  return [btn, menu];
}

export default function decorate(block) {
  if (block.querySelector(':scope > .breadcrumb-inner')) return;
  const inner = el('nav', 'ifx-fixed breadcrumb-inner');
  inner.setAttribute('aria-label', 'Breadcrumb');
  const trail = el('div', 'breadcrumb-trail');
  const list = block.querySelector('ul, ol');
  if (list) trail.append(list);
  const tools = el('div', 'breadcrumb-tools');
  const share = block.classList.contains('share');
  ['share', 'star'].forEach((name) => {
    if (share && name === 'share') {
      tools.append(...buildShareMenu(tools));
      return;
    }
    const icon = el('span', `breadcrumb-tool breadcrumb-tool-${name}`);
    icon.setAttribute('aria-hidden', 'true');
    tools.append(icon);
  });
  inner.append(trail, tools);
  block.replaceChildren(inner);
}
