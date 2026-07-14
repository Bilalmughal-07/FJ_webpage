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
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
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

(function () {
    const galleryGrid = document.querySelector('.gallery__grid');
    if (!galleryGrid) return;

    const galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery__item'));

    // Fade-in when the gallery enters the viewport
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    galleryGrid.classList.add('is-visible');
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.15 }
    );

    revealObserver.observe(galleryGrid);

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const backdrop = lightbox.querySelector('[data-lightbox-close]');

    let currentIndex = 0;
    let lastFocusedElement = null;

    const showImage = (index) => {
        const item = galleryItems[index];
        const img = item.querySelector('.gallery__image');
        const caption = item.querySelector('.gallery__caption');

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
    };

    const openLightbox = (index) => {
        currentIndex = index;
        showImage(currentIndex);
        lastFocusedElement = document.activeElement;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showImage(currentIndex);
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showImage(currentIndex);
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('is-open')) return;

        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') showPrev();
        if (event.key === 'ArrowRight') showNext();
    });
})();


// ==========================================================
// 4. Contact Form (validation, submission handling)
// ==========================================================
