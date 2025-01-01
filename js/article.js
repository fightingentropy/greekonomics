// Extended blog posts data with full content
const blogPosts = [
    {
        id: 1,
        title: 'Getting Started with Stock Market Investing',
        excerpt: 'Learn the fundamentals of stock market investing and how to build a diversified portfolio for long-term growth.',
        content: `
            <h2>Understanding the Basics of Stock Market Investing</h2>
            <p>Stock market investing can seem daunting at first, but understanding the basics is crucial for building long-term wealth. When you buy a stock, you're purchasing a small ownership stake in a company, which means you get to participate in its growth and success.</p>

            <h2>Building a Diversified Portfolio</h2>
            <p>Diversification is key to managing risk in your investment portfolio. This means spreading your investments across different:</p>
            <ul>
                <li>Companies</li>
                <li>Industries</li>
                <li>Geographic regions</li>
                <li>Asset classes</li>
            </ul>

            <h2>Investment Strategies for Beginners</h2>
            <p>As a beginner, it's important to start with a solid investment strategy. Consider these approaches:</p>
            <ul>
                <li>Dollar-cost averaging</li>
                <li>Index fund investing</li>
                <li>Long-term buy and hold</li>
            </ul>

            <h2>Managing Risk and Expectations</h2>
            <p>Understanding and managing risk is crucial for successful investing. Never invest more than you can afford to lose, and always have a long-term perspective when investing in stocks.</p>
        `,
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        tags: ['investing', 'stocks'],
        date: '2025-01-01',
        readTime: '5 min read'
    },
    {
        id: 2,
        title: 'Cryptocurrency: Understanding the Basics',
        excerpt: 'A comprehensive guide to understanding cryptocurrency, blockchain technology, and how to safely invest in digital assets.',
        content: `
            <h2>What is Cryptocurrency?</h2>
            <p>Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies, cryptocurrencies are decentralized systems based on blockchain technology.</p>

            <h2>Understanding Blockchain Technology</h2>
            <p>Blockchain is the underlying technology that powers cryptocurrencies. It's a distributed ledger that records all transactions across a network of computers.</p>

            <h2>Popular Cryptocurrencies</h2>
            <p>While Bitcoin was the first cryptocurrency, there are now thousands of different cryptocurrencies, each with its own features and use cases.</p>

            <h2>Safety and Security</h2>
            <p>When investing in cryptocurrencies, security should be your top priority. Always use reputable exchanges and consider using hardware wallets for long-term storage.</p>
        `,
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        tags: ['crypto', 'investing'],
        date: '2025-01-01',
        readTime: '7 min read'
    },
    {
        id: 3,
        title: 'Creating a Monthly Budget That Works',
        excerpt: 'Practical tips and strategies for creating and sticking to a monthly budget that helps you achieve your financial goals.',
        content: `
            <h2>Why Budgeting Matters</h2>
            <p>A budget is more than just tracking expenses—it's a roadmap for your financial future. A well-planned budget helps you understand your spending habits and make informed financial decisions.</p>

            <h2>Creating Your Budget</h2>
            <p>Start by tracking your income and categorizing your expenses. Break down your spending into:</p>
            <ul>
                <li>Essential expenses (housing, utilities, food)</li>
                <li>Savings and investments</li>
                <li>Discretionary spending</li>
            </ul>

            <h2>Sticking to Your Budget</h2>
            <p>Creating a budget is one thing, but sticking to it requires discipline and good habits. Use tools and apps to track your spending and set up automatic savings transfers.</p>

            <h2>Adjusting Your Budget</h2>
            <p>Your budget should be flexible and adapt to changes in your life. Review and adjust your budget regularly to ensure it continues to serve your financial goals.</p>
        `,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        tags: ['budgeting', 'personal-finance'],
        date: '2025-01-01',
        readTime: '4 min read'
    }
];

// Get article ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const articleId = parseInt(urlParams.get('id'));

// Find the article
const article = blogPosts.find(post => post.id === articleId);

if (article) {
    // Update page title
    document.title = `${article.title} - Greekonomics`;

    // Populate article content
    document.getElementById('articleTitle').textContent = article.title;
    document.getElementById('articleImage').src = article.image;
    document.getElementById('articleImage').alt = article.title;
    document.getElementById('articleDate').textContent = article.date;
    document.getElementById('articleReadTime').textContent = article.readTime;
    document.getElementById('articleBody').innerHTML = article.content;

    // Populate tags
    const tagsHtml = article.tags.map(tag => `<span class="article-tag">#${tag}</span>`).join('');
    document.getElementById('articleTags').innerHTML = tagsHtml;

    // Find related articles (articles with matching tags)
    const relatedArticles = blogPosts
        .filter(post => post.id !== article.id && post.tags.some(tag => article.tags.includes(tag)))
        .slice(0, 2);

    // Populate related articles
    const relatedHtml = relatedArticles.map(post => `
        <a href="article.html?id=${post.id}" class="related-article">
            <h4>${post.title}</h4>
            <p>${post.readTime}</p>
        </a>
    `).join('');
    document.getElementById('relatedArticles').querySelector('.related-grid').innerHTML = relatedHtml;

    // Share functionality
    document.querySelector('.share-buttons').addEventListener('click', (e) => {
        if (e.target.closest('.btn')) {
            const url = window.location.href;
            const title = article.title;
            
            // You can implement actual sharing functionality here
            console.log(`Sharing article: ${title}\nURL: ${url}`);
        }
    });
} else {
    // Handle article not found
    document.getElementById('articleTitle').textContent = 'Article not found';
    document.getElementById('articleBody').innerHTML = '<p>Sorry, the requested article could not be found.</p>';
}
