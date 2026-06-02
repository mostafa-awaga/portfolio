/* ========== REALISTIC STARFIELD ========== */
(function initStarfield() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('starfield');
  container.appendChild(canvas);

  let w, h;
  let stars = [];
  const STAR_COUNT = 400;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      // Weighted random size — most stars tiny, a few larger
      const rand = Math.random();
      let size;
      if (rand < 0.65) size = 0.3 + Math.random() * 0.5;       // tiny
      else if (rand < 0.88) size = 0.8 + Math.random() * 0.7;   // medium
      else if (rand < 0.97) size = 1.5 + Math.random() * 0.8;   // large
      else size = 2.3 + Math.random() * 1.0;                     // bright

      // Slight color tint for realism (warm white, cool blue-white, accent touches)
      const tints = [
        { r: 255, g: 255, b: 255 },   // pure white
        { r: 220, g: 230, b: 255 },   // cool blue-white
        { r: 255, g: 248, b: 230 },   // warm yellow-white
        { r: 200, g: 220, b: 255 },   // icy blue
        { r: 255, g: 240, b: 220 },   // warm gold
        { r: 180, g: 160, b: 255 },   // subtle purple (accent hint)
        { r: 140, g: 220, b: 255 },   // subtle cyan (accent hint)
      ];
      const tint = tints[Math.floor(Math.random() * tints.length)];

      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size,
        baseOpacity: 0.2 + Math.random() * 0.7,
        // Drift: very slow random direction per star
        driftX: (Math.random() - 0.5) * 0.08,
        driftY: (Math.random() - 0.5) * 0.06,
        // Some stars barely move
        driftScale: Math.random() < 0.3 ? 0.05 : 1,
        // Twinkle phase
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.003 + Math.random() * 0.012,
        twinkleDepth: 0.15 + Math.random() * 0.45,
        // Glow radius (only for larger stars)
        glowRadius: size > 1.2 ? size * (2 + Math.random() * 2) : 0,
        tint,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    stars.forEach(s => {
      // Drift movement
      s.x += s.driftX * s.driftScale;
      s.y += s.driftY * s.driftScale;
      s.twinklePhase += s.twinkleSpeed;

      // Wrap around edges
      if (s.x < -5) s.x = w + 5;
      if (s.x > w + 5) s.x = -5;
      if (s.y < -5) s.y = h + 5;
      if (s.y > h + 5) s.y = -5;

      // Twinkle
      const twinkle = 1 - s.twinkleDepth + s.twinkleDepth * Math.sin(s.twinklePhase);
      const alpha = s.baseOpacity * twinkle;

      const { r, g, b } = s.tint;

      // Draw soft glow for brighter stars
      if (s.glowRadius > 0) {
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.glowRadius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.25})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw star core
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
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

/* ========== PARALLAX ON HERO IMAGE (subtle tilt only, no float) ========== */
(function initParallax() {
  const heroImg = document.querySelector('.hero-image-container');
  if (!heroImg) return;
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    heroImg.style.transform = `translate(${x}px, ${y}px)`;
  });
})();

/* ========== COUNTER ANIMATION FOR STATS ========== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ========== SCROLL TO TOP ========== */
(function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  });

  // Smooth scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ========== TOAST NOTIFICATION ========== */
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === 'success'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
      }
    </div>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ========== FORM HANDLER — EmailJS with mailto fallback ========== */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Check if EmailJS is loaded
    if (typeof emailjs !== 'undefined') {
      emailjs.send('service_portfolio', 'template_portfolio', {
        from_name: name,
        from_email: email,
        message: message,
      }).then(() => {
        showToast('Message sent successfully! I\'ll get back to you soon.');
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }).catch(() => {
        // Fallback to mailto
        sendViaMailto(name, email, message);
        btn.textContent = originalText;
        btn.disabled = false;
      });
    } else {
      // Fallback: open mailto link
      sendViaMailto(name, email, message);
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });

  function sendViaMailto(name, email, message) {
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.open(`mailto:darsh3waga@gmail.com?subject=${subject}&body=${body}`, '_self');
    showToast('Opening your email client to send the message.');
    form.reset();
  }
})();
