/* de-package-overview — behaviours observed on the live page (motion-observe):
   1. "Auf dieser Seite" sub-nav: sticky shadow once stuck + scroll-spy active link
   2. package family "zeigen +N mehr" reveals the hidden families
   3. teaser-card carousel prev/next (track translates by one card + gap) */
(() => {
  const jump = document.querySelector('.jump');
  const links = [...document.querySelectorAll('.jump__link')];
  if (jump && links.length) {
    const targets = links.map((a) => document.querySelector(a.getAttribute('href')));
    // live: the sub-nav is pinned to the viewport top (fixed, z 99) once the hero scrolls past
    const spacer = document.createElement('div');
    spacer.className = 'jump__spacer';
    jump.before(spacer);
    const onScroll = () => {
      const stuck = spacer.getBoundingClientRect().top <= 0 && window.scrollY > 0;
      spacer.style.height = stuck ? `${jump.offsetHeight}px` : '0px';
      jump.classList.toggle('sticky-box-shadow', stuck);
      const line = jump.getBoundingClientRect().bottom + 1;
      let idx = 0;
      targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= line) idx = i; });
      links.forEach((a, i) => a.classList.toggle('active', i === idx));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll('.pkg__more-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ul = btn.closest('.pkg__fams');
      ul.querySelectorAll('.pkg__extra').forEach((li) => { li.hidden = false; li.classList.add('visible'); });
      ul.querySelectorAll('.pkg__more').forEach((li) => { li.hidden = true; });
      ul.classList.add('is-open');
    });
  });

  document.querySelectorAll('.tcards').forEach((root) => {
    const track = root.querySelector('.tcards__track');
    const prev = root.querySelector('.tcards__prev');
    const next = root.querySelector('.tcards__next');
    if (!track || !prev || !next) return;
    const cards = [...track.children];
    let i = 0;
    const step = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
    const visible = () => Math.max(1, Math.floor((root.clientWidth + 32) / (step() || 1)));
    const render = () => {
      const max = Math.max(0, cards.length - visible());
      i = Math.min(Math.max(i, 0), max);
      track.style.transform = `translate3d(${-i * step()}px, 0, 0)`;
      prev.disabled = i === 0;
      next.disabled = i === max;
    };
    prev.addEventListener('click', () => { i -= 1; render(); });
    next.addEventListener('click', () => { i += 1; render(); });
    window.addEventListener('resize', render);
  });
})();
