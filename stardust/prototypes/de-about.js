/* de-about: jump-nav behaviours observed on live (motion-observe):
   scroll-spy `active` on the in-page nav links, the jump nav pinning (fixed + shadow, out of flow)
   once the page scrolls past it, and the mobile "Springen zu" dropdown toggle. */
(() => {
  const links = [...document.querySelectorAll('[data-spy]')];
  const ids = [...new Set(links.map((a) => a.dataset.spy))];
  const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const comp = document.querySelector('.pageheader-comp');
  const bars = [document.querySelector('.ph__nav-section'), document.querySelector('.ph__jump')];
  let pinAt = null;
  const measurePin = () => {
    if (comp) comp.classList.remove('is-stuck');
    const bar = bars.find((b) => b && b.offsetParent !== null);
    pinAt = bar ? bar.getBoundingClientRect().top + window.scrollY : null;
  };
  measurePin();
  window.addEventListener('resize', () => { measurePin(); update(); });
  const update = () => {
    const y = window.scrollY + 120;
    let cur = null;
    targets.forEach((t) => { if (t.getBoundingClientRect().top + window.scrollY <= y) cur = t.id; });
    links.forEach((a) => a.classList.toggle('active', a.dataset.spy === cur));
    if (comp && pinAt !== null) comp.classList.toggle('is-stuck', window.scrollY > pinAt);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  const btn = document.querySelector('.ph__jump-btn');
  const list = document.querySelector('.ph__jump-list');
  if (btn && list) {
    btn.addEventListener('click', () => {
      const open = list.hidden;
      list.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    list.addEventListener('click', (e) => { if (e.target.closest('a')) { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
  }
})();
