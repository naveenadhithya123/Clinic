/**
 * VelocityAuto Motors - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS Animation
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

  // 2. Sticky Navbar & Scroll Spy
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header background toggle
    if (scrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (scrollPos > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Active link highlighting
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Scroll to Top Smooth Scroll
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Mobile Hamburger Menu
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. Inventory Filtering Tabs & Quick Search
  const invTabs = document.querySelectorAll('.inv-tab');
  const carCards = document.querySelectorAll('.car-card');

  invTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      invTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      carCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInScale 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Quick Search Filter Button
  const btnFilterSearch = document.getElementById('btnFilterSearch');
  if (btnFilterSearch) {
    btnFilterSearch.addEventListener('click', () => {
      const makeVal = document.getElementById('searchMake').value;
      const priceVal = document.getElementById('searchPrice').value;

      carCards.forEach(card => {
        const cardMake = card.getAttribute('data-make');
        const cardPrice = parseInt(card.getAttribute('data-price'), 10);
        let matchMake = (makeVal === 'all' || cardMake === makeVal);
        let matchPrice = true;

        if (priceVal === '50-100') {
          matchPrice = cardPrice >= 50000 && cardPrice <= 100000;
        } else if (priceVal === '100-200') {
          matchPrice = cardPrice > 100000 && cardPrice <= 200000;
        } else if (priceVal === '200+') {
          matchPrice = cardPrice > 200000;
        }

        if (matchMake && matchPrice) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      // Smooth scroll down to inventory
      const invSec = document.getElementById('inventory');
      if (invSec) invSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Wishlist heart buttons toggle
  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
      }
    });
  });

  // 5. Vehicle Database for Quick Specs & Details Modal
  const vehicleDatabase = {
    'porsche-gt3': {
      title: '2026 Porsche 911 GT3 RS Coupe',
      tag: 'SUPERCAR &bull; BRAND NEW 2026',
      price: '$241,300',
      monthly: 'Est. $3,420/mo',
      img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      desc: 'The benchmark of road-legal track machinery. Featuring an atmospheric 4.0L naturally aspirated flat-six engine screaming up to 9,000 RPM with revolutionary DRS active aerodynamics.',
      specs: [
        { label: 'Engine', val: '4.0L Naturally Aspirated Boxer-6' },
        { label: 'Horsepower', val: '518 HP @ 8,500 RPM' },
        { label: '0-60 MPH', val: '3.0 Seconds' },
        { label: 'Top Track Speed', val: '184 MPH' },
        { label: 'Transmission', val: '7-Speed Dual-Clutch (PDK)' },
        { label: 'Drivetrain', val: 'Rear-Wheel Drive (RWD)' }
      ],
      features: [
        'Active DRS Rear Wing Aerodynamics',
        'Carbon Fiber Reinforced Plastic Hood & Doors',
        'Porsche Ceramic Composite Brakes (PCCB)',
        'Club Sport Titanium Roll Cage',
        'Weissach Performance Package',
        'Bose Surround Sound Audio'
      ]
    },
    'bmw-m4': {
      title: '2026 BMW M4 Competition M xDrive',
      tag: 'COUPE &bull; BRAND NEW 2026',
      price: '$92,500',
      monthly: 'Est. $1,310/mo',
      img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      desc: 'High-octane agility paired with daily luxury. Featuring BMW M TwinPower Turbo inline-6 power delivery, intelligent all-wheel drive with dedicated pure RWD drift mode.',
      specs: [
        { label: 'Engine', val: '3.0L BMW M TwinPower Turbo I6' },
        { label: 'Horsepower', val: '523 HP @ 6,250 RPM' },
        { label: '0-60 MPH', val: '3.4 Seconds' },
        { label: 'Top Speed', val: '180 MPH (M Driver Pkg)' },
        { label: 'Transmission', val: '8-Speed M Steptronic w/ Drivelogic' },
        { label: 'Drivetrain', val: 'M xDrive Intelligent AWD' }
      ],
      features: [
        'M Carbon Bucket Racing Seats',
        'Adaptive M Suspension damping',
        'BMW Curved Display with OS 8.5',
        'Harman Kardon Premium Surround Sound',
        'Full Carbon Fiber Roof & Trim',
        'M Drive Professional Lap Timer'
      ]
    },
    'audi-etron': {
      title: '2026 Audi RS e-tron GT Performance',
      tag: '100% ELECTRIC &bull; ALL-WHEEL DRIVE',
      price: '$147,500',
      monthly: 'Est. $2,090/mo',
      img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
      desc: 'Electric grand touring at its most thrilling pinnacle. Dual synchronous electric motors delivering instantaneous torque with lightning 800V DC fast charging.',
      specs: [
        { label: 'Powertrain', val: 'Dual Permanent Magnet Synchronous' },
        { label: 'Horsepower', val: '637 HP (Boost Mode)' },
        { label: '0-60 MPH', val: '2.9 Seconds' },
        { label: 'EPA Range', val: '249 Miles per charge' },
        { label: 'Charging Rate', val: '800V Architecture (5-80% in 22m)' },
        { label: 'Drivetrain', val: 'Electric quattro AWD' }
      ],
      features: [
        'Bang & Olufsen 3D Advanced Sound',
        'Three-Chamber Adaptive Air Suspension',
        'Tungsten Carbide-Coated Brakes',
        'Matrix-Design LED Laser Headlights',
        'Alcantara & Nappa Leather Interior',
        'All-Wheel Steering Agility'
      ]
    },
    'amg-gt': {
      title: 'Mercedes-AMG GT Black Series',
      tag: 'SUPERCAR &bull; CERTIFIED PRE-OWNED',
      price: '$325,000',
      monthly: 'Est. $4,610/mo',
      img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      desc: 'The most ferocious V8 AMG ever engineered. Handcrafted 4.0L flat-plane crankshaft Biturbo with adjustable carbon front splitter and active aero blade.',
      specs: [
        { label: 'Engine', val: 'Handcrafted 4.0L Flat-Plane V8 Biturbo' },
        { label: 'Horsepower', val: '720 HP @ 6,700 RPM' },
        { label: '0-60 MPH', val: '3.1 Seconds' },
        { label: 'Top Speed', val: '202 MPH' },
        { label: 'Mileage', val: '3,420 Certified Miles' },
        { label: 'Drivetrain', val: 'Rear-Wheel Drive (RWD)' }
      ],
      features: [
        'Carbon Fiber Two-Stage Adjustable Wing',
        'AMG Ceramic High-Performance Brakes',
        'AMG Track Pace Telemetry System',
        'Full Carbon Fiber Body Panels',
        '9-Stage AMG Traction Control Knob',
        'Exclusive Black Series Interior Stitching'
      ]
    },
    'ferrari-f8': {
      title: 'Ferrari F8 Tributo V8 Twin-Turbo',
      tag: 'EXOTIC &bull; CERTIFIED PRE-OWNED',
      price: '$368,000',
      monthly: 'Est. $5,220/mo',
      img: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
      desc: 'An homage to the most powerful V8 in Prancing Horse history. 710 horsepower, S-Duct aerodynamic nose, and zero turbo lag responsiveness.',
      specs: [
        { label: 'Engine', val: '3.9L 90-degree Twin-Turbo V8' },
        { label: 'Horsepower', val: '710 HP @ 8,000 RPM' },
        { label: '0-60 MPH', val: '2.8 Seconds' },
        { label: 'Top Speed', val: '211 MPH' },
        { label: 'Mileage', val: '1,850 Certified Miles' },
        { label: 'Color', val: 'Rosso Corsa Racing Red' }
      ],
      features: [
        'Ferrari Side Slip Angle Control (SSC 6.1)',
        'Carbon Ceramic Brembo Braking System',
        'Ferrari Dynamic Enhancer Plus (FDE+)',
        'Carbon Driver Zone with LED Shift Lights',
        'Scuderia Ferrari Fender Shields',
        'JBL Premium Hi-Fi Sound System'
      ]
    },
    'tesla-plaid': {
      title: 'Tesla Model S Plaid Tri-Motor',
      tag: 'HYPER-EV &bull; BRAND NEW 2026',
      price: '$89,990',
      monthly: 'Est. $1,275/mo',
      img: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
      desc: 'The quickest accelerating production car in the world. 1,020 HP tri-motor all-wheel drive with carbon-sleeved rotors and ultra-low 0.208 drag coefficient.',
      specs: [
        { label: 'Powertrain', val: 'Tri-Motor All-Wheel Drive' },
        { label: 'Horsepower', val: '1,020 HP' },
        { label: '0-60 MPH', val: '1.99 Seconds' },
        { label: 'Quarter Mile', val: '9.23 Seconds @ 155 MPH' },
        { label: 'Range', val: '359 Miles (EPA)' },
        { label: 'Top Speed', val: '200 MPH (with Track Pkg)' }
      ],
      features: [
        'Full Self-Driving Hardware Suite',
        '17-inch Cinematic OLED Center Display',
        '22-Speaker 960W Audio with Active Noise Canceling',
        'Heated & Ventilated Front Seats',
        'Yoke Steering Control Option',
        'Wireless Tri-Zone Smartphone Charging'
      ]
    },
    'corvette-z06': {
      title: 'Chevrolet Corvette Z06 3LZ Coupe',
      tag: 'AMERICAN EXOTIC &bull; BRAND NEW 2026',
      price: '$114,395',
      monthly: 'Est. $1,620/mo',
      img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      desc: 'The highest-horsepower naturally aspirated production V8 ever produced. Handcrafted LT6 engine singing to an astounding 8,600 RPM redline.',
      specs: [
        { label: 'Engine', val: '5.5L Flat-Plane Crank LT6 V8' },
        { label: 'Horsepower', val: '670 HP @ 8,400 RPM' },
        { label: '0-60 MPH', val: '2.6 Seconds' },
        { label: 'Redline', val: '8,600 RPM' },
        { label: 'Transmission', val: '8-Speed Dual-Clutch Tremec' },
        { label: 'Drivetrain', val: 'Mid-Engine Rear-Wheel Drive' }
      ],
      features: [
        'Magnetic Selective Ride Control 4.0',
        'Performance Data & Video Recorder (PDR)',
        '3LZ Custom Leather-Wrapped Interior',
        'Bose Performance Series 14-Speaker Audio',
        'Carbon Fiber Ground Effects Package',
        'Brembo 6-Piston Monobloc Front Brakes'
      ]
    },
    'aston-vantage': {
      title: 'Aston Martin Vantage 4.0L Twin-Turbo',
      tag: 'BRITISH LUXURY &bull; CERTIFIED PRE-OWNED',
      price: '$169,900',
      monthly: 'Est. $2,410/mo',
      img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      desc: 'Pure sculpture on wheels. Handcrafted British engineering with bespoke twin-turbo V8 muscle, rear transaxle for perfect 50:50 weight distribution.',
      specs: [
        { label: 'Engine', val: '4.0L Twin-Turbocharged V8' },
        { label: 'Horsepower', val: '503 HP @ 6,000 RPM' },
        { label: '0-60 MPH', val: '3.5 Seconds' },
        { label: 'Top Speed', val: '195 MPH' },
        { label: 'Mileage', val: '5,120 Certified Miles' },
        { label: 'Exhaust', val: 'Sport Quad-Tip Stainless System' }
      ],
      features: [
        'Electronic Rear Differential (E-Diff)',
        'Adaptive Damping System (ADS) Skyhook',
        'Caithness Luxury Leather & Alcantara',
        '360-Degree Camera Parking System',
        '20-inch Forged Diamond Turned Wheels',
        'Aston Martin Premium Audio System'
      ]
    }
  };

  // Modal Dialog Handlers
  const carModal = document.getElementById('carModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCarImg = document.getElementById('modalCarImg');
  const modalCarPrice = document.getElementById('modalCarPrice');
  const modalCarMonthly = document.getElementById('modalCarMonthly');
  const modalCarTag = document.getElementById('modalCarTag');
  const modalCarTitle = document.getElementById('modalCarTitle');
  const modalCarDesc = document.getElementById('modalCarDesc');
  const modalSpecGrid = document.getElementById('modalSpecGrid');
  const modalFeaturesList = document.getElementById('modalFeaturesList');

  function openVehicleModal(carKey) {
    const data = vehicleDatabase[carKey];
    if (!data) return;

    modalCarImg.src = data.img;
    modalCarImg.alt = data.title;
    modalCarPrice.textContent = data.price;
    modalCarMonthly.textContent = data.monthly;
    modalCarTag.innerHTML = data.tag;
    modalCarTitle.textContent = data.title;
    modalCarDesc.textContent = data.desc;

    // Populate Specs
    modalSpecGrid.innerHTML = data.specs.map(s => `
      <div class="modal-spec-item">
        <span>${s.label}</span>
        <strong>${s.val}</strong>
      </div>
    `).join('');

    // Populate Features
    modalFeaturesList.innerHTML = data.features.map(f => `
      <div class="modal-feature-item">
        <i class="fas fa-check"></i> <span>${f}</span>
      </div>
    `).join('');

    // Update Modal Action Buttons
    const modalDriveBtn = document.getElementById('modalDriveBtn');
    if (modalDriveBtn) {
      modalDriveBtn.onclick = () => {
        closeVehicleModal();
        const driveSelect = document.getElementById('driveCarSelect');
        if (driveSelect) {
          driveSelect.value = data.title;
        }
      };
    }

    carModal.classList.add('active');
    carModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVehicleModal() {
    carModal.classList.remove('active');
    carModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Hook all details & quick spec buttons
  document.querySelectorAll('.btn-card-details, .btn-quick-spec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const carKey = btn.getAttribute('data-car');
      openVehicleModal(carKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVehicleModal);
  }

  if (carModal) {
    carModal.addEventListener('click', (e) => {
      if (e.target === carModal) closeVehicleModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && carModal.classList.contains('active')) {
      closeVehicleModal();
    }
  });

  // Pre-fill Test Drive selector when clicking card "Drive" button
  document.querySelectorAll('.btn-card-testdrive').forEach(btn => {
    btn.addEventListener('click', () => {
      const carName = btn.getAttribute('data-car-name');
      const driveSelect = document.getElementById('driveCarSelect');
      if (driveSelect && carName) {
        // Find matching option
        for (let opt of driveSelect.options) {
          if (opt.value.includes(carName) || carName.includes(opt.value)) {
            driveSelect.value = opt.value;
            break;
          }
        }
      }
    });
  });

  // 6. Interactive Financing Calculator
  const calcPriceInput = document.getElementById('calcPriceInput');
  const calcPriceSlider = document.getElementById('calcPriceSlider');
  const calcDownInput = document.getElementById('calcDownInput');
  const calcDownSlider = document.getElementById('calcDownSlider');
  const calcTradeInput = document.getElementById('calcTradeInput');
  const calcTradeSlider = document.getElementById('calcTradeSlider');
  const calcAprInput = document.getElementById('calcAprInput');
  const calcAprSlider = document.getElementById('calcAprSlider');
  const termButtons = document.querySelectorAll('.btn-term');

  let currentTerm = 60; // default 60 months

  // Term selection
  termButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      termButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTerm = parseInt(btn.getAttribute('data-term'), 10);
      recalculateFinance();
    });
  });

  // Dual Sync helper (input <-> slider)
  function setupDualSync(inputElem, sliderElem) {
    inputElem.addEventListener('input', () => {
      sliderElem.value = inputElem.value;
      recalculateFinance();
    });
    sliderElem.addEventListener('input', () => {
      inputElem.value = sliderElem.value;
      recalculateFinance();
    });
  }

  setupDualSync(calcPriceInput, calcPriceSlider);
  setupDualSync(calcDownInput, calcDownSlider);
  setupDualSync(calcTradeInput, calcTradeSlider);
  setupDualSync(calcAprInput, calcAprSlider);

  function formatMoney(num) {
    return '$' + Math.round(num).toLocaleString('en-US');
  }

  function recalculateFinance() {
    const price = parseFloat(calcPriceInput.value) || 0;
    const down = parseFloat(calcDownInput.value) || 0;
    const trade = parseFloat(calcTradeInput.value) || 0;
    const apr = parseFloat(calcAprInput.value) || 0;
    const term = currentTerm;

    const totalCredits = down + trade;
    const principal = Math.max(0, price - totalCredits);

    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalOutlay = 0;

    if (principal > 0) {
      if (apr > 0) {
        const monthlyRate = (apr / 100) / 12;
        monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
        totalOutlay = monthlyPayment * term;
        totalInterest = Math.max(0, totalOutlay - principal);
      } else {
        monthlyPayment = principal / term;
        totalOutlay = principal;
        totalInterest = 0;
      }
    }

    // Update UI elements
    document.getElementById('resMonthlyPayment').textContent = Math.round(monthlyPayment).toLocaleString('en-US');
    document.getElementById('resVehiclePrice').textContent = formatMoney(price);
    document.getElementById('resTotalCredits').textContent = '-' + formatMoney(totalCredits);
    document.getElementById('resPrincipal').textContent = formatMoney(principal);
    document.getElementById('resTotalInterest').textContent = formatMoney(totalInterest);
    document.getElementById('resTotalCost').textContent = formatMoney(totalOutlay);

    // Update Progress Bars
    const barPrincipal = document.getElementById('barPrincipal');
    const barInterest = document.getElementById('barInterest');
    if (barPrincipal && barInterest) {
      const sum = principal + totalInterest;
      if (sum > 0) {
        const princPercent = (principal / sum) * 100;
        const intPercent = (totalInterest / sum) * 100;
        barPrincipal.style.width = princPercent + '%';
        barInterest.style.width = intPercent + '%';
      }
    }
  }

  // Initial Calculation
  recalculateFinance();

  // 7. Testimonials Carousel
  const tSlides = document.querySelectorAll('.t-slide');
  const tDots = document.querySelectorAll('#tDots .dot');
  const tPrevBtn = document.getElementById('tPrevBtn');
  const tNextBtn = document.getElementById('tNextBtn');
  let currentTestimonial = 0;
  let testimonialInterval = null;

  function showTestimonial(index) {
    if (index >= tSlides.length) index = 0;
    if (index < 0) index = tSlides.length - 1;
    currentTestimonial = index;

    tSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentTestimonial);
    });
    tDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentTestimonial);
    });
  }

  function startTestimonialAuto() {
    stopTestimonialAuto();
    testimonialInterval = setInterval(() => {
      showTestimonial(currentTestimonial + 1);
    }, 6000);
  }

  function stopTestimonialAuto() {
    if (testimonialInterval) clearInterval(testimonialInterval);
  }

  if (tPrevBtn && tNextBtn) {
    tPrevBtn.addEventListener('click', () => {
      showTestimonial(currentTestimonial - 1);
      startTestimonialAuto();
    });
    tNextBtn.addEventListener('click', () => {
      showTestimonial(currentTestimonial + 1);
      startTestimonialAuto();
    });
  }

  tDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showTestimonial(idx);
      startTestimonialAuto();
    });
  });

  const tWrapper = document.querySelector('.testimonials-carousel-wrapper');
  if (tWrapper) {
    tWrapper.addEventListener('mouseenter', stopTestimonialAuto);
    tWrapper.addEventListener('mouseleave', startTestimonialAuto);
  }

  startTestimonialAuto();

  // 8. Test Drive Booking Form & VIP Pass Generator
  const driveForm = document.getElementById('driveForm');
  const driveConfirmation = document.getElementById('driveConfirmation');
  const btnBookAnother = document.getElementById('btnBookAnother');

  // Set default minimum date to tomorrow
  const driveDate = document.getElementById('driveDate');
  if (driveDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    driveDate.min = tomorrow.toISOString().split('T')[0];
    driveDate.value = tomorrow.toISOString().split('T')[0];
  }

  if (driveForm) {
    driveForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Fields
      const name = document.getElementById('driveName');
      const phone = document.getElementById('drivePhone');
      const email = document.getElementById('driveEmail');
      const car = document.getElementById('driveCarSelect');
      const branch = document.getElementById('driveBranch');
      const date = document.getElementById('driveDate');
      const time = document.getElementById('driveTime');
      const license = document.getElementById('licenseCheck');

      // Clear errors
      document.querySelectorAll('.field-error').forEach(el => el.textContent = '');

      if (!name.value.trim()) {
        document.getElementById('nameError').textContent = 'Please enter your full legal name.';
        isValid = false;
      }
      if (!phone.value.trim() || phone.value.trim().length < 7) {
        document.getElementById('phoneError').textContent = 'Please provide a valid contact number.';
        isValid = false;
      }
      if (!email.value.trim() || !email.value.includes('@')) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
      }
      if (!car.value) {
        document.getElementById('carError').textContent = 'Please select a vehicle model.';
        isValid = false;
      }
      if (!date.value) {
        document.getElementById('dateError').textContent = 'Please pick a preferred reservation date.';
        isValid = false;
      }
      if (!license.checked) {
        document.getElementById('licenseError').textContent = 'You must confirm driver license eligibility.';
        isValid = false;
      }

      if (!isValid) return;

      const submitBtn = document.getElementById('btnSubmitDrive');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Securing VIP Track Slot...</span>';

      setTimeout(() => {
        // Generate random reference code
        const refCode = 'VA-' + Math.floor(100000 + Math.random() * 900000);

        document.getElementById('passDriver').textContent = name.value.trim();
        document.getElementById('passRef').textContent = refCode;
        document.getElementById('passVehicle').textContent = car.value;
        document.getElementById('passBranch').textContent = branch.value;
        document.getElementById('passSlot').textContent = `${date.value} @ ${time.value.split(':')[0]}:00`;

        driveForm.style.display = 'none';
        driveConfirmation.style.display = 'block';

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-key"></i> <span>Confirm VIP Test Drive Reservation</span>';
      }, 900);
    });
  }

  if (btnBookAnother) {
    btnBookAnother.addEventListener('click', () => {
      driveForm.reset();
      driveConfirmation.style.display = 'none';
      driveForm.style.display = 'block';
    });
  }

  // 9. Newsletter Subscription
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        const originalText = newsletterForm.innerHTML;
        newsletterForm.innerHTML = '<div style="color:var(--accent-green); font-weight:700; font-size:0.9rem;"><i class="fas fa-check-circle"></i> Welcome to the Velocity VIP Club!</div>';
        setTimeout(() => {
          newsletterForm.innerHTML = originalText;
          newsletterForm.reset();
        }, 4000);
      }
    });
  }
});
