
document.addEventListener('DOMContentLoaded', function() {
    // --------------------------
    // Site name generation
    // --------------------------
    const generateSiteName = () => {
        const adjectives = ["Royal", "Imperial", "Majestic", "Opulent", "Luxe", "Golden", "Diamond", "Elite"];
        const nouns = ["Fortune", "Paradise", "Oasis", "Empire", "Mirage", "Crown", "Jackpot"];
        
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${adjective} ${noun}`;
    };
    
    const siteName = generateSiteName();
    document.getElementById('brand-name').textContent = siteName;
    document.getElementById('main-title').textContent = siteName;
    document.getElementById('footer-brand-name').textContent = siteName;
    
    // Update page title
    document.title = `${siteName} | Luxury Casino Resorts Worldwide`;
    
    // Update JSON-LD with site name
    const jsonLd = JSON.parse(document.getElementById('json-ld').textContent);
    jsonLd.name = `${siteName} | Luxury Casino Resorts Worldwide`;
    document.getElementById('json-ld').textContent = JSON.stringify(jsonLd, null, 4);
    
    // Set current year in the footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // --------------------------
    // Mobile menu toggle
    // --------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
        });
    });
    
    // --------------------------
    // Navbar scroll effect
    // --------------------------
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // --------------------------
    // Fetch and load images from JSON
    // --------------------------
    fetch('images.json')
        .then(response => response.json())
        .then(data => {
            // Load hero video
            if (data.hero && data.hero.video) {
                const heroVideo = document.getElementById('hero-video');
                heroVideo.src = data.hero.video;
            }
            
            // Load casinos
            if (data.casinos && Array.isArray(data.casinos)) {
                loadCasinos(data.casinos);
                updateJsonLdCasinos(data.casinos);
            }
            
            // Load gallery images
            if (data.gallery && Array.isArray(data.gallery)) {
                loadGallery(data.gallery);
            }
            
            // Load cuisine section image
            if (data.cuisine && data.cuisine.image) {
                document.getElementById('cuisine-image').style.backgroundImage = `url('${data.cuisine.image}')`;
            }
            
            // Load high stakes images
            if (data.highStakes && Array.isArray(data.highStakes)) {
                for (let i = 0; i < Math.min(data.highStakes.length, 3); i++) {
                    document.getElementById(`high-stakes-image-${i+1}`).style.backgroundImage = `url('${data.highStakes[i]}')`;
                }
            }
            
            // Load signup image
            if (data.signup && data.signup.image) {
                document.getElementById('signup-image').style.backgroundImage = `url('${data.signup.image}')`;
            }
            
            // Load themed rooms
            if (data.themedRooms && Array.isArray(data.themedRooms)) {
                loadThemedRooms(data.themedRooms);
            }
            
            // Load testimonials
            if (data.testimonials && Array.isArray(data.testimonials)) {
                loadTestimonials(data.testimonials);
            }
            
            // Load events
            if (data.events && Array.isArray(data.events)) {
                loadEvents(data.events);
            }
        })
        .catch(error => {
            console.error('Error loading images:', error);
        });
    
    // --------------------------
    // Casinos section functions
    // --------------------------
    function loadCasinos(casinos) {
        const casinoCardsContainer = document.getElementById('casino-cards');
        const visibleCasinos = casinos.slice(0, 6); // Show first 6 initially
        
        visibleCasinos.forEach((casino, index) => {
            const casinoCard = createCasinoCard(casino, index);
            casinoCardsContainer.appendChild(casinoCard);
        });
        
        // Setup load more functionality
        const loadMoreButton = document.getElementById('load-more-casinos');
        const spinner = document.getElementById('load-spinner');
        
        if (casinos.length <= 6) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.addEventListener('click', () => {
                // Show spinner
                spinner.classList.remove('hidden');
                
                // Simulate loading delay
                setTimeout(() => {
                    const nextCasinos = casinos.slice(6);
                    nextCasinos.forEach((casino, index) => {
                        const casinoCard = createCasinoCard(casino, index + 6);
                        casinoCardsContainer.appendChild(casinoCard);
                        
                        // Add AOS attributes dynamically
                        casinoCard.setAttribute('data-aos', 'fade-up');
                        casinoCard.setAttribute('data-aos-delay', (index * 100).toString());
                    });
                    
                    // Initialize AOS for new elements
                    AOS.refresh();
                    
                    // Hide spinner and button
                    spinner.classList.add('hidden');
                    loadMoreButton.style.display = 'none';
                }, 1500);
            });
        }
    }
    
    function createCasinoCard(casino, index) {
        const delay = index * 100;
        
        const card = document.createElement('div');
        card.className = 'casino-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', delay.toString());
        
        card.innerHTML = `
            <div class="h-64 bg-cover bg-center" style="background-image: url('${casino.image}')"></div>
            <div class="p-6">
                <div class="flex items-center mb-2">
                    <h3 class="text-xl font-bold font-playfair mr-2">${casino.name}</h3>
                    <span class="flag-icon">${getFlagIcon(casino.country)}</span>
                </div>
                <div class="flex text-gold mb-3">
                    ${getStarRating(casino.rating)}
                </div>
                <p class="text-gray-600 mb-4 line-clamp-2">${casino.description}</p>
                <button class="btn-text learn-more" data-casino-index="${index}">Learn More <i class="fas fa-arrow-right ml-2"></i></button>
            </div>
        `;
        
        // Add event listener to the Learn More button
        setTimeout(() => {
            const learnMoreBtn = card.querySelector('.learn-more');
            learnMoreBtn.addEventListener('click', () => {
                openCasinoModal(casino);
            });
        }, 0);
        
        return card;
    }
    
    function getFlagIcon(country) {
        // Simple implementation - in a real project, use an actual flag library
        const countryMap = {
            'USA': '🇺🇸',
            'Singapore': '🇸🇬',
            'Monaco': '🇲🇨',
            'Macau': '🇲🇴',
            'Australia': '🇦🇺',
            'UAE': '🇦🇪',
            'UK': '🇬🇧',
            'France': '🇫🇷',
            'Germany': '🇩🇪',
            'Japan': '🇯🇵'
        };
        
        return countryMap[country] || '🏳️';
    }
    
    function getStarRating(rating) {
        let stars = '';
        for (let i = 0; i < rating; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        return stars;
    }
    
    function openCasinoModal(casino) {
        const modal = document.getElementById('casino-modal');
        
        // Populate modal content
        document.getElementById('casino-modal-image').style.backgroundImage = `url('${casino.image}')`;
        document.getElementById('casino-modal-name').textContent = casino.name;
        document.getElementById('casino-modal-flag').innerHTML = getFlagIcon(casino.country);
        document.getElementById('casino-modal-rating').innerHTML = getStarRating(casino.rating);
        document.getElementById('casino-modal-description').textContent = casino.fullDescription || casino.description;
        
        // Populate gaming options
        const gamesEl = document.getElementById('casino-modal-games');
        gamesEl.innerHTML = '';
        if (casino.games && Array.isArray(casino.games)) {
            casino.games.forEach(game => {
                const li = document.createElement('li');
                li.textContent = game;
                gamesEl.appendChild(li);
            });
        }
        
        // Populate amenities
        const amenitiesEl = document.getElementById('casino-modal-amenities');
        amenitiesEl.innerHTML = '';
        if (casino.amenities && Array.isArray(casino.amenities)) {
            casino.amenities.forEach(amenity => {
                const li = document.createElement('li');
                li.textContent = amenity;
                amenitiesEl.appendChild(li);
            });
        }
        
        // Set address and website
        document.getElementById('casino-modal-address').textContent = casino.address || 'Address information not available';
        const websiteBtn = document.getElementById('casino-modal-website');
        if (casino.website) {
            websiteBtn.href = casino.website;
        } else {
            websiteBtn.href = '#';
        }
        
        // Show the modal
        modal.classList.remove('hidden');
        
        // Setup close button
        document.getElementById('close-casino-modal').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    
    function updateJsonLdCasinos(casinos) {
        const jsonLd = JSON.parse(document.getElementById('json-ld').textContent);
        
        jsonLd.mainEntity.itemListElement = casinos.map((casino, index) => {
            return {
                "@type": "LodgingBusiness",
                "position": index + 1,
                "name": casino.name,
                "image": casino.image,
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": casino.country
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": casino.rating,
                    "bestRating": "5",
                    "reviewCount": Math.floor(Math.random() * 1000) + 100
                }
            };
        });
        
        document.getElementById('json-ld').textContent = JSON.stringify(jsonLd, null, 4);
    }
    
    // --------------------------
    // Gallery section functions
    // --------------------------
    function loadGallery(images) {
        const galleryWrapper = document.querySelector('.gallery-swiper .swiper-wrapper');
        
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${image}" alt="Gallery image ${index + 1}" class="w-full h-64 md:h-80 object-cover rounded-lg" loading="lazy">
            `;
            galleryWrapper.appendChild(slide);
            
            // Add click event for lightbox
            slide.addEventListener('click', () => {
                openLightbox(image);
            });
        });
        
        // Initialize Swiper
        const gallerySwiper = new Swiper('.gallery-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            lazy: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.gallery-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.gallery-swiper .swiper-button-next',
                prevEl: '.gallery-swiper .swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    function openLightbox(imageSrc) {
        const lightbox = document.getElementById('gallery-lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        lightboxImage.src = imageSrc;
        lightbox.classList.remove('hidden');
        
        // Setup close button
        document.getElementById('lightbox-close').addEventListener('click', () => {
            lightbox.classList.add('hidden');
        });
        
        // Close on click outside
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
            }
        });
    }
    
    // --------------------------
    // Themed Rooms section
    // --------------------------
    function loadThemedRooms(rooms) {
        const roomsContainer = document.getElementById('themed-rooms-container');
        
        rooms.forEach((room, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="p-4">
                    <div class="spotlight-card">
                        <div class="h-72 bg-cover bg-center rounded-t-lg" style="background-image: url('${room.image}')"></div>
                        <div class="p-6 bg-dark-card rounded-b-lg">
                            <h3 class="text-xl font-playfair font-bold text-gold mb-2">${room.name}</h3>
                            <p class="text-gray-300 mb-4">${room.description}</p>
                            <div class="flex justify-between items-center">
                                <div class="text-gold font-bold">From ${room.price}</div>
                                <a href="#" class="btn-text">Book Now <i class="fas fa-arrow-right ml-2"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            roomsContainer.appendChild(slide);
        });
        
        // Initialize Swiper
        const roomsSwiper = new Swiper('.themed-rooms-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            lazy: true,
            pagination: {
                el: '.themed-rooms-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.themed-rooms-swiper .swiper-button-next',
                prevEl: '.themed-rooms-swiper .swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // --------------------------
    // Testimonials section
    // --------------------------
    function loadTestimonials(testimonials) {
        const testimonialsContainer = document.getElementById('testimonials-container');
        
        testimonials.forEach(testimonial => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="p-4">
                    <div class="testimonial-card">
                        <div class="flex items-center mb-4">
                            <img src="${testimonial.image}" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover">
                            <div class="ml-3">
                                <h4 class="font-bold">${testimonial.name}</h4>
                                <p class="text-sm text-gray-500">${testimonial.location}</p>
                            </div>
                        </div>
                        <div class="flex text-gold mb-3">
                            ${getStarRating(testimonial.rating)}
                        </div>
                        <p class="text-gray-600 italic">"${testimonial.comment}"</p>
                    </div>
                </div>
            `;
            testimonialsContainer.appendChild(slide);
        });
        
        // Initialize Swiper
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.testimonials-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // --------------------------
    // Events section
    // --------------------------
    function loadEvents(events) {
        const eventsContainer = document.getElementById('events-container');
        
        events.forEach((event, index) => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="p-4">
                    <div class="event-card shadow">
                        <div class="h-48 bg-cover bg-center" style="background-image: url('${event.image}')"></div>
                        <div class="p-6">
                            <div class="flex items-center mb-2">
                                <i class="far fa-calendar-alt text-gold mr-2"></i>
                                <span class="text-gray-500">${formattedDate}</span>
                            </div>
                            <h3 class="text-xl font-playfair font-bold mb-2">${event.title}</h3>
                            <p class="text-gray-600 mb-4 line-clamp-2">${event.description}</p>
                            
                            <div class="mb-4">
                                <p class="text-sm font-medium text-gray-500">Event begins in:</p>
                                <div class="flex space-x-2 text-xs mt-1">
                                    <div class="bg-gray-100 rounded px-2 py-1">
                                        <span class="event-countdown" data-date="${event.date}">Loading...</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button class="btn-primary w-full event-rsvp" data-event-index="${index}">RSVP</button>
                        </div>
                    </div>
                </div>
            `;
            eventsContainer.appendChild(slide);
        });
        
        // Initialize Swiper
        const eventsSwiper = new Swiper('.events-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.events-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
                1280: {
                    slidesPerView: 4,
                }
            }
        });
        
        // Setup event countdown timers
        const countdownElements = document.querySelectorAll('.event-countdown');
        countdownElements.forEach(element => {
            updateEventCountdown(element);
            setInterval(() => updateEventCountdown(element), 1000);
        });
        
        // Setup RSVP buttons
        const rsvpButtons = document.querySelectorAll('.event-rsvp');
        rsvpButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                openEventModal(events[index]);
            });
        });
    }
    
    function updateEventCountdown(element) {
        const targetDate = new Date(element.dataset.date);
        const currentDate = new Date();
        const difference = targetDate - currentDate;
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            
            element.textContent = `${days}d ${hours}h ${minutes}m`;
        } else {
            element.textContent = "Event in progress";
        }
    }
    
    function openEventModal(event) {
        const modal = document.getElementById('event-modal');
        
        // Populate modal content
        document.getElementById('event-modal-image').style.backgroundImage = `url('${event.image}')`;
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        document.getElementById('event-modal-date').textContent = formattedDate;
        document.getElementById('event-modal-title').textContent = event.title;
        document.getElementById('event-modal-description').textContent = event.fullDescription || event.description;
        document.getElementById('event-modal-location').textContent = event.location || 'Main Casino Floor';
        document.getElementById('event-modal-time').textContent = event.time || '8:00 PM - 11:00 PM';
        document.getElementById('event-modal-price').textContent = event.price || 'VIP Members: Free, Guests: $100';
        
        // Show the modal
        modal.classList.remove('hidden');
        
        // Setup close button
        document.getElementById('close-event-modal').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        // RSVP button
        document.getElementById('event-rsvp-btn').addEventListener('click', () => {
            modal.classList.add('hidden');
            showToast('Success', 'Your RSVP has been confirmed. We look forward to seeing you!');
        });
    }
    
    // --------------------------
    // Main countdown timer
    // --------------------------
    function startCountdown() {
        // Set the event date to 30 days from now
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + 30);
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        function updateCountdown() {
            const currentDate = new Date();
            const difference = eventDate - currentDate;
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    startCountdown();
    
    // --------------------------
    // Form validation
    // --------------------------
    const vipForm = document.getElementById('vip-form');
    
    vipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateVipForm()) {
            const submitBtn = document.getElementById('submit-btn');
            const spinner = document.getElementById('submit-spinner');
            
            // Show spinner
            spinner.classList.remove('hidden');
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Hide spinner
                spinner.classList.add('hidden');
                submitBtn.disabled = false;
                
                // Reset form
                vipForm.reset();
                
                // Show success modal
                const successModal = document.getElementById('success-modal');
                document.getElementById('success-message').textContent = 'Thank you for joining our VIP club! Your application has been received and we will contact you shortly.';
                successModal.classList.remove('hidden');
                
                // Setup close button
                document.getElementById('close-success-modal').addEventListener('click', () => {
                    successModal.classList.add('hidden');
                });
            }, 2000);
        }
    });
    
    function validateVipForm() {
        let isValid = true;
        
        // Name validation
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        if (!nameInput.value.trim()) {
            nameError.classList.remove('hidden');
            isValid = false;
        } else {
            nameError.classList.add('hidden');
        }
        
        // Email validation
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            emailError.classList.remove('hidden');
            isValid = false;
        } else {
            emailError.classList.add('hidden');
        }
        
        // Country validation
        const countryInput = document.getElementById('country');
        const countryError = document.getElementById('country-error');
        if (!countryInput.value) {
            countryError.classList.remove('hidden');
            isValid = false;
        } else {
            countryError.classList.add('hidden');
        }
        
        // Casino type validation
        const casinoTypeInputs = document.querySelectorAll('input[name="casino-type"]');
        const casinoTypeError = document.getElementById('casino-type-error');
        let casinoTypeSelected = false;
        casinoTypeInputs.forEach(input => {
            if (input.checked) {
                casinoTypeSelected = true;
            }
        });
        
        if (!casinoTypeSelected) {
            casinoTypeError.classList.remove('hidden');
            isValid = false;
        } else {
            casinoTypeError.classList.add('hidden');
        }
        
        return isValid;
    }
    
    // Newsletter form validation
    const newsletterForm = document.getElementById('newsletter-form');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        const emailError = document.getElementById('newsletter-error');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailPattern.test(emailInput.value)) {
            emailError.classList.remove('hidden');
        } else {
            emailError.classList.add('hidden');
            emailInput.value = '';
            showToast('Subscribed!', 'Thank you for subscribing to our newsletter.');
        }
    });
    
    // --------------------------
    // Toast notification
    // --------------------------
    function showToast(title, message) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-message').textContent = message;
        
        // Show toast
        toast.classList.remove('translate-y-16', 'opacity-0');
        
        // Hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-16', 'opacity-0');
        }, 5000);
    }
    
    // --------------------------
    // Accordion functionality
    // --------------------------
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = document.getElementById(button.getAttribute('aria-controls'));
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            button.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle visibility of content
            content.classList.toggle('hidden');
            content.classList.toggle('active');
            
            // Toggle plus/minus icons
            const plusIcon = button.querySelector('.fa-plus');
            const minusIcon = button.querySelector('.fa-minus');
            plusIcon.classList.toggle('hidden');
            minusIcon.classList.toggle('hidden');
        });
    });
    
    // --------------------------
    // Back to top button
    // --------------------------
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // --------------------------
    // Smooth scrolling for all anchor links
    // --------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --------------------------
    // Initialize AOS animations
    // --------------------------
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
});
