/* =============================================
   SENA ORUCU — main.js
   ============================================= */

/* ── Page load fade-in ── */
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });

  initNav();
  initScrollSpy();
  initCardObserver();
  setActiveNav();
});

/* ── Nav: scroll shadow + hamburger ── */
function initNav() {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ── Active nav link based on current page ── */
function setActiveNav() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  const allLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const isHome = (page === 'index.html' || page === '') && (href === 'index.html' || href === './');
    const isMatch = href === page;

    if (isHome || isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ── Scroll spy (future use) ── */
function initScrollSpy() {
  // Placeholder for section-level scroll spy if needed
}

/* ── IntersectionObserver for project cards ── */
function initCardObserver() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger by index within the observed batch
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Assign stagger delays
  cards.forEach((card, i) => {
    card.dataset.delay = (i % 3) * 100; // stagger within each row
    observer.observe(card);
  });
}
