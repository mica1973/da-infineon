// Reference archetype (glossary): share menu toggle + accordion (live: item gets .accordion-item-open,
// collapse animates height ~.35s, icon swaps plus/minus, aria-expanded flips).
document.querySelectorAll('.art-share').forEach((share) => {
  const btn = share.querySelector('.art-share__btn');
  const menu = share.querySelector('.art-share__menu');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  });
});
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// live is the Bootstrap collapse sequence: panel .collapse -> .collapsing (height .35s) -> .collapse.show;
// h3 loses .collapsed on open while the icon <i> gains it (motion/de-glossary.json).
document.querySelectorAll('.accordion-comp .accordion-button').forEach((btn) => {
  const item = btn.closest('.accordion-item');
  const panel = item.querySelector('.accordion-collapse');
  const icon = btn.querySelector('.clickable-icon');
  panel.classList.add('collapse');
  let busy = false;
  const toggle = () => {
    if (busy) return;
    const open = !item.classList.contains('accordion-item-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('collapsed', !open);
    if (icon) icon.classList.toggle('collapsed', open);
    const settle = () => {
      panel.classList.remove('collapsing');
      panel.classList.add('collapse');
      panel.classList.toggle('show', open);
      panel.style.height = '';
      busy = false;
    };
    if (reduce) { item.classList.toggle('accordion-item-open', open); settle(); return; }
    busy = true;
    if (open) item.classList.add('accordion-item-open');
    const from = open ? 0 : panel.scrollHeight;
    const to = open ? panel.scrollHeight : 0;
    panel.classList.remove('collapse', 'show');
    panel.classList.add('collapsing');
    panel.style.height = from + 'px';
    panel.getBoundingClientRect();
    requestAnimationFrame(() => { panel.style.height = to + 'px'; });
    panel.addEventListener('transitionend', () => {
      if (!open) item.classList.remove('accordion-item-open');
      settle();
    }, { once: true });
  };
  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});
