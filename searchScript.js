import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment  } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { firebaseConfig } from './config.js'; 


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const searchInput = document.getElementById('query');
const searchResultsContainer = document.createElement('div');
searchResultsContainer.className = 'search-results';
document.body.appendChild(searchResultsContainer);

// Style for search results container
searchResultsContainer.style.position = 'absolute';
searchResultsContainer.style.backgroundColor = '#fff';
searchResultsContainer.style.border = '1px solid #ccc';
searchResultsContainer.style.borderRadius = '5px';
searchResultsContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
searchResultsContainer.style.width = `${searchInput.offsetWidth}px`;
searchResultsContainer.style.maxHeight = '300px';
searchResultsContainer.style.overflowY = 'auto';
searchResultsContainer.style.display = 'none';
searchResultsContainer.style.zIndex = '1000';

// Position search results below the input field
searchInput.addEventListener('focus', () => {
    const rect = searchInput.getBoundingClientRect();
    searchResultsContainer.style.top = `${rect.bottom + window.scrollY}px`;
    searchResultsContainer.style.left = `${rect.left + 10}px`;
});

// Fetch books from Firestore
async function fetchBooksForSearch() {
    try {
        const books = [];
        const querySnapshot = await getDocs(collection(db, 'books'));
        querySnapshot.forEach(docSnapshot => {
            const book = docSnapshot.data();
            books.push({ id: docSnapshot.id, ...book });
        });
        return books;
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

// Handle search input
async function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
        searchResultsContainer.style.display = 'none';
        searchResultsContainer.innerHTML = '';
        return;
    }

    const books = await fetchBooksForSearch();
    const filteredBooks = books.filter(book => book.name.toLowerCase().includes(searchTerm));

    searchResultsContainer.innerHTML = '';

    if (filteredBooks.length > 0) {
        filteredBooks.forEach(book => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.style.display = 'flex';
            resultItem.style.alignItems = 'center';
            resultItem.style.padding = '10px';
            resultItem.style.cursor = 'pointer';
            resultItem.style.borderBottom = '1px solid #ddd';

            const img = document.createElement('img');
            img.src = book.image;
            img.alt = book.name;
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.objectFit = 'cover';
            img.style.marginRight = '10px';
            img.style.borderRadius = '5px';

            const title = document.createElement('span');
            title.textContent = book.name;

            resultItem.appendChild(img);
            resultItem.appendChild(title);

            resultItem.addEventListener('mouseover', () => {
                resultItem.style.backgroundColor = '#f1f1f1';
            });

            resultItem.addEventListener('mouseout', () => {
                resultItem.style.backgroundColor = '#fff';
            });

            resultItem.addEventListener('click', () => {
                window.location.href = `mitolohiya_details.html?bookId=${book.id}`;
            });

            searchResultsContainer.appendChild(resultItem);
        });

        searchResultsContainer.style.display = 'block';
    } else {
        searchResultsContainer.innerHTML = '<div style="padding: 10px; color: #888;">No results found</div>';
        searchResultsContainer.style.display = 'block';
    }
}

// Event listener for search input
searchInput.addEventListener('input', handleSearch);

// Hide search results when clicking outside
document.addEventListener('click', event => {
    if (!searchResultsContainer.contains(event.target) && event.target !== searchInput) {
        searchResultsContainer.style.display = 'none';
    }
});