document.addEventListener('DOMContentLoaded', function () {
    const headlinesWrapper = document.querySelector('.headlines-wrapper');
    const headlines = document.querySelectorAll('.headline');
    const navDots = document.querySelector('.nav-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let interval;

    function updateSlidePosition() {
        headlinesWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active dot
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    goToSlide(currentIndex)
    function goToSlide(index) {
        currentIndex = index;
        updateSlidePosition();
        resetInterval();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % headlines.length;
        updateSlidePosition();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + headlines.length) % headlines.length;
        updateSlidePosition();
    }

    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 3000);
    }

    // Event listeners for controls
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    // Initial setup
    resetInterval();

    // Pause on hover
    headlinesWrapper.addEventListener('mouseenter', () => clearInterval(interval));
    headlinesWrapper.addEventListener('mouseleave', resetInterval);

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    headlinesWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(interval);
    });

    headlinesWrapper.addEventListener('touchmove', (e) => {
        e.preventDefault();
        touchEndX = e.touches[0].clientX;
    });

    headlinesWrapper.addEventListener('touchend', () => {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) { // Minimum swipe distance
            if (difference > 0) { // Swipe left
                nextSlide();
            } else { // Swipe right
                prevSlide();
            }
        }
        resetInterval();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        }
    });
});


// Main Article Section
// Add click handlers for read more links
document.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // You could add analytics tracking here
        console.log('Article clicked:', e.target.closest('.news-item').querySelector('.news-title').textContent);
    });
});

// Add lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const carousel = new bootstrap.Carousel(document.querySelector('#newsCarousel'), {
        interval: 5000,     // Auto-slide interval
        ride: 'carousel',   // Enable auto-sliding
        wrap: true,        // Enable continuous loop
        pause: 'hover',    // Pause on hover
        touch: true,       // Enable touch swipe
        rtl: false         // Enable RTL mode
    });

    // Swap next/prev buttons functionality for RTL
    const carouselElement = document.querySelector('#newsCarousel');
    const nextButton = carouselElement.querySelector('.carousel-control-next');
    const prevButton = carouselElement.querySelector('.carousel-control-prev');

    nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        carousel.prev();
    });

    prevButton.addEventListener('click', function (e) {
        e.preventDefault();
        carousel.next();
    });

    // Handle touch events for RTL
    let touchStartX = 0;
    let touchEndX = 0;

    carouselElement.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, false);

    carouselElement.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX) {
            carousel.prev(); // Swipe right to left
        }
        if (touchEndX > touchStartX) {
            carousel.next(); // Swipe left to right
        }
    }
});


$(document).ready(function () {
    $('.latest-news-carousel.owl-carousel').owlCarousel({
        items: 1, // Number of items to display
        loop: true, // Enable looping
        margin: 10, // Space between items
        autoplay: true, // Enable autoplay
        autoplayTimeout: 3000, // Time between transitions (3 seconds)
        autoplayHoverPause: true, // Pause on hover
        responsive: {
            0: {
                items: 1 // For mobile devices
            },
            768: {
                items: 1 // For tablets
            },
            1024: {
                items: 2 // For desktops
            }
        }
    });
});

$(document).ready(function () {
    $('.nav-what-item a').on('click', function () {
        // Remove active classes from all tabs
        $('.nav-what-item a').removeClass('bg-dark text-white').addClass('bg-light text-dark');

        // Add active classes to the clicked tab
        $(this).removeClass('bg-light text-dark').addClass('bg-dark text-white');
    });
});

    // What's New carousel
    $(".whats-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });