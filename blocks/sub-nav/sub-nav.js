/**
 * sub-nav — the centred secondary navigation bar of a section hub (live .secondary-nav-link).
 * Authoring: one list of links; the link to the current page (else the first) is marked active.
 * Decode tier: template-slotted — the authored list is MOVED into the bar (EW1).
 */

export default function decorate(block) {
  if (block.querySelector(':scope > .sub-nav-inner')) return;
  const inner = document.createElement('nav');
  inner.className = 'ifx-fixed sub-nav-inner';
  const list = block.querySelector('ul, ol');
  if (list) {
    inner.append(list);
    const links = [...list.querySelectorAll('a[href]')];
    const here = window.location.pathname.replace(/\/$/, '');
    const pathOf = (a) => {
      try {
        return new URL(a.getAttribute('href'), window.location.href).pathname;
      } catch {
        return '';
      }
    };
    const current = links.find((a) => pathOf(a) === here) || links[0];
    if (current) current.closest('li').classList.add('active');
  }
  block.replaceChildren(inner);
}
