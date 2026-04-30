/* ════════════════════════════════════════════
   DARSHAN MAHAVIDHYALAY — script.js
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar Scroll Effect ─────────────────── */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      backTop.classList.add('show');
    } else {
      navbar.classList.remove('scrolled');
      backTop.classList.remove('show');
    }
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Hamburger Menu ───────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── Reveal on Scroll ─────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same container
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObs.observe(el));

  /* ── Animated Counter ─────────────────────── */
  const counters = document.querySelectorAll('.stat-num');
  let counted    = false;

  const countObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current = Math.min(current + step, target);
          counter.textContent = Math.floor(current).toLocaleString('en-IN');
          if (current < target) requestAnimationFrame(update);
        };

        update();
      });
    }
  }, { threshold: 0.5 });

  const statsBand = document.querySelector('.stats-band');
  if (statsBand) countObs.observe(statsBand);

  /* ── Active Nav Link on Scroll ───────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => {
          a.style.color = '';
          a.style.background = '';
        });
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) {
          active.style.color = 'var(--gold)';
          active.style.background = 'rgba(201,168,76,0.08)';
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObs.observe(s));

  /* ── Contact Form Submit (AJAX) ───────────── */
  const form       = document.getElementById('contactForm');
  const statusDiv  = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      btn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      try {
        const data = new FormData(form);
        const res  = await fetch('contact.php', { method: 'POST', body: data });
        const json = await res.json();

        if (json.success) {
          statusDiv.className = 'success';
          statusDiv.textContent = '✅ Thank you! Your message has been sent. We\'ll get back to you shortly.';
          form.reset();
        } else {
          throw new Error(json.message || 'Something went wrong.');
        }
      } catch (err) {
        statusDiv.className = 'error';
        statusDiv.textContent = '❌ ' + err.message;
      }

      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
    });
  }

  /* ── Smooth anchor scroll (override) ─────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
