// Helper: Get the month index difference between two Date objects
function getMonthIndex(baseDate, compareDate) {
    return (compareDate.getFullYear() - baseDate.getFullYear()) * 12 + (compareDate.getMonth() - baseDate.getMonth());
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission handling
const rsvpForm = document.querySelector('.rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.attending) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your RSVP! We\'ll be in touch soon.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add some interactive hover effects
document.querySelectorAll('.detail-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .detail-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style); 

// === INTERACTIVE TIMELINE LOGIC ===
// Load and parse the CSV file using PapaParse
const CSV_PATH = 'Timelines/Wedding Planning - Photo Timeline.csv';
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
let filteredTimeline = [];

// Helper: Try to find the correct photo file for a given title
function findPhotoFile(title, callback) {
    const base = title.trim();
    const exts = ['.jpg', '.jpeg', '.png', '.gif'];
    let found = false;
    let idx = 0;
    function tryNext() {
        if (idx >= exts.length) {
            callback(null); // Not found
            return;
        }
        const file = base + exts[idx];
        const img = new Image();
        img.onload = function() { found = true; callback(file); };
        img.onerror = function() { idx++; tryNext(); };
        // Use encodeURIComponent to properly encode the filename for URL
        img.src = `Photos/${encodeURIComponent(file)}`;
    }
    tryNext();
}

// Helper: Parse date in MM/DD/YYYY or M/D/YYYY format
function parseDate(str) {
    // Accepts MM/DD/YYYY or M/D/YYYY
    if (!str) return null;
    const parts = str.trim().split(/[\/-]/);
    if (parts.length === 3) {
        let [m, d, y] = parts;
        if (y.length === 2) y = '20' + y; // handle 2-digit years
        const date = new Date(+y, +m - 1, +d);
        if (!isNaN(date.getTime())) return date;
    }
    // Try Date constructor as fallback
    const date = new Date(str);
    if (!isNaN(date.getTime())) return date;
    console.warn('Unparseable date:', str);
    return null;
}

// Modified CSV parsing to guess extensions
function parseTimelineCSV(results) {
    console.log('Parsing timeline CSV, results:', results);
    const data = results.data;
    let rows = data;
    if (rows.length && rows[0][0].toLowerCase().includes('time')) {
        rows = rows.slice(1);
    }
    console.log('Processing rows:', rows.length);
    filteredTimeline = rows
        .map(row => {
            const [date, title] = row;
            const parsedDate = parseDate(date);
            if (!parsedDate || !title) return null;
            return { date: parsedDate, title: title.trim(), file: null };
        })
        .filter(Boolean)
        .sort((a, b) => a.date - b.date);
    console.log('Filtered timeline before file assignment:', filteredTimeline.length);
    // Now assign file names (as before)
    let pending = filteredTimeline.length;
    if (pending === 0) {
        console.log('No timeline items found');
        onTimelineDataReady();
        return;
    }
    filteredTimeline.forEach((item, i) => {
        findPhotoFile(item.title, function(file) {
            if (file) {
                filteredTimeline[i].file = file;
                console.log('Found file for', item.title, ':', file);
            } else {
                filteredTimeline[i].file = null;
                console.log('No file found for', item.title);
            }
            if (--pending === 0) {
                filteredTimeline = filteredTimeline.filter(item => item.file);
                console.log('Final filtered timeline length:', filteredTimeline.length);
                onTimelineDataReady();
            }
        });
    });
}

function loadTimelineCSV() {
    Papa.parse(CSV_PATH, {
        download: true,
        complete: parseTimelineCSV,
        error: function(error) {
            console.error('Error loading timeline CSV:', error);
        },
        skipEmptyLines: true
    });
}

// Timeline SVG drawing for a moving window of 5 months with smooth scrolling
function drawTimelineSVGWindowSmooth(data, centerMonthIdx) {
    const svg = document.getElementById('timeline-svg');
    if (!svg || !data.length) return;
    const width = svg.width.baseVal.value;
    const height = svg.height.baseVal.value;
    svg.innerHTML = '';

    // Find the min date for month calculations
    const minDate = new Date(data[0].date);
    // We'll show a window of 5 months, but allow fractional center
    const windowMonths = 5;
    const centerY = height / 2;
    const monthSpacing = height / windowMonths;
    const lineX = 30; // vertical line at x=30
    // Draw timeline line (no filter)
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', lineX);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', lineX);
    line.setAttribute('y2', height);
    line.setAttribute('stroke', '#3a2c1a');
    line.setAttribute('stroke-width', '3.5');
    svg.appendChild(line);

    // Draw ticks and labels for a range of months centered on centerMonthIdx
    const minTick = Math.floor(centerMonthIdx - windowMonths / 2) - 2;
    const maxTick = Math.ceil(centerMonthIdx + windowMonths / 2) + 2;
    for (let monthIdx = minTick; monthIdx <= maxTick; monthIdx++) {
        if (monthIdx < 0) continue;
        const y = centerY + (monthIdx - centerMonthIdx) * monthSpacing;
        if (y < -40 || y > height + 40) continue; // Only draw visible ticks
        const d = new Date(minDate.getFullYear(), minDate.getMonth() + monthIdx, 1);
        const isYear = d.getMonth() === 0;
        const tickLength = isYear ? 32 : 16;
        const tickColor = isYear ? '#3a2c1a' : '#7c6a4a';
        // Tick mark (right side only, no filter)
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', lineX);
        tick.setAttribute('y1', y);
        tick.setAttribute('x2', lineX + tickLength);
        tick.setAttribute('y2', y);
        tick.setAttribute('stroke', tickColor);
        tick.setAttribute('stroke-width', isYear ? '3' : '2');
        svg.appendChild(tick);
        // Label (right side only)
        if (isYear) {
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', lineX + tickLength + 10);
            label.setAttribute('y', y + 6);
            label.setAttribute('text-anchor', 'start');
            label.setAttribute('font-size', '1.1rem');
            label.setAttribute('fill', '#3a2c1a');
            label.setAttribute('font-family', 'Cormorant Garamond, Playfair Display, serif');
            label.setAttribute('font-weight', '700');
            label.textContent = d.getFullYear();
            svg.appendChild(label);
        }
        // Label every month except January
        if (d.getMonth() !== 0) {
            const monthLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            monthLabel.setAttribute('x', lineX + tickLength + 10);
            monthLabel.setAttribute('y', y + 5);
            monthLabel.setAttribute('text-anchor', 'start');
            monthLabel.setAttribute('font-size', '0.95rem');
            monthLabel.setAttribute('fill', '#7c6a4a');
            monthLabel.setAttribute('font-family', 'Cormorant Garamond, Playfair Display, serif');
            monthLabel.textContent = d.toLocaleString('default', { month: 'short' });
            svg.appendChild(monthLabel);
        }
        // (No photo dots)
    }
}

// Scroll-driven logic (uses filteredTimeline)
let timelineSection = null;
let photoImg = null;

// Initialize timeline elements when DOM is ready
function initializeTimelineElements() {
    timelineSection = document.getElementById('story');
    photoImg = document.getElementById('timeline-photo');
    console.log('Timeline elements initialized:', { timelineSection: !!timelineSection, photoImg: !!photoImg });
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Helper: Get the latest photo whose date is <= the current center month
function getPhotoForCenterMonth(filteredTimeline, minDate, centerMonthIdx) {
    let bestIdx = 0;
    let bestMonthIdx = -1;
    for (let i = 0; i < filteredTimeline.length; i++) {
        const monthIdx = getMonthIndex(minDate, filteredTimeline[i].date);
        if (monthIdx <= centerMonthIdx && monthIdx >= bestMonthIdx) {
            bestMonthIdx = monthIdx;
            bestIdx = i;
        }
    }
    return filteredTimeline[bestIdx];
}

// Helper: Get the latest quote whose date is <= the current center date
function getQuoteForCenterDate(quotesTimeline, centerDate) {
    let bestIdx = 0;
    let bestTime = -Infinity;
    for (let i = 0; i < quotesTimeline.length; i++) {
        const quoteTime = quotesTimeline[i].date.getTime();
        if (quoteTime <= centerDate.getTime() && quoteTime >= bestTime) {
            bestTime = quoteTime;
            bestIdx = i;
        }
    }
    return quotesTimeline[bestIdx];
}

// === QUOTES LOGIC ===
const QUOTES_CSV_PATH = 'Timelines/Notes for Wedding Website.csv';
let quotesTimeline = [];

function parseQuotesCSV(results) {
    console.log('Parsing quotes CSV, results:', results);
    const data = results.data;
    let rows = data;
    if (rows.length && rows[0][0].toLowerCase().includes('date')) {
        rows = rows.slice(1);
    }
    console.log('Processing quote rows:', rows.length);
    quotesTimeline = rows
        .map(row => {
            const [date, quote] = row;
            const parsedDate = parseDate(date);
            if (!parsedDate || !quote) return null;
            return { date: parsedDate, quote: quote.trim().replace(/^"|"$/g, '') };
        })
        .filter(Boolean)
        .sort((a, b) => a.date - b.date);
    console.log('Quotes timeline length:', quotesTimeline.length);
}

function loadQuotesCSV() {
    Papa.parse(QUOTES_CSV_PATH, {
        download: true,
        complete: parseQuotesCSV,
        error: function(error) {
            console.error('Error loading quotes CSV:', error);
        },
        skipEmptyLines: true
    });
}

// Helper: Get the latest quote whose date is <= the current center month
function getQuoteForCenterMonth(quotesTimeline, minDate, centerMonthIdx) {
    let bestIdx = 0;
    let bestMonthIdx = -1;
    for (let i = 0; i < quotesTimeline.length; i++) {
        const monthIdx = getMonthIndex(minDate, quotesTimeline[i].date);
        if (monthIdx <= centerMonthIdx && monthIdx >= bestMonthIdx) {
            bestMonthIdx = monthIdx;
            bestIdx = i;
        }
    }
    return quotesTimeline[bestIdx];
}

// Helper: Compute relationship duration since 12/1/2018
function getRelationshipDuration(centerDate) {
    const start = new Date(2018, 11, 1); // Months are 0-indexed
    let end = centerDate;
    if (end < start) end = start;
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
        months--;
        // Get days in previous month
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return `${years} Year${years !== 1 ? 's' : ''}, ${months} Month${months !== 1 ? 's' : ''}, ${days} Day${days !== 1 ? 's' : ''}`;
}

// Helper: Get the exact fractional date for the center of the timeline
function getFractionalCenterDate(minDate, centerMonthIdx) {
    // Get the integer part (months) and fractional part
    const intMonths = Math.floor(centerMonthIdx);
    const frac = centerMonthIdx - intMonths;
    // Start at the first of the month
    const baseDate = new Date(minDate.getFullYear(), minDate.getMonth() + intMonths, 1);
    // Get days in this month
    const nextMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
    const daysInMonth = (nextMonth - baseDate) / (1000 * 60 * 60 * 24);
    // Add fractional days
    const day = 1 + Math.round(frac * daysInMonth);
    // Clamp to valid day in month
    const resultDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), Math.min(day, daysInMonth));
    return resultDate;
}

// Dynamically set scroll-container height for scrollytelling
function setScrollContainerHeight() {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer || !filteredTimeline.length) {
        console.log('Cannot set scroll container height:', !scrollContainer ? 'no scroll container' : 'no filtered timeline');
        return;
    }
    // Each photo gets a viewport height worth of scroll, but cap it at a reasonable maximum
    const baseHeight = window.innerHeight * filteredTimeline.length;
    const minHeight = Math.min(baseHeight, window.innerHeight * 20); // Cap at 20 viewport heights
    scrollContainer.style.minHeight = minHeight + 'px';
    console.log('Set scroll container height to:', minHeight, 'px (base was:', baseHeight, 'px)');
}

