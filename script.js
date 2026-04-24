document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('loaded'), 300);
        });
        // Fallback
        setTimeout(() => preloader.classList.add('loaded'), 2500);
    }

    // --- Theme Management ---
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    const updateThemeIcon = (isDark) => {
        if (!themeBtn) return;
        themeBtn.innerHTML = isDark 
            ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.73 12.73l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
            : `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
    };

    if (themeBtn) {
        html.classList.toggle('dark', savedTheme === 'dark');
        updateThemeIcon(savedTheme === 'dark');

        themeBtn.onclick = () => {
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        };
    }

    // --- Navbar & Scroll Management ---
    const nav = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Active Page Highlighting
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Handle both root and subfolder relative paths
        const linkPath = linkHref.replace('../', '');
        const cleanLinkPath = linkPath.replace('.html', '');
        
        const isActive = (currentPath.includes(cleanLinkPath) && cleanLinkPath !== 'index') || 
                         (currentPath.endsWith('/') && cleanLinkPath === 'index') ||
                         (currentPath.endsWith('index.html') && cleanLinkPath === 'index');

        if (isActive) {
            link.classList.add('text-primary', 'active-nav-link', 'font-bold');
        } else {
            link.classList.remove('text-primary', 'active-nav-link', 'font-bold');
        }
    });

    window.addEventListener('scroll', () => {
        if (nav) {
            window.requestAnimationFrame(() => {
                nav.classList.toggle('scrolled', window.scrollY > 20);
            });
        }
    }, { passive: true });

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    
    const toggleMenu = (forceState) => {
        if (!mobileMenu || !hamburger) return;
        const isCurrentlyOpen = !mobileMenu.classList.contains('opacity-0');
        const isOpen = forceState !== undefined ? forceState : !isCurrentlyOpen;
        
        if (!isOpen) {
            mobileMenu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100', 'scale-100');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'scale-100');
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            
            // Focus the first link or close button after animation
            setTimeout(() => {
                const firstLink = mobileMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            }, 300);
        }
    };

    if (hamburger && mobileMenu) {
        hamburger.onclick = () => toggleMenu();
        if (closeMenuBtn) closeMenuBtn.onclick = () => toggleMenu(false);
        mobileLinks?.forEach(a => a.onclick = () => toggleMenu(false));

        // Click outside to close
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) toggleMenu(false);
        });

        // Close on ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('opacity-0')) {
                toggleMenu(false);
            }
        });

        // Focus Trap
        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = mobileMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Active Mobile Page Highlighting
    if (mobileLinks) {
        mobileLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref) return;
            const linkPath = linkHref.replace('../', '');
            const cleanLinkPath = linkPath.replace('.html', '');
            
            const isActive = (currentPath.includes(cleanLinkPath) && cleanLinkPath !== 'index') || 
                             (currentPath.endsWith('/') && cleanLinkPath === 'index') ||
                             (currentPath.endsWith('index.html') && cleanLinkPath === 'index');

            if (isActive) {
                link.classList.add('active-mobile-link');
            } else {
                link.classList.remove('active-mobile-link');
            }
        });
    }

    // --- Scroll Reveal (IntersectionObserver) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve to allow re-triggering if desired
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- Counter Animation ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = parseInt(entry.target.dataset.target);
                const suffix = entry.target.dataset.suffix || '';
                let count = 0;
                const duration = 2000;
                const increment = target / (duration / 16);
                
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        entry.target.innerText = Math.floor(count) + suffix;
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.innerText = target + suffix;
                    }
                };
                updateCount();
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX - 4 + 'px';
            cursorDot.style.top = mouseY - 4 + 'px';
        });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX - 18 + 'px';
            cursorRing.style.top = ringY - 18 + 'px';
            requestAnimationFrame(animateRing);
        };
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, input, textarea, .hover-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
        });
    }

    // --- Scroll to Top ---
    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(() => {
                scrollBtn.classList.toggle('visible', window.scrollY > 600);
            });
        }, { passive: true });
        scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-item').forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (trigger) {
            trigger.onclick = () => {
                const wasActive = item.classList.contains('active');
                // Close all others
                document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
                // Toggle current
                if (!wasActive) item.classList.add('active');
            };
        }
    });

    // --- Typed Text Effect ---
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const words = ['Bold.', 'Smart.', 'Fast.', 'Scalable.'];
        let wordIdx = 0, charIdx = 0, deleting = false;

        const type = () => {
            const currentWord = words[wordIdx];
            
            if (!deleting) {
                typedEl.textContent = currentWord.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx === currentWord.length) {
                    deleting = true;
                    setTimeout(type, 2000);
                    return;
                }
                setTimeout(type, 100);
            } else {
                typedEl.textContent = currentWord.substring(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    deleting = false;
                    wordIdx = (wordIdx + 1) % words.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, 50);
            }
        };
        setTimeout(type, 1000);
    }

    // --- Parallax on Hero Glows ---
    const heroGlows = document.querySelectorAll('.hero-glow');
    if (heroGlows.length > 0) {
        let rafId = null;
        window.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                heroGlows.forEach((glow, i) => {
                    const factor = (i + 1) * 0.8;
                    glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                });
            });
        }, { passive: true });
    }

    // --- Form Validation & Submission ---
    const form = document.getElementById('contact-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input, textarea, select');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('border-red-500');
                    isValid = false;
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            if (!isValid) return;

            const btn = form.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            btn.innerHTML = `<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Sending...`;
            btn.disabled = true;

            await new Promise(r => setTimeout(r, 1500));

            const data = new FormData(form);
            const msg = `Hi, I am ${data.get('name')}. \nCategory: ${data.get('category')}. \nMessage: ${data.get('message')}`;
            window.open(`https://wa.me/917012986540?text=${encodeURIComponent(msg)}`, '_blank');
            
            btn.innerHTML = originalContent;
            btn.disabled = false;
            form.reset();
        };
    }

    // --- Dynamic Year ---
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
});
