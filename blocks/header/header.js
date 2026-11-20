import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Infineon header (replica canon `header.site-header`), template-slotted from the `/nav` document.
 *
 * /nav sections: 1 brand link · 2 nav list (top item link > category list > link list) ·
 * styled sections `search`, `language`, `currency`, `account`, `cart`, `news` (`menus` key
 * names the top items whose panel shows it). Authored nodes are MOVED into the chrome; the
 * only clones are the presentational category heads inside each panel (instrumentation
 * stripped). Behaviour follows stardust/chrome/header-contract.json: click-open mega panels
 * on desktop (first category active, categories switch on hover/click), language/currency
 * dropdowns, cart modal, account panel, and a drill-down drawer + search overlay on mobile.
 *
 * @ew-exempt the search section's link text is also used as the input placeholder.
 */

const isDesktop = window.matchMedia('(width >= 992px)');
let uid = 0;
const nextId = (p) => {
  uid += 1;
  return `${p}-${uid}`;
};

function el(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  node.append(...kids.filter(Boolean));
  return node;
}

const glyph = (name) => el('span', { class: `icon icon-${name}`, 'aria-hidden': 'true' });

/** Removes ids and data-* (the editor index) from a presentational clone (EW4). */
function stripInstrumentation(node) {
  [node, ...node.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('id');
    [...n.attributes].filter((a) => a.name.startsWith('data-')).forEach((a) => {
      n.removeAttribute(a.name);
    });
  });
  return node;
}

/** The authored link of a list item, unwrapping the pipeline's `<p>` (#98). */
function itemLink(li) {
  const p = li.querySelector(':scope > p');
  if (p) {
    while (p.firstChild) p.before(p.firstChild);
    p.remove();
  }
  return li.querySelector(':scope > a');
}

const sectionOf = (fragment, name) => fragment.querySelector(`:scope > .section.${name}`);
const contentOf = (section) => section?.querySelector('.default-content-wrapper') || section;

/* ---------------------------------------------------------------- state */

function closeAll(root, { focus = false } = {}) {
  const open = root.dataset.open || '';
  root.querySelectorAll('[aria-expanded="true"]').forEach((t) => {
    t.setAttribute('aria-expanded', 'false');
  });
  root.querySelectorAll('.nav-item.is-open').forEach((li) => li.classList.remove('is-open'));
  root.dataset.open = '';
  document.body.classList.remove('site-header-modal-open');
  if (focus && root.lastTrigger) root.lastTrigger.focus();
  return open;
}

function openState(root, name, trigger) {
  closeAll(root);
  root.dataset.open = name;
  root.lastTrigger = trigger;
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
}

/* ---------------------------------------------------------------- mega menu */

function activateCat(mega, cat) {
  mega.querySelectorAll('.mega-cat.is-active').forEach((c) => c.classList.remove('is-active'));
  if (cat) cat.classList.add('is-active');
}

function decorateCategory(cat, mega, root) {
  cat.classList.add('mega-cat');
  const sub = cat.querySelector(':scope > ul');
  const link = itemLink(cat);
  const label = el('div', { class: 'mega-cat-label' });
  [...cat.childNodes].filter((n) => n !== sub).forEach((n) => label.append(n));
  cat.prepend(label);
  if (!sub) {
    cat.classList.add('is-link');
    return;
  }
  cat.classList.add('has-sub');
  const wrap = el('div', { class: 'mega-sub' });
  if (link) {
    const head = stripInstrumentation(link.cloneNode(true));
    head.querySelectorAll('.icon').forEach((i) => i.remove());
    wrap.append(el('div', { class: 'mega-sub-head' }, head));
  } else {
    // no landing page: the head repeats the label text as a non-link title
    const head = stripInstrumentation(label.cloneNode(true));
    head.querySelectorAll('.icon').forEach((i) => i.remove());
    head.className = 'mega-sub-head';
    wrap.append(head);
  }
  sub.before(wrap);
  wrap.append(sub);
  [...sub.children].forEach((li) => {
    if (!li.querySelector('a')) li.classList.add('is-text');
  });
  label.setAttribute('role', 'button');
  label.setAttribute('tabindex', link ? '-1' : '0');
  label.addEventListener('mouseenter', () => {
    if (isDesktop.matches) activateCat(mega, cat);
  });
  label.addEventListener('click', (e) => {
    e.preventDefault();
    if (isDesktop.matches) {
      activateCat(mega, cat);
    } else {
      activateCat(mega, cat.classList.contains('is-active') ? null : cat);
      root.querySelector('.drawer-back')?.focus();
    }
  });
  label.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      label.click();
    }
  });
}

