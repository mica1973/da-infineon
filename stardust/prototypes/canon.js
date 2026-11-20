// Shared chrome behaviour (canon): header main-nav items toggle their mega panel.
(() => {
  // Header: main-nav items open their mega panel.
  const navLinks = [...document.querySelectorAll('.site-header__nav a')];
  const megas = [...document.querySelectorAll('.mega')];
  navLinks.forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const m = megas[i];
    const open = m && m.hidden;
    megas.forEach((x) => { x.hidden = true; });
    if (m && open) m.hidden = false;
  }));
})();
