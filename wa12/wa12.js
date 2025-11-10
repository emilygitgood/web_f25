const searchForm = document.querySelector("#search-form");
const searchBtn = document.querySelector("#search-btn");
const randomBtn = document.querySelector("#random-btn");
const searchInput = document.querySelector("#search-input");
const bookInfo = document.querySelector("#book-info");
const clearBtn = document.querySelector("#clear-btn");
const exportBtn = document.querySelector("#export-btn");
const viewFavoritesBtn = document.querySelector("#view-favorites-btn");
const favoritesCount = document.querySelector("#count");
const pluralSpan = document.querySelector("#plural");

let currentBooks = [];
let favorites = [];

// Load favorites on page load
loadFavorites();

// Event listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchBooks();
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchBooks();
});

randomBtn.addEventListener('click', getRandomBook);
clearBtn.addEventListener('click', clearFavorites);
exportBtn.addEventListener('click', exportFavorites);
viewFavoritesBtn.addEventListener('click', viewFavorites);

async function searchBooks() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a book title or author to search!');
        searchInput.focus();
        return;
    }
    
    showLoading('Searching for books...');
    
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
        showError('Failed to fetch books. Please check your internet connection and try again!');
    }
}

async function getRandomBook() {
    showLoading('Finding a random book...');
    
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
        showError('Failed to fetch a random book. Please check your internet connection and try again!');
    }
}

function displayBooks(books) {
    bookInfo.innerHTML = '';
    
    books.forEach((book, index) => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        // Sanitize data
        const title = sanitizeText(book.title || 'Unknown Title');
        const author = book.author_name ? sanitizeText(book.author_name.join(', ')) : 'Unknown Author';
        const publishYear = sanitizeText(book.first_publish_year || 'Unknown');
        const coverId = book.cover_i;
        
        // Create content container
        const bookContent = document.createElement('div');
        bookContent.className = 'book-content';
        
        // Add cover image or placeholder
        if (coverId) {
            const img = document.createElement('img');
            img.src = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
            img.alt = `Book cover for ${title}`;
            img.className = 'book-cover';
            bookContent.appendChild(img);
        } else {
            const noCover = document.createElement('div');
            noCover.className = 'no-cover';
            noCover.textContent = 'No Cover Available';
            bookContent.appendChild(noCover);
        }
        
        // Create details section
        const bookDetails = document.createElement('div');
        bookDetails.className = 'book-details';
        
        const titleElement = document.createElement('h3');
        titleElement.className = 'book-title';
        titleElement.textContent = title;
        
        const authorElement = document.createElement('p');
        authorElement.className = 'book-author';
        authorElement.textContent = `By: ${author}`;
        
        const yearElement = document.createElement('p');
        yearElement.className = 'book-year';
        yearElement.textContent = `First Published: ${publishYear}`;
        
        const addButton = document.createElement('button');
        addButton.className = 'button add-favorite-btn';
        addButton.textContent = 'Add to Favorites';
        addButton.setAttribute('aria-label', `Add ${title} to favorites`);
        addButton.addEventListener('click', () => {
            addToFavorites(title, author, coverId, publishYear);
        });
        
        bookDetails.appendChild(titleElement);
        bookDetails.appendChild(authorElement);
        bookDetails.appendChild(yearElement);
        bookDetails.appendChild(addButton);
        
        bookContent.appendChild(bookDetails);
        bookCard.appendChild(bookContent);
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
    
    bookInfo.innerHTML = '';
    
    const heading = document.createElement('h2');
    heading.style.fontFamily = 'Mansalva';
    heading.style.color = 'orange';
    heading.textContent = 'Your Favorite Books';
    bookInfo.appendChild(heading);
    
    favorites.forEach((fav, index) => {
        const favCard = document.createElement('div');
        favCard.className = 'favorite-item';
        
        if (fav.coverId) {
            const img = document.createElement('img');
            img.src = `https://covers.openlibrary.org/b/id/${fav.coverId}-S.jpg`;
            img.alt = `Book cover for ${fav.title}`;
            favCard.appendChild(img);
        } else {
            const noCover = document.createElement('div');
            noCover.className = 'no-cover-small';
            noCover.textContent = 'No Cover';
            favCard.appendChild(noCover);
        }
        
        const favInfo = document.createElement('div');
        favInfo.className = 'favorite-info';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'favorite-title';
        titleDiv.textContent = fav.title;
        
        const authorDiv = document.createElement('div');
        authorDiv.className = 'favorite-author';
        authorDiv.textContent = fav.author;
        
        const yearDiv = document.createElement('div');
        yearDiv.className = 'favorite-year';
        yearDiv.textContent = `Published: ${fav.year}`;
        
        favInfo.appendChild(titleDiv);
        favInfo.appendChild(authorDiv);
        favInfo.appendChild(yearDiv);
        
        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.setAttribute('aria-label', `Remove ${fav.title} from favorites`);
        removeBtn.addEventListener('click', () => removeFavorite(index));
        
        favCard.appendChild(favInfo);
        favCard.appendChild(removeBtn);
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
    
    try {
        const dataStr = JSON.stringify(favorites, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-favorite-books.json';
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting favorites:', error);
        alert('Failed to export favorites. Please try again.');
    }
}

function saveFavorites() {
    try {
        localStorage.setItem('bookFavorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('Failed to save favorites. Your browser storage may be full.');
    }
}

function loadFavorites() {
    try {
        const saved = localStorage.getItem('bookFavorites');
        if (saved) {
            favorites = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        favorites = [];
    }
    updateFavoritesCount();
}

function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
    // Update plural/singular
    if (pluralSpan) {
        pluralSpan.textContent = favorites.length === 1 ? '' : 's';
    }
}