// Update scroll-container height when timeline data is loaded or window is resized
function onTimelineDataReady() {
    console.log('Timeline data ready, filtered timeline length:', filteredTimeline.length);
    setScrollContainerHeight();
    // Initial draw to set the SVG size and position
    drawTimelineSVGWindowSmooth(filteredTimeline, 0); 
    updateTimelineOnScroll();
    // Add scroll event listeners now that data is ready
    addScrollEventListeners();
}

// Update scroll-driven logic to use smooth moving window and correct photo/quote/duration snapping
function updateTimelineOnScroll() {
    if (!timelineSection || !filteredTimeline.length) {
        console.log('Timeline section or filtered timeline not ready:', { 
            timelineSection: !!timelineSection, 
            filteredTimelineLength: filteredTimeline ? filteredTimeline.length : 0 
        });
        return;
    }
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) {
        console.log('Scroll container not found');
        return;
    }
    const rect = scrollContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScroll = scrollContainer.offsetHeight - windowHeight;
    const scrolled = clamp(-rect.top, 0, totalScroll);
    const progress = totalScroll > 0 ? scrolled / totalScroll : 0;
    
    console.log('Scroll progress:', progress, 'scrolled:', scrolled, 'totalScroll:', totalScroll);
    
    // Calculate floating month index
    const minDate = new Date(filteredTimeline[0].date);
    const maxDate = new Date(filteredTimeline[filteredTimeline.length - 1].date);
    const totalMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());
    const centerMonthIdx = progress * totalMonths;
    
    console.log('Center month index:', centerMonthIdx);
    
    // Find the latest photo whose date is <= the current center month
    const photo = getPhotoForCenterMonth(filteredTimeline, minDate, centerMonthIdx);
    if (photo) {
        console.log('Setting photo:', photo.file);
        photoImg.src = `Photos/${encodeURIComponent(photo.file)}`;
        photoImg.style.display = 'block';
    } else {
        console.log('No photo found for current month');
        photoImg.style.display = 'none';
    }
    // Draw the smoothly moving window timeline
    drawTimelineSVGWindowSmooth(filteredTimeline, centerMonthIdx);

    // QUOTES: Find and display the latest quote for the current center date
    const centerDate = getFractionalCenterDate(minDate, centerMonthIdx);
    const quoteObj = getQuoteForCenterDate(quotesTimeline, centerDate);
    const quoteDiv = document.querySelector('.timeline-right');
    if (quoteDiv) {
        let quoteHtml = '';
        const titleHtml = '<div class="quotes-title">Ben\'s Notes to Self</div>';
        if (quoteObj) {
            // Replace line breaks with <br>
            const quoteHtmlText = quoteObj.quote.replace(/\r?\n/g, '<br>');
            quoteHtml = `<div class=\"quote-text\">&ldquo;${quoteHtmlText}&rdquo;</div>`;
            console.log('Setting quote:', quoteObj.quote.substring(0, 50) + '...');
        } else {
            quoteHtml = '<div class="quote-placeholder">(Quotes/text coming soon)</div>';
            console.log('No quote found for current date');
        }
        quoteDiv.innerHTML = titleHtml + quoteHtml;
    }

    // RELATIONSHIP DURATION: Compute and display under the photo
    if (document.getElementById('relationship-duration')) {
        const duration = getRelationshipDuration(centerDate);
        document.getElementById('relationship-duration').textContent = duration;
        console.log('Setting duration:', duration);
    }
}

// Load quotes CSV on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTimelineElements();
    loadTimelineCSV();
    loadQuotesCSV();
    // These will be called after the CSV data is loaded
    // setScrollContainerHeight();
    // updateTimelineOnScroll();
});

// Add scroll event listeners after timeline data is ready
function addScrollEventListeners() {
    console.log('Adding scroll event listeners');
    window.addEventListener('scroll', updateTimelineOnScroll);
    window.addEventListener('resize', () => {
        setScrollContainerHeight();
        updateTimelineOnScroll();
    });
    
    // Also trigger an initial update
    setTimeout(() => {
        console.log('Triggering initial timeline update');
        updateTimelineOnScroll();
    }, 100);
} 