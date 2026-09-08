/* ===================================================================
   SAVORO - Fine Dining Restaurant
   Interactive Vanilla JavaScript
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 850,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70
    });
  }

  initNavbar();
  initMobileNav();
  initNavSpy();
  initHeroParallax();
  initMenuTabs();
  initReviewsCarousel();
  initGalleryLightbox();
  initReservationForm();
  initNewsletter();
  initScrollTop();
  initDateConstraints();
});

/* --- 1. NAVBAR SCROLL EFFECT --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- 2. MOBILE NAVIGATION DRAWER --- */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', toggleMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  navMenu.querySelectorAll('.nav-link, .btn-reserve-nav').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- 3. ACTIVE NAV SCROLLSPY --- */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 180;
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --- 4. HERO PARALLAX EFFECT --- */
function initHeroParallax() {
  const heroBg = document.querySelector('.hero-parallax-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;
    if (scrollPos < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollPos * 0.38}px)`;
    }
  }, { passive: true });
}

/* --- 5. MENU TABS WITH FADE TRANSITIONS --- */
function initMenuTabs() {
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const menuPanels = document.querySelectorAll('.menu-category-panel');
  if (!tabButtons.length || !menuPanels.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetCategory = button.getAttribute('data-category');

      // Update button active state
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Transition panels
      menuPanels.forEach(panel => {
        if (panel.id === `menu-${targetCategory}`) {
          panel.classList.add('active');
          // Trigger stagger animation for menu items
          const items = panel.querySelectorAll('.menu-item');
          items.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight; // trigger reflow
            item.style.animation = `menuFadeUp 0.5s ease forwards ${index * 0.08}s`;
          });
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* --- 6. CUSTOMER REVIEWS CAROUSEL --- */
function initReviewsCarousel() {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewPrevBtn');
  const nextBtn = document.getElementById('reviewNextBtn');
  const dotsContainer = document.getElementById('reviewDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.review-card');
  let currentIndex = 0;
  let autoTimer = null;

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'review-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Review Slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateCarousel();
        resetAutoTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.review-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoTimer(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoTimer(); });

  function startAutoTimer() {
    autoTimer = setInterval(nextSlide, 5500);
  }
  function resetAutoTimer() {
    clearInterval(autoTimer);
    startAutoTimer();
  }

  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => startAutoTimer());

  // Touch Swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) { nextSlide(); resetAutoTimer(); }
    else if (diff < -45) { prevSlide(); resetAutoTimer(); }
  }, { passive: true });

  startAutoTimer();
}

/* --- 7. GALLERY LIGHTBOX --- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  if (!galleryItems.length || !lightbox || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Fine Dining at Savoro';
      const desc = item.getAttribute('data-desc') || '';

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title;
      if (lightboxCaption) {
        lightboxCaption.innerHTML = `<h4>${title}</h4><p>${desc}</p>`;
      }
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* --- 8. RESERVATION FORM --- */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const successCard = document.getElementById('reservationSuccess');
  const newBookingBtn = document.getElementById('newResBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('resName');
    const email = document.getElementById('resEmail');
    const phone = document.getElementById('resPhone');
    const date = document.getElementById('resDate');
    const time = document.getElementById('resTime');
    const guests = document.getElementById('resGuests');
    const seating = document.getElementById('resSeating');

    // Reset error states
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');

    // Validation
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'resNameError');
      isValid = false;
    }

    if (!phone.value.trim() || phone.value.trim().length < 7) {
      showError(phone, 'resPhoneError');
      isValid = false;
    }

    if (!email.value.trim() || !email.value.includes('@')) {
      showError(email, 'resEmailError');
      isValid = false;
    }

    if (!date.value) {
      showError(date, 'resDateError');
      isValid = false;
    }

    if (!time.value) {
      showError(time, 'resTimeError');
      isValid = false;
    }

    if (!guests.value) {
      showError(guests, 'resGuestsError');
      isValid = false;
    }

    if (!isValid) return;

    // Loading State
    const submitBtn = document.getElementById('resSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Populate confirmation
      const resCode = 'SAV-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('confCode').innerText = resCode;
      document.getElementById('confName').innerText = name.value.trim();
      document.getElementById('confDate').innerText = formatDate(date.value);
      document.getElementById('confTime').innerText = time.value;
      document.getElementById('confGuests').innerText = guests.value + ' Guest' + (guests.value > 1 ? 's' : '');
      document.getElementById('confSeating').innerText = seating.value || 'Main Dining Room';

      form.style.display = 'none';
      if (successCard) successCard.style.display = 'block';

      btnText.style.display = 'inline-flex';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }, 1300);
  });

  function showError(inputEl, errorId) {
    inputEl.classList.add('error');
    const err = document.getElementById(errorId);
    if (err) err.style.display = 'block';
  }

  function formatDate(rawDate) {
    const d = new Date(rawDate);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (successCard) successCard.style.display = 'none';
    });
  }
}

/* --- 9. NEWSLETTER FORM --- */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const feedback = document.getElementById('newsletterFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail');
    if (!email.value || !email.value.includes('@')) {
      feedback.style.color = '#ef4444';
      feedback.innerText = 'Please enter a valid email address.';
      return;
    }
    feedback.style.color = '#d4af37';
    feedback.innerText = 'Thank you for joining the Savoro Culinary Society. Invitation dispatched.';
    email.value = '';
    setTimeout(() => { feedback.innerText = ''; }, 4500);
  });
}

/* --- 10. SCROLL TO TOP --- */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- 11. DATE CONSTRAINTS --- */
function initDateConstraints() {
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}
