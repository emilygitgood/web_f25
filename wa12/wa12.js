const searchBtn = document.querySelector("#search-btn");
const randomBtn = document.querySelector("#random-btn");
const searchInput = document.querySelector("#search-input");
const bookInfo = document.querySelector("#book-info");
const clearBtn = document.querySelector("#clear-btn");
const exportBtn = document.querySelector("#export-btn");
const viewFavoritesBtn = document.querySelector("#view-favorites-btn");
const favoritesCount = document.querySelector("#count");

let currentBooks = [];
let favorites = [];

loadFavorites();

searchBtn.addEventListener('click', searchBooks);
randomBtn.addEventListener('click', getRandomBook);
clearBtn.addEventListener('click', clearFavorites);
exportBtn.addEventListener('click', exportFavorites);
viewFavoritesBtn.addEventListener('click', viewFavorites);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBooks();
    }
});

async function searchBooks() {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter a book title or author to search!');
        return;
    }
    
    bookInfo.innerHTML = '<p>Searching for books...</p>';
    
    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            currentBooks = data.docs;
            displayBooks(data.docs);
        } else {
            bookInfo.innerHTML = '<p>No books found. Try a different search!</p>';
        }
        
    } catch (error) {
        console.error('Error fetching books:', error);
        bookInfo.innerHTML = '<p style="color: red;">Failed to fetch books. Please check your internet connection and try again!</p>';
    }
}

async function getRandomBook() {
    bookInfo.innerHTML = '<p>Finding a random book...</p>';
    
    const subjects = ['fantasy', 'science fiction', 'mystery', 'romance', 'history', 'adventure', 'classic', 'poetry'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    try {
        const response = await fetch(`https://openlibrary.org/search.json?subject=${randomSubject}&limit=50`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.docs.length);
            const randomBook = data.docs[randomIndex];
            displayBooks([randomBook]);
        } else {
            bookInfo.innerHTML = '<p>Could not find a random book. Try again!</p>';
        }
        
    } catch (error) {
        console.error('Error fetching random book:', error);
        bookInfo.innerHTML = '<p style="color: red;">Failed to fetch a random book. Please check your internet connection and try again!</p>';
    }
}

function displayBooks(books) {
    bookInfo.innerHTML = '';
    
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        const title = book.title || 'Unknown Title';
        const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
        const publishYear = book.first_publish_year || 'Unknown';
        const coverId = book.cover_i;
        
        bookCard.innerHTML = `
            <div class="book-content">
                ${coverId ? 
                    `<img src="https://covers.openlibrary.org/b/id/${coverId}-M.jpg" alt="${title} cover" class="book-cover">` :
                    '<div class="no-cover">No Cover Available</div>'
                }
                <div class="book-details">
                    <h3 class="book-title">${title}</h3>
                    <p class="book-author">By: ${author}</p>
                    <p class="book-year">First Published: ${publishYear}</p>
                    <button class="button add-favorite-btn" onclick="addToFavorites('${title.replace(/'/g, "\\'")}', '${author.replace(/'/g, "\\'")}', '${coverId || ''}', '${publishYear}')">
                        Add to Favorites
                    </button>
                </div>
            </div>
        `;
        
        bookInfo.appendChild(bookCard);
    });
}

function addToFavorites(title, author, coverId, year) {
    const exists = favorites.some(fav => fav.title === title && fav.author === author);
    
    if (exists) {
        alert('This book is already in your favorites!');
        return;
    }
    
    const favorite = {
        title: title,
        author: author,
        coverId: coverId,
        year: year,
        dateAdded: new Date().toISOString()
    };
    
    favorites.push(favorite);
    saveFavorites();
    updateFavoritesCount();
    alert(`"${title}" added to favorites!`);
}

function viewFavorites() {
    if (favorites.length === 0) {
        bookInfo.innerHTML = '<p>You have no favorites yet! Search for books and add them to your favorites.</p>';
        return;
    }
    
    bookInfo.innerHTML = '<h2 style="font-family: Mansalva; color: orange;">Your Favorite Books</h2>';
    
    favorites.forEach((fav, index) => {
        const favCard = document.createElement('div');
        favCard.className = 'favorite-item';
        
        favCard.innerHTML = `
            ${fav.coverId ? 
                `<img src="https://covers.openlibrary.org/b/id/${fav.coverId}-S.jpg" alt="${fav.title} cover">` :
                '<div class="no-cover-small">No Cover</div>'
            }
            <div class="favorite-info">
                <div class="favorite-title">${fav.title}</div>
                <div class="favorite-author">${fav.author}</div>
                <div class="favorite-year">Published: ${fav.year}</div>
            </div>
            <button class="remove-btn" onclick="removeFavorite(${index})">Remove</button>
        `;
        
        bookInfo.appendChild(favCard);
    });
}

function removeFavorite(index) {
    const book = favorites[index];
    if (confirm(`Remove "${book.title}" from favorites?`)) {
        favorites.splice(index, 1);
        saveFavorites();
        updateFavoritesCount();
        viewFavorites();
    }
}

function clearFavorites() {
    if (favorites.length === 0) {
        alert('You have no favorites to clear!');
        return;
    }
    
    if (confirm('Are you sure you want to clear all your favorites? This cannot be undone!')) {
        favorites = [];
        saveFavorites();
        updateFavoritesCount();
        bookInfo.innerHTML = '<p>All favorites cleared!</p>';
    }
}

function exportFavorites() {
    if (favorites.length === 0) {
        alert('You have no favorites to export!');
        return;
    }
    
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-favorite-books.json';
    link.click();
    URL.revokeObjectURL(url);
}

function saveFavorites() {
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
}

function loadFavorites() {
    const saved = localStorage.getItem('bookFavorites');
    if (saved) {
        favorites = JSON.parse(saved);
    }
    updateFavoritesCount();
}

function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
}