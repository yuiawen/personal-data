document.addEventListener('DOMContentLoaded', function() {
  let aosConfig = {
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  };
  
  if (window.innerWidth < 768) {
    aosConfig.duration = 600;
  }
  
  AOS.init(aosConfig);
  
  setupDarkModeToggle();
  setupContactForm();
  setupSmoothScroll();
  setupNavbarHighlight();
  setupCardHoverEffects();
  setupMobileOptimizations();
});

function toggleDarkMode() {
  const body = document.body;
  
  document.documentElement.style.transition = 'color 0.3s ease, background-color 0.3s ease';
  
  body.classList.toggle('dark-mode');
  
  const themeToggle = document.getElementById('themeToggle');
  if (body.classList.contains('dark-mode')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', 'disabled');
  }
  
  setTimeout(() => {
    document.documentElement.style.transition = '';
  }, 300);
}

function checkDarkMode() {
  const darkModeStatus = localStorage.getItem('darkMode');
  const themeToggle = document.getElementById('themeToggle');
  
  if (darkModeStatus === 'enabled') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

function setupDarkModeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
    
    checkDarkMode();
    
    if (!localStorage.getItem('darkMode')) {
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'enabled');
      }
    }
  }
}

function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      alert(`Terima kasih ${name}! Pesan Anda telah dikirim dan akan segera dibalas.`);
      
      contactForm.reset();
    });
  }
}

function validateForm() {
  let isValid = true;
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  
  if (name.value.trim() === '') {
    setInvalidFeedback(name, 'Silakan masukkan nama Anda');
    isValid = false;
  } else {
    removeInvalidFeedback(name);
  }
  
  if (email.value.trim() === '') {
    setInvalidFeedback(email, 'Silakan masukkan alamat email Anda');
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    setInvalidFeedback(email, 'Silakan masukkan alamat email yang valid');
    isValid = false;
  } else {
    removeInvalidFeedback(email);
  }
  
  if (subject.value.trim() === '') {
    setInvalidFeedback(subject, 'Silakan masukkan subjek pesan');
    isValid = false;
  } else {
    removeInvalidFeedback(subject);
  }
  
  if (message.value.trim() === '') {
    setInvalidFeedback(message, 'Silakan masukkan pesan Anda');
    isValid = false;
  } else {
    removeInvalidFeedback(message);
  }
  
  return isValid;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function setInvalidFeedback(input, message) {
  input.classList.add('is-invalid');
  
  let feedback = input.nextElementSibling;
  if (!feedback || !feedback.classList.contains('invalid-feedback')) {
    feedback = document.createElement('div');
    feedback.classList.add('invalid-feedback');
    input.parentNode.insertBefore(feedback, input.nextSibling);
  }
  
  feedback.textContent = message;
}

function removeInvalidFeedback(input) {
  input.classList.remove('is-invalid');
  const feedback = input.nextElementSibling;
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.textContent = '';
  }
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offset = window.innerWidth < 768 ? 60 : 70;
        
        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
        
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      }
    });
  });
}

function setupNavbarHighlight() {
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const threshold = window.innerWidth < 768 ? 70 : 100;
      
      if (pageYOffset >= (sectionTop - threshold)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      }
    }
  });
}

function setupCardHoverEffects() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
  });
}

function setupMobileOptimizations() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });
  
  if (window.innerWidth < 768) {
    document.querySelectorAll('[data-aos]').forEach(item => {
      if (item.getAttribute('data-aos-duration')) {
        const currentDuration = parseInt(item.getAttribute('data-aos-duration'));
        item.setAttribute('data-aos-duration', Math.min(currentDuration, 600).toString());
      }
      
      if (item.getAttribute('data-aos-delay')) {
        const currentDelay = parseInt(item.getAttribute('data-aos-delay'));
        if (currentDelay > 300) {
          item.setAttribute('data-aos-delay', '200');
        }
      }
    });
  }
  
  if (window.innerWidth < 576) {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
          navbar.style.padding = '0.5rem 0';
        } else {
          navbar.style.padding = '0.75rem 0';
        }
      });
    }
  }
  
  adjustFormLabelsOnMobile();
  optimizeAnimationsForDevice();
}

function adjustFormLabelsOnMobile() {
  if (window.innerWidth < 576) {
    const formFloatingLabels = document.querySelectorAll('.form-floating > label');
    formFloatingLabels.forEach(label => {
      label.style.fontSize = '0.85rem';
    });
  }
}

function optimizeAnimationsForDevice() {
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  
  if (window.innerWidth < 768 || isLowEndDevice) {
    document.querySelectorAll('.animate-float').forEach(el => {
      el.style.animationDuration = '4s';
    });
    
    if (isLowEndDevice) {
      document.querySelectorAll('.animate-pop').forEach(el => {
        el.classList.remove('animate-pop');
      });
    }
  }
}

window.addEventListener('resize', function() {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(function() {
    adjustFormLabelsOnMobile();
  }, 250);
});
