// Sample posts data
const posts = [
    {
        title: 'Getting Started with Stock Market Investing',
        subtitle: 'Learn the fundamentals of stock market investing and how to build a diversified portfolio for long-term growth.',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80',
        author: 'Alex Thompson',
        authorVerified: true,
        date: 'Jan 2, 2025',
        category: 'investing'
    },
    {
        title: 'Cryptocurrency: Understanding the Basics',
        subtitle: 'A comprehensive guide to understanding cryptocurrency, blockchain technology, and how to safely invest in digital assets.',
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1000&q=80',
        author: 'Sarah Chen',
        authorVerified: true,
        date: 'Jan 2, 2025',
        category: 'cryptocurrency'
    },
    {
        title: 'Creating a Monthly Budget That Works',
        subtitle: 'Practical tips and strategies for creating and sticking to a monthly budget that helps you achieve your financial goals.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
        author: 'Michael Roberts',
        authorVerified: false,
        date: 'Jan 2, 2025',
        category: 'budgeting'
    }
];

// DOM Elements
const postsGrid = document.getElementById('postsGrid');
const filterTabs = document.querySelectorAll('.filter-tab');
const categoryTabs = document.querySelectorAll('.category-tab');

// Render post card
function createPostCard(post) {
    return `
        <article class="post-card" data-category="${post.category}">
            <div class="post-actions">
                <button class="action-btn like-btn" aria-label="Like post">
                    <i class="bi bi-heart"></i>
                </button>
                <button class="action-btn copy-btn" aria-label="Copy link">
                    <i class="bi bi-link-45deg"></i>
                </button>
            </div>
            <div class="post-content">
                <div class="post-text">
                    <h2>${post.title}</h2>
                    <p class="post-subtitle">${post.subtitle}</p>
                    <div class="post-meta">
                        <span class="post-date">${post.date}</span>
                    </div>
                </div>
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
            </div>
        </article>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCategoryNav();
    initCategoryFilter();
    initToast();
    
    // Add event listeners for buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.like-btn')) {
            const btn = e.target.closest('.like-btn');
            btn.classList.toggle('liked');
        }
        
        if (e.target.closest('.copy-btn')) {
            const article = e.target.closest('.post-card');
            const title = article.querySelector('h2').textContent;
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showToast();
            });
        }
    });
});

function initCategoryFilter() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const posts = document.querySelectorAll('.post-card');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            
            // Filter posts
            posts.forEach(post => {
                if (category === 'all' || post.dataset.category === category) {
                    post.style.display = '';
                    post.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
}

function initCategoryNav() {
    const scroll = document.querySelector('.categories-scroll');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Check if navigation is needed
    function checkNavigationNeeded() {
        const isOverflowing = scroll.scrollWidth > scroll.clientWidth;
        prevBtn.style.display = isOverflowing ? '' : 'none';
        nextBtn.style.display = isOverflowing ? '' : 'none';
        
        if (isOverflowing) {
            updateNavButtons();
        }
    }
    
    // Check scroll position and update button visibility
    function updateNavButtons() {
        const isAtStart = scroll.scrollLeft <= 0;
        const isAtEnd = scroll.scrollLeft >= scroll.scrollWidth - scroll.clientWidth - 1;
        
        prevBtn.classList.toggle('hidden', isAtStart);
        nextBtn.classList.toggle('hidden', isAtEnd);
    }
    
    // Scroll by one category width
    function scrollCategories(direction) {
        const scrollAmount = scroll.clientWidth * 0.5;
        scroll.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => scrollCategories(-1));
    nextBtn.addEventListener('click', () => scrollCategories(1));
    scroll.addEventListener('scroll', updateNavButtons);
    
    // Initial check
    checkNavigationNeeded();
    
    // Update on resize
    window.addEventListener('resize', checkNavigationNeeded);
}

function initToast() {
    const toast = document.querySelector('.toast');
    const closeBtn = toast.querySelector('.toast-close');
    
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
    });
}

function showToast() {
    const toast = document.querySelector('.toast');
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Search functionality
const searchInput = document.querySelector('.search-input');
const postCards = document.querySelectorAll('.post-card');

function filterPosts(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    
    postCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        const subtitle = card.querySelector('.post-subtitle').textContent.toLowerCase();
        const category = card.dataset.category.toLowerCase();
        
        if (title.includes(searchTerm) || 
            subtitle.includes(searchTerm) || 
            category.includes(searchTerm)) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        filterPosts(e.target.value);
    });
}

// Copy link functionality
document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        
        const toast = document.querySelector('.toast');
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    });
});

// Close toast on click
document.querySelector('.toast-close')?.addEventListener('click', () => {
    document.querySelector('.toast').classList.remove('show');
});

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

// Add active class to current navigation item
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
