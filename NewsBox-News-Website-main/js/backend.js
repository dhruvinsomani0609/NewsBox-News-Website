const API_KEY = "7b2af931d4b34ef782ff781a3a0767ed";
const url = "https://newsapi.org/v2/everything?q=";
const topHeadlinesUrl = "https://newsapi.org/v2/top-headlines?";

// DOM elements
const navLinks = document.querySelectorAll(".nav-link");
const searchText = document.getElementById("search-text");
const searchButton = document.getElementById("search-button");
const categoryLinks = document.querySelectorAll('.navbarItem .nav-link');

// Function to fetch news articles based on query
async function fetchNews(query) {
    try {
        // Fetch news articles with the given query and API key
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}&pageSize=40`);
        const data = await res.json();
        if (data.articles) {
            bindData(data.articles); // Bind the fetched articles to the page
        } else {
            console.log("No articles found for the query.");
        }
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Function to fetch top headlines by category
async function fetchTopHeadlines(category = 'general', country = 'us', pageSize = 20) {
    try {
        const res = await fetch(`${topHeadlinesUrl}category=${category}&country=${country}&apiKey=${API_KEY}&pageSize=${pageSize}`);
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching top headlines:", error);
        return [];
    }
}

// Function to fetch general news by query
async function fetchNewsByQuery(query, pageSize = 20) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}&pageSize=${pageSize}&sortBy=publishedAt`);
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching news by query:", error);
        return [];
    }
}

// Function to bind news articles to the DOM
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear previous news
    cardsContainer.innerHTML = "";

    // Populate new articles
    articles.forEach((article) => {
        if (!article.urlToImage) return; // Skip articles without images
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Function to fill data inside the news card
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Redirect to page.html with category or query parameter
const redirectToPage = (param) => {
    if (param.trim()) {
        console.log(`Redirecting to: page.html?category=${encodeURIComponent(param.trim())}`);
        window.location.href = `page.html?category=${encodeURIComponent(param.trim())}`;
    } else {
        console.log("Empty search or category, redirect not triggered.");
    }
};

// Search button click event
if (searchButton && searchText) {
    searchButton.addEventListener("click", () => {
        const query = searchText.value.trim();
        if (query) {
            redirectToPage(query);  // Redirect to page.html with the search query as a category
            fetchNews(query);       // Fetch news results for the query
        } else {
            console.log("Search query is empty.");
        }
    });

    // Optional: 'Enter' key functionality for search
    searchText.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchText.value.trim();
            if (query) {
                redirectToPage(query);  // Trigger the redirection when Enter is pressed
                fetchNews(query);       // Fetch news results for the query
            } else {
                console.log("Search query is empty.");
            }
        }
    });
}

// Add event listeners to category links
categoryLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        const category = link.dataset.category; // Get category from data-category attribute

        if (category === "index.html") {
            // Redirect to the homepage
            window.location.href = category;
        } else {
            console.log(`Category clicked: ${category}`);
            redirectToPage(category); // Redirect to page.html with category
            fetchNews(category); // Fetch news for the selected category
        }
    });
});


// Utility functions for loading states
function showLoading(container) {
    if (container) {
        container.innerHTML = `
            <div class="news-loading">
                <div class="spinner"></div>
                <div class="loading-text">Loading news...</div>
            </div>
        `;
    }
}

function showError(container, message = 'Failed to load news') {
    if (container) {
        container.innerHTML = `
            <div class="news-error">
                <p>${message}</p>
                <button class="retry-btn" onclick="initializeHomepage()">Retry</button>
            </div>
        `;
    }
}

// Homepage dynamic news loading functions
async function loadTrendingNews() {
    try {
        const articles = await fetchNewsByQuery('trending OR breaking', 1);
        if (articles.length > 0) {
            const article = articles[0];
            const trendingContainer = document.querySelector('#note');
            if (trendingContainer) {
                trendingContainer.innerHTML = `
                    <img src="${article.urlToImage || 'img/features-fashion.jpg'}" 
                         class="img-fluid rounded-circle border border-3 border-primary me-2"
                         style="width: 30px; height: 30px;" alt="">
                    <a href="${article.url}" target="_blank" class="text-white mb-0 link-hover">
                        <p class="mb-0 news-text text-white">${article.title}</p>
                    </a>
                `;
                trendingContainer.classList.add('loaded');
            }
        }
    } catch (error) {
        console.error('Error loading trending news:', error);
    }
}

