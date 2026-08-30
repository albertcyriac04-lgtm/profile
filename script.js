// script.js - Core Portfolio Logic & Interactive Demos

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('open');
            // Toggle hamburger bars morphing
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('open')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu on nav link click
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('open');
                menuToggle.querySelectorAll('.bar').forEach(bar => bar.style.transform = 'none');
                menuToggle.querySelectorAll('.bar')[1].style.opacity = '1';
            });
        });
    }

    // -------------------------------------------------------------------------
    // 2. Light / Dark Theme Management
    // -------------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check saved local storage theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', userPrefersDark ? 'dark' : 'light');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Re-initialize particles to adapt to new theme colors
        if (typeof initParticles === 'function') {
            initParticles();
        }
    });

    // -------------------------------------------------------------------------
    // 3. Typing Subtitle Animation
    // -------------------------------------------------------------------------
    const typingText = document.getElementById('typing-text');
    const roles = [
        "Machine Learning.",
        "Generative AI.",
        "RAG Pipelines.",
        "Full-Stack Development.",
        "Data Science."
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at full word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before next word
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    if (typingText) {
        typeEffect();
    }

    // -------------------------------------------------------------------------
    // 4. Scroll Fade-in Observer
    // -------------------------------------------------------------------------
    const scrollElements = document.querySelectorAll('.scroll-fade');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.15)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check
    handleScrollAnimation();

    // -------------------------------------------------------------------------
    // 5. Neural Network / Math Grid Background Animation
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            // Collision check with screen boundaries
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            
            this.draw();
        }
    }
    
    function initParticles() {
        particlesArray = [];
        resizeCanvas();
        
        // Dynamic density based on window size
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
        const theme = htmlElement.getAttribute('data-theme');
        const particleColor = theme === 'dark' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.12)';
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1.5;
            let x = (Math.random() * ((canvas.width - size * 2) - size * 2)) + size * 2;
            let y = (Math.random() * ((canvas.height - size * 2) - size * 2)) + size * 2;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }
    
    function connectParticles() {
        let opacityValue = 1;
        const theme = htmlElement.getAttribute('data-theme');
        const maxDistance = 140;
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < maxDistance * maxDistance) {
                    opacityValue = 1 - (distance / (maxDistance * maxDistance));
                    
                    const lineColor = theme === 'dark' 
                        ? `rgba(6, 182, 212, ${opacityValue * 0.15})`
                        : `rgba(99, 102, 241, ${opacityValue * 0.08})`;
                    
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    if (canvas) {
        initParticles();
        animateParticles();
    }

    // -------------------------------------------------------------------------
    // 6. Interactive Playground Tab Switching
    // -------------------------------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active to current elements
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const panel = document.getElementById(targetId);
            if (panel) {
                panel.classList.add('active');
            }
            
            // If switched to TSP, trigger standard drawing
            if (targetId === 'tsp-tab') {
                drawTSPMap();
            }
        });
    });

    // -------------------------------------------------------------------------
    // 7. ML Crop Recommender System Simulator
    // -------------------------------------------------------------------------
    // Prototype optimal clusters (Normalized centroid profiles)
    // Dimension values: [N, P, K, Temp, Rainfall]
    const cropPrototypes = [
        {
            name: "Rice",
            emoji: "🌾",
            profile: [80, 40, 40, 27, 2200],
            minMax: [[40, 120], [20, 60], [20, 60], [20, 35], [1500, 3000]],
            desc: "Rice requires high soil nitrogen, moderate phosphorus/potassium, sustained heat, and heavy consistent rainfall. Excellent for typical Kerala monsoon periods."
        },
        {
            name: "Maize",
            emoji: "🌽",
            profile: [100, 60, 30, 24, 800],
            minMax: [[60, 140], [35, 80], [15, 50], [15, 30], [500, 1200]],
            desc: "Maize thrives in well-aerated soil rich in nitrogen and phosphorus, requiring warm days, mild nights, and moderate seasonal precipitation."
        },
        {
            name: "Cotton",
            emoji: "☁️",
            profile: [70, 50, 25, 32, 600],
            minMax: [[40, 100], [30, 70], [10, 40], [22, 40], [400, 900]],
            desc: "Cotton demands low rainfall, high sunshine, and high ambient temperature during growth, making it optimal for drier summer crop rotations."
        },
        {
            name: "Wheat",
            emoji: "🍞",
            profile: [60, 45, 35, 15, 450],
            minMax: [[30, 90], [25, 65], [15, 55], [8, 22], [300, 650]],
            desc: "Wheat is a cool-climate grain requiring moderate initial moisture, low temperature thresholds, and low annual rainfall. A major winter crop."
        },
        {
            name: "Sugarcane",
            emoji: "🎋",
            profile: [90, 30, 120, 28, 1500],
            minMax: [[50, 130], [10, 50], [80, 200], [20, 36], [1000, 2200]],
            desc: "Sugarcane is highly potassium-demanding and relies heavily on steady rainfall and warm tropical regions to synthesize sugars effectively."
        },
        {
            name: "Watermelon",
            emoji: "🍉",
            profile: [40, 30, 50, 30, 500],
            minMax: [[10, 70], [15, 50], [30, 80], [24, 38], [300, 850]],
            desc: "Watermelon prefers sandy, well-draining soils with modest organic nutrition (lower N/P) but steady warmth. Drought-tolerant once established."
        },
        {
            name: "Coffee",
            emoji: "☕",
            profile: [100, 25, 30, 22, 1800],
            minMax: [[60, 140], [10, 40], [15, 50], [16, 26], [1200, 2500]],
            desc: "Coffee crops benefit from elevated hills, rich Nitrogen levels, acidic soil matrices, cooler mountain temperatures, and reliable tropical rainfall schedules."
        }
    ];

    const sliders = {
        N: document.getElementById('nitrogen'),
        P: document.getElementById('phosphorus'),
        K: document.getElementById('potassium'),
        Temp: document.getElementById('temperature'),
        Rain: document.getElementById('rainfall')
    };

    const valDisplays = {
        N: document.getElementById('val-nitrogen'),
        P: document.getElementById('val-phosphorus'),
        K: document.getElementById('val-potassium'),
        Temp: document.getElementById('val-temperature'),
        Rain: document.getElementById('val-rainfall')
    };

    function updateCropRecommendation() {
        if (!sliders.N) return; // Exit if elements are missing

        const currentN = parseFloat(sliders.N.value);
        const currentP = parseFloat(sliders.P.value);
        const currentK = parseFloat(sliders.K.value);
        const currentTemp = parseFloat(sliders.Temp.value);
        const currentRain = parseFloat(sliders.Rain.value);

        // Update Slider Labels
        valDisplays.N.textContent = `${currentN} mg/kg`;
        valDisplays.P.textContent = `${currentP} mg/kg`;
        valDisplays.K.textContent = `${currentK} mg/kg`;
        valDisplays.Temp.textContent = `${currentTemp} °C`;
        valDisplays.Rain.textContent = `${currentRain} mm`;

        // Calculate K-Centroid Normalized Vector Match (Euclidean Distance Classifier)
        const inputs = [currentN, currentP, currentK, currentTemp, currentRain];
        
        // Define Feature Ranges for Normalization [min, max]
        const featuresRange = [
            [0, 140],     // N
            [5, 145],     // P
            [5, 205],     // K
            [8, 45],      // Temp
            [200, 3000]   // Rain
        ];

        let bestCrop = cropPrototypes[0];
        let maxSimilarity = 0;

        cropPrototypes.forEach(crop => {
            let normalizedDistanceSq = 0;
            
            // Normalized Euclidean distance calculation
            for (let i = 0; i < 5; i++) {
                const min = featuresRange[i][0];
                const max = featuresRange[i][1];
                const delta = max - min;
                
                const normInput = (inputs[i] - min) / delta;
                const normProto = (crop.profile[i] - min) / delta;
                
                normalizedDistanceSq += Math.pow(normInput - normProto, 2);
            }
            
            const distance = Math.sqrt(normalizedDistanceSq);
            // Convert distance [0 to sqrt(5) ≈ 2.23] to a percentage similarity
            const maxPossibleDist = 1.8; 
            const similarity = Math.max(0, 1 - (distance / maxPossibleDist));
            
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                bestCrop = crop;
            }
        });

        // Update UI displays
        const similarityPct = Math.round(maxSimilarity * 100);
        document.getElementById('crop-icon').textContent = bestCrop.emoji;
        document.getElementById('crop-name').textContent = bestCrop.name;
        document.getElementById('crop-confidence-fill').style.width = `${similarityPct}%`;
        document.getElementById('crop-confidence-val').textContent = `${similarityPct}% Matching Score`;
        document.getElementById('crop-desc').innerHTML = `
            <strong>Why this recommended:</strong> ${bestCrop.desc} 
            <br><span style='font-size:0.85rem; display:block; margin-top:0.5rem; opacity:0.85;'>
            <em>Optimal Vector for ${bestCrop.name}: N=${bestCrop.profile[0]}, P=${bestCrop.profile[1]}, K=${bestCrop.profile[2]}, Temp=${bestCrop.profile[3]}°C, Rain=${bestCrop.profile[4]}mm</em></span>`;
    }

    // Attach Event Listeners to Crop sliders
    Object.values(sliders).forEach(slider => {
        if (slider) {
            slider.addEventListener('input', updateCropRecommendation);
        }
    });

    // Run once at start to draw default crop recommendation
    updateCropRecommendation();

    // -------------------------------------------------------------------------
    // 8. Operations Research TSP Solver (5-Node Interactive Map)
    // -------------------------------------------------------------------------
    // Initial coordinates for 5 Cities in Kerala (scaled to 500 x 400 SVG box)
    const initialCities = [
        { id: 0, name: "Kochi", x: 90, y: 150 },
        { id: 1, name: "Munnar", x: 260, y: 70 },
        { id: 2, name: "Kottayam", x: 160, y: 240 },
        { id: 3, name: "Kuttikkanam", x: 380, y: 220 },
        { id: 4, name: "Trivandrum", x: 210, y: 340 }
    ];

    let cities = JSON.parse(JSON.stringify(initialCities));
    let isSolving = false;
    let selectedNodeIndex = null;
    
    const svg = document.getElementById('tsp-svg');
    const nodesGroup = document.getElementById('nodes-group');
    const pathsGroup = document.getElementById('paths-group');
    const shortestPathGroup = document.getElementById('shortest-path-group');
    
    // Matrix calculator (Distance Formula)
    function getDistance(c1, c2) {
        // We simulate pixels mapping to 1.5x Kilometer scale factors
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        return Math.round(Math.sqrt(dx*dx + dy*dy) * 0.7);
    }
    
    function drawTSPMap() {
        if (!svg) return;
        
        // Clear layers
        nodesGroup.innerHTML = '';
        pathsGroup.innerHTML = '';
        
        // Draw connection lines representing full coordinate grid connectivity
        for (let i = 0; i < cities.length; i++) {
            for (let j = i + 1; j < cities.length; j++) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", cities[i].x);
                line.setAttribute("y1", cities[i].y);
                line.setAttribute("x2", cities[j].x);
                line.setAttribute("y2", cities[j].y);
                line.setAttribute("class", "tsp-connection");
                pathsGroup.appendChild(line);
            }
        }
        
        // Draw Nodes
        cities.forEach((city, index) => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("class", "tsp-node");
            g.setAttribute("data-index", index);
            
            // Core outer glow
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", city.x);
            circle.setAttribute("cy", city.y);
            circle.setAttribute("r", 15);
            circle.setAttribute("class", "tsp-node-circle");
            
            // Dot inside
            const innerDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            innerDot.setAttribute("cx", city.x);
            innerDot.setAttribute("cy", city.y);
            innerDot.setAttribute("r", 4);
            innerDot.setAttribute("fill", "var(--accent-indigo)");
            
            // Label
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", city.x);
            text.setAttribute("y", city.y - 22);
            text.setAttribute("class", "tsp-node-label");
            text.textContent = city.name;
            
            g.appendChild(circle);
            g.appendChild(innerDot);
            g.appendChild(text);
            
            // Drag listeners
            g.addEventListener('mousedown', (e) => {
                if (isSolving) return;
                selectedNodeIndex = index;
                e.preventDefault();
            });
            
            nodesGroup.appendChild(g);
        });

        // Update Matrix View
        updateDistanceMatrixTable();
    }
    
    // Drag listeners on overall SVG element
    if (svg) {
        svg.addEventListener('mousemove', (e) => {
            if (selectedNodeIndex === null) return;
            
            const rect = svg.getBoundingClientRect();
            // Scale according to viewBox size (500 x 400)
            const x = ((e.clientX - rect.left) / rect.width) * 500;
            const y = ((e.clientY - rect.top) / rect.height) * 400;
            
            // Restrict bounds
            cities[selectedNodeIndex].x = Math.max(20, Math.min(480, x));
            cities[selectedNodeIndex].y = Math.max(20, Math.min(380, y));
            
            drawTSPMap();
            // Clear current solution path if they drag nodes
            shortestPathGroup.innerHTML = '';
            document.getElementById('best-distance').textContent = "- km";
            document.getElementById('optimal-path-sequence').textContent = "Positions changed. Resolve route.";
        });
        
        window.addEventListener('mouseup', () => {
            selectedNodeIndex = null;
        });
    }

    function updateDistanceMatrixTable() {
        const table = document.getElementById('dist-matrix-table');
        if (!table) return;
        
        let html = '<tr><th>City</th>';
        cities.forEach(c => {
            html += `<th>${c.name.substring(0, 4)}</th>`;
        });
        html += '</tr>';
        
        cities.forEach((c1, i) => {
            html += `<tr><th>${c1.name}</th>`;
            cities.forEach((c2, j) => {
                if (i === j) {
                    html += '<td>0</td>';
                } else {
                    html += `<td>${getDistance(c1, c2)}</td>`;
                }
            });
            html += '</tr>';
        });
        
        table.innerHTML = html;
    }

    // Solve TSP using Exhaustive Enumeration
    // Formula cyclic: Fixing index 0 (Kochi) as start node.
    // Remaining cities: [1, 2, 3, 4] -> 4! = 24 permutations.
    function getPermutations(array) {
        let res = [];
        const permute = (arr, m = []) => {
            if (arr.length === 0) {
                res.push(m);
            } else {
                for (let i = 0; i < arr.length; i++) {
                    let curr = arr.slice();
                    let next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next));
                }
            }
        };
        permute(array);
        return res;
    }

    const btnRunTSP = document.getElementById('btn-run-tsp');
    const btnResetTSP = document.getElementById('btn-reset-tsp');

    if (btnRunTSP) {
        btnRunTSP.addEventListener('click', async () => {
            if (isSolving) return;
            isSolving = true;
            btnRunTSP.disabled = true;
            btnResetTSP.disabled = true;
            btnRunTSP.textContent = "Solving...";
            shortestPathGroup.innerHTML = '';
            
            const rootNode = cities[0];
            const otherNodeIndices = [1, 2, 3, 4];
            
            // Total permutations: 24 (since start node Kochi is locked)
            const permutations = getPermutations(otherNodeIndices);
            
            let minDistance = Infinity;
            let bestPath = [];
            
            const scanCountDisplay = document.getElementById('permutations-scanned');
            
            // We animate the solving progress by drawing search sweeps
            for (let k = 0; k < permutations.length; k++) {
                const currentPerm = [0].concat(permutations[k]).concat([0]);
                
                // Draw temporary scanning overlay lines
                shortestPathGroup.innerHTML = '';
                for (let i = 0; i < currentPerm.length - 1; i++) {
                    const c1 = cities[currentPerm[i]];
                    const c2 = cities[currentPerm[i+1]];
                    
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", c1.x);
                    line.setAttribute("y1", c1.y);
                    line.setAttribute("x2", c2.x);
                    line.setAttribute("y2", c2.y);
                    line.setAttribute("class", "tsp-scanning-path");
                    shortestPathGroup.appendChild(line);
                }
                
                // Calculate distance
                let currentDist = 0;
                for (let i = 0; i < currentPerm.length - 1; i++) {
                    currentDist += getDistance(cities[currentPerm[i]], cities[currentPerm[i+1]]);
                }
                
                if (currentDist < minDistance) {
                    minDistance = currentDist;
                    bestPath = currentPerm;
                    document.getElementById('best-distance').textContent = `${minDistance} km`;
                }
                
                scanCountDisplay.textContent = `${k + 1} / 24 paths`;
                
                // Animated delay
                await new Promise(resolve => setTimeout(resolve, 80));
            }
            
            // Completed! Draw optimal glowing solid path
            shortestPathGroup.innerHTML = '';
            
            // Assemble Path points for SVG Polyline or multiple Lines
            for (let i = 0; i < bestPath.length - 1; i++) {
                const c1 = cities[bestPath[i]];
                const c2 = cities[bestPath[i+1]];
                
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", c1.x);
                line.setAttribute("y1", c1.y);
                line.setAttribute("x2", c2.x);
                line.setAttribute("y2", c2.y);
                line.setAttribute("class", "tsp-optimal-path");
                shortestPathGroup.appendChild(line);
            }
            
            // Format Output Display
            const pathNames = bestPath.map(idx => cities[idx].name).join(" ➔ ");
            document.getElementById('optimal-path-sequence').textContent = pathNames;
            
            isSolving = false;
            btnRunTSP.disabled = false;
            btnResetTSP.disabled = false;
            btnRunTSP.textContent = "Solve Route";
        });
    }

    if (btnResetTSP) {
        btnResetTSP.addEventListener('click', () => {
            if (isSolving) return;
            cities = JSON.parse(JSON.stringify(initialCities));
            shortestPathGroup.innerHTML = '';
            document.getElementById('best-distance').textContent = "- km";
            document.getElementById('permutations-scanned').textContent = "0 / 24";
            document.getElementById('optimal-path-sequence').textContent = "Click 'Solve Route'";
            drawTSPMap();
        });
    }

    // Render TSP map initially
    drawTSPMap();
});
