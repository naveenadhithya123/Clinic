/* ===================================================================
   AURELIA GRAND HOTEL - Boutique Luxury Resort
   Master Interactive JavaScript
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
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
  initBookingWidget();
  initTestimonialsSlider();
  initGalleryLightbox();
  initOffersBooking();
  initRoomBookingButtons();
  initNewsletter();
  initScrollTop();
  initDateConstraints();
});

/* --- 1. NAVBAR SCROLL EFFECT --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- 2. MOBILE DRAWER NAVIGATION --- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !menu) return;

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- 3. SCROLLSPY ACTIVE NAV LINK --- */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 200;
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

/* --- 4. HERO PARALLAX --- */
function initHeroParallax() {
  const heroBg = document.querySelector('.hero-parallax-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const offset = window.pageYOffset;
    if (offset < window.innerHeight) {
      heroBg.style.transform = `translateY(${offset * 0.35}px)`;
    }
  }, { passive: true });
}

/* --- 5. EMBEDDED BOOKING WIDGET LOGIC --- */
function initBookingWidget() {
  const form = document.getElementById('bookingWidgetForm');
  const modal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalDismiss = document.getElementById('modalDismissBtn');
  if (!form) return;

  const roomRates = {
    'deluxe': { name: 'Deluxe Ocean View Room', rate: 480 },
    'junior-suite': { name: 'Mediterranean Junior Suite', rate: 750 },
    'panoramic-suite': { name: 'Grand Panoramic Suite', rate: 1250 },
    'presidential': { name: 'Presidential Royal Penthouse', rate: 2400 }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkin = document.getElementById('bookCheckin');
    const checkout = document.getElementById('bookCheckout');
    const guests = document.getElementById('bookGuests');
    const room = document.getElementById('bookRoom');

    let isValid = true;

    // Reset error visuals
    [checkin, checkout, guests, room].forEach(el => el.classList.remove('error'));

    if (!checkin.value) {
      checkin.classList.add('error');
      isValid = false;
    }
    if (!checkout.value) {
      checkout.classList.add('error');
      isValid = false;
    }

    if (checkin.value && checkout.value) {
      const dIn = new Date(checkin.value);
      const dOut = new Date(checkout.value);
      if (dOut <= dIn) {
        alert('Check-out date must be after check-in date.');
        checkout.classList.add('error');
        return;
      }
    }

    if (!isValid) return;

    // Calculate nights
    const d1 = new Date(checkin.value);
    const d2 = new Date(checkout.value);
    const diffTime = Math.abs(d2 - d1);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const selectedRoomKey = room.value || 'deluxe';
    const roomInfo = roomRates[selectedRoomKey] || roomRates['deluxe'];
    const totalEst = roomInfo.rate * nights;

    // Populate modal
    const confCode = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('modalConfCode').innerText = confCode;
    document.getElementById('modalRoomName').innerText = roomInfo.name;
    document.getElementById('modalDates').innerText = `${checkin.value} to ${checkout.value} (${nights} Night${nights > 1 ? 's' : ''})`;
    document.getElementById('modalGuests').innerText = guests.options[guests.selectedIndex].text;
    document.getElementById('modalTotal').innerText = '$' + totalEst.toLocaleString() + ' USD';

    const btn = form.querySelector('.btn-search-booking');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking Availability...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-magnifying-glass"></i> Check Availability';
      btn.disabled = false;
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }, 900);
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalDismiss) modalDismiss.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* --- 6. ROOM BOOK NOW BUTTONS LINK TO WIDGET --- */
function initRoomBookingButtons() {
  const roomButtons = document.querySelectorAll('.room-book-btn');
  const roomSelect = document.getElementById('bookRoom');
  const widgetSection = document.getElementById('home');

  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const roomKey = btn.getAttribute('data-room');
      if (roomSelect && roomKey) {
        roomSelect.value = roomKey;
        roomSelect.classList.add('highlight-pulse');
        setTimeout(() => roomSelect.classList.remove('highlight-pulse'), 1800);
      }
      if (widgetSection) {
        widgetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --- 7. SPECIAL OFFERS LINKING --- */
function initOffersBooking() {
  const offerBtns = document.querySelectorAll('.claim-offer-btn');
  offerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const offerTitle = btn.getAttribute('data-offer') || 'Package';
      const widgetSection = document.getElementById('home');
      alert(`Thank you for selecting "${offerTitle}". Please select your preferred dates in the booking bar to apply your promotional rate.`);
      if (widgetSection) widgetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* --- 8. TESTIMONIALS SLIDER --- */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testPrevBtn');
  const nextBtn = document.getElementById('testNextBtn');
  const dotsContainer = document.getElementById('testDots');
  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.testimonial-card');
  let currentIdx = 0;
  let autoTimer = null;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'test-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        currentIdx = idx;
        updateSlider();
        resetAutoTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlider() {
    track.style.transform = `translateX(-${currentIdx * 100}%)`;
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.test-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIdx);
      });
    }
  }

  function nextSlide() {
    currentIdx = (currentIdx + 1) % slides.length;
    updateSlider();
  }
  function prevSlide() {
    currentIdx = (currentIdx - 1 + slides.length) % slides.length;
    updateSlider();
  }

  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoTimer(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoTimer(); });

  function startAutoTimer() { autoTimer = setInterval(nextSlide, 5500); }
  function resetAutoTimer() { clearInterval(autoTimer); startAutoTimer(); }

  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => startAutoTimer());

  startAutoTimer();
}

/* --- 9. GALLERY LIGHTBOX --- */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('hotelLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxClose');
  if (!items.length || !lightbox || !lightboxImg) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Aurelia Grand Hotel';
      const desc = item.getAttribute('data-desc') || '';

      lightboxImg.src = img.src;
      lightboxImg.alt = title;
      if (lightboxTitle) lightboxTitle.innerText = title;
      if (lightboxDesc) lightboxDesc.innerText = desc;

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

/* --- 10. NEWSLETTER FORM --- */
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
    feedback.innerText = 'Welcome to Aurelia Privé. Your welcome dossier has been dispatched.';
    email.value = '';
    setTimeout(() => { feedback.innerText = ''; }, 4500);
  });
}

/* --- 11. SCROLL TO TOP --- */
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

/* --- 12. DATE RESTRICTIONS --- */
function initDateConstraints() {
  const checkin = document.getElementById('bookCheckin');
  const checkout = document.getElementById('bookCheckout');
  if (!checkin || !checkout) return;

  const today = new Date().toISOString().split('T')[0];
  checkin.min = today;

  // Set default check-in to today, check-out to tomorrow
  checkin.value = today;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  checkout.value = tomorrow.toISOString().split('T')[0];
  checkout.min = today;

  checkin.addEventListener('change', () => {
    if (checkin.value) {
      checkout.min = checkin.value;
      if (checkout.value && checkout.value <= checkin.value) {
        const nextDay = new Date(checkin.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkout.value = nextDay.toISOString().split('T')[0];
      }
    }
  });
}