async function loadMainPost() {
    try {
        const articles = await fetchTopHeadlines('general', 'us', 1);
        if (articles.length > 0) {
            const article = articles[0];
            const mainPostImg = document.querySelector('.col-lg-7.col-xl-8 .position-relative img');
            const mainPostTitle = document.querySelector('.col-lg-7.col-xl-8 .border-bottom a');
            const mainPostDesc = document.querySelector('.col-lg-7.col-xl-8 p.mt-3');
            
            if (mainPostImg && mainPostTitle && mainPostDesc) {
                mainPostImg.src = article.urlToImage || mainPostImg.src;
                mainPostTitle.textContent = article.title;
                mainPostTitle.href = article.url;
                mainPostTitle.target = '_blank';
                mainPostDesc.textContent = article.description || article.content?.substring(0, 200) + '...';
                console.log('Main post loaded:', article.title);
            }
        }
    } catch (error) {
        console.error('Error loading main post:', error);
    }
}

async function loadTopStory() {
    try {
        const articles = await fetchNewsByQuery('world news', 1);
        if (articles.length > 0) {
            const article = articles[0];
            const topStoryImg = document.querySelector('.bg-light .col-md-6 img');
            const topStoryTitle = document.querySelector('.bg-light .col-md-6 .h3');
            
            if (topStoryImg && topStoryTitle) {
                topStoryImg.src = article.urlToImage || topStoryImg.src;
                topStoryTitle.textContent = article.title;
                topStoryTitle.href = article.url;
                topStoryTitle.target = '_blank';
                console.log('Top story loaded:', article.title);
            }
        }
    } catch (error) {
        console.error('Error loading top story:', error);
    }
}

async function loadSideNews() {
    try {
        const articles = await fetchTopHeadlines('technology', 'us', 6);
        const sideNewsItems = document.querySelectorAll('.main_side_sec');
        
        articles.forEach((article, index) => {
            if (index < sideNewsItems.length && article.urlToImage) {
                const item = sideNewsItems[index];
                const img = item.querySelector('img');
                const title = item.querySelector('.h6');
                
                if (img && title) {
                    img.src = article.urlToImage;
                    title.textContent = article.title;
                    title.href = article.url;
                    title.target = '_blank';
                }
            }
        });
        console.log('Side news loaded:', articles.length, 'articles');
    } catch (error) {
        console.error('Error loading side news:', error);
    }
}

async function loadLatestNews() {
    try {
        const articles = await fetchTopHeadlines('general', 'us', 5);
        const latestNewsContainer = document.querySelector('.latest-news-carousel');
        
        if (latestNewsContainer && articles.length > 0) {
            latestNewsContainer.innerHTML = '';
            
            articles.forEach(article => {
                if (article.urlToImage) {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'latest-news-item';
                    newsItem.innerHTML = `
                        <div class="news-card rounded">
                            <div class="rounded-top overflow-hidden">
                                <img src="${article.urlToImage}" class="img-zoomin img-fluid rounded-top w-100" alt="">
                            </div>
                            <div class="d-flex flex-column p-4">
                                <a href="${article.url}" target="_blank" class="h4">${article.title}</a>
                            </div>
                        </div>
                    `;
                    latestNewsContainer.appendChild(newsItem);
                }
            });
            
            // Reinitialize Owl Carousel after a short delay
            setTimeout(() => {
                if (typeof $ !== 'undefined' && $.fn.owlCarousel) {
                    $('.latest-news-carousel').owlCarousel('destroy');
                    $('.latest-news-carousel').owlCarousel({
                        autoplay: true,
                        smartSpeed: 2000,
                        center: false,
                        dots: true,
                        loop: true,
                        margin: 25,
                        nav: true,
                        navText: [
                            '<i class="bi bi-arrow-left"></i>',
                            '<i class="bi bi-arrow-right"></i>'
                        ],
                        responsiveClass: true,
                        responsive: {
                            0: { items: 1 },
                            576: { items: 1 },
                            768: { items: 2 },
                            992: { items: 3 },
                            1200: { items: 4 }
                        }
                    });
                }
            }, 500);
            
            console.log('Latest news carousel loaded:', articles.length, 'articles');
        }
    } catch (error) {
        console.error('Error loading latest news:', error);
    }
}

