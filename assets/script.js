/* =====================================================
   SADIA Portfolio – JavaScript
   Ultra-Animated | Particle System | GSAP-Style Effects
   ===================================================== */

'use strict';

// ─── LOADER ─────────────────────────────────────────────
const loader        = document.getElementById('loader');
const loaderProg    = document.getElementById('loaderProgress');
const loaderText    = document.getElementById('loaderText');

const loadSteps = [
  { pct: 20, msg: 'Loading assets...' },
  { pct: 45, msg: 'Preparing animations...' },
  { pct: 70, msg: 'Setting up experience...' },
  { pct: 90, msg: 'Almost there...' },
  { pct: 100, msg: 'Welcome to SADIA!' },
];

let stepIdx = 0;
function advanceLoader() {
  if (stepIdx >= loadSteps.length) return;
  const s = loadSteps[stepIdx++];
  loaderProg.style.width = s.pct + '%';
  loaderText.textContent = s.msg;
  if (s.pct < 100) setTimeout(advanceLoader, 280 + Math.random() * 200);
  else {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      initAnimations();
    }, 600);
  }
}
document.body.style.overflow = 'hidden';
setTimeout(advanceLoader, 400);

// ─── PARTICLE CANVAS ────────────────────────────────────
const canvas  = document.getElementById('particlesCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '64,138,113' : '176,228,204';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(120, Math.floor(W * H / 10000));
  particles = Array.from({ length: count }, () => new Particle());
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(64,138,113,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ─── CUSTOM CURSOR ──────────────────────────────────────
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateCursorFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursorFollower);
}
animateCursorFollower();

document.querySelectorAll('a, button, .service-card, .portfolio-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    cursorFollower.style.borderColor = '#B0E4CC';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.borderColor = '#408A71';
  });
});

// ─── HEADER SCROLL ──────────────────────────────────────
const header = document.getElementById('header');
const backTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  header.classList.toggle('scrolled', scrolled > 50);
  backTop.classList.toggle('visible', scrolled > 400);

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (scrolled >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── HAMBURGER ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// ─── SMOOTH SCROLL ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── INTERSECTION OBSERVER REVEALS ──────────────────────
function initAnimations() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('revealed'), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => io.observe(el));

  // Skill bars
  const skillIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          const w = fill.dataset.width;
          setTimeout(() => { fill.style.width = w + '%'; }, 300);
        });
        skillIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const skillsSection = document.querySelector('.skills-grid');
  if (skillsSection) skillIo.observe(skillsSection);

  // Stat counters
  const countIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(el => animateCounter(el));
        countIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) countIo.observe(statsSection);
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const startTime = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const value = target * ease;
    el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ─── PORTFOLIO FILTER ───────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    portfolioCards.forEach((card, i) => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;
      card.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
      if (show) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.display = 'block';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
          if (card.dataset.category !== filter && filter !== 'all') card.style.display = 'none';
        }, 400);
      }
    });
  });
});

// ─── TESTIMONIALS SLIDER ────────────────────────────────
const track   = document.getElementById('testimonialTrack');
const dotsEl  = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track) {
  const cards     = track.querySelectorAll('.testimonial-card');
  const total     = cards.length;
  let current     = 0;
  let autoSlide;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    // Show 1 card on mobile, 3 on desktop
    const perView = window.innerWidth < 768 ? 1 : 3;
    track.style.transform = `translateX(-${current * (100 / perView)}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() { clearInterval(autoSlide); autoSlide = setInterval(() => goTo(current + 1), 5000); }
  resetAuto();

  window.addEventListener('resize', () => goTo(current));
}

// ─── CONTACT FORM ───────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = document.getElementById('submitBtn');
    const span = btn.querySelector('span');
    span.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      span.textContent = '✓ Message Sent! I\'ll respond within 24 hours.';
      btn.style.background = 'linear-gradient(135deg, #2d6e57, #1a4a35)';
      setTimeout(() => {
        contactForm.reset();
        span.textContent = 'Send Message & Book Free Call';
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = '';
      }, 4000);
    }, 1800);
  });
}

// ─── MICRO TILT ON SERVICE CARDS ────────────────────────
document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = (e.clientY - cy) / (rect.height / 2) * 6;
    const ry   = (e.clientX - cx) / (rect.width  / 2) * -6;
    card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── PARALLAX HERO ORBS ─────────────────────────────────
const orbs = document.querySelectorAll('.hero-orb');
window.addEventListener('mousemove', e => {
  const xPct = (e.clientX / window.innerWidth  - 0.5) * 2;
  const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
  orbs.forEach((orb, i) => {
    const strength = (i + 1) * 12;
    orb.style.transform = `translate(${xPct * strength}px, ${yPct * strength}px)`;
  });
});

// ─── GLITCH EFFECT ON HOVER ─────────────────────────────
const logoText = document.querySelector('.logo-text');
if (logoText) {
  logoText.addEventListener('mouseenter', () => {
    logoText.classList.add('glitch');
    setTimeout(() => logoText.classList.remove('glitch'), 600);
  });
}

// ─── TIMELINE ANIMATION ─────────────────────────────────
const timelineIo = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        setTimeout(() => item.style.opacity = '1', i * 200);
      });
      timelineIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const timeline = document.querySelector('.timeline');
if (timeline) {
  timeline.querySelectorAll('.timeline-item').forEach(item => item.style.opacity = '0');
  timelineIo.observe(timeline);
}

// ─── TOOLS STAGGER ──────────────────────────────────────
const toolsIo = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.tool-item');
      items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, i * 80);
      });
      toolsIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const toolsGrid = document.querySelector('.tools-grid');
if (toolsGrid) toolsIo.observe(toolsGrid);

// ─── FLOATING CARDS MOUSE PARALLAX ──────────────────────
const whySection = document.querySelector('.why-visual');
if (whySection) {
  document.querySelector('.why-me').addEventListener('mousemove', e => {
    const rect  = whySection.getBoundingClientRect();
    const xPct  = (e.clientX - rect.left  - rect.width  / 2) / rect.width;
    const yPct  = (e.clientY - rect.top   - rect.height / 2) / rect.height;
    document.querySelectorAll('.floating-card').forEach((card, i) => {
      const m = (i + 1) * 12;
      card.style.transform = `translateY(calc(var(--float-y,0px) + ${yPct * m}px)) translateX(${xPct * m}px)`;
    });
  });
}

// ─── SCROLL PROGRESS BAR ────────────────────────────────
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
  background: linear-gradient(90deg, #408A71, #B0E4CC);
  transition: width 0.1s ease; width: 0%;
  box-shadow: 0 0 8px rgba(64,138,113,0.7);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const totalH  = document.body.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / totalH) * 100;
  progressBar.style.width = scrolled + '%';
});

// ─── FORM INPUT ANIMATIONS ──────────────────────────────
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.querySelector('label').style.color = '#B0E4CC';
  });
  input.addEventListener('blur', () => {
    input.parentElement.querySelector('label').style.color = '';
  });
});

// ─── WHATSAPP FLOAT PULSE ───────────────────────────────
const waFloat = document.querySelector('.whatsapp-float');
if (waFloat) {
  setInterval(() => {
    waFloat.style.boxShadow = '0 0 0 12px rgba(37,211,102,0.2)';
    setTimeout(() => { waFloat.style.boxShadow = '0 4px 20px rgba(37,211,102,0.5)'; }, 400);
  }, 2500);
}

console.log('%c🚀 SADIA Portfolio – Built with ❤️', 'color:#B0E4CC;font-size:16px;font-weight:bold;');
