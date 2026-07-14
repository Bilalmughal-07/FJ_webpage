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

    document.addEventListener('click', (event) => {
        const isOpen = navLinksList.classList.contains('is-open');
        if (!isOpen) return;

        const clickedInsideNav = navLinksList.contains(event.target) || toggle.contains(event.target);
        if (!clickedInsideNav) closeMenu();
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

(function () {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+]?[\d\s-]{10,15}$/;

    const requiredFields = ['contact-name', 'contact-phone', 'contact-email', 'contact-message']
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    // Create one error message element per required field
    requiredFields.forEach((field) => {
        const group = field.closest('.contact-form__group');
        if (!group || group.querySelector('.contact-form__error')) return;

        const errorEl = document.createElement('p');
        errorEl.className = 'contact-form__error';
        errorEl.id = `${field.id}-error`;
        group.appendChild(errorEl);
        field.setAttribute('aria-describedby', errorEl.id);
    });

    // Success confirmation, created once and toggled visible on valid submit
    const successEl = document.createElement('p');
    successEl.className = 'contact-form__success';
    successEl.setAttribute('role', 'status');
    successEl.setAttribute('aria-live', 'polite');
    successEl.textContent = 'Thank you for your inquiry! Our team will get back to you shortly.';
    form.querySelector('.contact-form__submit').insertAdjacentElement('afterend', successEl);

    const getFieldError = (field) => {
        const value = field.value.trim();

        if (field.hasAttribute('required') && !value) {
            return 'This field is required.';
        }
        if (field.type === 'email' && value && !emailPattern.test(value)) {
            return 'Enter a valid email address.';
        }
        if (field.type === 'tel' && value && !phonePattern.test(value)) {
            return 'Enter a valid phone number.';
        }
        return '';
    };

    const validateField = (field) => {
        const group = field.closest('.contact-form__group');
        const errorEl = group.querySelector('.contact-form__error');
        const message = getFieldError(field);
        const isValid = !message;

        group.classList.toggle('is-invalid', !isValid);
        field.setAttribute('aria-invalid', String(!isValid));
        if (errorEl) errorEl.textContent = message;

        return isValid;
    };

    requiredFields.forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        successEl.classList.remove('is-visible');

        const isFormValid = requiredFields
            .map((field) => validateField(field))
            .every(Boolean);

        if (!isFormValid) {
            const firstInvalid = requiredFields.find((field) =>
                field.closest('.contact-form__group').classList.contains('is-invalid')
            );
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        successEl.classList.add('is-visible');
        form.reset();

        requiredFields.forEach((field) => {
            field.closest('.contact-form__group').classList.remove('is-invalid');
            field.removeAttribute('aria-invalid');
        });
    });
})();


// ==========================================================
// 5. Footer (dynamic copyright year)
// ==========================================================

(function () {
    const yearEl = document.getElementById('footer-year');
    if (!yearEl) return;

    yearEl.textContent = new Date().getFullYear();
})();


// ==========================================================
// 6. Smooth Scrolling
// ==========================================================

(function () {
    const header = document.getElementById('header');

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');

            if (!href || href === '#') {
                event.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();

            const offset = (header ? header.offsetHeight : 0) + 16;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
})();


// ==========================================================
// 7. Scroll Reveal Animations
// ==========================================================

(function () {
    const revealTargets = ['hero', 'about', 'products', 'why-choose-us', 'gallery', 'contact', 'footer']
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if (!revealTargets.length) return;

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );

    revealTargets.forEach((section) => {
        section.classList.add('reveal');
        revealObserver.observe(section);
    });
})();


// ==========================================================
// 8. Product Section Interactions
// ==========================================================

(function () {
    const productButtons = document.querySelectorAll('.product-card__button');
    if (!productButtons.length) return;

    const header = document.getElementById('header');
    const contactSection = document.getElementById('contact');
    const messageField = document.getElementById('contact-message');

    productButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const titleEl = card ? card.querySelector('.product-card__title') : null;
            const productName = titleEl ? titleEl.textContent.trim() : 'this product';

            if (messageField && !messageField.value.trim()) {
                messageField.value = `I'm interested in the ${productName}. Please share more details and pricing.`;
            }

            if (contactSection) {
                const offset = (header ? header.offsetHeight : 0) + 16;
                const targetPosition = contactSection.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }

            if (messageField) {
                window.setTimeout(() => messageField.focus(), 500);
            }
        });
    });
})();


// ==========================================================
// 9. Statistics Counter Animation
// ==========================================================

(function () {
    const numberPattern = /(\d+)(\+)/;
    const candidates = document.querySelectorAll('.about__stat, .feature-card__title');

    candidates.forEach((el) => {
        const match = el.textContent.match(numberPattern);
        if (!match) return;

        el.innerHTML = el.innerHTML.replace(
            numberPattern,
            `<span class="counter" data-target="${match[1]}">0</span>$2`
        );
    });

    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounter = (el) => {
        const target = Number(el.dataset.target);

        if (prefersReducedMotion) {
            el.textContent = target;
            return;
        }

        const duration = 1500;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        };

        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
})();
