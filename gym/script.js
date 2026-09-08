/* ===================================================================
   IRONPULSE FITNESS - High-Energy Fitness & Gym Studio
   Master Interactive JavaScript
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70
    });
  }

  initNavbar();
  initMobileNav();
  initNavSpy();
  initStatsCounters();
  initPricingToggle();
  initProgramBookingButtons();
  initPassForm();
  initTestimonialsSlider();
  initScrollTop();
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

/* --- 4. ANIMATED STATS COUNTER --- */
function initStatsCounters() {
  const counters = document.querySelectorAll('.counter-val');
  const statsSection = document.getElementById('statsSection');
  if (!statsSection || !counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const start = performance.now();

          const updateCounter = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease-out
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            if (target >= 1000) {
              counter.innerText = current.toLocaleString();
            } else {
              counter.innerText = current;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = (target >= 1000) ? target.toLocaleString() : target;
            }
          };

          requestAnimationFrame(updateCounter);
        });
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(statsSection);
}

/* --- 5. PRICING MONTHLY / ANNUAL TOGGLE --- */
function initPricingToggle() {
  const toggleCheckbox = document.getElementById('billingToggle');
  const priceBasic = document.getElementById('priceBasic');
  const pricePro = document.getElementById('pricePro');
  const priceElite = document.getElementById('priceElite');
  const periodLabels = document.querySelectorAll('.price-period');
  if (!toggleCheckbox) return;

  const prices = {
    monthly: { basic: 39, pro: 69, elite: 119, period: '/ month' },
    annual: { basic: 29, pro: 49, elite: 89, period: '/ month (billed annually)' }
  };

  toggleCheckbox.addEventListener('change', () => {
    const isAnnual = toggleCheckbox.checked;
    const data = isAnnual ? prices.annual : prices.monthly;

    if (priceBasic) priceBasic.innerText = '$' + data.basic;
    if (pricePro) pricePro.innerText = '$' + data.pro;
    if (priceElite) priceElite.innerText = '$' + data.elite;

    periodLabels.forEach(label => {
      label.innerText = data.period;
    });
  });
}

/* --- 6. PROGRAM JOIN BUTTONS LINKING TO PASS --- */
function initProgramBookingButtons() {
  const progBtns = document.querySelectorAll('.prog-join-btn');
  const goalSelect = document.getElementById('passGoal');
  const passSection = document.getElementById('freePass');

  progBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const progName = btn.getAttribute('data-program');
      if (goalSelect && progName) {
        goalSelect.value = progName;
        goalSelect.classList.add('pulse-field');
        setTimeout(() => goalSelect.classList.remove('pulse-field'), 1600);
      }
      if (passSection) passSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* --- 7. FREE 7-DAY PASS FORM --- */
function initPassForm() {
  const form = document.getElementById('freePassForm');
  const successBox = document.getElementById('passSuccess');
  const resetBtn = document.getElementById('newPassBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('passName');
    const email = document.getElementById('passEmail');
    const phone = document.getElementById('passPhone');
    const goal = document.getElementById('passGoal');

    // Reset error states
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'passNameError');
      isValid = false;
    }

    if (!email.value.trim() || !email.value.includes('@')) {
      showError(email, 'passEmailError');
      isValid = false;
    }

    const phoneVal = phone.value.trim();
    if (!phoneVal || !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phoneVal)) {
      showError(phone, 'passPhoneError');
      isValid = false;
    }

    if (!isValid) return;

    // Loading State
    const submitBtn = document.getElementById('submitPassBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    setTimeout(() => {
      const passCode = 'PULSE-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('confPassCode').innerText = passCode;
      document.getElementById('confPassName').innerText = name.value.trim();
      document.getElementById('confPassGoal').innerText = goal.options[goal.selectedIndex].text;

      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';

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
      if (successBox) successBox.style.display = 'none';
    });
  }
}

/* --- 8. TESTIMONIALS SLIDER --- */
function initTestimonialsSlider() {
  const track = document.getElementById('gymTestTrack');
  const prevBtn = document.getElementById('gymPrevBtn');
  const nextBtn = document.getElementById('gymNextBtn');
  const dotsContainer = document.getElementById('gymTestDots');
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
    currentIdx = (currentIdx + 1) % cards.length;
    updateSlider();
  }
  function prevSlide() {
    currentIdx = (currentIdx - 1 + cards.length) % cards.length;
    updateSlider();
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