async function loadCategoryNews(category, tabId) {
    try {
        const articles = await fetchTopHeadlines(category, 'us', 6);
        const tabContent = document.querySelector(`#${tabId}`);
        
        if (tabContent && articles.length > 0) {
            // Load main article
            const mainImg = tabContent.querySelector('.col-lg-8 img');
            const mainTitle = tabContent.querySelector('.col-lg-8 .h4');
            const mainDesc = tabContent.querySelector('.col-lg-8 p');
            
            if (mainImg && mainTitle && articles[0].urlToImage) {
                mainImg.src = articles[0].urlToImage;
                mainTitle.textContent = articles[0].title;
                mainTitle.href = articles[0].url;
                mainTitle.target = '_blank';
                if (mainDesc) {
                    mainDesc.textContent = articles[0].description || articles[0].content?.substring(0, 300) + '...';
                }
            }
            
            // Load side articles
            const sideItems = tabContent.querySelectorAll('.col-lg-4 .row.g-4.align-items-center');
            articles.slice(1).forEach((article, index) => {
                if (index < sideItems.length && article.urlToImage) {
                    const item = sideItems[index];
                    const img = item.querySelector('img');
                    const title = item.querySelector('.h6');
                    
                    if (img && title) {
                        img.src = article.urlToImage;
                        title.textContent = article.title;
                        title.href = article.url;
                        title.target = '_blank';
                    }
                }
            });
            console.log(`Category ${category} loaded for tab ${tabId}:`, articles.length, 'articles');
        }
    } catch (error) {
        console.error(`Error loading category ${category}:`, error);
    }
}

// Function to completely rebuild main post section with dynamic content
async function rebuildMainPostSection() {
    try {
        const articles = await fetchTopHeadlines('general', 'us', 1);
        if (articles.length > 0) {
            const article = articles[0];
            const mainSection = document.querySelector('.col-lg-7.col-xl-8');
            
            if (mainSection) {
                mainSection.innerHTML = `
                    <div class="position-relative overflow-hidden rounded">
                        <img src="${article.urlToImage || 'img/default-news.jpg'}" class="img-fluid rounded img-zoomin w-100" alt="">
                        <div class="d-flex justify-content-center px-4 position-absolute flex-wrap" style="bottom: 10px; left: 0;">
                            <a href="#" class="text-white me-3 link-hover"><i class="fa fa-clock"></i> ${Math.floor(Math.random() * 10) + 1} minute read</a>
                            <a href="#" class="text-white me-3 link-hover"><i class="fa fa-eye"></i> ${Math.floor(Math.random() * 5000) + 1000} Views</a>
                            <a href="#" class="text-white me-3 link-hover"><i class="fa fa-comment-dots"></i> ${Math.floor(Math.random() * 50) + 5} Comment</a>
                            <a href="#" class="text-white link-hover"><i class="fa fa-arrow-up"></i> ${Math.floor(Math.random() * 2000) + 500} Share</a>
                        </div>
                    </div>
                    <div class="border-bottom py-3">
                        <a href="${article.url}" target="_blank" class="display-4 text-dark mb-0 link-hover">${article.title}</a>
                    </div>
                    <p class="mt-3 mb-4">${article.description || article.content?.substring(0, 200) + '...' || 'Breaking news story from our trusted sources.'}</p>
                    <div class="bg-light p-4 rounded" id="top-story-section">
                        <div class="news-2">
                            <h3 class="mb-4">Top Story</h3>
                        </div>
                        <div class="row g-4 align-items-center" id="top-story-content">
                            <!-- Will be populated by loadTopStorySection -->
                        </div>
                    </div>
                `;
                console.log('Main post section rebuilt with:', article.title);
            }
        }
    } catch (error) {
        console.error('Error rebuilding main post section:', error);
    }
}

