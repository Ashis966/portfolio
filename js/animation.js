/* ============================================================
   ANIMATIONS — Ashis Kumar Portfolio 2026
   GSAP + ScrollTrigger + Lenis smooth scroll + Typed.js
   ============================================================ */

/* ── Lenis Smooth Scroll ── */
let lenis;

if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    // ONLY use GSAP ticker — no separate requestAnimationFrame loop
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync
    lenis.on('scroll', ScrollTrigger.update);
} else {
    // Graceful fallback: use CSS scroll-behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    // Stub so rest of code doesn't crash
    lenis = {
        scrollTo: (target, opts) => {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        on: () => {},
        raf: () => {}
    };
    console.warn('Lenis not loaded – using native smooth scroll fallback.');
}


/* ── Typed.js Typing Animation ── */
if (document.getElementById('typed-text')) {
    new Typed('#typed-text', {
        strings: [
            'Full‑Stack Web Developer',
            'Technical Trainer',
            'Django & PHP Expert',
            'React.js Developer',
            'ERP System Builder'
        ],
        typeSpeed: 55,
        backSpeed: 30,
        backDelay: 1800,
        loop: true,
        cursorChar: '|',
    });
}

/* ── GSAP RegisterPlugin ── */
gsap.registerPlugin(ScrollTrigger);

/* ── Hero Animations ── */
function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 1.8 }); // after loader

    tl.from('.hero-eyebrow',   { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' })
      .from('.hero-name',      { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.3')
      .from('.hero-typed-wrap',{ opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .from('.hero-desc',      { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .from('.hero-stats',     { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.2')
      .from('.hero-image-wrap',{ opacity: 0, scale: 0.85, duration: 0.9, ease: 'back.out(1.7)' }, '-=0.8')
      .from('.hero-shape',     { opacity: 0, scale: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4');
}

initHeroAnimations();

/* ── Scroll Progress Bar ── */
window.addEventListener('scroll', () => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const scrollTop  = document.documentElement.scrollTop;
    const scrollFull = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width  = (scrollTop / scrollFull * 100) + '%';
});

/* ── Section Reveal Animations ── */
// Generic fade-up for sections
gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

gsap.utils.toArray('.reveal-scale').forEach(el => {
    gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(1.6)',
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
        }
    });
});

/* ── Staggered children ── */
gsap.utils.toArray('.stagger-children').forEach(container => {
    gsap.to(container.children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            toggleActions: 'play none none none'
        }
    });
});

/* ── Skill Progress Bars ── */
ScrollTrigger.create({
    trigger: '#skills',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        document.querySelectorAll('.skill-progress-bar').forEach(bar => {
            const target = bar.dataset.progress + '%';
            bar.style.width = target;
        });
    }
});

/* ── Counter Animation ── */
function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start    = performance.now();

    function step(time) {
        const elapsed  = time - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.floor(eased * target);
        el.textContent = current + suffix;

        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
    }

    requestAnimationFrame(step);
}

/* ── About section counters ── */
ScrollTrigger.create({
    trigger: '#about',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        document.querySelectorAll('.about-stat[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count);
            const suffix = el.dataset.suffix || '+';
            animateCounter(el, target, suffix);
        });

        document.querySelectorAll('.about-stat[data-start-year]').forEach(el => {
            const year   = parseInt(el.dataset.startYear);
            const target = Math.max(1, new Date().getFullYear() - year);
            animateCounter(el, target, '+');
        });
    }
});

/* ── Timeline reveal ── */
document.querySelectorAll('.timeline-item').forEach((item, i) => {
    ScrollTrigger.create({
        trigger: item,
        start: 'top 82%',
        once: true,
        onEnter: () => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, i * 150);
        }
    });
});

/* ── About section stagger ── */
gsap.utils.toArray('.about-highlights li').forEach((li, i) => {
    ScrollTrigger.create({
        trigger: li,
        start: 'top 88%',
        once: true,
        onEnter: () => {
            setTimeout(() => {
                gsap.to(li, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
            }, i * 80);
        }
    });
});

// Set initial state for about highlights
gsap.set('.about-highlights li', { opacity: 0, x: -20 });

/* ── Section heading animation ── */
gsap.utils.toArray('.section-title').forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
        }
    });
});

/* ── Navbar shrink on scroll ── */
const mainNav = document.getElementById('mainNav');

/* ── Scroll-to-top button ── */
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.4 });
    });
}

/* ── Active nav on scroll ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link-custom');

function updateActiveNav(scrollY) {
    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 160) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Use Lenis scroll event for all scroll-position-dependent UI
lenis.on('scroll', ({ scroll }) => {
    if (mainNav) mainNav.classList.toggle('scrolled', scroll > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scroll > 500);
    updateActiveNav(scroll);
});

// Also bind native scroll as fallback (handles lenis stub & ensures always works)
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (mainNav) mainNav.classList.toggle('scrolled', y > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 500);
    updateActiveNav(y);
}, { passive: true });

// Initialize on page load
updateActiveNav(window.scrollY);


/* ── Smooth anchor links via Lenis ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            lenis.scrollTo(target, { duration: 1.3, offset: -80 });

            // Close mobile menu if open
            const navCollapse = document.getElementById('navMenu');
            if (navCollapse && navCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        }
    });
});