function decorateNav(navSection, root) {
  const list = contentOf(navSection)?.querySelector('ul');
  const nav = el('nav', { class: 'site-header-nav', id: nextId('site-nav'), 'aria-label': 'Main' });
  if (!list) return nav;
  const back = el('button', { type: 'button', class: 'drawer-back', 'aria-label': 'Zurück' }, glyph('chevron-left'));
  nav.append(back, list);
  [...list.children].forEach((li) => {
    li.classList.add('nav-item');
    const trigger = itemLink(li);
    const cats = li.querySelector(':scope > ul');
    if (!trigger || !cats) return;
    trigger.classList.add('nav-item-link');
    const mega = el('div', { class: 'mega', id: nextId('mega') });
    const close = el('button', { type: 'button', class: 'mega-close', 'aria-label': 'Close' }, glyph('cross'));
    const catsCol = el('div', { class: 'mega-cats' }, cats);
    mega.append(catsCol, el('div', { class: 'mega-news-slot' }), close);
    li.append(mega);
    [...cats.children].forEach((cat) => decorateCategory(cat, mega, root));
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', mega.id);
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const wasOpen = li.classList.contains('is-open');
      if (isDesktop.matches) {
        if (wasOpen) {
          closeAll(root);
          return;
        }
        openState(root, 'mega', trigger);
        li.classList.add('is-open');
        activateCat(mega, mega.querySelector('.mega-cat'));
      } else {
        root.querySelectorAll('.nav-item.is-open').forEach((x) => x.classList.remove('is-open'));
        activateCat(mega, null);
        li.classList.toggle('is-open', !wasOpen);
        trigger.setAttribute('aria-expanded', String(!wasOpen));
        nav.classList.toggle('is-drilled', !wasOpen);
      }
      root.dispatchEvent(new CustomEvent('site-header:panel', { detail: { li, mega } }));
    });
    close.addEventListener('click', () => closeAll(root, { focus: true }));
  });
  back.addEventListener('click', () => {
    const open = nav.querySelector('.nav-item.is-open');
    if (!open) return;
    const cat = open.querySelector('.mega-cat.is-active');
    if (cat) {
      cat.classList.remove('is-active');
      return;
    }
    open.classList.remove('is-open');
    open.querySelector('.nav-item-link')?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-drilled');
  });
  return nav;
}

function decorateNews(newsSection, root) {
  const content = contentOf(newsSection);
  if (!content) return;
  const menus = (newsSection.dataset.menus || '').split(',').map((s) => s.trim()).filter(Boolean);
  const news = el('div', { class: 'mega-news' });
  let item = null;
  [...content.children].forEach((node) => {
    const isLinkPara = node.tagName === 'P' && node.querySelector('a');
    if (/^H[1-6]$/.test(node.tagName)) {
      news.append(el('div', { class: 'mega-news-title' }, node));
    } else if (isLinkPara && !node.nextElementSibling) {
      news.append(el('div', { class: 'mega-news-all' }, node));
    } else if (isLinkPara) {
      item = el('div', { class: 'mega-news-item' }, node);
      news.append(item);
    } else if (item) {
      item.append(node);
    } else {
      news.append(node);
    }
  });
  root.addEventListener('site-header:panel', (e) => {
    const name = e.detail.li.querySelector('.nav-item-link')?.textContent.trim();
    if (menus.includes(name)) e.detail.mega.querySelector('.mega-news-slot').append(news);
  });
}

/* ---------------------------------------------------------------- tools */

