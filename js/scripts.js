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

// Sample blog posts data
const blogPosts = [
    {
        id: 1,
        title: 'Getting Started with Stock Market Investing',
        excerpt: 'Learn the fundamentals of stock market investing and how to build a diversified portfolio for long-term growth.',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        tags: ['investing', 'stocks'],
        date: '2025-01-01',
        readTime: '5 min read'
    },
    {
        id: 2,
        title: 'Cryptocurrency: Understanding the Basics',
        excerpt: 'A comprehensive guide to understanding cryptocurrency, blockchain technology, and how to safely invest in digital assets.',
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        tags: ['crypto', 'investing'],
        date: '2025-01-01',
        readTime: '7 min read'
    },
    {
        id: 3,
        title: 'Creating a Monthly Budget That Works',
        excerpt: 'Practical tips and strategies for creating and sticking to a monthly budget that helps you achieve your financial goals.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        tags: ['budgeting', 'personal-finance'],
        date: '2025-01-01',
        readTime: '4 min read'
    }
];

// DOM Elements
const blogGrid = document.getElementById('blogGrid');
const searchInput = document.getElementById('searchInput');
const tagContainer = document.getElementById('tagContainer');

// Current filter state
let currentTag = 'all';
let searchQuery = '';

// Render blog post card
function createBlogCard(post) {
    return `
        <a href="article.html?id=${post.id}" class="blog-card-link">
            <article class="blog-card">
                <img src="${post.image}" alt="${post.title}" class="blog-card-image">
                <div class="blog-card-content">
                    <div class="blog-card-tags">
                        ${post.tags.map(tag => `<span class="blog-card-tag">#${tag}</span>`).join('')}
                    </div>
                    <h2 class="blog-card-title">${post.title}</h2>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <div class="blog-card-meta">
                        <span>${post.date}</span>
                        <span>${post.readTime}</span>
                    </div>
                </div>
            </article>
        </a>
    `;
}

// Filter and render posts
function filterAndRenderPosts() {
    const filteredPosts = blogPosts.filter(post => {
        const matchesTag = currentTag === 'all' || post.tags.includes(currentTag);
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTag && matchesSearch;
    });

    blogGrid.innerHTML = filteredPosts.map(createBlogCard).join('');
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterAndRenderPosts();
});

tagContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
        // Remove active class from all tags
        document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
        // Add active class to clicked tag
        e.target.classList.add('active');
        // Update current tag
        currentTag = e.target.dataset.tag;
        filterAndRenderPosts();
    }
});

// Initial render
filterAndRenderPosts();
