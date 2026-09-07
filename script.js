// MediCare Plus - Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 80 });
  }
  initNavbar();
  initHamburger();
  initNavSpy();
  initDoctorsCarousel();
  initTestimonialsSlider();
  initStatsCounter();
  initAppointmentForm();
  initNewsletter();
  initScrollTop();
  initMinDate();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initHamburger() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('open');
    });
  });
}

function initNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 160;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function initDoctorsCarousel() {
  const track = document.getElementById('doctorsTrack');
  const prevBtn = document.getElementById('docPrevBtn');
  const nextBtn = document.getElementById('docNextBtn');
  const indicators = document.getElementById('doctorsIndicators');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.doctor-card');
  let currentIndex = 0;
  let autoPlayTimer = null;

  function getVisibleCards() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCards());
  }

  function renderIndicators() {
    if (!indicators) return;
    indicators.innerHTML = '';
    const totalPages = getMaxIndex() + 1;
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-indicator' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to doctor slide ' + (i + 1));
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
        resetTimer();
      });
      indicators.appendChild(dot);
    }
  }

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';
    if (indicators) {
      indicators.querySelectorAll('.carousel-indicator').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; updateCarousel(); resetTimer(); }
  });
  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) { currentIndex++; updateCarousel(); resetTimer(); }
    else { currentIndex = 0; updateCarousel(); resetTimer(); }
  });

  function startTimer() {
    autoPlayTimer = setInterval(() => {
      if (currentIndex < getMaxIndex()) currentIndex++;
      else currentIndex = 0;
      updateCarousel();
    }, 4500);
  }
  function resetTimer() { clearInterval(autoPlayTimer); startTimer(); }

  track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  track.addEventListener('mouseleave', () => startTimer());

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 40 && currentIndex < getMaxIndex()) { currentIndex++; updateCarousel(); resetTimer(); }
    else if (diff < -40 && currentIndex > 0) { currentIndex--; updateCarousel(); resetTimer(); }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    renderIndicators();
    updateCarousel();
  });

  // Doctor card appointment buttons
  document.querySelectorAll('.book-doc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const docName = btn.getAttribute('data-doctor');
      const deptSelect = document.getElementById('departmentSelect');
      const msgField = document.getElementById('patientMessage');
      if (deptSelect) {
        if (docName.includes('Cardiology')) deptSelect.value = 'Cardiology';
        else if (docName.includes('Neurology')) deptSelect.value = 'Neurology';
        else if (docName.includes('Pediatrics')) deptSelect.value = 'Pediatrics';
        else if (docName.includes('Orthopedics')) deptSelect.value = 'Orthopedics';
        else if (docName.includes('Dental')) deptSelect.value = 'Dental';
      }
      if (msgField) msgField.value = 'I would like to request an appointment specifically with ' + docName + '.';
      const aptSec = document.getElementById('appointment');
      if (aptSec) aptSec.scrollIntoView({ behavior: 'smooth' });
    });
  });

  renderIndicators();
  updateCarousel();
  startTimer();
}

function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testPrevBtn');
  const nextBtn = document.getElementById('testNextBtn');
  const dotsContainer = document.getElementById('testDots');
  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let timer = null;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'test-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (idx + 1));
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateSlider();
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlider() {
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.test-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }

  nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

  function startTimer() { timer = setInterval(nextSlide, 5000); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => startTimer());

  startTimer();
}

function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;
  const statsSection = document.getElementById('statsSection');
  if (!statsSection || counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const start = performance.now();
          const updateCount = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            if (target >= 1000) {
              counter.innerText = current.toLocaleString();
            } else {
              counter.innerText = current;
            }
            if (progress < 1) requestAnimationFrame(updateCount);
            else counter.innerText = (target >= 1000) ? target.toLocaleString() : target;
          };
          requestAnimationFrame(updateCount);
        });
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  const successBox = document.getElementById('bookingSuccessMsg');
  const newBookingBtn = document.getElementById('newBookingBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('patientName');
    const phone = document.getElementById('patientPhone');
    const dept = document.getElementById('departmentSelect');
    const date = document.getElementById('preferredDate');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const deptError = document.getElementById('deptError');
    const dateError = document.getElementById('dateError');

    // Reset errors
    [name, phone, dept, date].forEach(el => el.classList.remove('input-error'));
    [nameError, phoneError, deptError, dateError].forEach(el => el.style.display = 'none');

    if (!name.value.trim() || name.value.trim().length < 2) {
      name.classList.add('input-error');
      nameError.style.display = 'block';
      isValid = false;
    }

    const phoneVal = phone.value.trim();
    if (!phoneVal || !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phoneVal)) {
      phone.classList.add('input-error');
      phoneError.style.display = 'block';
      isValid = false;
    }

    if (!dept.value) {
      dept.classList.add('input-error');
      deptError.style.display = 'block';
      isValid = false;
    }

    if (!date.value) {
      date.classList.add('input-error');
      dateError.style.display = 'block';
      isValid = false;
    }

    if (!isValid) return;

    // Loading indicator
    const submitBtn = document.getElementById('submitBookingBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    submitBtn.disabled = true;

    setTimeout(() => {
      document.getElementById('confirmedPatientName').innerText = name.value.trim();
      document.getElementById('confirmedDept').innerText = dept.value;
      document.getElementById('confirmedDate').innerText = date.value;

      form.style.display = 'none';
      successBox.style.display = 'block';
      btnText.style.display = 'inline-block';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }, 1200);
  });

  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      successBox.style.display = 'none';
    });
  }
}

function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const feedback = document.getElementById('newsletterFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail');
    if (!email.value || !email.value.includes('@')) {
      feedback.style.color = '#f87171';
      feedback.innerText = 'Please enter a valid email address.';
      return;
    }
    feedback.style.color = '#34d399';
    feedback.innerText = 'Thank you! You have subscribed to MediCare Plus updates.';
    email.value = '';
    setTimeout(() => { feedback.innerText = ''; }, 4000);
  });
}

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

function initMinDate() {
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}
