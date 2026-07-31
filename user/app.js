const SESSION_KEY = 'hoperise_session';

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY)) || JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
    } catch (e) {
        return null;
    }
}

function requireUser() {
    const session = getSession();

    if (!session || !session.role) {
        window.location.href = '../login.html?role=user';
        return null;
    }

    return session;
}

document.addEventListener('DOMContentLoaded', () => {
    const session = requireUser();
    if (!session) return;

    initUserSession(session);
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCarousel();
    initDonation();
    initForms();
    initBackToTop();
    initCounters();
});

/* ========== USER SESSION ========== */
function initUserSession(session) {
    const actions = document.getElementById('navActions');
    if (!actions) return;

    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.className = 'nav-user-chip';
    logoutBtn.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(session.name || 'User')}&background=4f46e5&color=fff&size=32" alt="">
        <span>${session.name || 'User'}</span>
        <i class="fas fa-sign-out-alt" title="Logout"></i>
    `;

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = '../login.html?logout=1';
    });

    actions.appendChild(logoutBtn);

    const mobileActions = document.querySelector('.nav-mobile-actions');
    if (mobileActions) {
        const mobileLogout = logoutBtn.cloneNode(true);
        mobileLogout.classList.add('btn-logout-mobile');
        mobileLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
            window.location.href = '../login.html?logout=1';
        });
        mobileActions.appendChild(mobileLogout);
    }
}

/* ========== NAVBAR ========== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* ========== MOBILE MENU ========== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu(open) {
        navMenu.classList.toggle('open', open);
        hamburger.classList.toggle('active', open);
        overlay.classList.toggle('show', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => toggleMenu(!navMenu.classList.contains('open')));

    overlay.addEventListener('click', () => toggleMenu(false));

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) toggleMenu(false);
    });
}

/* ========== SMOOTH SCROLL ========== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ========== SCROLL ANIMATIONS ========== */
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.about-grid, .program-showcase-card, .impact-card, .event-card-public, ' +
        '.story-card, .contact-card, .donate-wrapper, .volunteer-grid, ' +
        '.about-feature, .perk, .donate-feature, .cta-content, .volunteer-form-card, ' +
        '.donate-form-card, .contact-form-card'
    );

    elements.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

/* ========== CAROUSEL ========== */
function initCarousel() {
    const track = document.getElementById('eventsTrack');
    const prevBtn = document.getElementById('prevEvent');
    const nextBtn = document.getElementById('nextEvent');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = track.querySelectorAll('.event-slide');
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();

    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, slides.length - slidesPerView);
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const count = getMaxIndex() + 1;
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function update() {
        const gap = 24;
        const slideWidth = track.parentElement.offsetWidth / slidesPerView;
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
        update();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    createDots();
    update();

    window.addEventListener('resize', () => {
        slidesPerView = getSlidesPerView();
        currentIndex = Math.min(currentIndex, getMaxIndex());
        createDots();
        update();
    });
}

/* ========== INDIAN FORMATTING ========== */
function formatINR(value) {
    return '₹' + Number(value).toLocaleString('en-IN');
}

/* ========== DONATION ========== */
function initDonation() {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customInput = document.getElementById('customAmount');
    const donateAmountDisplay = document.getElementById('donateAmount');
    const donateBtn = document.getElementById('donateBtn');
    const freqBtns = document.querySelectorAll('.freq-btn');

    let selectedAmount = 100;

    freqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            freqBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const freq = btn.dataset.freq;
            const label = freq === 'one-time' ? '' : '/' + freq.replace('ly', '');
            donateAmountDisplay.textContent = formatINR(selectedAmount) + label;
        });
    });

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAmount = parseInt(btn.dataset.amount);
            customInput.value = '';
            donateAmountDisplay.textContent = formatINR(selectedAmount);
        });
    });

    customInput.addEventListener('input', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        selectedAmount = parseInt(customInput.value) || 0;
        donateAmountDisplay.textContent = selectedAmount > 0 ? formatINR(selectedAmount) : formatINR(0);
    });

    donateBtn.addEventListener('click', () => {
        if (selectedAmount <= 0) {
            showToast('Please select or enter a donation amount', 'error');
            return;
        }
        showToast(`Thank you for your generous donation of ${formatINR(selectedAmount)}!`, 'success');
    });
}

/* ========== FORMS ========== */
function initForms() {
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for signing up! We\'ll be in touch soon.', 'success');
            volunteerForm.reset();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            contactForm.reset();
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Subscribed to our newsletter!', 'success');
            newsletterForm.reset();
        });
    }
}

/* ========== BACK TO TOP ========== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========== COUNTER ANIMATION ========== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const isCurrency = el.dataset.currency === 'true';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (isCurrency) {
            el.textContent = '₹' + current.toLocaleString('en-IN') + '+';
        } else if (target >= 1000000) {
            el.textContent = (current / 1000000).toFixed(1) + 'M+';
        } else if (target >= 1000) {
            el.textContent = (current / 1000).toFixed(0) + 'K+';
        } else {
            el.textContent = current + '+';
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ========== TOAST ========== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
}