// Function to rebuild top story section with dynamic content
async function loadTopStorySection() {
    try {
        const articles = await fetchNewsByQuery('world news', 1);
        if (articles.length > 0) {
            const article = articles[0];
            const topStoryContent = document.querySelector('#top-story-content');
            
            if (topStoryContent) {
                topStoryContent.innerHTML = `
                    <div class="col-md-6">
                        <div class="rounded overflow-hidden">
                            <img src="${article.urlToImage || 'img/default-news.jpg'}" class="img-fluid rounded img-zoomin w-100" alt="">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="d-flex flex-column">
                            <a href="${article.url}" target="_blank" class="h3">${article.title}</a>
                        </div>
                    </div>
                `;
                console.log('Top story section loaded:', article.title);
            }
        }
    } catch (error) {
        console.error('Error loading top story section:', error);
    }
}

// Function to completely rebuild sidebar with dynamic content
async function rebuildSidebarSection() {
    try {
        const articles = await fetchTopHeadlines('technology', 'us', 8);
        const sidebarSection = document.querySelector('.col-lg-5.col-xl-4');
        
        if (sidebarSection && articles.length > 0) {
            let sidebarHTML = `
                <div class="bg-light rounded p-4 pt-0">
                    <div class="row g-4">
                        <div class="col-12">
                            <div class="rounded overflow-hidden">
                                <img src="${articles[0].urlToImage || 'img/default-news.jpg'}" class="img-fluid rounded img-zoomin w-100" alt="">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="d-flex flex-column">
                                <a href="${articles[0].url}" target="_blank" class="h4 mb-2">${articles[0].title}</a>
                            </div>
                        </div>
            `;
            
            // Add remaining articles as smaller cards
            for (let i = 1; i < Math.min(articles.length, 7); i++) {
                const article = articles[i];
                if (article.urlToImage) {
                    sidebarHTML += `
                        <div class="col-12">
                            <div class="row g-4 align-items-center main_side_sec">
                                <div class="col-5">
                                    <div class="overflow-hidden rounded">
                                        <img src="${article.urlToImage}" class="img-zoomin img-fluid rounded w-100" alt="">
                                    </div>
                                </div>
                                <div class="col-7">
                                    <div class="features-content d-flex flex-column">
                                        <a href="${article.url}" target="_blank" class="h6">${article.title}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
            
            sidebarHTML += `
                    </div>
                </div>
            `;
            
            sidebarSection.innerHTML = sidebarHTML;
            console.log('Sidebar section rebuilt with', articles.length, 'articles');
        }
    } catch (error) {
        console.error('Error rebuilding sidebar section:', error);
    }
}

// Function to completely rebuild category tabs with dynamic content
async function rebuildCategoryTabs() {
    const categories = [
        { name: 'sports', tabId: 'tab-1', displayName: 'Sports' },
        { name: 'business', tabId: 'tab-2', displayName: 'Business' },
        { name: 'general', tabId: 'tab-3', displayName: 'Politics' },
        { name: 'technology', tabId: 'tab-4', displayName: 'Technology' },
        { name: 'entertainment', tabId: 'tab-5', displayName: 'Fashion' }
    ];
    
    for (const category of categories) {
        try {
            const articles = await fetchTopHeadlines(category.name, 'us', 6);
            const tabContent = document.querySelector(`#${category.tabId}`);
            
            if (tabContent && articles.length > 0) {
                let tabHTML = `
                    <div class="row g-4">
                        <div class="col-lg-8">
                            <div class="position-relative rounded overflow-hidden">
                                <img src="${articles[0].urlToImage || 'img/default-news.jpg'}" class="img-zoomin img-fluid rounded w-100" alt="">
                                <div class="position-absolute text-white px-4 py-2 bg-dark rounded" style="top: 20px; right: 20px;">
                                    ${category.displayName}
                                </div>
                            </div>
                            <div class="my-4">
                                <a href="${articles[0].url}" target="_blank" class="h4">${articles[0].title}</a>
                            </div>
                            <div class="d-flex justify-content-between">
                                <a href="#" class="text-dark link-hover me-3"><i class="fa fa-clock"></i> ${Math.floor(Math.random() * 10) + 1} minute read</a>
                                <a href="#" class="text-dark link-hover me-3"><i class="fa fa-eye"></i> ${Math.floor(Math.random() * 5000) + 1000} Views</a>
                                <a href="#" class="text-dark link-hover me-3"><i class="fa fa-comment-dots"></i> ${Math.floor(Math.random() * 50) + 5} Comment</a>
                                <a href="#" class="text-dark link-hover"><i class="fa fa-arrow-up"></i> ${Math.floor(Math.random() * 2000) + 500} Share</a>
                            </div>
                            <p class="my-4">${articles[0].description || articles[0].content?.substring(0, 300) + '...' || 'Latest news in ' + category.displayName.toLowerCase() + ' category.'}</p>
                        </div>
                        <div class="col-lg-4">
                            <div class="row g-4">
                `;
                
                // Add side articles
                for (let i = 1; i < Math.min(articles.length, 6); i++) {
                    const article = articles[i];
                    if (article.urlToImage) {
                        const publishDate = new Date(article.publishedAt).toLocaleDateString();
                        tabHTML += `
                            <div class="col-12">
                                <div class="row g-4 align-items-center new_side_sec">
                                    <div class="col-5">
                                        <div class="overflow-hidden rounded">
                                            <img src="${article.urlToImage}" class="img-zoomin img-fluid rounded w-100" alt="">
                                        </div>
                                    </div>
                                    <div class="col-7">
                                        <div class="features-content d-flex flex-column">
                                            <p class="text-uppercase mb-2">${category.displayName}</p>
                                            <a href="${article.url}" target="_blank" class="h6">${article.title.substring(0, 60)}${article.title.length > 60 ? '...' : ''}</a>
                                            <small class="text-body d-block"><i class="fas fa-calendar-alt me-1"></i> ${publishDate}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
                
                tabHTML += `
                            </div>
                        </div>
                    </div>
                `;
                
                tabContent.innerHTML = tabHTML;
                console.log(`Category ${category.name} tab rebuilt with ${articles.length} articles`);
            }
        } catch (error) {
            console.error(`Error rebuilding category ${category.name}:`, error);
        }
    }
}

// Initialize all homepage sections with completely dynamic content
async function initializeHomepage() {
    console.log('Rebuilding entire homepage with dynamic content...');
    try {
        // Show loading indicator
        document.body.style.cursor = 'wait';
        
        await Promise.all([
            loadTrendingNews(),
            rebuildMainPostSection(),
            loadLatestNews(),
            rebuildSidebarSection(),
            rebuildCategoryTabs()
        ]);
        
        // Load top story after main post is rebuilt
        await loadTopStorySection();
        
        document.body.style.cursor = 'default';
        console.log('Homepage completely rebuilt with dynamic news content');
    } catch (error) {
        console.error('Error rebuilding homepage:', error);
        document.body.style.cursor = 'default';
    }
}

// Add event listeners for sidebar navigation
function initializeSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.offcanvas-body .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const category = link.dataset.category;
            
            if (category) {
                console.log(`Sidebar category clicked: ${category}`);
                redirectToPage(category);
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize sidebar navigation
    initializeSidebarNavigation();
    
    // Check if we're on a category page or homepage
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        console.log(`Loading category page for: ${category}`);
        fetchNews(category); // Fetch news based on category from URL
    } else {
        console.log('Loading homepage with dynamic content');
        // Load dynamic content for homepage
        initializeHomepage();
    }
});
