/* ===================================================================
   THE FADE ROOM - Salon & Barber Shop
   Master Interactive JavaScript
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  initNavbar();
  initMobileNav();
  initNavSpy();
  initServiceBookingButtons();
  initStylistBookingButtons();
  initBeforeAfterSliders();
  initBookingForm();
  initTestimonialsCarousel();
  initScrollTop();
  initDateConstraints();
});

/* --- 1. NAVBAR SCROLL EFFECT --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- 2. MOBILE DRAWER NAVIGATION --- */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');
  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  navMenu.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- 3. SCROLLSPY ACTIVE NAV LINK --- */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 180;
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
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

/* --- 4. PRE-FILL SERVICE IN BOOKING FORM --- */
function initServiceBookingButtons() {
  const serviceBtns = document.querySelectorAll('.service-book-btn');
  const serviceSelect = document.getElementById('bookService');
  const bookSection = document.getElementById('booking');

  serviceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceVal = btn.getAttribute('data-service');
      if (serviceSelect && serviceVal) {
        serviceSelect.value = serviceVal;
        serviceSelect.classList.add('highlight-pulse');
        setTimeout(() => serviceSelect.classList.remove('highlight-pulse'), 1500);
      }
      if (bookSection) bookSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* --- 5. PRE-FILL STYLIST IN BOOKING FORM --- */
function initStylistBookingButtons() {
  const stylistBtns = document.querySelectorAll('.stylist-book-btn');
  const stylistSelect = document.getElementById('bookStylist');
  const bookSection = document.getElementById('booking');

  stylistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const stylistVal = btn.getAttribute('data-stylist');
      if (stylistSelect && stylistVal) {
        stylistSelect.value = stylistVal;
        stylistSelect.classList.add('highlight-pulse');
        setTimeout(() => stylistSelect.classList.remove('highlight-pulse'), 1500);
      }
      if (bookSection) bookSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* --- 6. INTERACTIVE BEFORE/AFTER SLIDERS --- */
function initBeforeAfterSliders() {
  const containers = document.querySelectorAll('.ba-slider-container');

  containers.forEach(container => {
    const handle = container.querySelector('.ba-handle');
    const afterImg = container.querySelector('.ba-after-wrap');

    const updateSlider = (xPos) => {
      const rect = container.getBoundingClientRect();
      let pos = ((xPos - rect.left) / rect.width) * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;

      if (afterImg) afterImg.style.width = `${pos}%`;
      if (handle) handle.style.left = `${pos}%`;
    };

    let isDragging = false;

    container.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    container.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });

    // Touch Support
    container.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    container.addEventListener('touchmove', (e) => {
      if (isDragging) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    // Set initial position to 50%
    if (afterImg) afterImg.style.width = '50%';
    if (handle) handle.style.left = '50%';
  });
}

/* --- 7. ONLINE BOOKING FORM --- */
function initBookingForm() {
  const form = document.getElementById('salonBookingForm');
  const successCard = document.getElementById('bookingSuccess');
  const resetBtn = document.getElementById('newBookingBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('clientName');
    const phone = document.getElementById('clientPhone');
    const service = document.getElementById('bookService');
    const stylist = document.getElementById('bookStylist');
    const date = document.getElementById('bookDate');
    const time = document.getElementById('bookTime');

    // Reset error classes
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');

    // Validate Name
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'nameError');
      isValid = false;
    }

    // Validate Phone
    const phoneVal = phone.value.trim();
    if (!phoneVal || !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phoneVal)) {
      showError(phone, 'phoneError');
      isValid = false;
    }

    // Validate Service
    if (!service.value) {
      showError(service, 'serviceError');
      isValid = false;
    }

    // Validate Stylist
    if (!stylist.value) {
      showError(stylist, 'stylistError');
      isValid = false;
    }

    // Validate Date
    if (!date.value) {
      showError(date, 'dateError');
      isValid = false;
    }

    // Validate Time
    if (!time.value) {
      showError(time, 'timeError');
      isValid = false;
    }

    if (!isValid) return;

    // Loading State
    const submitBtn = document.getElementById('submitAppointmentBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    setTimeout(() => {
      const aptCode = 'FADE-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('confCode').innerText = aptCode;
      document.getElementById('confName').innerText = name.value.trim();
      document.getElementById('confService').innerText = service.options[service.selectedIndex].text;
      document.getElementById('confStylist').innerText = stylist.options[stylist.selectedIndex].text;
      document.getElementById('confDateTime').innerText = `${date.value} at ${time.value}`;

      form.style.display = 'none';
      if (successCard) successCard.style.display = 'block';

      btnText.style.display = 'inline-flex';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }, 1100);
  });

  function showError(inputEl, errorId) {
    inputEl.classList.add('error');
    const err = document.getElementById(errorId);
    if (err) err.style.display = 'block';
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (successCard) successCard.style.display = 'none';
    });
  }
}

/* --- 8. CLIENT TESTIMONIALS CAROUSEL --- */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testPrevBtn');
  const nextBtn = document.getElementById('testNextBtn');
  const dotsContainer = document.getElementById('testDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIdx = 0;
  let autoTimer = null;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'test-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial Slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        currentIdx = idx;
        updateCarousel();
        resetAutoTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIdx * 100}%)`;
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.test-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIdx);
      });
    }
  }

  function nextSlide() {
    currentIdx = (currentIdx + 1) % cards.length;
    updateCarousel();
  }
  function prevSlide() {
    currentIdx = (currentIdx - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoTimer(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoTimer(); });

  function startAutoTimer() { autoTimer = setInterval(nextSlide, 5000); }
  function resetAutoTimer() { clearInterval(autoTimer); startAutoTimer(); }

  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => startAutoTimer());

  startAutoTimer();
}

/* --- 9. SCROLL TO TOP --- */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- 10. DATE CONSTRAINTS --- */
function initDateConstraints() {
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}
