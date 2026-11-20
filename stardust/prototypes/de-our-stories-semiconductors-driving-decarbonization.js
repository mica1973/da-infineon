// Article archetype: share menu toggle + click-to-play video (poster first, native controls after play).
document.querySelectorAll('.art-share').forEach((share) => {
  const btn = share.querySelector('.art-share__btn');
  const menu = share.querySelector('.art-share__menu');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  });
});
document.querySelectorAll('.art-video').forEach((wrap) => {
  const video = wrap.querySelector('video');
  const play = wrap.querySelector('.art-video__play');
  const start = () => {
    wrap.classList.add('is-playing');
    video.controls = true;
    video.play().catch(() => {});
  };
  play.addEventListener('click', start);
  play.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start(); } });
});
