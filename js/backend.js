const API_KEY = "YOUR_API_KEY";
const url = "https://newsapi.org/v2/everything?q=";

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


// Fetch and display news based on URL category or search query
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
if (category) {
    fetchNews(category); // Fetch news based on category from URL
} else {
    console.log("No category or search query in URL.");
}
