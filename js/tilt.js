/* ============================================================
   VANILLA TILT — Ashis Kumar Portfolio 2026
   3D tilt effect on cards (desktop only)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 992 || typeof VanillaTilt === 'undefined') return;

    // Skill cards
    VanillaTilt.init(document.querySelectorAll('.skill-card'), {
        max: 12,
        speed: 400,
        glare: true,
        'max-glare': 0.12,
        perspective: 800,
        scale: 1.03,
    });

    // Service cards
    VanillaTilt.init(document.querySelectorAll('.service-card'), {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.08,
        perspective: 1000,
        scale: 1.02,
    });
});
