// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav active link on scroll
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.navbar .nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (top >= offset && top < offset + height) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
});

// Contact Form AJAX Submission (Formspree)
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);

    // NOTE: Replace YOUR_FORM_ID below with your actual Formspree ID
    fetch("https://formspree.io/f/mwvdzepy", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            Swal.fire({
                title: "Success!",
                text: "Thanks! I’ll get back to you soon.",
                icon: "success",
                confirmButtonColor: "#0d6efd"
            });
            form.reset();
        } else {
            Swal.fire({
                title: "Error!",
                text: "Oops! There was a problem submitting your form.",
                icon: "error",
                confirmButtonColor: "#0d6efd"
            });
        }
    }).catch(error => {
        Swal.fire({
            title: "Network Error",
            text: "Oops! There was a network error submitting your form.",
            icon: "error",
            confirmButtonColor: "#0d6efd"
        });
    });
});

// Animated Counter
function animateCounter(counter, target) {
    let count = 0, speed = Math.max(20, 2000 / target);
    let inc = Math.ceil(target / 48);
    const update = () => {
        count += inc;
        if (count >= target) { counter.textContent = target + (target !== 100 ? "+" : "%"); return; }
        counter.textContent = count + (target !== 100 ? "+" : "%");
        setTimeout(update, speed);
    };
    update();
}
document.querySelectorAll('.animated-counter').forEach(counter => {
    let target;
    if (counter.hasAttribute('data-start-year')) {
        const currentYear = new Date().getFullYear();
        const startYear = parseInt(counter.getAttribute('data-start-year'));
        // Ensure at least 1 year of experience is shown if currentYear == startYear
        target = Math.max(1, currentYear - startYear);
    } else {
        target = parseInt(counter.getAttribute('data-count'));
    }
    animateCounter(counter, target);
});

// AOS Animation
AOS.init({ duration: 900, once: true });

// Speech function
function speak(text) {
    // stop previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // speed (0.5 = slow, 1 = normal, 2 = fast)
    utterance.pitch = 1; // tone
    speechSynthesis.speak(utterance);
}

// Attach hover and click events to all skill-badges
let hoverTimeout;
document.querySelectorAll(".skill-badge").forEach(badge => {
    badge.addEventListener("mouseenter", () => {
        let skillName = badge.innerText.trim();
        // Add a small delay to prevent chaotic triggers when swiping across badges
        hoverTimeout = setTimeout(() => {
            speak(skillName);
        }, 400);
    });

    badge.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimeout); // Cancel if mouse leaves before delay finishes
    });

    badge.addEventListener("click", () => {
        clearTimeout(hoverTimeout);
        let skillName = badge.innerText.trim();
        speak(skillName);
    });
});

// Attach click event to download-resume
document.querySelectorAll(".download-resume").forEach(resume => {
    resume.addEventListener("click", () => {
        let download_resume = resume.innerText.trim();
        speak(download_resume);
    });
});
