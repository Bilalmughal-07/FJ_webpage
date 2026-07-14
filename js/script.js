/* ==========================================================================
   Fahad Jewellery Box - Main JavaScript
   --------------------------------------------------------------------------
   Purpose: Vanilla JS for interactive behavior such as navigation toggling,
   smooth scrolling, gallery interactions, and contact form handling.
   No external libraries or frameworks are used.
   ========================================================================== */

// ==========================================================
// 1. Navigation (mobile menu toggle, scroll effects)
// ==========================================================

(function () {
    const header = document.getElementById('header');
    const toggle = document.getElementById('navbar-toggle');
    const navLinksList = document.getElementById('navbar-links');
    const navLinks = navLinksList.querySelectorAll('a');

    const openMenu = () => {
        navLinksList.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        navLinksList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        isOpen ? closeMenu() : openMenu();
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    // Sticky background + shadow on scroll
    let ticking = false;

    const updateHeaderOnScroll = () => {
        header.classList.toggle('header--scrolled', window.scrollY > 40);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeaderOnScroll);
            ticking = true;
        }
    });

    updateHeaderOnScroll();

    // Active link state based on section in view
    const sections = document.querySelectorAll('main section[id]');

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
    };

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveLink(entry.target.id);
            });
        },
        { rootMargin: `-${header.offsetHeight}px 0px -60% 0px`, threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
})();


// ==========================================================
// 2. Hero Section (any interactive/animated behavior)
// ==========================================================


// ==========================================================
// 3. Gallery (lightbox / image interactions)
// ==========================================================


// ==========================================================
// 4. Contact Form (validation, submission handling)
// ==========================================================
