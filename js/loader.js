/* ============================================================
   LOADER — Ashis Kumar Portfolio 2026
   Page transition loader and cursor glow
   ============================================================ */

/* ── Page Loader ── */
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    // Add a short delay so the loading bar animation completes
    setTimeout(() => {
        loader.classList.add('loaded');

        // Remove from DOM after transition
        setTimeout(() => {
            loader.remove();
        }, 700);
    }, 1600);
});

/* ── Custom Interactive Dual Cursor (desktop only) ── */
(function initCustomCursor() {
    if (window.innerWidth < 992) return;

    const dot  = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');
    if (!dot || !ring) return;

    // Enable custom cursor styling (hides default cursor)
    document.documentElement.classList.add('custom-cursor-enabled');

    let mouseX = 0, mouseY = 0;
    let dotX   = 0, dotY  = 0;
    let ringX  = 0, ringY = 0;
    let isHidden = true;
    let hoveredTarget = null; // element the ring is currently wrapping

    document.addEventListener('mousemove', (e) => {
        if (isHidden) {
            dot.style.opacity  = '1';
            ring.style.opacity = '1';
            isHidden = false;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
        isHidden = true;
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
        isHidden = false;
    });

    /* ── Animation loop ──
       Only the cursor moves. Elements NEVER move — no magnetic pull.
       This prevents any hover shaking/jitter.
    */
    function updateCursor() {
        // Dot tracks mouse directly with a small spring lag
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;

        if (hoveredTarget) {
            const rect    = hoveredTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width  / 2;
            const centerY = rect.top  + rect.height / 2;

            // Ring smoothly expands and locks onto the hovered element
            ringX += (centerX - ringX) * 0.22;
            ringY += (centerY - ringY) * 0.22;

            ring.style.width        = `${rect.width  + 12}px`;
            ring.style.height       = `${rect.height + 12}px`;
            ring.style.borderRadius = '14px';
        } else {
            // Standard small ring that follows the dot
            ringX += (dotX - ringX) * 0.15;
            ringY += (dotY - ringY) * 0.15;

            ring.style.width        = '34px';
            ring.style.height       = '34px';
            ring.style.borderRadius = '50%';
        }

        dot.style.transform  = `translate3d(calc(${dotX}px - 50%), calc(${dotY}px - 50%), 0)`;
        ring.style.transform = `translate3d(calc(${ringX}px - 50%), calc(${ringY}px - 50%), 0)`;

        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    /* ── Hover detection ──
       Ring expands on hover, but page elements do NOT move at all.
    */
    const hoverTargets = 'a, button, .skill-card, .project-card, .service-card, .social-btn, [role="button"]';

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(hoverTargets);
        if (target) {
            document.body.classList.add('custom-cursor-hover');
            if (target.matches('a, button, .social-btn, #scrollTopBtn, #resumeFab')) {
                hoveredTarget = target;
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(hoverTargets);
        if (target) {
            const leavingTarget = !e.relatedTarget || !e.relatedTarget.closest(hoverTargets);
            if (leavingTarget) {
                document.body.classList.remove('custom-cursor-hover');
            }
            if (hoveredTarget && (!e.relatedTarget || e.relatedTarget.closest(hoverTargets) !== hoveredTarget)) {
                hoveredTarget = null;
            }
        }
    });
})();