function localeHref(href) {
  const url = new URL(href, window.location);
  const rest = window.location.pathname.replace(/^\/(de|ja)(?=\/|$)/, '');
  const base = url.pathname.replace(/\/$/, '');
  url.pathname = `${base}${rest}` || '/';
  return url.origin === window.location.origin ? `${url.pathname}` : url.href;
}

function dropdown(root, name, label, icon, panelKids) {
  const id = nextId(`dd-${name}`);
  const button = el('button', {
    type: 'button',
    class: 'site-header-tool',
    'aria-label': label,
    'aria-expanded': 'false',
    'aria-controls': id,
    'aria-haspopup': 'true',
  }, glyph(icon));
  const panel = el('div', { class: 'dropdown-panel', id }, ...panelKids);
  const wrap = el('div', { class: `site-header-dropdown dropdown-${name}` }, button, panel);
  button.addEventListener('click', () => {
    if (!isDesktop.matches) {
      // inside the mobile drawer: a local disclosure, the drawer stays open
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      return;
    }
    if (root.dataset.open === name) closeAll(root);
    else openState(root, name, button);
  });
  return wrap;
}

function decorateLanguage(section, root) {
  const list = contentOf(section)?.querySelector('ul');
  if (!list) return null;
  const locale = (window.location.pathname.match(/^\/(de|ja)(?=\/|$)/) || [])[1] || '';
  [...list.children].forEach((li) => {
    const a = itemLink(li);
    if (!a) return;
    const authored = new URL(a.getAttribute('href'), window.location);
    const target = authored.pathname.replace(/^\/|\/$/g, '');
    if (authored.origin === window.location.origin && target === locale) {
      a.setAttribute('aria-current', 'true');
      a.append(glyph('check'));
    }
    if (authored.origin === window.location.origin) a.href = localeHref(a.getAttribute('href'));
  });
  const wrap = dropdown(root, 'language', 'Sprache', 'globe', [list]);
  const current = list.querySelector('[aria-current="true"]');
  if (current) {
    // presentational copy of the current language name (shown in the mobile drawer)
    const name = el('span', { class: 'lang-current' }, current.textContent.trim());
    wrap.querySelector('button').append(name, glyph('chevron-down'));
  }
  return wrap;
}

function decorateCurrency(section, root) {
  const list = contentOf(section)?.querySelector('ul');
  if (!list) return null;
  const input = el('input', { type: 'search', placeholder: 'Search', 'aria-label': 'Search' });
  const field = el('div', { class: 'currency-search' }, glyph('search'), input);
  list.setAttribute('role', 'listbox');
  const items = [...list.children];
  let stored = null;
  try {
    stored = localStorage.getItem('ifx-currency');
  } catch (e) { /* storage unavailable */ }
  const current = el('span', { class: 'currency-current' });
  const select = (li) => {
    items.forEach((x) => x.setAttribute('aria-selected', String(x === li)));
    current.textContent = li.textContent.trim();
    try {
      localStorage.setItem('ifx-currency', li.textContent.trim());
    } catch (e) { /* storage unavailable */ }
  };
  items.forEach((li, i) => {
    li.setAttribute('role', 'option');
    li.setAttribute('tabindex', '0');
    const selected = stored ? li.textContent.trim() === stored : i === 0;
    li.setAttribute('aria-selected', String(selected));
    li.addEventListener('click', () => {
      select(li);
      closeAll(root, { focus: true });
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });
  });
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    items.forEach((li) => {
      li.hidden = q && !li.textContent.toLowerCase().includes(q);
    });
  });
  const selected = items.find((li) => li.getAttribute('aria-selected') === 'true') || items[0];
  if (selected) current.textContent = selected.textContent.trim();
  const wrap = dropdown(root, 'currency', 'Currency', 'money', [field, list]);
  wrap.querySelector('button').append(current, glyph('chevron-down'));
  return wrap;
}

let indexPromise;
function searchIndex() {
  indexPromise = indexPromise || fetch('/query-index.json')
    .then((r) => (r.ok ? r.json() : { data: [] }))
    .then((j) => j.data || [])
    .catch(() => []);
  return indexPromise;
}

