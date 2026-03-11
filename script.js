// Wait for DOM to load fully
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Dynamic Dates
    const setDynamicDates = () => {
        const dateElement = document.getElementById("current-date");
        const yearElement = document.getElementById("year");
        
        if (dateElement) {
            const today = new Date();
            // E.g., "October 14, 2023"
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            dateElement.textContent = today.toLocaleDateString('en-US', options);
        }
        
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    };

    setDynamicDates();

    // 2. Countdown Timer Logic (15:00)
    let timeInSeconds = 15 * 60; // 15 mins
    const countdownElement = document.getElementById("countdown");

    if (countdownElement) {
        // Try to get saved time from sessionStorage so it doesn't reset on page refresh
        const savedTime = sessionStorage.getItem('mitolynCountdownTime');
        
        if (savedTime && !isNaN(savedTime) && savedTime > 0) {
            timeInSeconds = parseInt(savedTime, 10);
        }

        const updateCountdown = () => {
            const minutes = Math.floor(timeInSeconds / 60);
            let seconds = timeInSeconds % 60;
            
            // Format to always have 2 digits
            const formattedMin = minutes < 10 ? "0" + minutes : minutes;
            const formattedSec = seconds < 10 ? "0" + seconds : seconds;

            countdownElement.textContent = `${formattedMin}:${formattedSec}`;

            if (timeInSeconds > 0) {
                timeInSeconds--;
                // Save time every second
                sessionStorage.setItem('mitolynCountdownTime', timeInSeconds);
            } else {
                // If it hits 0, it stays at 0
                countdownElement.textContent = "00:00";
            }
        };

        // Initialize and interval
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // 3. Smooth tactile interactions for buttons (removes delay on old mobile browsers)
    const attachTouchEffects = (selectors) => {
        selectors.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.addEventListener('touchstart', () => {
                    el.style.transform = 'scale(0.97)';
                    el.style.transition = 'transform 0.1s';
                }, { passive: true });
                
                el.addEventListener('touchend', () => {
                    el.style.transform = '';
                }, { passive: true });
                
                el.addEventListener('touchcancel', () => {
                    el.style.transform = '';
                }, { passive: true });
            }
        });
    };

    attachTouchEffects(['#video-cta-link', '#cta-button']);
    
    // Pass user's click ID logic (Future extension if using ClickBank tracking)
    // You can parse URL parameters and append them to the ClickBank links
    const appendTrackingParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        // Ex: ?tid=tiktok_bio
        const tid = urlParams.get('tid') || 'tiktok_organic'; 
        
        const links = document.querySelectorAll('a[href*="hop.clickbank.net"]');
        links.forEach(link => {
            try {
                const url = new URL(link.href);
                // In ClickBank, tracking parameter is usually 'tid'
                if(!url.searchParams.has('tid')) {
                    url.searchParams.append('tid', tid);
                }
                link.href = url.toString();
            } catch (e) {
                console.error("Invalid URL format in href", e);
            }
        });
    };
    
    appendTrackingParams();
});
