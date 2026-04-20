/* =========================================================
   Portfolio — interactivity
   - Lucide icon rendering
   - Sticky-navbar scroll style
   - Smooth scroll + active link highlighting
   - Mobile menu toggle
   - Dark / light theme toggle
   - Reveal-on-scroll for sections
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Render lucide icons ----
  if (window.lucide) window.lucide.createIcons();

  const navbar     = document.getElementById('navbar');
  const navLinks   = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');
  const themeBtn   = document.getElementById('themeToggle');
  const sections   = document.querySelectorAll('section[id]');
  const links      = document.querySelectorAll('.nav-link');
  const yearEl     = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Sticky navbar background on scroll ----
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active section detection
    const y = window.scrollY + 120;
    let current = sections[0]?.id;
    sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Smooth scroll for in-page anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks.classList.remove('open');
      // restore menu icon
      const i = menuToggle.querySelector('i');
      if (i) { i.setAttribute('data-lucide', 'menu'); window.lucide?.createIcons(); }
    });
  });

  // ---- Mobile menu toggle ----
  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    const i = menuToggle.querySelector('i');
    if (i) {
      i.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
      window.lucide?.createIcons();
    }
  });

  // ---- Theme toggle (dark <-> light) ----
  const applyTheme = (light) => {
    document.documentElement.classList.toggle('light', light);
    const i = themeBtn.querySelector('i');
    if (i) {
      i.setAttribute('data-lucide', light ? 'moon' : 'sun');
      window.lucide?.createIcons();
    }
    try { localStorage.setItem('ck-theme', light ? 'light' : 'dark'); } catch (_) {}
  };
  // restore preference
  let initLight = false;
  try { initLight = localStorage.getItem('ck-theme') === 'light'; } catch (_) {}
  if (initLight) applyTheme(true);

  themeBtn?.addEventListener('click', () => {
    applyTheme(!document.documentElement.classList.contains('light'));
  });

  // ---- Reveal sections on scroll ----
  const revealTargets = document.querySelectorAll('.section');
  revealTargets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => io.observe(el));
});