function decorateSearch(section, root) {
  const content = contentOf(section);
  const link = content?.querySelector('a');
  const action = link ? link.href : '/search';
  const placeholder = link ? link.textContent.trim() : '';
  const input = el('input', {
    type: 'search', name: 'q', placeholder, 'aria-label': placeholder || 'Search', autocomplete: 'off',
  });
  const suggest = el('ul', { class: 'search-suggest', role: 'listbox', hidden: '' });
  // the authored link only configures the form (action + placeholder), as on live
  link?.closest('p')?.remove();
  const close = el('button', { type: 'button', class: 'search-close' }, 'Close');
  const form = el('form', { class: 'site-header-search', role: 'search', action }, glyph('search'), input, close, suggest);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) window.location.href = `${action}#q=${encodeURIComponent(q)}`;
  });
  input.addEventListener('input', async () => {
    const q = input.value.trim().toLowerCase();
    suggest.replaceChildren();
    if (q.length < 2) {
      suggest.hidden = true;
      return;
    }
    const rows = (await searchIndex()).filter((r) => (r.title || '').toLowerCase().includes(q));
    rows.slice(0, 8).forEach((r) => {
      suggest.append(el('li', { role: 'option' }, el('a', { href: r.path }, r.title)));
    });
    suggest.hidden = !rows.length;
  });
  close.addEventListener('click', () => closeAll(root, { focus: true }));
  return form;
}

function decorateAccount(section, root) {
  const content = contentOf(section);
  const loginPara = content?.querySelector(':scope > p');
  const panelId = nextId('account');
  const panel = el('div', { class: 'site-header-account', id: panelId });
  if (content) [...content.children].filter((n) => n !== loginPara).forEach((n) => panel.append(n));
  const toggle = el('button', {
    type: 'button',
    class: 'site-header-login-toggle',
    'aria-label': 'Account',
    'aria-expanded': 'false',
    'aria-controls': panelId,
    'aria-haspopup': 'true',
  }, glyph('chevron-down'));
  const login = el('div', { class: 'site-header-login' }, loginPara, toggle);
  toggle.addEventListener('click', () => {
    if (root.dataset.open === 'account') closeAll(root);
    else openState(root, 'account', toggle);
  });
  return { login, panel, panelId };
}

function decorateCart(section, root) {
  const content = contentOf(section);
  const id = nextId('cart');
  const close = el('button', { type: 'button', class: 'cart-close', 'aria-label': 'Close' }, glyph('cross'));
  const body = el('div', { class: 'cart-body' }, el('span', { class: 'icon icon-cart cart-icon', 'aria-hidden': 'true' }));
  if (content) [...content.children].forEach((n) => body.append(n));
  const dialog = el('div', {
    class: 'cart-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Warenkorb',
  }, close, body);
  const backdrop = el('div', { class: 'cart-backdrop' });
  const modal = el('div', { class: 'site-header-cart', id }, backdrop, dialog);
  close.addEventListener('click', () => closeAll(root, { focus: true }));
  backdrop.addEventListener('click', () => closeAll(root, { focus: true }));
  const open = (trigger) => {
    openState(root, 'cart', trigger);
    document.body.classList.add('site-header-modal-open');
    close.focus();
  };
  return { modal, id, open };
}

