document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero');
    const bgContainer = document.getElementById('dynamic-bg-container');

    if (!heroSection || !bgContainer) {
        return; // Stop als de benodigde elementen niet bestaan
    }

    const codeSnippets = [
        '<>', '{}', '=>', '()', 'let', 'var', 'css', 'div',
        'flex', 'grid', 'nav', 'html', '()=>', 'px', 'rem', 'em',
        'git', 'node', 'scss', 'js', 'const', 'null', 'true', 'false',
        ':', ';', 'fn()', 'body', 'head', 'link', 'span', 'class',
        'import', 'export', 'async', 'await', 'json', 'api', 'font',
        'color', 'margin', 'padding', 'react', 'vue', 'solid'
    ];

    const numSnippets = 150; // Aantal elementen in het raster

    // Genereer de code snippets
    for (let i = 0; i < numSnippets; i++) {
        const snippetEl = document.createElement('span');
        snippetEl.classList.add('code-snippet');
        snippetEl.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        snippetEl.style.left = `${Math.random() * 100}%`;
        snippetEl.style.top = `${Math.random() * 100}%`;
        snippetEl.dataset.depth = Math.random() * 0.4 + 0.1; // Diepte voor parallax (0.1 tot 0.5)
        bgContainer.appendChild(snippetEl);
    }

    // Converteer naar een array en sla de initiële posities op om reflow te voorkomen
    const allSnippets = Array.from(bgContainer.querySelectorAll('.code-snippet')).map(snippet => {
        const rect = snippet.getBoundingClientRect();
        return {
            el: snippet,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            randomAngle: Math.random() * 2 * Math.PI,
            randomRotationDir: Math.random() > 0.5 ? 1 : -1 // Willekeurige rotatierichting
        };
    });

    // Detecteer of het een touch device is
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (isMobile) {
        // --- MOBIEL: GYROSCOOP & RANDOM HIGHLIGHTS ---

        const startGyroscope = () => {
            // Controleer of de pagina in een beveiligde context (HTTPS) draait.
            if (window.isSecureContext === false) {
                console.warn('Gyroscoop-effect is uitgeschakeld. De DeviceOrientationEvent API vereist een beveiligde context (HTTPS).');
                return;
            }

            // Specifiek voor iOS 13+ is een expliciete toestemmingsvraag nodig.
            if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            console.warn('Toestemming voor gyroscoop niet gegeven.');
                        }
                    })
                    .catch(console.error);
            } else {
                // Voor Android en oudere browsers die geen expliciete toestemming vragen.
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        // Start de gyroscoop-functionaliteit na een gebruikersinteractie (klik/tik).
        heroSection.addEventListener('click', startGyroscope, { once: true });

        // De functie die de oriëntatie verwerkt
        function handleOrientation(event) {
            // gamma: left-to-right tilt (-90 to 90)
            // beta: front-to-back tilt (-180 to 180)
            const moveX = event.gamma / 45; // Normaliseer de tilt
            const moveY = event.beta / 90;

            allSnippets.forEach(snippetObj => {
                const depth = snippetObj.el.dataset.depth;
                const translateX = -moveX * (depth * 20); // Iets subtielere beweging
                const translateY = -moveY * (depth * 20);
                snippetObj.el.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        }

        // Willekeurig highlighten van snippets
        setInterval(() => {
            // Verwijder eerst alle highlights
            allSnippets.forEach(s => s.el.classList.remove('highlight'));

            // Voeg highlight toe aan een paar willekeurige snippets
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * allSnippets.length);
                allSnippets[randomIndex].el.classList.add('highlight');
            }
        }, 2000); // Verander elke 2 seconden

    } else {
        // --- DESKTOP: MUIS-INTERACTIE ---
        const movementStrength = 6575; // VERHOOGD: Hoe ver de elementen bewegen.
        const smoothingFactor = 0.15; // VERHOOGD: Hoe snel de elementen reageren (hoger = sneller).

        // Doelposities voor de muis (genormaliseerd, -0.5 tot 0.5)
        let targetX = 0;
        let targetY = 0;

        // Huidige posities voor de animatie-loop
        let currentX = 0;
        let currentY = 0;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            // Bereken muispositie als een waarde tussen -0.5 en 0.5
            targetX = (e.clientX - rect.left) / rect.width - 0.5;
            targetY = (e.clientY - rect.top) / rect.height - 0.5;
        });

        heroSection.addEventListener('mouseleave', () => {
            // Wanneer de muis weggaat, moet het effect terug naar het midden.
            targetX = 0;
            targetY = 0;
        });

        const animate = () => {
            // Beweeg de huidige positie geleidelijk naar de doelpositie
            currentX += (targetX - currentX) * smoothingFactor;
            currentY += (targetY - currentY) * smoothingFactor;

            allSnippets.forEach(snippetObj => {
                const depth = snippetObj.el.dataset.depth;
                // De verplaatsing is negatief omdat we een parallax-effect willen
                const moveX = -currentX * movementStrength * depth;
                const moveY = -currentY * movementStrength * depth;

                snippetObj.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            requestAnimationFrame(animate);
        };

        // Start de animatie-loop
        animate();
    }
});