// index (landing) — minimal behaviour mirroring the live page's observed widgets.
// Hero stage: the active counter's fill runs a 15 s CSS animation (lifted: `progress 15s linear`);
// a 15 s timer advances to the next slide; prev/next/pause/resume controls.
(() => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const slides = [...hero.querySelectorAll('.hero__slide')];
    const imgs = [...hero.querySelectorAll('.hero__img')];
    const counts = [...hero.querySelectorAll('.hero__count')];
    let cur = 0;
    const go = (n) => {
      const len = slides.length;
      [slides, imgs, counts].forEach((list, k) => list[cur] && list[cur].classList.remove(['showing', 'showImg', 'active'][k]));
      cur = (n + len) % len;
      [slides, imgs, counts].forEach((list, k) => list[cur] && list[cur].classList.add(['showing', 'showImg', 'active'][k]));
      hero.querySelectorAll('.hero__prev').forEach((b) => b.classList.toggle('icon-brand-500', cur !== 0));
    };
    // auto-advance every 15 s (timer, like the live stage; the fill bar's CSS animation is the visual)
    let timer = null;
    const arm = () => { clearTimeout(timer); if (!hero.classList.contains('is-paused')) timer = setTimeout(() => { go(cur + 1); arm(); }, 15000); };
    hero.querySelectorAll('.hero__prev').forEach((b) => b.addEventListener('click', () => { go(cur - 1); arm(); }));
    hero.querySelectorAll('.hero__next').forEach((b) => b.addEventListener('click', () => { go(cur + 1); arm(); }));
    const setPaused = (p) => {
      hero.classList.toggle('is-paused', p);
      arm();
    };
    hero.querySelectorAll('.hero__pause').forEach((b) => b.addEventListener('click', () => setPaused(true)));
    hero.querySelectorAll('.hero__resume').forEach((b) => b.addEventListener('click', () => setPaused(false)));
    arm();
  }

  // Products & applications: desktop tabs + mobile accordion.
  const pa = document.querySelector('.pa');
  if (pa) {
    const tabs = [...pa.querySelectorAll('.pa__tab')];
    const panes = [...pa.querySelectorAll('.pa__pane')];
    tabs.forEach((t, i) => t.addEventListener('click', () => {
      tabs.forEach((x, k) => { x.classList.toggle('is-active', k === i); x.setAttribute('aria-selected', String(k === i)); });
      panes.forEach((x, k) => x.classList.toggle('is-active', k === i));
    }));
    pa.querySelectorAll('.pa__acc-btn').forEach((b) => b.addEventListener('click', () => {
      const body = b.nextElementSibling;
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      if (body) body.hidden = !open;
    }));
  }

})();