/* ---------------------------------------------------------------- decorate */

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  const root = el('div', { class: 'site-header' });
  root.dataset.open = '';
  const bar = el('div', { class: 'site-header-bar' });
  const sections = [...fragment.querySelectorAll(':scope > .section')];

  // brand
  const brand = contentOf(sections[0])?.querySelector('a');
  if (brand) {
    brand.classList.add('site-header-logo');
    brand.setAttribute('aria-label', 'Infineon');
    brand.closest('p')?.replaceWith(brand);
    bar.append(brand);
  }

  const nav = decorateNav(sections[1], root);
  bar.append(nav);

  const search = sectionOf(fragment, 'search');
  const searchForm = search ? decorateSearch(search, root) : null;
  if (searchForm) bar.append(searchForm);

  const tools = el('div', { class: 'site-header-tools' });
  const locale = el('div', { class: 'site-header-locale' });
  const lang = sectionOf(fragment, 'language');
  const cur = sectionOf(fragment, 'currency');
  if (lang) locale.append(decorateLanguage(lang, root) || '');
  if (cur) locale.append(decorateCurrency(cur, root) || '');
  tools.append(locale);

  const cartSection = sectionOf(fragment, 'cart');
  const cart = cartSection ? decorateCart(cartSection, root) : null;
  const cartBtn = el('button', {
    type: 'button',
    class: 'site-header-tool site-header-tool-cart',
    'aria-label': 'Cart',
    'aria-haspopup': 'dialog',
    'aria-expanded': 'false',
    'aria-controls': cart?.id,
  }, glyph('cart'));
  tools.append(cartBtn);

  const accountSection = sectionOf(fragment, 'account');
  const account = accountSection ? decorateAccount(accountSection, root) : null;
  if (account) tools.append(account.login);
  bar.append(tools);

  // mobile bar
  const mSearch = el('button', {
    type: 'button', class: 'm-search', 'aria-label': 'Search', 'aria-expanded': 'false',
  }, glyph('search'));
  const mCart = el('button', {
    type: 'button',
    class: 'm-cart',
    'aria-label': 'Cart',
    'aria-haspopup': 'dialog',
    'aria-expanded': 'false',
  }, glyph('cart'));
  const mUser = el('button', {
    type: 'button',
    class: 'm-user',
    'aria-label': 'Account',
    'aria-expanded': 'false',
    'aria-controls': account?.panelId,
  }, glyph('user'));
  const mMenu = el('button', {
    type: 'button',
    class: 'm-menu',
    'aria-label': 'Toggle navigation',
    'aria-expanded': 'false',
    'aria-controls': nav.id,
  }, glyph('menu'), glyph('cross'));
  bar.append(el('div', { class: 'site-header-mobile' }, mSearch, mCart, mUser, mMenu));
  root.append(bar);
  if (account) root.append(account.panel);
  if (cart) root.append(cart.modal);

  const news = sectionOf(fragment, 'news');
  if (news) decorateNews(news, root);

  const toggle = (name, trigger) => {
    if (root.dataset.open === name) closeAll(root);
    else openState(root, name, trigger);
  };
  cartBtn.addEventListener('click', () => cart?.open(cartBtn));
  mCart.addEventListener('click', () => cart?.open(mCart));
  mUser.addEventListener('click', () => toggle('account', mUser));
  mSearch.addEventListener('click', () => {
    toggle('search', mSearch);
    if (root.dataset.open === 'search') searchForm?.querySelector('input').focus();
  });
  mMenu.addEventListener('click', () => {
    toggle('drawer', mMenu);
    nav.classList.remove('is-drilled');
  });

  // language + currency live in the tools row on desktop and at the drawer foot on mobile
  // the nav sits after the mobile buttons on mobile so Tab moves from the toggle into the drawer
  const mobileBar = bar.querySelector('.site-header-mobile');
  const placeLocale = () => {
    closeAll(root);
    if (isDesktop.matches) {
      tools.prepend(locale);
      (brand || bar.firstChild)?.after(nav);
      nav.inert = false;
    } else {
      nav.append(locale);
      mobileBar.after(nav);
      nav.inert = true;
    }
  };
  // the collapsed mobile drawer stays out of the tab order until it opens
  new MutationObserver(() => {
    if (!isDesktop.matches) nav.inert = root.dataset.open !== 'drawer';
  }).observe(root, { attributes: true, attributeFilter: ['data-open'] });
  placeLocale();
  isDesktop.addEventListener('change', placeLocale);

  // close paths: Escape (focus back to the trigger), click outside
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.dataset.open) closeAll(root, { focus: true });
  });
  document.addEventListener('click', (e) => {
    if (root.dataset.open && !root.contains(e.target)) closeAll(root);
  });

  block.textContent = '';
  block.append(root);
}
