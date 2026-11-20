import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Infineon footer (replica canon `footer.site-footer`), template-slotted from `/footer`.
 * Sections: 1 logo link · 2 link columns (a title paragraph followed by its list, repeated) ·
 * 3 legal list + copyright paragraph · 4 social links (icons). Authored nodes are moved.
 */

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids.filter(Boolean));
  return node;
}

const contentOf = (section) => section?.querySelector('.default-content-wrapper') || section;

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  const [brandSec, linksSec, legalSec, socialSec] = [...fragment.querySelectorAll(':scope > .section')]
    .map(contentOf);

  const nav = el('nav', 'site-footer-nav');
  nav.setAttribute('aria-label', 'Footer');
  const logo = brandSec?.querySelector('a');
  if (logo) {
    logo.setAttribute('aria-label', 'Infineon');
    nav.append(el('div', 'site-footer-logo', logo.closest('p') || logo));
  }

  // link columns: each title paragraph opens a column; following nodes join it
  let col = null;
  [...(linksSec?.children || [])].forEach((node) => {
    if (node.tagName !== 'UL' || !col) {
      col = el('div', 'site-footer-col');
      nav.append(col);
    }
    if (node.tagName === 'P') {
      col.append(el('div', 'site-footer-title', node));
    } else {
      col.append(node);
    }
  });

  // the year sits in its own span, as on live (`© 1999-<span>2026</span> Infineon …`)
  const copy = [...(legalSec?.children || [])].find((n) => n.tagName === 'P');
  const yearText = copy && [...copy.childNodes].find((n) => n.nodeType === 3 && /-\d{4}/.test(n.data));
  if (yearText) {
    const at = yearText.data.search(/-\d{4}/) + 1;
    const year = yearText.splitText(at);
    year.splitText(4);
    const span = el('span', 'current-year');
    year.replaceWith(span);
    span.append(year);
  }

  const legalLeft = el('div', 'site-footer-legal-left');
  [...(legalSec?.children || [])].forEach((node) => {
    legalLeft.append(node.tagName === 'UL' ? el('div', 'site-footer-links', node) : el('div', 'site-footer-copy', node));
  });

  const legalRight = el('div', 'site-footer-legal-right');
  const social = socialSec?.querySelector('ul');
  if (social) {
    social.querySelectorAll('a').forEach((a) => {
      if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', a.title || a.textContent.trim());
    });
    legalRight.append(el('div', 'site-footer-social', social));
  }

  const root = el(
    'div',
    'site-footer',
    el('div', 'ifx-fixed', nav, el('div', 'site-footer-legal', legalLeft, legalRight)),
  );
  block.textContent = '';
  block.append(root);
}
