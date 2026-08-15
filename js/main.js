/* ============================================================
   MAIN JS — Ashis Kumar Portfolio 2026
   Core functionality: form, project filter, speech, etc.
   ============================================================ */

/* ── Theme Toggle ── */
(function initThemeToggle() {
    // Apply saved theme immediately to avoid flash
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved, false);

    function applyTheme(theme, animate) {
        if (!animate) {
            document.documentElement.style.transition = 'none';
        }
        document.documentElement.dataset.theme = theme;

        const isLight = theme === 'light';
        const icon    = isLight ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        const tip     = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';

        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            const i = btn.querySelector('i');
            if (i) i.className = icon;
            btn.title = tip;
        });

        if (!animate) {
            requestAnimationFrame(() => {
                document.documentElement.style.transition = '';
            });
        }
    }

    function handleToggleClick() {
        const current = document.documentElement.dataset.theme || 'dark';
        const next    = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
        localStorage.setItem('theme', next);
    }

    // Wire buttons (scripts are deferred/at bottom, DOM is ready)
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', handleToggleClick);
    });
})();

/* ── Footer year ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Mobile navbar close on link click ── */
document.querySelectorAll('.nav-link-custom').forEach(link => {
    link.addEventListener('click', () => {
        const navCollapse = document.getElementById('navMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) bsCollapse.hide();
        }
    });
});

/* ── Skills Filtering ── */
(function initSkillsFilter() {
    const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
    const skillItems = document.querySelectorAll('.skill-item');

    if (!filterBtns.length || !skillItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');

            const category = btn.dataset.filter;
            skillItems.forEach(item => {
                const cats = item.dataset.category || '';
                const show = category === 'all' || cats.includes(category);
                if (show) {
                    item.style.display = 'block';
                    item.style.animation = 'none';
                    void item.offsetHeight;
                    item.style.animation = 'cardEnter 0.4s ease forwards';
                } else {
                    item.style.animation = 'cardLeave 0.3s ease forwards';
                    setTimeout(() => { item.style.display = 'none'; }, 290);
                }
            });
        });
    });
})();

/* ── Project Filtering ── */
(function initProjectFilter() {
    const filterBtns   = document.querySelectorAll('.project-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-item');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');

            const category = btn.dataset.filter;

            projectCards.forEach(card => {
                const cats = card.dataset.category || '';
                const show = category === 'all' || cats.includes(category);

                if (show) {
                    card.style.display = 'block';
                    card.style.animation = 'none';
                    card.offsetHeight; // force reflow
                    card.style.animation = 'cardEnter 0.4s ease forwards';
                } else {
                    card.style.animation = 'cardLeave 0.3s ease forwards';
                    setTimeout(() => { card.style.display = 'none'; }, 290);
                }
            });
        });
    });
})();

/* ── Contact Form — Formspree AJAX ── */
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('[type="submit"]');
        const btnText   = submitBtn.querySelector('.btn-text');
        const btnIcon   = submitBtn.querySelector('i');

        // Loading state
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';
        if (btnIcon) { btnIcon.className = 'bi bi-arrow-repeat spin'; }

        try {
            const response = await fetch('https://formspree.io/f/mwvdzepy', {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                // Success state
                if (btnText) btnText.textContent = 'Sent!';
                if (btnIcon) { btnIcon.className = 'bi bi-check-lg'; }
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                form.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    if (btnText) btnText.textContent = 'Send Message';
                    if (btnIcon) { btnIcon.className = 'bi bi-send'; }
                    submitBtn.style.background = '';
                }, 3500);

                // Toast notification
                showToast('Message sent! I\'ll get back to you soon.', 'success');
            } else {
                throw new Error('Server error');
            }
        } catch {
            if (btnText) btnText.textContent = 'Try again';
            if (btnIcon) { btnIcon.className = 'bi bi-exclamation-triangle'; }
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            submitBtn.disabled = false;

            setTimeout(() => {
                if (btnText) btnText.textContent = 'Send Message';
                if (btnIcon) { btnIcon.className = 'bi bi-send'; }
                submitBtn.style.background = '';
            }, 3000);

            showToast('Something went wrong. Please try again.', 'error');
        }
    });
})();

/* ── Toast Notification ── */
function showToast(message, type = 'success') {
    const existing = document.getElementById('portfolio-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        z-index: 9999;
        padding: 0.85rem 1.5rem;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
        border: 1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'};
        color: ${type === 'success' ? '#4ade80' : '#f87171'};
        border-radius: 12px;
        backdrop-filter: blur(16px);
        font-family: 'Inter', sans-serif;
        font-size: 0.875rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        opacity: 0;
        transition: all 0.4s ease;
    `;

    const icon = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `<span>${icon}</span> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}



/* ── Resize handler for tilt cleanup ── */
window.addEventListener('resize', () => {
    if (window.innerWidth < 992) {
        document.querySelectorAll('[data-tilt]').forEach(el => {
            if (el._vanillaTilt) el._vanillaTilt.destroy();
        });
    }
});

