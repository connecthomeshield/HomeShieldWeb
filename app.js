document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. MULTI-COLOR THEME MANAGER
    // ==========================================
    const desktopSwatches = document.querySelectorAll('#theme-selector-desktop button');
    const mobileButtons = document.querySelectorAll('#theme-selector-mobile button');
    const themesList = ['showroom', 'navy', 'orange', 'teal'];

    const themeMetaData = {
        showroom: { name: "Showroom", bg: "#f8fafc", border: "#e2a83a" },
        navy: { name: "Navy Dark", bg: "#050e1e", border: "#e2a83a" },
        orange: { name: "Orange Warm", bg: "#fffbf7", border: "#ea580c" },
        teal: { name: "Teal Crystalline", bg: "#f5fffd", border: "#06b6d4" }
    };

    const applyAppTheme = (theme) => {
        if (!themesList.includes(theme)) theme = 'showroom';

        // 1. Swap classes on HTML root element
        themesList.forEach(t => {
            document.documentElement.classList.remove(`theme-${t}`);
        });
        document.documentElement.classList.add(`theme-${theme}`);

        // 2. Update Active theme trigger details in top bar
        const activeThemeDot = document.getElementById('active-theme-dot');
        const activeThemeText = document.getElementById('active-theme-text');
        if (activeThemeDot && activeThemeText && themeMetaData[theme]) {
            activeThemeDot.style.backgroundColor = themeMetaData[theme].bg;
            activeThemeDot.style.borderColor = themeMetaData[theme].border;
            activeThemeText.textContent = themeMetaData[theme].name;
        }

        // 3. Update Desktop Selector Swatches (hide active one, show inactive ones in the dropdown)
        desktopSwatches.forEach(btn => {
            const btnTheme = btn.getAttribute('data-theme');
            if (btnTheme === theme) {
                btn.classList.add('hidden');
            } else {
                btn.classList.remove('hidden');
            }
        });

        // 4. Update Mobile Buttons active states
        mobileButtons.forEach(btn => {
            const btnTheme = btn.getAttribute('data-theme');
            if (btnTheme === theme) {
                btn.className = "flex-1 py-2 text-xs font-black bg-themeAccent text-themeBgAlt rounded-lg shadow-md transition-all";
            } else {
                btn.className = "flex-1 py-2 text-xs font-bold bg-themeBg text-themeTextMuted border border-themeBorder rounded-lg transition-all";
            }
        });
    };

    // Read stored theme preference, DEFAULT to Showroom light theme
    const activeAppTheme = localStorage.getItem('homeshield_app_theme') || 'showroom';
    applyAppTheme(activeAppTheme);

    // Attach Click Event listeners
    desktopSwatches.forEach(dot => {
        dot.addEventListener('click', () => {
            const selected = dot.getAttribute('data-theme');
            applyAppTheme(selected);
            localStorage.setItem('homeshield_app_theme', selected);
        });
    });

    mobileButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.getAttribute('data-theme');
            applyAppTheme(selected);
            localStorage.setItem('homeshield_app_theme', selected);
        });
    });

    // ==========================================
    // 1. MOBILE MENU TOGGLER
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });


    // ==========================================
    // 2. BEFORE/AFTER IMAGE WATERPROOFING SLIDER
    // ==========================================
    const sliderContainer = document.querySelector('.slider-container');
    const beforeImage = document.querySelector('.before-image');
    const sliderHandle = document.getElementById('slider-drag-handle');

    if (sliderContainer && beforeImage && sliderHandle) {
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            const x = clientX - rect.left;
            let percentage = (x / rect.width) * 100;

            // Constrain between 0% and 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            // Apply clip path to before image (left side is before)
            beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            // Move handle
            sliderHandle.style.left = `${percentage}%`;
        };

        // Initialize slider at 50%
        beforeImage.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
        sliderHandle.style.left = '50%';

        // Mouse Events
        sliderContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        // Touch Events (Mobile)
        sliderContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        });
    }


    // ==========================================
    // 3. PRODUCT SHOWCASE DATA & INTERACTIVE MODAL
    // ==========================================
    const productModal = document.getElementById('product-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDynamicContent = document.getElementById('modal-dynamic-content');

    const productsData = {
        emulsion: {
            title: "Home Shield Premium Emulsion",
            category: "Premium Interior & Exterior Wall Protection",
            tagline: "Highly durable paint offering ultimate protection, stain resistance, and vibrant gloss.",
            image: "./WhatsApp Image 2026-05-25 at 10.27.00 PM.jpeg",
            colorClass: "from-gold-600 to-amber-700",
            features: [
                "**Anti-Fungal Protection:** Specially formulated to inhibit black mold, algae, and fungal growth.",
                "**Washable & Easy to Clean:** 100% acrylic binder enables easy washing of grease, dust, pencil, and spills.",
                "**Rich Matt Finish:** Luxury reflection texture that hides plaster/wall minor imperfections beautifully.",
                "**Low VOC & Odorless:** Safe indoor air quality, eco-friendly, and zero chemical harsh odors.",
                "**HD Colours:** High definition color formulation for ultimate color retention and brightness."
            ],
            specs: {
                "Pack Sizes": "1 Litre, 4 Litres, 10 Litres, 20 Litres",
                "Coverage": "120 - 140 Sq. Ft. per Litre (for 1 coat on smooth wall)",
                "Thinning Ratio": "Add 500ml - 750ml of clean water to 1 Litre Emulsion",
                "Drying Interval": "4 - 6 hours between successive coats",
                "Recommended Coats": "2 to 3 Coats for long-lasting performance"
            },
            directions: [
                "**1. Surface Scraped:** Sand the masonry wall thoroughly using emery paper 180 to scrape off peeling paint, dust, or grease.",
                "**2. Anchoring Basecoat:** Apply a single coat of Home Shield Wall Primer (thinned 1:1 by volume with water). Dry for 6-8 hours.",
                "**3. Acrylic Putty:** Fill wall dents and surface pores using Home Shield Acrylic Putty. Dry for 4-6 hours, sand with emery paper 180 and wipe clean.",
                "**4. Intermediate Sealing:** Apply a second sealing coat of Home Shield Wall Primer. Dry for 6-8 hours. Sand lightly with emery paper 320.",
                "**5. Topcoat Emulsion:** Dilute Emulsion with 500-750ml water per Litre. Apply 2-3 coats of Premium Emulsion using a brush, roller, or spray, leaving 4-6 hours between coats."
            ]
        },
        primer: {
            title: "Home Shield Wall Primer",
            category: "High-Performance Interior & Exterior Basecoat",
            tagline: "Superior adhesion primer that blocks dampness and anchors paint for double the lifetime durability.",
            image: "./Home SHEILD primer.jpg.jpeg",
            colorClass: "from-orange-600 to-red-700",
            features: [
                "**Superior Adhesion:** Penetrates deeply into wall cement to anchor topcoats strongly and prevent peeling.",
                "**Water Thinnable:** Easy dilution in 1:1 ratio by volume for optimal consistency and high flow.",
                "**Maximum Coverage:** Spreads evenly to cover large masonry surfaces, saving topcoat expenses.",
                "**Perfect Bonding Shield:** Seals concrete pores, blocking moisture and preventing pH paint saponification."
            ],
            specs: {
                "Pack Sizes": "2 Litres, 5 Litres, 10 Litres, 20 Litres",
                "Coverage": "100 - 120 Sq. Ft. per Litre (on primed or smooth plaster)",
                "Thinning Ratio": "Dilute 1:1 by volume with clean water",
                "Drying Interval": "6 - 8 hours before applying putty or topcoat",
                "Recommended Coats": "2 Coats (1st before putty, 2nd after putty)"
            },
            directions: [
                "**1. Wall Sanding:** Clean the plaster surface using emery paper 180 to clear away dust, sand particles, grease, or previous loose coats.",
                "**2. First Sealcoat:** Apply one coat of Home Shield Wall Primer thinned with water (1:1 ratio). Ensure uniform coverage and allow to dry for 6-8 hours.",
                "**3. Smoothening:** Smoothen wall surface by filling dents with thin coats of acrylic wall putty. Dry for 4-6 hours and sand flat with emery paper 180.",
                "**4. Final Primer Base:** Apply the second coat of Wall Primer to lock the absorbent putty layer. Allow 6-8 hours of curing time. Sand with emery paper 320 before topcoating."
            ]
        },
        distemper: {
            title: "Home Shield Acrylic Distemper",
            category: "Water-Thinnable Economical Interior Coating",
            tagline: "Super bright washable paint providing an elegant, smooth, and highly budget-friendly wall finish.",
            image: "./home shield distemper.jpg.jpeg",
            colorClass: "from-teal-600 to-cyan-700",
            features: [
                "**Superior Brightness:** Custom bright white formula reflects light widely, brightening rooms with low lighting.",
                "**Easy Washability:** Modern polymer formulation allows wiping off minor spots easily.",
                "**Smooth Aesthetic Finish:** Rich matt texture that gives your walls a clean premium distemper look.",
                "**Highly Economical:** Premium luxury look at a highly competitive, budget-friendly wholesale price point."
            ],
            specs: {
                "Pack Sizes": "5 Kilograms, 10 Kilograms, 20 Kilograms",
                "Coverage": "70 - 80 Sq. Ft. per Kilogram per coat",
                "Thinning Ratio": "Add 600ml - 700ml of clean water to 1 KG Distemper",
                "Drying Interval": "6 - 8 hours. Allow drying overnight for best cure",
                "MRP (20kg)": "₹1,065/- (Highly cost-efficient)"
            },
            directions: [
                "**1. Pre-Cleaning:** Scrape off previous coatings, dirt, dust or fungi. Sand using emery paper 180 and clean off all debris.",
                "**2. Anchor Primer:** Paint a single coat of Home Shield Wall Primer and let dry for 6-8 hours.",
                "**3. Acrylic Putty:** Patch up dents and hairline fractures with Home Shield Wall Putty. Allow 4-6 hours drying, sand with emery paper 180.",
                "**4. Undercoat Primer:** Apply the second coat of Wall Primer and let dry for 6-8 hours. Sand gently with emery paper 320.",
                "**5. Topcoat Distemper:** Dilute 1KG Distemper with 600-700ml water. Apply two coats of Acrylic Distemper with a brush or roller, drying 6-8 hours between coats."
            ]
        }
    };

    // Open Modal
    document.querySelectorAll('[data-product]').forEach(card => {
        const btn = card.querySelector('.open-modal-btn');
        const productKey = card.getAttribute('data-product');

        if (btn && productKey && productsData[productKey]) {
            btn.addEventListener('click', () => {
                const product = productsData[productKey];

                // Build Features HTML
                let featuresHtml = '';
                product.features.forEach(f => {
                    const formatted = f.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    featuresHtml += `<li class="flex items-start space-x-3 text-themeText text-sm">
                        <svg class="w-5 h-5 text-themeAccent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                        <span>${formatted}</span>
                    </li>`;
                });

                // Build Specs HTML
                let specsHtml = '';
                for (const [key, val] of Object.entries(product.specs)) {
                    specsHtml += `<div class="flex justify-between items-center py-2.5 border-b border-themeBorder">
                        <span class="text-xs text-themeTextMuted font-bold uppercase tracking-wider">${key}</span>
                        <span class="text-xs font-bold text-themeText text-right">${val}</span>
                    </div>`;
                }

                // Build Directions HTML
                let directionsHtml = '';
                product.directions.forEach(step => {
                    const formatted = step.replace(/\*\*(.*?)\*\*/g, '<strong class="text-themeAccent">$1</strong>');
                    directionsHtml += `<div class="bg-themeBgAlt p-4 rounded-xl border border-themeBorder space-y-1">
                        <p class="text-xs text-themeText font-medium leading-relaxed">${formatted}</p>
                    </div>`;
                });

                // Build Full Modal Content HTML
                modalDynamicContent.innerHTML = `
                    <!-- Left: Product Image & Spec Details -->
                    <div class="md:col-span-5 space-y-6">
                        <div class="relative rounded-2xl overflow-hidden bg-themeBg border border-themeBorder aspect-square">
                            <div class="absolute inset-0 bg-themeBorder animate-pulse z-0 skeleton-bg"></div>
                            <img src="${product.image}" alt="${product.title}" onload="hideSkeleton(this)" loading="lazy" decoding="async" class="relative z-10 w-full h-full object-cover will-change-transform">
                            <div class="absolute inset-0 bg-gradient-to-t from-themeBg via-transparent to-transparent pointer-events-none z-20"></div>
                        </div>
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold uppercase tracking-widest text-themeTextMuted">Product Specifications</h4>
                            <div class="bg-themeBgAlt p-4 rounded-2xl border border-themeBorder">
                                ${specsHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Right: Product Description, Features & Directions -->
                    <div class="md:col-span-7 space-y-6">
                        <div class="space-y-2">
                            <span class="text-xs text-themeAccent font-extrabold uppercase tracking-widest">${product.category}</span>
                            <h3 class="text-3xl font-extrabold text-themeText">${product.title}</h3>
                            <p class="text-sm text-themeTextMuted font-medium italic">${product.tagline}</p>
                        </div>

                        <!-- Core Features List -->
                        <div class="space-y-3">
                            <h4 class="text-xs font-bold uppercase tracking-widest text-themeTextMuted">Key Features</h4>
                            <ul class="space-y-3 bg-themeBgAlt p-6 rounded-2xl border border-themeBorder">
                                ${featuresHtml}
                            </ul>
                        </div>

                        <!-- Directions Checklist -->
                        <div class="space-y-3">
                            <h4 class="text-xs font-bold uppercase tracking-widest text-themeTextMuted">Directions of Use (Label Specifications)</h4>
                            <div class="space-y-3">
                                ${directionsHtml}
                            </div>
                        </div>
                    </div>
                `;

                // Show Modal
                productModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Lock background scrolling
            });
        }
    });

    // Close Modal Function
    const closeModal = () => {
        productModal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });


    // ==========================================
    // 4. INTERACTIVE STUDIO COLOR VISUALIZER ENGINE
    // ==========================================
    const svgLivingRoom = document.getElementById('svg-living-room');
    const svgExterior = document.getElementById('svg-exterior');
    const btnSceneLiving = document.getElementById('btn-scene-living');
    const btnSceneExterior = document.getElementById('btn-scene-exterior');

    // Segment selectors
    const btnSegmentAccent = document.getElementById('btn-segment-accent');
    const btnSegmentSide = document.getElementById('btn-segment-side');
    const btnSegmentCeiling = document.getElementById('btn-segment-ceiling');

    // Day/Night switch
    const btnAmbientLight = document.getElementById('btn-ambient-light-toggle');
    const litIndicatorSun = document.getElementById('lit-indicator-sun');
    const litIndicatorMoon = document.getElementById('lit-indicator-moon');
    const labelAmbientLight = document.getElementById('label-ambient-light');

    // Finish Selectors
    const finishButtons = document.querySelectorAll('.btn-finish-select');

    // HUD Actions
    const btnResetVisualizer = document.getElementById('btn-visualizer-reset');
    const btnSaveVisualizer = document.getElementById('btn-visualizer-save');

    // Harmony Buttons
    const harmonyBtnComp = document.getElementById('harmony-btn-comp');
    const harmonyBtnMono = document.getElementById('harmony-btn-mono');
    const harmonyBtnTriad = document.getElementById('harmony-btn-triad');
    const harmonyDotComp = document.getElementById('harmony-dot-comp');
    const harmonyDotMono = document.getElementById('harmony-dot-mono');
    const harmonyDotTriad = document.getElementById('harmony-dot-triad');

    // Modal selectors
    const paletteModal = document.getElementById('palette-saved-modal');
    const btnClosePaletteModal = document.getElementById('btn-close-saved-modal');
    const savedSwatchAccent = document.getElementById('saved-swatch-accent');
    const savedNameAccent = document.getElementById('saved-name-accent');
    const savedSwatchSide = document.getElementById('saved-swatch-side');
    const savedNameSide = document.getElementById('saved-name-side');
    const savedSwatchCeiling = document.getElementById('saved-swatch-ceiling');
    const savedNameCeiling = document.getElementById('saved-name-ceiling');

    // Room Segment Target DOM Nodes
    const targetsLiving = {
        accent: [document.getElementById('target-wall-living')],
        side: [document.getElementById('target-left-wall-living'), document.getElementById('target-right-wall-living')],
        ceiling: [document.getElementById('target-ceiling-living')]
    };

    const targetsExterior = {
        accent: [document.getElementById('target-wall-exterior')],
        side: [document.getElementById('target-left-pillar'), document.getElementById('target-right-pillar')],
        ceiling: [document.getElementById('target-gable-exterior')]
    };

    // Curated HomeShield High Definition Colors Catalog
    const colorsCatalog = [
        { name: "Royal Amber Gold", hex: "#e2a83a", desc: "Signature rich golden tone from our emulsion packaging, representing luxury, high coverage, and modern prestige." },
        { name: "Ocean Barrier Teal", hex: "#06b6d4", desc: "Stunning oceanic teal shade that pairs wonderfully with wooden textures, creating a calming interior zone." },
        { name: "Sunset Coral Orange", hex: "#ea580c", desc: "A vibrant warm orange hue matching the distemper packaging, designed to radiate brightness and positive vibes." },
        { name: "Deep Premium Navy", hex: "#0a1c3e", desc: "Our premium packaging Navy color, perfect for bold accent walls and deep structural contrast." },
        { name: "Shield Gloss White", hex: "#f8fafc", desc: "A pure, crisp white formulation providing 100% light reflectivity, making any tiny room look enormously spacious." },
        { name: "Damp Proof Grey", hex: "#7c8d9e", desc: "A classic high-performance modern slate grey tone engineered from our wall primer packaging." }
    ];

    // Perfect hand-curated harmonies for absolute aesthetic excellence
    const colorHarmonies = {
        "#e2a83a": { comp: "#06b6d4", compName: "Ocean Teal", mono: "#7c8d9e", monoName: "Damp Grey", triad: "#ea580c", triadName: "Coral Orange" },
        "#06b6d4": { comp: "#ea580c", compName: "Coral Orange", mono: "#7c8d9e", monoName: "Damp Grey", triad: "#e2a83a", triadName: "Amber Gold" },
        "#ea580c": { comp: "#06b6d4", compName: "Ocean Teal", mono: "#7c8d9e", monoName: "Damp Grey", triad: "#e2a83a", triadName: "Amber Gold" },
        "#0a1c3e": { comp: "#f8fafc", compName: "Gloss White", mono: "#7c8d9e", monoName: "Damp Grey", triad: "#e2a83a", triadName: "Amber Gold" },
        "#f8fafc": { comp: "#0a1c3e", compName: "Premium Navy", mono: "#7c8d9e", monoName: "Damp Grey", triad: "#e2a83a", triadName: "Amber Gold" },
        "#7c8d9e": { comp: "#e2a83a", compName: "Amber Gold", mono: "#f8fafc", monoName: "Gloss White", triad: "#06b6d4", triadName: "Ocean Teal" }
    };

    // State definitions
    let activeScene = 'living'; // 'living' or 'exterior'
    let activeSegment = 'accent'; // 'accent' or 'side' or 'ceiling'
    let activeFinish = 'matt'; // 'matt', 'gloss', 'sheen', 'stucco'
    let isNightMode = false;

    const paintedColors = {
        living: {
            accent: "#7c8d9e",
            side: "#cbd5e1",
            ceiling: "#e2e8f0"
        },
        exterior: {
            accent: "#7c8d9e",
            side: "#e2e8f0",
            ceiling: "#f8fafc"
        }
    };

    const selectedColorName = document.getElementById('selected-color-name');
    const selectedColorCode = document.getElementById('selected-color-code');
    const selectedColorDesc = document.getElementById('selected-color-desc');
    const colorSwatchesContainer = document.getElementById('color-swatches-container');

    // Update active color info text and details card
    const updateActiveColorDetails = (color) => {
        if (!color) return;
        selectedColorName.textContent = color.name;
        selectedColorCode.textContent = color.hex;
        if (selectedColorDesc) selectedColorDesc.textContent = color.desc;

        // Generate Suggested Harmonies
        const harmony = colorHarmonies[color.hex.toLowerCase()] || colorHarmonies["#e2a83a"];
        if (harmony) {
            harmonyDotComp.style.backgroundColor = harmony.comp;
            harmonyDotMono.style.backgroundColor = harmony.mono;
            harmonyDotTriad.style.backgroundColor = harmony.triad;

            // Set text helper inside buttons
            harmonyBtnComp.querySelector('span:not([id])').textContent = harmony.compName;
            harmonyBtnMono.querySelector('span:not([id])').textContent = harmony.monoName;
            harmonyBtnTriad.querySelector('span:not([id])').textContent = harmony.triadName;
        }
    };

    // Apply color to specified segment nodes
    const applyColorToDOM = (scene, segment, hex) => {
        const list = scene === 'living' ? targetsLiving[segment] : targetsExterior[segment];
        if (list) {
            list.forEach(el => {
                if (el) {
                    el.style.fill = hex;
                }
            });
        }
    };

    // Apply texture filter to wall elements
    const applyTextureFilter = (finish) => {
        const allWalls = [...targetsLiving.accent, ...targetsLiving.side, ...targetsLiving.ceiling,
        ...targetsExterior.accent, ...targetsExterior.side, ...targetsExterior.ceiling];

        allWalls.forEach(wall => {
            if (wall) {
                if (finish === 'matt') {
                    wall.setAttribute('filter', 'url(#filter-matt)');
                } else if (finish === 'stucco') {
                    wall.setAttribute('filter', 'url(#filter-stucco)');
                } else if (finish === 'gloss') {
                    wall.setAttribute('filter', 'url(#filter-gloss)');
                } else if (finish === 'sheen') {
                    wall.setAttribute('filter', 'url(#filter-sheen)');
                } else {
                    wall.removeAttribute('filter');
                }
            }
        });
    };

    // Inject Color Swatches into DOM
    colorsCatalog.forEach((color, idx) => {
        const activeClass = idx === 0 ? 'ring-2 ring-gold-500' : 'border-slate-800';
        const swatchBtn = document.createElement('button');
        swatchBtn.className = `h-11 w-full rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center relative overflow-hidden group ${activeClass}`;
        swatchBtn.style.backgroundColor = color.hex;
        swatchBtn.setAttribute('title', color.name);
        swatchBtn.innerHTML = `<span class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>`;

        swatchBtn.addEventListener('click', () => {
            // Remove active rings from all swatch buttons
            colorSwatchesContainer.querySelectorAll('button').forEach(btn => {
                btn.className = btn.className.replace('ring-2 ring-gold-500', 'border-slate-800');
            });
            // Add active ring
            swatchBtn.className = swatchBtn.className.replace('border-slate-800', 'ring-2 ring-gold-500');

            // Set painted color state
            paintedColors[activeScene][activeSegment] = color.hex;

            // Paint wall
            applyColorToDOM(activeScene, activeSegment, color.hex);

            // Update details
            updateActiveColorDetails(color);
        });

        colorSwatchesContainer.appendChild(swatchBtn);
    });

    // Helper to find color object in catalog
    const findColorByHex = (hex) => {
        return colorsCatalog.find(c => c.hex.toLowerCase() === hex.toLowerCase()) || { name: "Custom Color", hex: hex, desc: "A beautifully painted tone." };
    };

    // Initialize wall colors and apply Matt texture filter by default
    const initVisualizerDefaults = () => {
        Object.keys(paintedColors.living).forEach(segment => {
            applyColorToDOM('living', segment, paintedColors.living[segment]);
        });
        Object.keys(paintedColors.exterior).forEach(segment => {
            applyColorToDOM('exterior', segment, paintedColors.exterior[segment]);
        });
        applyTextureFilter('matt');
        updateActiveColorDetails(colorsCatalog[0]);
    };
    initVisualizerDefaults();

    // Check for pending color paint requests from colors.html
    const pendingPaintStr = localStorage.getItem('homeshield_pending_paint');
    if (pendingPaintStr) {
        try {
            const pending = JSON.parse(pendingPaintStr);
            localStorage.removeItem('homeshield_pending_paint');

            // Set paintedColor state
            paintedColors[activeScene][activeSegment] = pending.hex;

            // Paint wall
            applyColorToDOM(activeScene, activeSegment, pending.hex);

            // Update details
            const specColor = findColorByHex(pending.hex);
            updateActiveColorDetails(specColor);

            // Scroll to visualizer after a short delay to allow page rendering
            setTimeout(() => {
                const vis = document.getElementById('visualizer');
                if (vis) vis.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        } catch (e) {
            console.error("Error reading pending paint: ", e);
        }
    }

    // segment button toggles
    const setSegmentActive = (segment) => {
        activeSegment = segment;

        // Remove style classes
        [btnSegmentAccent, btnSegmentSide, btnSegmentCeiling].forEach(btn => {
            if (btn) {
                btn.className = btn.className.replace("bg-themeAccent text-themeBgAlt shadow-md", "text-themeTextMuted hover:text-themeText");
            }
        });

        // Add style to selected
        let targetBtn = btnSegmentAccent;
        if (segment === 'side') targetBtn = btnSegmentSide;
        if (segment === 'ceiling') targetBtn = btnSegmentCeiling;

        if (targetBtn) {
            targetBtn.className = targetBtn.className.replace("text-themeTextMuted hover:text-themeText", "bg-themeAccent text-themeBgAlt shadow-md");
        }
    };

    if (btnSegmentAccent) btnSegmentAccent.addEventListener('click', () => setSegmentActive('accent'));
    if (btnSegmentSide) btnSegmentSide.addEventListener('click', () => setSegmentActive('side'));
    if (btnSegmentCeiling) btnSegmentCeiling.addEventListener('click', () => setSegmentActive('ceiling'));

    // Finish Selectors click handlers
    finishButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const finish = btn.getAttribute('data-finish');
            activeFinish = finish;

            // Update styles
            finishButtons.forEach(b => {
                b.className = b.className.replace("bg-themeAccent text-themeBgAlt border border-themeAccent shadow-sm", "text-themeTextMuted bg-themeBgAlt border border-themeBorder hover:text-themeText");
            });

            btn.className = btn.className.replace("text-themeTextMuted bg-themeBgAlt border border-themeBorder hover:text-themeText", "bg-themeAccent text-themeBgAlt border border-themeAccent shadow-sm");

            // Apply filter
            applyTextureFilter(finish);
        });
    });

    // Day/Night Ambient Light Switch
    if (btnAmbientLight) {
        btnAmbientLight.addEventListener('click', () => {
            isNightMode = !isNightMode;

            const livingNightOverlay = document.getElementById('living-room-night-overlay');
            const lampLightCone = document.getElementById('lamp-light-cone');
            const lampBulbGlowDot = document.getElementById('lamp-bulb-glow-dot');
            const exteriorNightOverlay = document.getElementById('exterior-night-overlay');
            const exteriorLightLeft = document.getElementById('exterior-light-left');
            const exteriorLightRight = document.getElementById('exterior-light-right');
            const exteriorMoon = document.getElementById('exterior-moon');

            if (isNightMode) {
                // Turn Night mode ON
                if (litIndicatorSun) litIndicatorSun.classList.add('hidden');
                if (litIndicatorMoon) litIndicatorMoon.classList.remove('hidden');
                if (labelAmbientLight) labelAmbientLight.textContent = "Night Mode";

                // Living Room night
                if (livingNightOverlay) livingNightOverlay.style.opacity = '0.75';
                if (lampLightCone) lampLightCone.style.opacity = '0.85';
                if (lampBulbGlowDot) lampBulbGlowDot.style.opacity = '1';

                // Exterior night
                if (exteriorNightOverlay) exteriorNightOverlay.style.opacity = '0.85';
                if (exteriorLightLeft) exteriorLightLeft.style.opacity = '0.85';
                if (exteriorLightRight) exteriorLightRight.style.opacity = '0.85';
                if (exteriorMoon) exteriorMoon.style.opacity = '0.7';

            } else {
                // Turn Night mode OFF (Day light)
                if (litIndicatorSun) litIndicatorSun.classList.remove('hidden');
                if (litIndicatorMoon) litIndicatorMoon.classList.add('hidden');
                if (labelAmbientLight) labelAmbientLight.textContent = "Day Mode";

                // Living Room day
                if (livingNightOverlay) livingNightOverlay.style.opacity = '0';
                if (lampLightCone) lampLightCone.style.opacity = '0';
                if (lampBulbGlowDot) lampBulbGlowDot.style.opacity = '0';

                // Exterior day
                if (exteriorNightOverlay) exteriorNightOverlay.style.opacity = '0';
                if (exteriorLightLeft) exteriorLightLeft.style.opacity = '0';
                if (exteriorLightRight) exteriorLightRight.style.opacity = '0';
                if (exteriorMoon) exteriorMoon.style.opacity = '0.2';
            }
        });
    }

    // Curated harmony clicks
    const applyHarmonyColor = (harmonyHex) => {
        // Update paintedColors state
        paintedColors[activeScene][activeSegment] = harmonyHex;

        // Paint DOM element
        applyColorToDOM(activeScene, activeSegment, harmonyHex);

        // Update swatch active indicator
        const targetColor = findColorByHex(harmonyHex);
        updateActiveColorDetails(targetColor);

        // Find swatch button and highlight it
        if (colorSwatchesContainer) {
            colorSwatchesContainer.querySelectorAll('button').forEach(btn => {
                const btnColor = btn.getAttribute('title');
                if (btnColor === targetColor.name) {
                    btn.className = btn.className.replace('border-slate-800', 'ring-2 ring-gold-500');
                } else {
                    btn.className = btn.className.replace('ring-2 ring-gold-500', 'border-slate-800');
                }
            });
        }
    };

    if (harmonyBtnComp) harmonyBtnComp.addEventListener('click', () => {
        const hex = harmonyDotComp.style.backgroundColor;
        // Convert rgb to hex if needed
        let hexColor = "#06b6d4";
        if (hex.startsWith('rgb')) {
            const rgb = hex.match(/\d+/g);
            hexColor = "#" + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
        } else {
            hexColor = hex;
        }
        applyHarmonyColor(hexColor);
    });

    if (harmonyBtnMono) harmonyBtnMono.addEventListener('click', () => {
        const hex = harmonyDotMono.style.backgroundColor;
        let hexColor = "#7c8d9e";
        if (hex.startsWith('rgb')) {
            const rgb = hex.match(/\d+/g);
            hexColor = "#" + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
        } else {
            hexColor = hex;
        }
        applyHarmonyColor(hexColor);
    });

    if (harmonyBtnTriad) harmonyBtnTriad.addEventListener('click', () => {
        const hex = harmonyDotTriad.style.backgroundColor;
        let hexColor = "#ea580c";
        if (hex.startsWith('rgb')) {
            const rgb = hex.match(/\d+/g);
            hexColor = "#" + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
        } else {
            hexColor = hex;
        }
        applyHarmonyColor(hexColor);
    });

    // Reset visualizer fills
    if (btnResetVisualizer) {
        btnResetVisualizer.addEventListener('click', () => {
            paintedColors.living = {
                accent: "#7c8d9e",
                side: "#cbd5e1",
                ceiling: "#e2e8f0"
            };
            paintedColors.exterior = {
                accent: "#7c8d9e",
                side: "#e2e8f0",
                ceiling: "#f8fafc"
            };
            initVisualizerDefaults();
            setSegmentActive('accent');
        });
    }

    // Save active palette to Modal Dashboard
    if (btnSaveVisualizer && paletteModal) {
        btnSaveVisualizer.addEventListener('click', () => {
            const current = paintedColors[activeScene];

            const accentCol = findColorByHex(current.accent);
            const sideCol = findColorByHex(current.side);
            const ceilingCol = findColorByHex(current.ceiling);

            // Set text & dots inside Saved Modal
            if (savedSwatchAccent) savedSwatchAccent.style.backgroundColor = accentCol.hex;
            if (savedNameAccent) savedNameAccent.textContent = accentCol.name;
            if (savedSwatchSide) savedSwatchSide.style.backgroundColor = sideCol.hex;
            if (savedNameSide) savedNameSide.textContent = sideCol.name;
            if (savedSwatchCeiling) savedSwatchCeiling.style.backgroundColor = ceilingCol.hex;
            if (savedNameCeiling) savedNameCeiling.textContent = ceilingCol.name;

            // Show modal
            paletteModal.classList.remove('hidden');
        });
    }

    if (btnClosePaletteModal && paletteModal) {
        btnClosePaletteModal.addEventListener('click', () => {
            paletteModal.classList.add('hidden');
        });
    }

    // Handle Scene Toggles
    if (btnSceneLiving && btnSceneExterior && svgLivingRoom && svgExterior) {
        btnSceneLiving.addEventListener('click', () => {
            btnSceneLiving.className = "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg bg-themeAccent text-themeBgAlt shadow-md transition-all";
            btnSceneExterior.className = "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg text-themeTextMuted hover:text-themeText transition-all";

            svgLivingRoom.classList.remove('hidden');
            svgExterior.classList.add('hidden');
            activeScene = 'living';
            setSegmentActive('accent');
        });

        btnSceneExterior.addEventListener('click', () => {
            btnSceneExterior.className = "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg bg-themeAccent text-themeBgAlt shadow-md transition-all";
            btnSceneLiving.className = "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg text-themeTextMuted hover:text-themeText transition-all";

            svgExterior.classList.remove('hidden');
            svgLivingRoom.classList.add('hidden');
            activeScene = 'exterior';
            setSegmentActive('accent');
        });
    }


    // ==========================================
    // 4.5 WORLD COLOR ATLAS & INFINITE GENERATOR ENGINE
    // ==========================================
    const globalAtlasColors = [
        { name: "Imperial Ruby", hex: "#991b1b", rgb: "153, 27, 27", vibe: "warm" },
        { name: "Earthy Terracotta", hex: "#c2410c", rgb: "194, 65, 12", vibe: "earthy" },
        { name: "Soft Rose Petal", hex: "#fca5a5", rgb: "252, 165, 165", vibe: "pastel" },
        { name: "Sunset Coral", hex: "#ea580c", rgb: "234, 88, 12", vibe: "warm" },
        { name: "Apricot Velvet", hex: "#fb923c", rgb: "251, 146, 60", vibe: "warm" },
        { name: "Peach Cream", hex: "#ffedd5", rgb: "255, 237, 213", vibe: "pastel" },
        { name: "Royal Amber Gold", hex: "#e2a83a", rgb: "226, 168, 58", vibe: "warm" },
        { name: "Saffron Spice", hex: "#eab308", rgb: "234, 179, 8", vibe: "warm" },
        { name: "Honey Mustard", hex: "#ca8a04", rgb: "202, 138, 4", vibe: "earthy" },
        { name: "Sage Sanctuary", hex: "#166534", rgb: "22, 101, 52", vibe: "earthy" },
        { name: "Mint Breeze", hex: "#86efac", rgb: "134, 239, 172", vibe: "pastel" },
        { name: "Eucalyptus Slate", hex: "#475569", rgb: "71, 85, 105", vibe: "cool" },
        { name: "Ocean Barrier Teal", hex: "#06b6d4", rgb: "6, 182, 212", vibe: "cool" },
        { name: "Crystalline Aqua", hex: "#22d3ee", rgb: "34, 211, 238", vibe: "pastel" },
        { name: "Barents Sea Navy", hex: "#155e75", rgb: "21, 94, 117", vibe: "cool" },
        { name: "Deep Premium Navy", hex: "#0a1c3e", rgb: "10, 28, 62", vibe: "cool" },
        { name: "Classic Indigo", hex: "#1e1b4b", rgb: "30, 27, 75", vibe: "cool" },
        { name: "Sky Clarity", hex: "#bae6fd", rgb: "186, 230, 253", vibe: "pastel" },
        { name: "Damp Proof Grey", hex: "#7c8d9e", rgb: "124, 141, 158", vibe: "cool" },
        { name: "Charcoal Armor", hex: "#1e293b", rgb: "30, 41, 59", vibe: "cool" },
        { name: "Soft Pebble Grey", hex: "#f1f5f9", rgb: "241, 245, 249", vibe: "pastel" },
        { name: "Sovereign Purple", hex: "#581c87", rgb: "88, 28, 135", vibe: "warm" },
        { name: "Lilac Whisper", hex: "#e9d5ff", rgb: "233, 213, 255", vibe: "pastel" },
        { name: "Blush Orchid", hex: "#db2777", rgb: "219, 39, 119", vibe: "warm" }
    ];

    const generatedPalettes = [
        { type: "Sunset Terracotta", colors: ["#991b1b", "#ea580c", "#fb923c", "#ffedd5", "#fffbf7"] },
        { type: "Ocean Hydroshield", colors: ["#0a1c3e", "#155e75", "#06b6d4", "#22d3ee", "#bae6fd"] },
        { type: "Forest Sanctuary", colors: ["#166534", "#86efac", "#e2a83a", "#7c8d9e", "#f8fafc"] },
        { type: "Imperial Orchid", colors: ["#581c87", "#e9d5ff", "#db2777", "#fca5a5", "#f5fffd"] },
        { type: "Slate Minimalist", colors: ["#1e293b", "#475569", "#7c8d9e", "#cbd5e1", "#f1f5f9"] },
        { type: "Golden Autumnal", colors: ["#ca8a04", "#eab308", "#e2a83a", "#fb923c", "#ffedd5"] }
    ];

    let activeGeneratedPalette = generatedPalettes[0];
    let currentVibeFilter = 'all';

    const atlasSearchInput = document.getElementById('atlas-search-input');
    const atlasVibeFilters = document.getElementById('atlas-vibe-filters');
    const atlasCardsGrid = document.getElementById('atlas-cards-grid');
    const atlasEmptyState = document.getElementById('atlas-empty-state');

    const atlasToast = document.getElementById('atlas-toast');
    const atlasToastText = document.getElementById('atlas-toast-text');

    const generatedPaletteBands = document.getElementById('generated-palette-bands');
    const generatedPaletteDesc = document.getElementById('generated-palette-desc');
    const btnGeneratePalette = document.getElementById('btn-generate-palette');
    const btnPaintGenerated = document.getElementById('btn-paint-generated');

    // Clipboard Copy Helper
    const showAtlasToast = (message) => {
        if (!atlasToast) return;
        atlasToastText.textContent = message;
        atlasToast.classList.remove('translate-y-20', 'opacity-0');
        atlasToast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
            atlasToast.classList.remove('translate-y-0', 'opacity-100');
            atlasToast.classList.add('translate-y-20', 'opacity-0');
        }, 2200);
    };

    // Render Atlas Cards
    const renderAtlas = () => {
        if (!atlasCardsGrid) return;
        atlasCardsGrid.innerHTML = '';

        const query = (atlasSearchInput ? atlasSearchInput.value : '').toLowerCase().trim();
        let visibleCount = 0;

        globalAtlasColors.forEach(color => {
            // Vibe check
            const matchesVibe = currentVibeFilter === 'all' || color.vibe === currentVibeFilter;

            // Search check
            const matchesSearch = color.name.toLowerCase().includes(query) || color.hex.toLowerCase().includes(query);

            if (matchesVibe && matchesSearch) {
                visibleCount++;
                const card = document.createElement('div');
                card.className = "glass-panel p-4 rounded-2xl flex flex-col justify-between space-y-4 hover:border-themeAccent/40 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 text-themeText";

                card.innerHTML = `
                    <div class="h-28 w-full rounded-xl shadow-inner relative overflow-hidden flex items-center justify-center cursor-pointer active-paint-trigger" style="background-color: ${color.hex}">
                        <span class="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-black uppercase tracking-widest transition-opacity duration-200">
                            Paint Wall
                        </span>
                    </div>
                    <div class="space-y-1">
                        <div class="flex justify-between items-baseline">
                            <h4 class="text-xs font-black truncate max-w-[90px]">${color.name}</h4>
                            <span class="text-[8px] font-bold text-themeTextMuted select-none uppercase tracking-widest">${color.vibe}</span>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-mono">
                            <span class="font-bold text-themeAccent select-all">${color.hex.toUpperCase()}</span>
                            <button class="text-themeTextMuted hover:text-themeAccent transition-colors copy-color-btn shrink-0" title="Copy HEX Code">
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            </button>
                        </div>
                    </div>
                `;

                // Handle click to paint
                card.querySelector('.active-paint-trigger').addEventListener('click', () => {
                    paintedColors[activeScene][activeSegment] = color.hex;
                    applyColorToDOM(activeScene, activeSegment, color.hex);

                    const specColor = findColorByHex(color.hex);
                    updateActiveColorDetails(specColor);

                    // Scroll to visualizer
                    document.getElementById('visualizer').scrollIntoView({ behavior: 'smooth' });
                    showAtlasToast(`Painted Accent Wall: ${color.name}!`);
                });

                // Handle copy hex code
                card.querySelector('.copy-color-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(color.hex.toUpperCase());
                    showAtlasToast(`Copied ${color.name} HEX code!`);
                });

                atlasCardsGrid.appendChild(card);
            }
        });

        // Toggle Empty State
        if (visibleCount === 0) {
            if (atlasEmptyState) atlasEmptyState.classList.remove('hidden');
            if (atlasCardsGrid) atlasCardsGrid.classList.add('hidden');
        } else {
            if (atlasEmptyState) atlasEmptyState.classList.add('hidden');
            if (atlasCardsGrid) atlasCardsGrid.classList.remove('hidden');
        }
    };

    // Generate and render 5 color bands for Infinite generator
    const renderGeneratedPalette = () => {
        if (!generatedPaletteBands) return;
        generatedPaletteBands.innerHTML = '';

        if (generatedPaletteDesc) generatedPaletteDesc.textContent = `${activeGeneratedPalette.type} Template`;

        activeGeneratedPalette.colors.forEach(hex => {
            const band = document.createElement('div');
            band.className = "flex-1 h-full relative group cursor-pointer transition-all duration-300 hover:flex-[1.5]";
            band.style.backgroundColor = hex;
            band.innerHTML = `
                <span class="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white text-[8px] font-black uppercase tracking-wider transition-opacity duration-200">
                    <span>${hex}</span>
                    <span class="mt-0.5 text-[7px] text-themeAccent font-extrabold">Copy</span>
                </span>
            `;

            band.addEventListener('click', () => {
                navigator.clipboard.writeText(hex.toUpperCase());
                showAtlasToast(`Copied HEX code ${hex.toUpperCase()}!`);
            });

            generatedPaletteBands.appendChild(band);
        });
    };

    // Generator handler
    if (btnGeneratePalette) {
        btnGeneratePalette.addEventListener('click', () => {
            // Pick random template that isn't the active one if possible
            let pick = activeGeneratedPalette;
            while (pick === activeGeneratedPalette) {
                const idx = Math.floor(Math.random() * generatedPalettes.length);
                pick = generatedPalettes[idx];
            }
            activeGeneratedPalette = pick;
            renderGeneratedPalette();
            showAtlasToast(`Generated ${activeGeneratedPalette.type} Template!`);
        });
    }

    // Paint using generated template colors
    if (btnPaintGenerated) {
        btnPaintGenerated.addEventListener('click', () => {
            const colors = activeGeneratedPalette.colors;
            // Map: Accent = colors[0], Side = colors[2], Ceiling = colors[3]
            paintedColors[activeScene].accent = colors[0];
            paintedColors[activeScene].side = colors[2];
            paintedColors[activeScene].ceiling = colors[3];

            // Apply to DOM
            applyColorToDOM(activeScene, 'accent', colors[0]);
            applyColorToDOM(activeScene, 'side', colors[2]);
            applyColorToDOM(activeScene, 'ceiling', colors[3]);

            // Set active swatch color info to match accent wall
            const matchingColorObj = findColorByHex(colors[0]);
            updateActiveColorDetails(matchingColorObj);

            // Scroll to visualizer
            document.getElementById('visualizer').scrollIntoView({ behavior: 'smooth' });
            showAtlasToast(`Applied ${activeGeneratedPalette.type} Palette to Room!`);
        });
    }

    // Search input listener
    if (atlasSearchInput) {
        atlasSearchInput.addEventListener('input', renderAtlas);
    }

    // Vibe filter click handlers
    if (atlasVibeFilters) {
        atlasVibeFilters.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const vibe = btn.getAttribute('data-vibe');
                currentVibeFilter = vibe;

                // Toggle active style
                atlasVibeFilters.querySelectorAll('button').forEach(b => {
                    b.className = b.className.replace("bg-themeAccent text-themeBgAlt border border-themeAccent shadow-sm", "text-themeTextMuted bg-themeBg border border-themeBorder hover:text-themeText hover:border-themeAccent");
                });

                btn.className = btn.className.replace("text-themeTextMuted bg-themeBg border border-themeBorder hover:text-themeText hover:border-themeAccent", "bg-themeAccent text-themeBgAlt border border-themeAccent shadow-sm");

                renderAtlas();
            });
        });
    }

    // Trigger Initial Render
    renderAtlas();
    renderGeneratedPalette();

    // ==========================================
    // 5. SMART PAINT & BUDGET CALCULATOR ENGINE
    // ==========================================
    const inputAreaRange = document.getElementById('input-area-range');
    const inputAreaNum = document.getElementById('input-area-num');
    const labelAreaVal = document.getElementById('label-area-val');

    const selectProduct = document.getElementById('select-product');
    const selectCoats = document.getElementById('select-coats');

    const resultQuantity = document.getElementById('result-quantity');
    const resultUnit = document.getElementById('result-unit');
    const resultCost = document.getElementById('result-cost');
    const resultCoverageDesc = document.getElementById('result-coverage-desc');

    const checklistPrimer = document.getElementById('checklist-primer');
    const checklistPutty = document.getElementById('checklist-putty');

    const productSpecs = {
        emulsion: {
            coverage: 130, // Sq. Ft. per Litre per coat
            unit: "Litres",
            pricePerUnit: 250, // ₹ per Litre
            desc: "Based on flagship coverage rate of ~130 sq. ft. per Litre"
        },
        primer: {
            coverage: 110, // Sq. Ft. per Litre per coat
            unit: "Litres",
            pricePerUnit: 150,
            desc: "Based on wall primer basecoat coverage of ~110 sq. ft. per Litre"
        },
        distemper: {
            coverage: 75, // Sq. Ft. per KG per coat
            unit: "Kgs",
            pricePerUnit: 53.25, // ₹1065 for 20KG = ₹53.25/KG
            desc: "Based on distemper coverage rate of ~75 sq. ft. per Kilogram"
        }
    };

    const calculatePaint = () => {
        const area = parseFloat(inputAreaNum.value) || 0;
        const productKey = selectProduct.value;
        const coats = parseInt(selectCoats.value) || 2;

        // Get Surface condition multiplier
        const surfaceConditionEl = document.querySelector('input[name="surface-condition"]:checked');
        const condition = surfaceConditionEl ? surfaceConditionEl.value : 'smooth';

        let conditionMultiplier = 1.0;
        if (condition === 'rough') conditionMultiplier = 1.25; // Requires 25% more paint
        if (condition === 'damp') conditionMultiplier = 1.1; // Requires 10% more paint

        const spec = productSpecs[productKey];
        if (!spec) return;

        // Formula: Quantity = (Area * Coats * ConditionMultiplier) / Coverage
        let totalQuantity = (area * coats * conditionMultiplier) / spec.coverage;
        totalQuantity = Math.ceil(totalQuantity * 10) / 10; // Round to 1 decimal

        // Calculate Cost
        let totalCost = totalQuantity * spec.pricePerUnit;
        totalCost = Math.round(totalCost);

        // Update Outputs
        resultQuantity.textContent = totalQuantity.toLocaleString();
        resultUnit.textContent = spec.unit;
        resultCost.textContent = totalCost.toLocaleString('en-IN');
        resultCoverageDesc.textContent = spec.desc;

        // Update Checklist recommendations
        const primerQty = Math.ceil((area / 110) * 1.5); // Estimate 1.5 coats of primer
        const puttyQty = Math.ceil(area * 0.05); // Estimate ~0.05kg putty per sq.ft.

        checklistPrimer.textContent = `HomeShield Wall Primer: ~${primerQty} Litres required`;
        checklistPutty.textContent = `HomeShield Acrylic Putty: ~${puttyQty} Kgs recommended`;
    };

    // Dual-binding input synchronisation
    if (inputAreaRange && inputAreaNum) {
        inputAreaRange.addEventListener('input', (e) => {
            inputAreaNum.value = e.target.value;
            labelAreaVal.textContent = `${parseFloat(e.target.value).toLocaleString()} Sq. Ft.`;
            calculatePaint();
        });

        inputAreaNum.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value) || 0;
            if (val > 5000) val = 5000;
            if (val < 0) val = 0;
            inputAreaRange.value = val;
            labelAreaVal.textContent = `${val.toLocaleString()} Sq. Ft.`;
            calculatePaint();
        });
    }

    // Dropdown listeners
    if (selectProduct) selectProduct.addEventListener('change', calculatePaint);
    if (selectCoats) selectCoats.addEventListener('change', calculatePaint);

    // Surface Condition listener
    document.querySelectorAll('input[name="surface-condition"]').forEach(radio => {
        radio.addEventListener('change', () => {
            // Toggle highlight styles on radio labels using theme variables
            document.querySelectorAll('[id^="surface-label-"]').forEach(label => {
                label.className = label.className.replace('ring-2 ring-themeAccent border-themeAccent bg-themeBgAlt', 'border-themeBorder');
            });
            const selectedLabel = document.getElementById(`surface-label-${radio.value}`);
            if (selectedLabel) {
                selectedLabel.className = selectedLabel.className.replace('border-themeBorder', 'ring-2 ring-themeAccent border-themeAccent bg-themeBgAlt');
            }
            calculatePaint();
        });
    });

    // Run first calculation on load
    calculatePaint();


    // ==========================================
    // 6. PREMIUM 3D TILT EFFECT ON CARDS (OPTIMIZED)
    // ==========================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        let rect = null;

        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', (e) => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            const x = e.clientX - rect.left; // x coordinate inside element
            const y = e.clientY - rect.top;  // y coordinate inside element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotational values (max rotation 8 degrees)
            const rotateX = ((centerY - y) / centerY) * 8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.boxShadow = '';
            rect = null;
        });
    });


    // ==========================================
    // 7. LEAD CONTACT FORM & SECURE PHP MAILER
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const successModalMsg = document.getElementById('success-modal-msg');
    const successTicketId = document.getElementById('success-ticket-id');
    const successCloseBtn = document.getElementById('success-close-btn');

    // Premium Floating Toast Notification
    const showPremiumToast = (message, isSuccess = true) => {
        const existing = document.getElementById('hs-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'hs-toast';
        toast.className = `fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-500 translate-y-10 opacity-0 ${isSuccess
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/30 text-rose-300'
            }`;

        const icon = isSuccess
            ? `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`
            : `<svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;

        toast.innerHTML = `
            ${icon}
            <div class="text-[10px] font-black uppercase tracking-wider">${message}</div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 50);

        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Fetch form data
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const email = document.getElementById('form-email').value;
            const pincode = document.getElementById('form-pincode').value;
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value;

            // Generate appointment ticket number
            const randDigits = Math.floor(1000 + Math.random() * 9000);
            const ticketId = `HS-2026-${randDigits}`;

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.textContent = "Booking Visit...";
            submitBtn.style.opacity = "0.7";

            // Create lead structure
            const lead = {
                ticketId,
                name,
                phone,
                email,
                pincode,
                service,
                message
            };

            // Dispatch POST request to our PHP secure mailer
            fetch('./send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lead)
            })
                .then(async response => {
                    const isJson = response.headers.get('content-type')?.includes('application/json');
                    let data = null;
                    if (isJson) {
                        data = await response.json();
                    } else {
                        // Assume success with generic message when no JSON payload
                        data = { success: true, message: 'Email sent successfully.' };
                    }

                    if (!response.ok) {
                        const errorMsg = (data && data.error) ? data.error : `HTTP Error ${response.status}`;
                        throw new Error(errorMsg);
                    }
                    return data;
                })
                .then(res => {
                    if (res && res.success) {
                        // Store lead to LocalStorage for offline registry cache backup
                        lead.timestamp = new Date().toISOString();
                        let leads = JSON.parse(localStorage.getItem('homeshield_leads')) || [];
                        leads.push(lead);
                        localStorage.setItem('homeshield_leads', JSON.stringify(leads));

                        // Trigger Premium success modal
                        successTicketId.textContent = ticketId;
                        successModalMsg.innerHTML = `Thank you <strong>${name}</strong>. Your free structural moisture scanning visit and color consultation has been booked successfully!`;
                        successModal.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';

                        // Reset form
                        contactForm.reset();
                        showPremiumToast(res.message || "Inspection booked successfully!", true);
                    } else {
                        throw new Error(res.error || "Unknown error occurred.");
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    showPremiumToast(error.message || "Failed to book. Please check server settings.", false);
                })
                .finally(() => {
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.opacity = "";
                });
        });
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    // Set interactive active condition border on smooth label by default
    const initSmoothLabel = document.getElementById('surface-label-smooth');
    if (initSmoothLabel) {
        initSmoothLabel.className = initSmoothLabel.className.replace('border-slate-800', 'ring-2 ring-gold-500 border-gold-500/40 bg-navy-900');
    }

    // ------------------------------------------
    // 5-STEP DIRECTIONS TIMELINE CONTROLLER
    // ------------------------------------------
    const stepsData = {
        1: {
            tag: "Preparation Phase",
            title: "Surface Sanding & Clean",
            desc: "Ensure the masonry wall is completely free from any loose paints, dust, algae, or grease. Scrape off weak coatings and sand utilizing emery paper 180 to create a flat, dry, debris-free base.",
            dilution: "None (Ready Base)",
            curing: "Dry Base",
            tools: "Emery Paper 180",
            waterproof: "Dry & Sanded",
            svg: `<div class="absolute inset-0 bg-themeBorder animate-pulse z-0 skeleton-bg"></div><img src="direction_step1.png" class="relative z-10 w-full h-full object-cover will-change-transform" onload="hideSkeleton(this)" loading="lazy" decoding="async" alt="Surface Sanding & Clean">`
        },
        2: {
            tag: "Primer Sealing Phase",
            title: "First Coat of Wall Primer",
            desc: "Apply a single thorough coat of water-thinnable Home Shield Wall Primer (diluted in 1:1 ratio with clean water). Allow the basecoat layer to cure completely for 6 to 8 hours.",
            dilution: "1:1 with Water",
            curing: "6 - 8 Hours",
            tools: "Brush / Roller",
            waterproof: "Base Seal Locked",
            svg: `<div class="absolute inset-0 bg-themeBorder animate-pulse z-0 skeleton-bg"></div><img src="direction_step2.png" class="relative z-10 w-full h-full object-cover will-change-transform" onload="hideSkeleton(this)" loading="lazy" decoding="async" alt="First Primer Layer">`
        },
        3: {
            tag: "Smoothing Phase",
            title: "Smoothening Wall Putty",
            desc: "Fill dents, pores, or cracks by applying thin coats of Home Shield Wall Putty. Allow drying for 4-6 hours. Sand flat using emery paper 180 and wipe clean to produce a mirror-smooth subfloor.",
            dilution: "Ready Paste",
            curing: "4 - 6 Hours",
            tools: "Putty Knife / Trowel",
            waterproof: "Micro-Crack Filled",
            svg: `<div class="absolute inset-0 bg-themeBorder animate-pulse z-0 skeleton-bg"></div><img src="direction_step3.png" class="relative z-10 w-full h-full object-cover will-change-transform" onload="hideSkeleton(this)" loading="lazy" decoding="async" alt="Wall Putty Smoothening">`
        },
        4: {
            tag: "Primer Sealing Phase",
            title: "Second Coat of Wall Primer",
            desc: "Apply another anchoring coat of Home Shield Wall Primer to seal the absorbent putty base. Allow drying for 6-8 hours, sand very lightly with emery paper 320, and wipe clean.",
            dilution: "1:1 with Water",
            curing: "6 - 8 Hours",
            tools: "Roller / Spray",
            waterproof: "Anchor Lock Layer",
            svg: `<div class="absolute inset-0 bg-themeBorder animate-pulse z-0 skeleton-bg"></div><img src="direction_step4.png" class="relative z-10 w-full h-full object-cover will-change-transform" onload="hideSkeleton(this)" loading="lazy" decoding="async" alt="Second Primer Layer">`
        },
        5: {
            tag: "Premium Finish Phase",
            title: "Premium Emulsion Topcoat",
            desc: "Thin 1 Litre of Home Shield Premium Emulsion with 500-750ml of clean water. Apply 2 to 3 finishing coats of paint with a brush, roller or spray, keeping a drying interval of 4-6 hours between coats.",
            dilution: "1L Emulsion : 500ml Water",
            curing: "4 - 6 Hours",
            tools: "Premium Roller / Brush",
            waterproof: "100% Crystalline Shield",
            svg: `<div class="absolute inset-0 bg-themeBorder animate-pulse z-0 skeleton-bg"></div><img src="direction_step5.png" class="relative z-10 w-full h-full object-cover will-change-transform" onload="hideSkeleton(this)" loading="lazy" decoding="async" alt="Emulsion / Distemper Finish">`
        }
    };

    // Stepper logic variables
    const stepButtons = document.querySelectorAll('.step-nav-btn');
    const stageCard = document.getElementById('timeline-stage-card');
    const progressBar = document.getElementById('timeline-progress-bar');
    const prevBtn = document.getElementById('timeline-prev-btn');
    const nextBtn = document.getElementById('timeline-next-btn');

    let currentStep = 1;

    const updateStageDisplay = (step) => {
        currentStep = parseInt(step);
        const data = stepsData[currentStep];

        if (!data || !stageCard) return;

        // Apply fade-out animation classes
        const textPanel = document.getElementById('stage-text-panel');
        const graphicPanel = document.getElementById('stage-graphic-panel');

        if (textPanel && graphicPanel) {
            textPanel.style.opacity = 0;
            textPanel.style.transform = 'translateY(15px)';
            graphicPanel.style.opacity = 0;
            graphicPanel.style.transform = 'scale(0.95)';
        }

        setTimeout(() => {
            // Swap Contents
            document.getElementById('stage-tag').textContent = data.tag;
            document.getElementById('stage-title').textContent = data.title;
            document.getElementById('stage-desc').textContent = data.desc;
            document.getElementById('spec-dilution').textContent = data.dilution;
            document.getElementById('spec-curing').textContent = data.curing;
            document.getElementById('spec-tools').textContent = data.tools;
            document.getElementById('spec-waterproof').textContent = data.waterproof;
            document.getElementById('stage-svg-illustration').innerHTML = data.svg;

            // Trigger reflow & fade-in animations
            if (textPanel && graphicPanel) {
                textPanel.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                graphicPanel.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                textPanel.style.opacity = 1;
                textPanel.style.transform = 'translateY(0)';
                graphicPanel.style.opacity = 1;
                graphicPanel.style.transform = 'scale(1)';
            }
            // Update section dimension cache since timeline content height altered
            if (typeof cacheSectionDimensions === 'function') {
                cacheSectionDimensions();
            }
        }, 150);

        // Update active classes on nav buttons
        stepButtons.forEach(btn => {
            const btnStep = parseInt(btn.getAttribute('data-step'));
            const numBadge = btn.querySelector('.step-num-badge');
            const titleSpan = btn.querySelector('.step-nav-btn span:last-child');

            if (btnStep === currentStep) {
                btn.className = "step-nav-btn text-left p-4 lg:p-5 rounded-2xl border border-themeAccent/40 bg-themeBgAlt flex items-center space-x-4 transition-all duration-300 group select-none shadow-md";
                if (numBadge) {
                    numBadge.className = "step-num-badge w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs transition-all duration-300 shrink-0 border border-themeAccent bg-themeAccent text-themeBgAlt";
                }
                if (titleSpan) {
                    titleSpan.className = "text-sm font-bold text-themeText tracking-tight transition-colors";
                }
            } else {
                btn.className = "step-nav-btn text-left p-4 lg:p-5 rounded-2xl border border-themeBorder bg-themeBgAlt/50 hover:bg-themeBgAlt/95 hover:border-themeAccent/40 flex items-center space-x-4 transition-all duration-300 group select-none";
                if (numBadge) {
                    numBadge.className = "step-num-badge w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs transition-all duration-300 shrink-0 border border-themeBorder bg-themeBg text-themeTextMuted group-hover:border-themeAccent/60 group-hover:text-themeAccent";
                }
                if (titleSpan) {
                    titleSpan.className = "text-sm font-bold text-themeTextMuted tracking-tight transition-colors group-hover:text-themeText";
                }
            }
        });

        // Update progress bar height (Desktop only)
        if (progressBar) {
            const pct = ((currentStep - 1) / 4) * 91; // Anchored between first and last steps
            progressBar.style.height = `${pct}%`;
        }

        // Enable/Disable next/prev controls
        if (prevBtn) prevBtn.disabled = currentStep === 1;
        if (nextBtn) nextBtn.disabled = currentStep === 5;

        if (prevBtn) {
            if (currentStep === 1) {
                prevBtn.classList.add('opacity-40', 'cursor-not-allowed');
            } else {
                prevBtn.classList.remove('opacity-40', 'cursor-not-allowed');
            }
        }
        if (nextBtn) {
            if (currentStep === 5) {
                nextBtn.classList.add('opacity-40', 'cursor-not-allowed');
            } else {
                nextBtn.classList.remove('opacity-40', 'cursor-not-allowed');
            }
        }
    };

    // Initialize progress bar and clicks
    if (stepButtons.length > 0) {
        updateStageDisplay(1);

        stepButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const step = btn.getAttribute('data-step');
                updateStageDisplay(step);
            });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                updateStageDisplay(currentStep - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < 5) {
                updateStageDisplay(currentStep + 1);
            }
        });
    }

    // ==========================================
    // 8. IMMERSIVE 3D FULL-PAGE SCROLL SNAPPING CONTROLLER
    // ==========================================

    // Enable 3D Snap scroll system styling lock on body
    document.documentElement.classList.add('scroll-3d-active');

    const sections = Array.from(document.querySelectorAll('.scroll-section'));
    let currentSectionIndex = 0;
    let lastScrollTime = 0;
    const transitionDuration = 1200; // matching CSS transition time (1.2s)

    const sectionNames = {
        'inspiration-gallery': 'Gallery',
        'Main': 'Home',
        'hero': 'Home',
        'about': 'About Us',
        'products': 'Products',
        'visualizer': 'Studio Visualizer',
        'color-atlas': 'Color Atlas',
        'calculator': 'Cost Calculator',
        'timeline': '5-Step Guide',
        'contact': 'Inspection Registry'
    };

    // HIGH PERFORMANCE: Cache section dimensions to completely prevent layout thrashing (forced reflows)
    let sectionDimensions = [];

    const cacheSectionDimensions = () => {
        sectionDimensions = sections.map(section => ({
            scrollHeight: section.scrollHeight,
            clientHeight: section.clientHeight
        }));
    };

    // Initial cache run
    cacheSectionDimensions();

    // Cache dimensions update on window resize (debounced to avoid performance lag)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cacheSectionDimensions();
        }, 150);
    }, { passive: true });

    // Dynamic dynamic dot creation
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'scroll-dots-container';
    document.body.appendChild(dotsContainer);

    // Make dots visible with high performance ease
    setTimeout(() => {
        dotsContainer.classList.add('visible');
    }, 600);

    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        const sectionId = section.id || 'hero';
        const name = sectionNames[sectionId] || sectionId;

        dot.setAttribute('data-tooltip', name);
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastScrollTime < transitionDuration) return;
            lastScrollTime = now;
            transitionToSection(index);
        });

        dotsContainer.appendChild(dot);
    });

    // ---- NEXT SECTION ARROW BUTTONS ----
    // Inject a bounce arrow at the END of every section's content (inline flow, no overlay)
    sections.forEach((section, index) => {
        if (index === sections.length - 1) return; // no arrow on last section

        const arrow = document.createElement('button');
        arrow.className = 'section-next-arrow';
        arrow.setAttribute('aria-label', 'Scroll to next section');
        arrow.setAttribute('type', 'button');

        const nextName = sectionNames[sections[index + 1].id] || 'Next';

        arrow.innerHTML = `
            <span class="section-next-arrow__label">${nextName}</span>
            <span class="section-next-arrow__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </span>
        `;

        arrow.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastScrollTime < transitionDuration) return;
            lastScrollTime = now;
            transitionToSection(index + 1, 'down');
        });

        // Wrap in a flow container so it sits AFTER content, not floating over it
        const wrap = document.createElement('div');
        wrap.className = 'section-next-arrow-wrap';
        wrap.appendChild(arrow);

        const contentContainer = section.querySelector('.max-w-7xl');
        if (contentContainer) {
            contentContainer.appendChild(wrap);
        } else {
            section.appendChild(wrap);
        }
    });

    // Re-cache heights now that arrow wrappers have been added to sections
    cacheSectionDimensions();

    const updateNavHighlight = (sectionId) => {
        // Desktop capsule navigation link update
        document.querySelectorAll('.desktop-nav-dock .nav-link-pill').forEach(link => {
            const href = link.getAttribute('href');
            // Support simple hash or full page path with hash
            if (href === `#${sectionId}` || href === `./index.html#${sectionId}` || (sectionId === 'hero' && href === '#')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Highlight right side floating dots
        const dots = document.querySelectorAll('.scroll-dot');
        dots.forEach((dot, idx) => {
            if (idx === currentSectionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const transitionToSection = (targetIndex, direction = null) => {
        if (targetIndex < 0 || targetIndex >= sections.length) return;

        const prevIndex = currentSectionIndex;
        currentSectionIndex = targetIndex;
        const targetSection = sections[targetIndex];
        const sectionId = targetSection.id || 'hero';

        // Calculate direction of transition
        const dir = direction || (targetIndex > prevIndex ? 'down' : 'up');

        if (dir === 'down') {
            targetSection.scrollTop = 0;
        } else {
            // When going up, start from the bottom of the section so they can scroll back up
            // HIGH PERFORMANCE: Use cached dimensions to avoid layout thrashing
            const dims = sectionDimensions[targetIndex] || { scrollHeight: targetSection.scrollHeight };
            targetSection.scrollTop = dims.scrollHeight;
        }

        // Add 3D structural perspective transform classes
        sections.forEach((section, index) => {
            section.classList.remove('state-active', 'state-prev', 'state-next');
            if (index === targetIndex) {
                section.classList.add('state-active');
            } else if (index < targetIndex) {
                section.classList.add('state-prev');
            } else {
                section.classList.add('state-next');
            }
        });

        // Restart bounce animation on the newly-active section's arrow
        const activeArrow = targetSection.querySelector('.section-next-arrow-wrap .section-next-arrow');
        if (activeArrow) {
            activeArrow.style.animation = 'none';
            void activeArrow.offsetWidth;
            activeArrow.style.animation = '';
        }

        updateNavHighlight(sectionId);

        // Update URL state nicely without page reload or default anchor jump
        if (history.pushState) {
            history.pushState(null, null, `#${sectionId}`);
        } else {
            window.location.hash = `#${sectionId}`;
        }
    };

    // Wheel Scrolling Hook (Intercept scroll down at bottom, scroll up at top)
    const handleWheel = (e) => {
        // Prevent hijack inside form elements, textareas, sliders, custom lists
        if (e.target.closest('textarea, select, input[type="range"], #color-swatches-container, #atlas-cards-grid, .custom-scrollbar')) return;

        const activeSection = sections[currentSectionIndex];
        const now = Date.now();

        if (now - lastScrollTime < transitionDuration) {
            e.preventDefault();
            return;
        }

        const delta = e.deltaY;
        const dims = sectionDimensions[currentSectionIndex] || { clientHeight: activeSection.clientHeight, scrollHeight: activeSection.scrollHeight };

        if (delta > 0) {
            // Scroll DOWN (user moving wheel down) - check boundary utilizing cached dimensions
            const isAtBottom = activeSection.scrollTop + dims.clientHeight >= dims.scrollHeight - 5;
            if (isAtBottom) {
                e.preventDefault();
                if (currentSectionIndex < sections.length - 1) {
                    lastScrollTime = now;
                    transitionToSection(currentSectionIndex + 1, 'down');
                }
            }
        } else if (delta < 0) {
            // Scroll UP (user moving wheel up) - check boundary
            const isAtTop = activeSection.scrollTop <= 5;
            if (isAtTop) {
                e.preventDefault();
                if (currentSectionIndex > 0) {
                    lastScrollTime = now;
                    transitionToSection(currentSectionIndex - 1, 'up');
                }
            }
        }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    // Touch Swiping Handlers for full mobile responsive compatibility
    let touchStartY = 0;
    let touchStartX = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        // Ignore swipe inside interactive widgets
        if (e.target.closest('textarea, select, input[type="range"], #slider-drag-handle, #color-swatches-container, #atlas-cards-grid')) return;

        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;

        const deltaY = touchStartY - touchEndY;
        const deltaX = touchStartX - touchEndX;

        // Verify it is a distinct vertical swipe rather than horizontal
        if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
            const activeSection = sections[currentSectionIndex];
            const now = Date.now();

            if (now - lastScrollTime < transitionDuration) return;

            const dims = sectionDimensions[currentSectionIndex] || { clientHeight: activeSection.clientHeight, scrollHeight: activeSection.scrollHeight };

            if (deltaY > 0) {
                // Swiped UPwards (scrolling down) - check boundary utilizing cached dimensions
                const isAtBottom = activeSection.scrollTop + dims.clientHeight >= dims.scrollHeight - 8;
                if (isAtBottom && currentSectionIndex < sections.length - 1) {
                    lastScrollTime = now;
                    transitionToSection(currentSectionIndex + 1, 'down');
                }
            } else {
                // Swiped DOWNwards (scrolling up) - check boundary
                const isAtTop = activeSection.scrollTop <= 8;
                if (isAtTop && currentSectionIndex > 0) {
                    lastScrollTime = now;
                    transitionToSection(currentSectionIndex - 1, 'up');
                }
            }
        }
    }, { passive: true });

    // Key Press Arrows Navigation
    window.addEventListener('keydown', (e) => {
        // Bypass typing in search, contact fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        const activeSection = sections[currentSectionIndex];
        const now = Date.now();

        if (now - lastScrollTime < transitionDuration) return;

        const dims = sectionDimensions[currentSectionIndex] || { clientHeight: activeSection.clientHeight, scrollHeight: activeSection.scrollHeight };

        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            const isAtBottom = activeSection.scrollTop + dims.clientHeight >= dims.scrollHeight - 5;
            if (isAtBottom && currentSectionIndex < sections.length - 1) {
                e.preventDefault();
                lastScrollTime = now;
                transitionToSection(currentSectionIndex + 1, 'down');
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            const isAtTop = activeSection.scrollTop <= 5;
            if (isAtTop && currentSectionIndex > 0) {
                e.preventDefault();
                lastScrollTime = now;
                transitionToSection(currentSectionIndex - 1, 'up');
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            lastScrollTime = now;
            transitionToSection(0, 'up');
        } else if (e.key === 'End') {
            e.preventDefault();
            lastScrollTime = now;
            transitionToSection(sections.length - 1, 'down');
        }
    });

    // Intercept all Anchor clicks globally pointing to index hashes
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('#')) {
            const hashPart = href.split('#')[1];
            const pagePart = href.split('#')[0];

            // Match if it's on this home page
            if (pagePart === '' || pagePart === 'index.html' || pagePart === './index.html') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }

                    const targetIndex = sections.findIndex(s => s.id === hashPart || (hashPart === 'hero' && s.tagName === 'HEADER'));
                    if (targetIndex !== -1) {
                        transitionToSection(targetIndex);
                    }
                });
            }
        }
    });

    // Initialize Active states on load
    const initScrollSystem = () => {
        // Look up hashed section on load
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            const targetIndex = sections.findIndex(s => s.id === targetId || (targetId === 'hero' && s.tagName === 'HEADER'));
            if (targetIndex !== -1) {
                currentSectionIndex = targetIndex;
            }
        }

        sections.forEach((section, index) => {
            section.classList.remove('state-active', 'state-prev', 'state-next');
            if (index === currentSectionIndex) {
                section.classList.add('state-active');
                section.scrollTop = 0;
            } else if (index < currentSectionIndex) {
                section.classList.add('state-prev');
            } else {
                section.classList.add('state-next');
            }
        });

        const activeId = sections[currentSectionIndex].id || 'hero';
        updateNavHighlight(activeId);

        // Kick off the bounce animation on the initial active section's arrow
        const initArrow = sections[currentSectionIndex].querySelector('.section-next-arrow-wrap .section-next-arrow');
        if (initArrow) {
            initArrow.style.animation = 'none';
            void initArrow.offsetWidth;
            initArrow.style.animation = '';
        }
    };

    // ==========================================
    // 8.5 3D ISOMETRIC WALL INTERACTION SYSTEM
    // ==========================================
    const layerCards = document.querySelectorAll('#about [data-layer]');
    const isoLayers = document.querySelectorAll('.isometric-layer');

    const activateLayer = (layerName) => {
        isoLayers.forEach(layer => {
            if (layer.getAttribute('data-layer') === layerName) {
                layer.classList.add('active-3d-layer');
            } else {
                layer.classList.remove('active-3d-layer');
            }
        });
    };

    const deactivateLayers = () => {
        isoLayers.forEach(layer => {
            layer.classList.remove('active-3d-layer');
        });
    };

    layerCards.forEach(card => {
        const layerName = card.getAttribute('data-layer');
        card.addEventListener('mouseenter', () => {
            activateLayer(layerName);
        });
        card.addEventListener('mouseleave', () => {
            deactivateLayers();
        });
    });

    isoLayers.forEach(layer => {
        const layerName = layer.getAttribute('data-layer');
        layer.addEventListener('mouseenter', () => {
            layerCards.forEach(card => {
                if (card.getAttribute('data-layer') === layerName) {
                    card.classList.add('border-themeAccent/60', 'shadow-lg', 'bg-themeBgAlt/90');
                }
            });
        });
        layer.addEventListener('mouseleave', () => {
            layerCards.forEach(card => {
                card.classList.remove('border-themeAccent/60', 'shadow-lg', 'bg-themeBgAlt/90');
            });
        });
    });

    // ==========================================
    // 9. INSPIRATION GALLERY AUTO-SLIDER & SWIPE ENGINE
    // ==========================================
    const gallerySection = document.getElementById('inspiration-gallery');
    const slides = document.querySelectorAll('#inspiration-gallery .gallery-slide');
    const dots = document.querySelectorAll('#inspiration-gallery .gallery-dot');
    let currentSlide = 0;
    let autoplayInterval = null;
    const slideDuration = 6000; // Auto-play rotate slide every 6 seconds

    const showSlide = (index) => {
        if (slides.length === 0) return;

        // Keep index in boundary
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        currentSlide = index;

        // Toggle active slide class
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Toggle active dot class
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, slideDuration);
    };

    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    };

    // Bind indicator dot clicks
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startAutoplay(); // Reset autoplay timer on click
        });
    });

    // Start slideshow on load
    startAutoplay();

    // Horizontal Touch swipe triggers specifically for the gallery container
    if (gallerySection) {
        let touchStartGXX = 0;
        let touchStartGYY = 0;

        gallerySection.addEventListener('touchstart', (e) => {
            touchStartGXX = e.touches[0].clientX;
            touchStartGYY = e.touches[0].clientY;
        }, { passive: true });

        gallerySection.addEventListener('touchend', (e) => {
            const touchEndGXX = e.changedTouches[0].clientX;
            const touchEndGYY = e.changedTouches[0].clientY;

            const deltaX = touchStartGXX - touchEndGXX;
            const deltaY = touchStartGYY - touchEndGYY;

            // Horizontal Swipe Check: deltaX is significantly larger than deltaY
            if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    // Swiped leftwards -> Show Next Slide
                    nextSlide();
                } else {
                    // Swiped rightwards -> Show Prev Slide
                    prevSlide();
                }
                startAutoplay(); // Reset autoplay timer on manual swipe
            }
        }, { passive: true });
    }

    initScrollSystem();
});
