// HAyAms – Interactions (FR)
// Features: mobile nav toggle, CTA smooth scroll, scroll animations, animal carousel controls,
// add-to-cart feedback, newsletter validation, dynamic year.

(function () {
    'use strict';
  
    // Helpers
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  
    // 1) Mobile navigation toggle
    const navToggle = $('.nav-toggle');
    const navList = $('#primary-menu');
    if (navToggle && navList) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navList.classList.toggle('open', !expanded);
      });
      // Close on link click (mobile)
      $$('#primary-menu a').forEach(a =>
        a.addEventListener('click', () => {
          navToggle.setAttribute('aria-expanded', 'false');
          navList.classList.remove('open');
        })
      );
    }
  
    // 2) CTA smooth scroll to #about
    const cta = $('#ctaDiscover');
    const about = $('#about');
    if (cta && about) {
      cta.addEventListener('click', () => {
        about.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  
    // 3) Scroll-triggered animations using IntersectionObserver
    const animated = $$('[data-animate]');
    if ('IntersectionObserver' in window && animated.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            const delay = el.getAttribute('data-animate-delay');
            if (delay) el.style.transitionDelay = `${parseInt(delay, 10)}ms`;
            el.classList.add('in');
            io.unobserve(el);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
      animated.forEach(el => io.observe(el));
    } else {
      // Fallback
      animated.forEach(el => el.classList.add('in'));
    }
  
    // 4) Animal carousel controls
    const carousel = $('#animalCarousel');
    const prevBtn = $('#prevAnimals');
    const nextBtn = $('#nextAnimals');
  
    const scrollAmount = () => {
      // scroll by approx one card + gap
      const firstCard = carousel ? carousel.querySelector('.animal-card') : null;
      return firstCard ? firstCard.getBoundingClientRect().width + 16 : 280;
    };
  
    if (carousel) {
      if (prevBtn) prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
      if (nextBtn) nextBtn.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
      // Keyboard support
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault(); carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        } else if (e.key === 'ArrowRight') {
          e.preventDefault(); carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        }
      });
    }
  
    // 5) Add-to-cart feedback (frontend only)
    const cartNote = $('.cart-note');
    $$('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!cartNote) return;
        cartNote.textContent = 'Ajouté au panier ! (Démo)';
        cartNote.classList.remove('error');
        cartNote.style.display = 'block';
        setTimeout(() => { cartNote.style.display = 'none'; }, 1800);
      });
    });
  
    // 6) Newsletter form validation (FR)
    const form = $('#newsletterForm');
    const emailInput = $('#email');
    const formMsg = $('.form-msg');
  
    function isValidEmail(v) {
      // Simple RFC5322-ish
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
  
    if (form && emailInput && formMsg) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (!email) {
          formMsg.textContent = 'Veuillez entrer votre e‑mail.';
          formMsg.classList.add('error');
          return;
        }
        if (!isValidEmail(email)) {
          formMsg.textContent = 'Adresse e‑mail invalide.';
          formMsg.classList.add('error');
          return;
        }
        formMsg.classList.remove('error');
        formMsg.textContent = 'Merci ! Vous êtes abonné(e).';
        form.reset();
        // Hide after a while
        setTimeout(() => { formMsg.textContent = ''; }, 2500);
      });
    }
  
    // 7) Dynamic footer year
    const yearSpan = $('#year');
    if (yearSpan) {
      const now = new Date();
      yearSpan.textContent = String(now.getFullYear());
    }
  })();