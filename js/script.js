/**
 * Venite University - Premium JS Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader Fade Out
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.visibility = 'hidden';
      }, 500);
    });
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }
  }

  // 2. Sticky Navbar & Scroll-to-Top Visibility
  const navbar = document.querySelector('.navbar');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  window.addEventListener('scroll', () => {
    // Navbar sticky class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to Top visibility
    if (window.scrollY > 400) {
      if (scrollToTopBtn) scrollToTopBtn.classList.add('show');
    } else {
      if (scrollToTopBtn) scrollToTopBtn.classList.remove('show');
    }
  });

  // 3. Scroll to Top Action
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Active Navigation Link highlighting based on Current URL Path
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Simple check: if path contains href, mark it active
    if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath === '')))) {
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    }
  });

  // 5. Statistics Counter Animation using IntersectionObserver
  const counters = document.querySelectorAll('.counter');
  
  const startCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds animation duration
    const stepTime = 15; // update every 15ms
    const totalSteps = Math.ceil(duration / stepTime);
    let currentStep = 0;

    const incrementCounter = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      // Use ease-out quad for smoother end-phase counting
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);

      // format numbers with comma
      if (currentValue >= target) {
        counter.textContent = target.toLocaleString() + suffix;
        clearInterval(incrementCounter);
      } else {
        counter.textContent = currentValue.toLocaleString() + suffix;
      }
    }, stepTime);
  };

  const counterObserverOptions = {
    root: null,
    threshold: 0.1,
    border: '0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        startCounter(counter);
        observer.unobserve(counter); // Trigger animation once
      }
    });
  }, counterObserverOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // 6. Form Validation & Toast Feedback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-control-venite');

      inputs.forEach(input => {
        // Clear previous states
        input.classList.remove('is-invalid');
        
        const value = input.value.trim();
        const id = input.id;

        if (!value) {
          isValid = false;
          input.classList.add('is-invalid');
        } else if (id === 'email') {
          // Email format check
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            isValid = false;
            input.classList.add('is-invalid');
          }
        } else if (id === 'phone') {
          // Basic phone check (allowing +, digits, spaces, dashes)
          const phonePattern = /^[+]?[0-9\s\-]{7,15}$/;
          if (!phonePattern.test(value)) {
            isValid = false;
            input.classList.add('is-invalid');
          }
        }
      });

      if (isValid) {
        // Form is valid! Show custom Toast Notification
        showToast('Submission Successful!', 'Thank you for reaching out. A Venite admissions counselor will contact you shortly.');
        contactForm.reset();
      }
    });

    // Remove invalid style as user types or edits
    const inputs = contactForm.querySelectorAll('.form-control-venite');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
      });
    });
  }

  // 7. Newsletter Form Handling in Footer
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && input.value.trim()) {
        showToast('Subscribed!', 'Welcome to the Venite University Newsletter.');
        input.value = '';
      }
    });
  }

  // Helper to trigger Custom Styled Toast Notification
  function showToast(title, message) {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container-custom');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container-custom';
      document.body.appendChild(toastContainer);
    }

    const toastId = 'toast_' + Date.now();
    const toastHTML = `
      <div id="${toastId}" class="toast-custom">
        <div class="toast-custom-icon">
          <i class="fa-solid fa-check"></i>
        </div>
        <div class="toast-custom-content">
          <h6>${title}</h6>
          <p>${message}</p>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);

    // Fade in
    setTimeout(() => {
      toastElement.classList.add('show');
    }, 100);

    // Fade out and remove after 4 seconds
    setTimeout(() => {
      toastElement.classList.remove('show');
      setTimeout(() => {
        toastElement.remove();
      }, 400);
    }, 4000);
  }

  // 8. Custom Program/Admission Filter (Programmes Page tab animations)
  const filterTabs = document.querySelectorAll('.nav-pills-venite .nav-link');
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        // Bootstrap's native pill handling handles basic tab switching,
        // but we add a smooth transition/fade effect to content pane.
        const paneId = tab.getAttribute('data-bs-target');
        const activePane = document.querySelector(paneId);
        if (activePane) {
          activePane.style.opacity = '0';
          activePane.style.transform = 'translateY(15px)';
          setTimeout(() => {
            activePane.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            activePane.style.opacity = '1';
            activePane.style.transform = 'translateY(0)';
          }, 150);
        }
      });
    });
  }
  
  // 9. Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
});
