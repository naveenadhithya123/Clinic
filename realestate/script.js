/**
 * Skyline Realty - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. AOS Initialization
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

  // 2. Sticky Navbar & Scroll Spy
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header styling on scroll
    if (scrollPos > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top visibility
    if (scrollPos > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Scroll spy
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

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. Animated Stats Counter on Scroll
  const statsSection = document.getElementById('statsGrid');
  let statsCounted = false;

  function animateCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeOut;

        if (isDecimal) {
          counter.textContent = currentVal.toFixed(1);
        } else {
          counter.textContent = Math.floor(currentVal).toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsCounted) {
        statsCounted = true;
        animateCounters();
      }
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // 5. Property Search & Category Filtering
  const searchTypeBtns = document.querySelectorAll('.search-type-btn');
  const propertyCards = document.querySelectorAll('.property-card');
  let currentSearchCategory = 'all';

  searchTypeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      searchTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSearchCategory = btn.getAttribute('data-type');
      filterProperties();
    });
  });

  const propertySearchForm = document.getElementById('propertySearchForm');
  if (propertySearchForm) {
    propertySearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      filterProperties();

      const propSec = document.getElementById('properties');
      if (propSec) propSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function filterProperties() {
    const loc = document.getElementById('searchLocation').value;
    const beds = document.getElementById('searchBeds').value;

    propertyCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const cardLoc = card.getAttribute('data-location');
      const cardBeds = parseInt(card.getAttribute('data-beds'), 10);

      let matchCat = (currentSearchCategory === 'all' || cardCat === currentSearchCategory);
      let matchLoc = (loc === 'all' || cardLoc === loc);
      let matchBeds = (beds === 'all' || cardBeds >= parseInt(beds, 10));

      if (matchCat && matchLoc && matchBeds) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Wishlist buttons toggle
  document.querySelectorAll('.prop-fav-btn').forEach(btn => {
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

  // 6. Property Category Tabs (Buy / Rent / Sell)
  const catNavBtns = document.querySelectorAll('.cat-nav-btn');
  const catPanels = document.querySelectorAll('.cat-panel');

  catNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catNavBtns.forEach(b => b.classList.remove('active'));
      catPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const panel = document.getElementById(targetTab);
      if (panel) panel.classList.add('active');
    });
  });

  // 7. Property Database & Quick View Modal
  const propertyDatabase = {
    'glass-horizon': {
      title: 'The Glass Horizon Villa',
      tag: 'ARCHITECTURAL RESIDENCE &bull; BEVERLY HILLS',
      price: '$12,500,000',
      status: 'For Sale',
      address: '1420 Loma Vista Dr, Beverly Hills, CA 90210',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      desc: 'Perched in the prestigious Trousdale Estates, this architectural masterwork features frameless floor-to-ceiling glass walls, cantilevered floating staircases, and 180-degree unobstructed Los Angeles city-to-ocean vistas.',
      specs: [
        { label: 'Living Area', val: '9,450 sqft' },
        { label: 'Bedrooms', val: '6 En-Suite Suites' },
        { label: 'Bathrooms', val: '8 Full Baths' },
        { label: 'Lot Size', val: '0.85 Acres' },
        { label: 'Garage', val: '4-Car Climate Controlled' },
        { label: 'Architecture', val: 'Modern Minimalism' }
      ],
      amenities: [
        'Zero-Edge Infinity Heated Pool & Spa',
        '800-Bottle Temperature Controlled Wine Cellar',
        '12-Seat Dolby Atmos Private Cinema',
        'Wellness Spa with Steam & Cedar Sauna',
        'Smart Lutron & Crestron Home Automation',
        'Gated Motor Court with Security Station'
      ]
    },
    'sky-penthouse': {
      title: 'One Central Park Penthouse',
      tag: 'TROPHY SKY RESIDENCE &bull; MANHATTAN',
      price: '$8,950,000',
      status: 'For Sale',
      address: '220 Central Park South, Manhattan, NY 10019',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      desc: 'Floating 70 stories above Central Park, this full-floor penthouse delivers breathtaking 360-degree vistas of the iconic skyline, complete with a private 1,200 sqft wraparound cantilevered terrace.',
      specs: [
        { label: 'Interior Space', val: '5,200 sqft' },
        { label: 'Terrace', val: '1,200 sqft Wraparound' },
        { label: 'Bedrooms', val: '4 Primary Suites' },
        { label: 'Bathrooms', val: '5.5 Designer Baths' },
        { label: 'Ceiling Height', val: '14-Foot Soaring Ceilings' },
        { label: 'Elevator', val: 'Direct High-Speed Keyed Lift' }
      ],
      amenities: [
        'Private Saltwater Lap Pool in Building',
        'Private Jean-Georges Dining Room Access',
        'Calacatta Marble Slab Chef Kitchen',
        'Automated Motorized Solar Shades',
        '24/7 White-Glove Concierge & Valet',
        'Private Wine Locker & Storage Suite'
      ]
    },
    'villa-bellissima': {
      title: 'Villa Bellissima Waterfront Estate',
      tag: 'OCEANFRONT COMPOUND &bull; MIAMI BEACH',
      price: '$14,800,000',
      status: 'For Sale',
      address: '4400 Pine Tree Dr, Miami Beach, FL 33140',
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      desc: 'A tropical modern oasis boasting 120 feet of pristine deepwater frontage on Indian Creek Canal, equipped with a brand-new 100ft private yacht slip, outdoor summer kitchen, and lush manicured palm grounds.',
      specs: [
        { label: 'Living Space', val: '8,100 sqft' },
        { label: 'Water Frontage', val: '120 Linear Feet' },
        { label: 'Bedrooms', val: '5 King Bedrooms' },
        { label: 'Bathrooms', val: '7 Baths' },
        { label: 'Yacht Dock', val: '100ft Deepwater Slip' },
        { label: 'Rooftop', val: '3,000 sqft Sky Lounge' }
      ],
      amenities: [
        'Resort-Style Saltwater Pool & Cabanas',
        'Outdoor Teppanyaki Summer Kitchen',
        'Master Suite with Dual Onyx Bathrooms',
        'Custom Boffi Italian Designer Kitchen',
        'Direct Ocean Access with No Fixed Bridges',
        'Integrated Perimeter Biometric Security'
      ]
    },
    'malibu-cove': {
      title: 'Malibu Cove Modern Retreat',
      tag: 'LUXURY LEASE &bull; BROAD BEACH',
      price: '$45,000 / mo',
      status: 'For Rent',
      address: '31200 Broad Beach Rd, Malibu, CA 90265',
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      desc: 'Step directly onto the sand from this mid-century modern architectural marvel. Fully furnished by Christian Liaigre with custom teak decks, private stairs to the tidepools, and dramatic ocean panoramas.',
      specs: [
        { label: 'Living Space', val: '4,800 sqft' },
        { label: 'Bedrooms', val: '4 Oceanfront Suites' },
        { label: 'Bathrooms', val: '5 Baths' },
        { label: 'Lease Term', val: '12 Months / Seasonal' },
        { label: 'Furnishing', val: 'Designer White-Glove Furnished' },
        { label: 'Beach Access', val: 'Direct Gated Boardwalk' }
      ],
      amenities: [
        'Oceanfront Hot Tub on Sunset Deck',
        'Custom Surfboard Storage & Outdoor Shower',
        'Commercial Gaggenau Cooking Appliances',
        'Tesla High-Speed Charging Station',
        'Weekly Housekeeping & Pool Service Included',
        'Private Gated Security Entry'
      ]
    },
    'aspen-lodge': {
      title: 'Red Mountain Alpine Lodge',
      tag: 'SKI CHALET &bull; ASPEN RED MOUNTAIN',
      price: '$18,200,000',
      status: 'For Sale',
      address: '720 Willoughby Way, Aspen, CO 81611',
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      desc: 'Set high on Aspen Billionaire Mountain, this architectural stone and timber sanctuary features direct private ski access, towering cathedral timber ceilings, and views across the Roaring Fork Valley.',
      specs: [
        { label: 'Total Area', val: '11,200 sqft' },
        { label: 'Bedrooms', val: '6 Guest Suites + Bunk Room' },
        { label: 'Bathrooms', val: '8 Baths' },
        { label: 'Lot Size', val: '2.4 Alpine Acres' },
        { label: 'Ski Access', val: 'Direct Ski-In / Ski-Out' },
        { label: 'Fireplaces', val: '5 Custom Hand-Carved Stone' }
      ],
      amenities: [
        'Heated Driveway & Ski Equipment Locker Room',
        'Outdoor Grotto Hot Springs Jacuzzi',
        'Indoor Heated Hydrotherapy Pool',
        'Private Mountain Biking & Hiking Trails',
        'Full Guest Caretaker Cottage',
        'Commercial Oxygen-Enriched Bedroom System'
      ]
    },
    'tribeca-loft': {
      title: 'Tribeca Cast-Iron Artist Loft',
      tag: 'FURNISHED LEASE &bull; TRIBECA HISTORIC',
      price: '$28,000 / mo',
      status: 'For Rent',
      address: '114 Franklin St, Tribeca, NY 10013',
      img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      desc: 'Authentic architectural cast-iron loft with original Corinthian columns, exposed brick walls, and museum-grade gallery lighting. Perfectly curated for international art collectors and executives.',
      specs: [
        { label: 'Interior Space', val: '3,600 sqft' },
        { label: 'Bedrooms', val: '3 Bedrooms + Study' },
        { label: 'Bathrooms', val: '3 Baths' },
        { label: 'Ceilings', val: '13-Foot Original Wood Beams' },
        { label: 'Elevator', val: 'Direct Keyed Passenger Lift' },
        { label: 'Lease Term', val: 'Flexible 6-24 Months' }
      ],
      amenities: [
        'Sub-Zero & Wolf Commercial Kitchen',
        'Custom Soundproof Acoustic Insulation',
        'Primary Bath with Freestanding Soaking Tub',
        'Full Smart-Home Creston Integration',
        'Private Freight Elevator Access',
        'Historic Landmark Building Concierge'
      ]
    }
  };

  const propModal = document.getElementById('propModal');
  const modalClose = document.getElementById('modalClose');
  const mPropImg = document.getElementById('mPropImg');
  const mPropPrice = document.getElementById('mPropPrice');
  const mPropStatus = document.getElementById('mPropStatus');
  const mPropTag = document.getElementById('mPropTag');
  const mPropTitle = document.getElementById('mPropTitle');
  const mPropAddress = document.getElementById('mPropAddress');
  const mPropDesc = document.getElementById('mPropDesc');
  const mSpecsGrid = document.getElementById('mSpecsGrid');
  const mAmenitiesGrid = document.getElementById('mAmenitiesGrid');

  function openPropertyModal(propKey) {
    const data = propertyDatabase[propKey];
    if (!data) return;

    mPropImg.src = data.img;
    mPropImg.alt = data.title;
    mPropPrice.textContent = data.price;
    mPropStatus.textContent = data.status;
    mPropTag.innerHTML = data.tag;
    mPropTitle.textContent = data.title;
    mPropAddress.innerHTML = `<i class="fas fa-location-dot"></i> ${data.address}`;
    mPropDesc.textContent = data.desc;

    mSpecsGrid.innerHTML = data.specs.map(s => `
      <div class="m-spec-box">
        <span>${s.label}</span>
        <strong>${s.val}</strong>
      </div>
    `).join('');

    mAmenitiesGrid.innerHTML = data.amenities.map(a => `
      <div class="m-amenity-item">
        <i class="fas fa-check"></i> <span>${a}</span>
      </div>
    `).join('');

    const mBookTourBtn = document.getElementById('mBookTourBtn');
    if (mBookTourBtn) {
      mBookTourBtn.onclick = () => {
        closePropertyModal();
        const propSelect = document.getElementById('propertyInterest');
        if (propSelect) {
          for (let opt of propSelect.options) {
            if (opt.value.includes(data.title) || data.title.includes(opt.value)) {
              propSelect.value = opt.value;
              break;
            }
          }
        }
      };
    }

    propModal.classList.add('active');
    propModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePropertyModal() {
    propModal.classList.remove('active');
    propModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-view-details, .btn-quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const propKey = btn.getAttribute('data-prop');
      openPropertyModal(propKey);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closePropertyModal);
  }
  if (propModal) {
    propModal.addEventListener('click', (e) => {
      if (e.target === propModal) closePropertyModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && propModal.classList.contains('active')) {
      closePropertyModal();
    }
  });

  // Pre-fill Tour Booking form when clicking card "Tour" button
  document.querySelectorAll('.btn-book-tour').forEach(btn => {
    btn.addEventListener('click', () => {
      const propName = btn.getAttribute('data-prop-name');
      const propSelect = document.getElementById('propertyInterest');
      if (propSelect && propName) {
        for (let opt of propSelect.options) {
          if (opt.value.includes(propName) || propName.includes(opt.value)) {
            propSelect.value = opt.value;
            break;
          }
        }
      }
    });
  });

  // 8. Testimonials Slider
  const tSlides = document.querySelectorAll('.t-slide');
  const tDots = document.querySelectorAll('#tDots .t-dot');
  const tPrev = document.getElementById('tPrev');
  const tNext = document.getElementById('tNext');
  let currentSlide = 0;
  let slideTimer = null;

  function setTestimonialSlide(idx) {
    if (idx >= tSlides.length) idx = 0;
    if (idx < 0) idx = tSlides.length - 1;
    currentSlide = idx;

    tSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });
    tDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startTestimonials() {
    stopTestimonials();
    slideTimer = setInterval(() => {
      setTestimonialSlide(currentSlide + 1);
    }, 6000);
  }

  function stopTestimonials() {
    if (slideTimer) clearInterval(slideTimer);
  }

  if (tPrev && tNext) {
    tPrev.addEventListener('click', () => {
      setTestimonialSlide(currentSlide - 1);
      startTestimonials();
    });
    tNext.addEventListener('click', () => {
      setTestimonialSlide(currentSlide + 1);
      startTestimonials();
    });
  }

  tDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.getAttribute('data-index'), 10);
      setTestimonialSlide(i);
      startTestimonials();
    });
  });

  const tWrapper = document.querySelector('.t-slider-wrapper');
  if (tWrapper) {
    tWrapper.addEventListener('mouseenter', stopTestimonials);
    tWrapper.addEventListener('mouseleave', startTestimonials);
  }

  startTestimonials();

  // 9. Private Tour Booking Form Validation & Reservation Pass
  const tourForm = document.getElementById('tourBookingForm');
  const tourConfirmation = document.getElementById('tourConfirmation');
  const btnResetTour = document.getElementById('btnResetTour');

  const tourDateInput = document.getElementById('tourDate');
  if (tourDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tourDateInput.min = tomorrow.toISOString().split('T')[0];
    tourDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  if (tourForm) {
    tourForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const name = document.getElementById('clientName');
      const phone = document.getElementById('clientPhone');
      const email = document.getElementById('clientEmail');
      const prop = document.getElementById('propertyInterest');
      const date = document.getElementById('tourDate');
      const time = document.getElementById('tourTime');

      document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

      if (!name.value.trim()) {
        document.getElementById('nameErr').textContent = 'Please enter your full name.';
        valid = false;
      }
      if (!phone.value.trim() || phone.value.trim().length < 7) {
        document.getElementById('phoneErr').textContent = 'Please enter a valid phone number.';
        valid = false;
      }
      if (!email.value.trim() || !email.value.includes('@')) {
        document.getElementById('emailErr').textContent = 'Please enter a valid email address.';
        valid = false;
      }
      if (!prop.value) {
        document.getElementById('propErr').textContent = 'Please select a property or consultation type.';
        valid = false;
      }
      if (!date.value) {
        document.getElementById('dateErr').textContent = 'Please choose a viewing date.';
        valid = false;
      }

      if (!valid) return;

      const btnSubmit = document.getElementById('btnSubmitTour');
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Scheduling Private Escort...</span>';

      setTimeout(() => {
        const passId = 'SKY-' + Math.floor(100000 + Math.random() * 900000);

        document.getElementById('confGuest').textContent = name.value.trim();
        document.getElementById('confPassId').textContent = passId;
        document.getElementById('confProp').textContent = prop.value;
        document.getElementById('confTime').textContent = `${date.value} @ ${time.value.split('-')[0].trim()}`;

        tourForm.style.display = 'none';
        tourConfirmation.style.display = 'block';

        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fas fa-calendar-check"></i> <span>Confirm Private Tour Request</span>';
      }, 900);
    });
  }

  if (btnResetTour) {
    btnResetTour.addEventListener('click', () => {
      tourForm.reset();
      tourConfirmation.style.display = 'none';
      tourForm.style.display = 'block';
    });
  }

  // 10. Newsletter Form
  const footerNewsletter = document.getElementById('footerNewsletter');
  if (footerNewsletter) {
    footerNewsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = footerNewsletter.querySelector('input');
      if (input && input.value) {
        const origHTML = footerNewsletter.innerHTML;
        footerNewsletter.innerHTML = '<div style="color:#34d399; font-weight:700; font-size:0.88rem;"><i class="fas fa-check-circle"></i> Confidential dossier dispatched to your inbox.</div>';
        setTimeout(() => {
          footerNewsletter.innerHTML = origHTML;
          footerNewsletter.reset();
        }, 4000);
      }
    });
  }
});
