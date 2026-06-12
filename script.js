document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dynamic Typing Effect in Hero ---
    const typedTextSpan = document.getElementById("typed-text");
    const textArray = ["Software Developer", "UI/UX Designer", "Rotaract Service Director", "IT Specialist"];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newTextDelay = 2000; // Delay between words
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 1100);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, newTextDelay - 1000);
    }

    // --- 2. Sticky Header & Active Link Observer ---
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link dynamic highlighter
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // --- 3. Mobile Hamburger Navigation Menu ---
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navMenuLinks = document.querySelectorAll('.nav-menu .nav-link');

    mobileNavToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = mobileNavToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when link is clicked (Mobile)
    navMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // --- 4. Light / Dark Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check saved theme or fallback to system dark theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        localStorage.setItem('theme', 'dark'); // default dark
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'dark';
        if (currentTheme === 'dark') {
            newTheme = 'light';
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- 5. Skill Category Tabs ---
    const tabBtns = document.querySelectorAll('.skills-tab-btn');
    const skillContainers = document.querySelectorAll('.skills-container');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle corresponding skill container visibility
            const targetTab = btn.getAttribute('data-tab');
            skillContainers.forEach(container => {
                container.classList.remove('active');
                if (container.id === targetTab) {
                    container.classList.add('active');
                    // Animate newly selected tab progress bars
                    animateProgressBars(container);
                }
            });
        });
    });

    // Function to animate skill progress bars
    function animateProgressBars(container) {
        const progressBars = container.querySelectorAll('.skill-progress-bar');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-progress');
            bar.style.width = width;
        });
    }

    // --- 6. Projects Filtering System ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Trigger fade-in transition
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 7. Scroll-Reveal Observer (Scroll Animations) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills section, animate progress bars
                if (entry.target.id === 'skills') {
                    const activeContainer = entry.target.querySelector('.skills-container.active');
                    if (activeContainer) animateProgressBars(activeContainer);
                }
                
                // If it is the education section (contains languages progress bars)
                if (entry.target.id === 'education') {
                    const langBars = entry.target.querySelectorAll('.lang-progress-bar');
                    langBars.forEach(bar => {
                        const width = bar.getAttribute('data-progress');
                        bar.style.width = width;
                    });
                }
                
                // Stop observing once animation has run
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of section is visible
    });

    revealElements.forEach(el => revealsObserver.observe(el));

    // --- 8. Contact Form Client-side Validation & Mock Send ---
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');
            
            // Basic regex for email verification
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Clean up status element styles
            formAlert.style.display = 'none';
            formAlert.className = 'form-alert';
            
            // Front-end input validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
                showFormAlert('error', '<i class="fa-solid fa-triangle-exclamation"></i> Please fill in all fields.');
                return;
            }
            
            if (!emailPattern.test(emailInput.value.trim())) {
                showFormAlert('error', '<i class="fa-solid fa-triangle-exclamation"></i> Please enter a valid email address.');
                return;
            }
            
            // Mock submission success (Visual loading effect)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const origBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
            
            setTimeout(() => {
                showFormAlert('success', '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnText;
            }, 1800);
        });
    }

    function showFormAlert(type, message) {
        formAlert.style.display = 'block';
        formAlert.classList.add(type);
        formAlert.innerHTML = message;
    }

    // --- 9. Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 10. Update Year in Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
