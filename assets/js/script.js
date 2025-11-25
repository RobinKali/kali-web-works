document.addEventListener('DOMContentLoaded', () => {

    const body = document.body; 

    // ------------------- //
    // MOBIEL MENU LOGICA
    // ------------------- //

    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        mainNav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-label', mainNav.classList.contains('is-open') ? 'Sluit menu' : 'Open menu');
        body.classList.toggle('no-scroll'); // Voorkom scrollen als menu open is
    });

    // Sluit menu als op een link wordt geklikt
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('is-open')) {
                menuToggle.classList.remove('is-active');
                mainNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-label', 'Open menu');
                body.classList.remove('no-scroll');
            }
        });
    });

    // ------------------- //
    // TYPEWRITER EFFECT
    // ------------------- //
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) { // Voer alleen uit als het element bestaat (alleen op homepage)
        const originalText = heroTitle.textContent; // Lees de bestaande tekst
        heroTitle.textContent = ''; // Maak de H1 leeg
        let i = 0;

        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 150); // Snelheid van typen
            }
        }
        // Start de animatie met een kleine vertraging
        setTimeout(typeWriter, 500);
    }

    // ------------------- //
    // CONTACT FORMULIER MET AJAX (FETCH API)
    // ------------------- //
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Voorkom standaard formulierverzending

            const form = e.target;
            const formData = new FormData(form);

            try {
                // Verstuur data naar Formspree
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Voor Formspree API
                    }
                });

                if (response.ok) {
                    alert('Bedankt voor je bericht! Ik neem snel contact met je op!');
                    form.reset(); // Formulier resetten na succes
                } else {
                    // Verwerk foutmeldingen van Formspree
                    alert('Er is een fout opgetreden bij het versturen. Check de velden.');
                }
            } catch (error) {
                // Verwerk netwerkfouten (bijv. geen internet)
                alert('Netwerkfout! Probeer het later opnieuw.');
            }
        });
    }

    // ------------------- //
    // JAARTAL IN FOOTER
    // ------------------- //
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ------------------- //
    // COOKIE BANNER LOGICA
    // ------------------- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const refuseButton = document.getElementById('refuse-cookies');

    // Controleer of de cookie-keuze al is gemaakt
    if (cookieBanner && !localStorage.getItem('cookie_consent')) {
        // Toon de banner met een kleine vertraging als er geen keuze is gemaakt
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000); // 1 seconde vertraging
    }

    // Event listener voor de "accepteren" knop
    acceptButton?.addEventListener('click', function() {
        localStorage.setItem('cookie_consent', 'accepted');
        cookieBanner.classList.remove('show');
    });

    // Event listener voor de "weigeren" knop
    refuseButton?.addEventListener('click', function() {
        localStorage.setItem('cookie_consent', 'refused');
        cookieBanner.classList.remove('show');
    });

    // ------------------- //
    // DARK MODE LOGICA
    // ------------------- //
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Functie om dark mode aan te zetten
    const enableDarkMode = () => {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    };

    // Functie om dark mode uit te zetten
    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    };

    // Controleer de opgeslagen voorkeur van de gebruiker
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    // Event listener voor de knop
    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });


    // ------------------- //
    // SCROLL ANIMATIES
    // ------------------- //
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el, index) => {
            // Voeg een custom property toe voor de animatie-delay
            el.style.setProperty('--i', el.dataset.index || index);
            
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } 
        });
    };

    // Voer de functie uit bij het laden en bij het scrollen
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation);

    // ------------------- //
    // DIENSTEN ACCORDION
    // ------------------- //
    const skillsGrid = document.getElementById('skills-grid');
    const detailContainer = document.getElementById('service-detail-container');
    const detailTitle = document.getElementById('service-detail-title');
    const detailDescription = document.getElementById('service-detail-description');
    const backButton = document.getElementById('back-to-grid-button');

    // Dienst content
    const serviceDescriptions = {
        design: {
            title: 'UI/UX Design',
            text: 'Een krachtig design is de basis van elke succesvolle website. Wij vertalen jouw merkidentiteit naar een visueel aantrekkelijk en gebruiksvriendelijk ontwerp, geschikt voor alle apparaten!'
        },
        websites: {
            title: 'Responsieve Websites',
            text: 'Wij bouwen razendsnelle, moderne websites die perfect presteren op desktops, tablets en mobiele telefoons. Met schone, geoptimaliseerde code en de nieuwste webtechnologieën zorgen we voor een professioneel en schaalbaar eindproduct dat klaar is voor de toekomst.'
        },
        webshops: {
            title: 'E-commerce & Webshops',
            text: 'Klaar om online te verkopen? Wij ontwikkelen complete webshop-oplossingen die zijn ontworpen om te converteren. Van productbeheer en veilige betalingsgateways tot een intuïtief en veilig afrekenproces. Zo krijgt jouw klant een naadloze winkelervaring die vertrouwen wekt en de verkoop stimuleert!'
        },
        support: {
            title: 'Technisch Support',
            text: 'Voor een vast bedrag per maand zorgen wij dat jouw website veilig online blijft en helpen we je met domeinnaamverlenging, kleine wijzigingen en andere zaken, snel en makkelijk geregeld!'
        },
        hosting: {
            title: 'Webhosting',
            text: 'Een snelle en betrouwbare website begint met uitstekende hosting. Wij bieden geoptimaliseerde hostingpakketten afgestemd op de prestaties en veiligheid van jouw website. Onze hosting bied van hoge laadsnelheden, maximale uptime en de technische ondersteuning die je nodig hebt.'
        },
        beveiliging: {
            title: 'Website Beveiliging',
            text: 'In de digitale wereld is veiligheid essentieel. Van SSL-certificaten en firewalls tot regelmatige security-scans, we nemen de nodige stappen om jouw data en die van je klanten veilig te stellen en te houden.'
        },
        maatwerk: {
            title: 'Maatwerk Oplossingen',
            text: 'Heb je een uniek idee dat niet past in een standaardoplossing? Van complexe functionaliteiten en API-integraties tot volledig op maat gemaakte systemen, we denken met je mee en vertalen jouw specifieke wensen naar een functionele en schaalbare technische oplossing.'
        }
    };

    if (skillsGrid) {
        const skillItems = skillsGrid.querySelectorAll('.skill-item');

        skillItems.forEach(item => {
            item.addEventListener('click', () => {
                const serviceKey = item.dataset.service;
                const service = serviceDescriptions[serviceKey];

                // Vul de detail container
                detailTitle.textContent = service.title;
                detailDescription.textContent = service.text;

                // 1. Fade de grid uit
                skillsGrid.classList.add('fading-out');

                // 2. Wacht tot de fade-out animatie klaar is
                setTimeout(() => {
                    skillsGrid.style.display = 'none'; // Verberg de grid
                    detailContainer.style.display = 'block'; // Maak detail container klaar
                    // 3. Fade de detail container in
                    setTimeout(() => detailContainer.classList.add('visible'), 10); // Korte delay voor CSS trigger
                }, 400); // Moet overeenkomen met de transition duur in CSS
            });
        });

        backButton.addEventListener('click', () => {
            // 1. Fade de detail container uit
            detailContainer.classList.remove('visible');

            // 2. Wacht tot de fade-out animatie klaar is
            setTimeout(() => {
                detailContainer.style.display = 'none'; // Verberg de details
                skillsGrid.style.display = 'flex'; // Maak grid klaar
                // 3. Fade de grid weer in
                skillsGrid.classList.remove('fading-out');
            }, 400); // Moet overeenkomen met de transition duur in CSS
        });

        // Bugfix: Reset de view als het scherm wordt vergroot/verkleind
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && detailContainer.style.display === 'block') {
                detailContainer.classList.remove('visible');
                detailContainer.style.display = 'none';
                skillsGrid.style.display = 'flex';
                skillsGrid.classList.remove('fading-out');
            }
        });
    }

    // ------------------- //
    // CARROUSEL NAVIGATIE
    // ------------------- //
    const setupCarouselNavigation = (gridSelector, navSelector) => {
        const grid = document.querySelector(gridSelector);
        const nav = document.querySelector(navSelector);
        const items = grid.querySelectorAll('.project-card-link');

        if (!grid || !nav || items.length === 0) {
            return;
        }

        // navigatiebolletjes
        items.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('nav-dot');
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                items[index].scrollIntoView({
                    behavior: 'smooth',
                    inline: 'start',
                    block: 'nearest'
                });
            });
            nav.appendChild(dot);
        });

        const dots = nav.querySelectorAll('.nav-dot');
        if (dots.length > 0) {
            dots[0].classList.add('active'); // Eerste bolletje actief maken
        }

        // Functie om het actieve bolletje bij te werken tijdens het scrollen
        const updateActiveDot = () => {
            let mostVisibleIndex = 0;
            let maxVisibility = 0;

            items.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const gridRect = grid.getBoundingClientRect();
                const visibleWidth = Math.max(0, Math.min(rect.right, gridRect.right) - Math.max(rect.left, gridRect.left));
                const visibility = visibleWidth / item.offsetWidth;

                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    mostVisibleIndex = index;
                }
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === mostVisibleIndex);
            });
        };

        // Intersection Observer om de actieve stip bij te werken
        const observer = new IntersectionObserver(updateActiveDot, { root: grid, threshold: 0.5 });
        items.forEach(item => observer.observe(item));
    };

    // Zet de carrousels alleen op voor mobiele schermen
    if (window.innerWidth <= 768) {
        setupCarouselNavigation('.projects-section .project-grid', '#projects-nav');
        setupCarouselNavigation('.packages-section .project-grid', '#packages-nav');
    }

    // ------------------- //
    // GECOMBINEERDE SCROLL HANDLER
    // ------------------- //
    const header = document.querySelector('.site-header');
    const backToTopButton = document.getElementById('back-to-top');
    let lastScrollTop = 0;

    // Event listener voor de "Terug naar boven" knop
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Functie om de animatie-index toe te voegen aan grid-items.
    const setupAnimationIndices = () => {
        document.querySelectorAll('.project-grid .animate-on-scroll').forEach((el, i) => el.dataset.index = i);
        document.querySelectorAll('.testimonial-grid .animate-on-scroll').forEach((el, i) => el.dataset.index = i);
        document.querySelectorAll('.skills-grid .animate-on-scroll').forEach((el, i) => el.dataset.index = i);
    };

    const handleCombinedScroll = () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Voer de scroll-animatie functie uit
        handleScrollAnimation();

        // --- De rest van de scroll-logica ---

        // 1. "Terug naar boven" knop logica
        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', scrollTop > 300);
        }

        // 2. Header achtergrond/border en verbergen/tonen logica
        if (header) {
            header.classList.toggle('scrolled', scrollTop > 10);

            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                header.classList.add('header-hidden'); // Scroll Down
            } else {
                header.classList.remove('header-hidden'); // Scroll Up
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    // Voer de functie uit bij het laden en bij het scrollen (met debounce)
    if (scrollElements.length > 0 || backToTopButton || header) {
        let debounceTimer;
        // Debounce functie om te voorkomen dat de scroll-handler te vaak wordt aangeroepen
        const debounce = (func, delay) => {
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => func.apply(context, args), delay);
            };
        };

        // Voer de functie eenmalig uit bij het laden
        setupAnimationIndices();
        handleCombinedScroll();

        window.addEventListener('scroll', debounce(handleCombinedScroll, 15));
    }
});