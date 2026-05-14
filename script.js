/* ========== STARFIELD ========== */
(function initStarfield() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('starfield');
  container.appendChild(canvas);

  let w, h;
  const layers = [
    { count: 200, speed: 0.15, sizeMin: 0.5, sizeMax: 1.2, opacity: 0.4 },
    { count: 120, speed: 0.35, sizeMin: 1.0, sizeMax: 1.8, opacity: 0.6 },
    { count: 60,  speed: 0.6,  sizeMin: 1.5, sizeMax: 2.5, opacity: 0.85 }
  ];
  let stars = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin),
          speed: layer.speed + Math.random() * 0.1,
          opacity: layer.opacity * (0.5 + Math.random() * 0.5),
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.005 + Math.random() * 0.015
        });
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.y -= s.speed;
      s.twinkle += s.twinkleSpeed;
      if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
      const flicker = 0.6 + 0.4 * Math.sin(s.twinkle);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.opacity * flicker})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });
  resize(); createStars(); draw();
})();

/* ========== CURSOR GLOW ========== */
(function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animate() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animate);
  })();
})();

/* ========== NAVBAR ========== */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          navAnchors.forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });
})();

/* ========== TYPING EFFECT ========== */
(function initTyping() {
  const el = document.querySelector('.typed-text');
  if (!el) return;
  const words = ['Full Stack .NET Developer', 'Backend Engineer', 'API Architect', 'Web Developer'];
  let wordIdx = 0, charIdx = 0, deleting = false;
  function type() {
    const current = words[wordIdx];
    if (deleting) {
      el.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(type, 400); return; }
    } else {
      el.textContent = current.substring(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(type, 2000); return; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1000);
})();

/* ========== SCROLL REVEAL ========== */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observer.observe(el));
})();

/* ========== SKILL BARS ========== */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.level + '%';
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => observer.observe(bar));
})();

/* ========== SMOOTH SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========== PARALLAX ON HERO IMAGE ========== */
(function initParallax() {
  const heroImg = document.querySelector('.hero-image-container');
  if (!heroImg) return;
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroImg.style.transform = `translate(${x}px, ${y}px)`;
  });
})();

/* ========== FORM HANDLER ========== */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Message Sent!';
    btn.style.background = '#333';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();
