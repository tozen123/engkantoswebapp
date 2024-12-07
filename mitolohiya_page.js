import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { firebaseConfig } from './config.js'; // Ensure you have a `config.js` file with your Firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const likesFilter = document.getElementById('likesFilter');
const viewsFilter = document.getElementById('viewsFilter');
const cardContainer = document.getElementById('card-container');

// Fetch books from Firestore
async function fetchBooks() {
    try {
        const booksSnapshot = await getDocs(collection(db, "books"));
        const books = [];
        booksSnapshot.forEach((doc) => {
            const book = doc.data();
            books.push({
                id: doc.id,
                name: book.name,
                author: book.author,
                image: book.image,
                hearts: book.hearts || 0,
                reads: book.reads || 0
            });
        });
        displayBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Display books based on filters
function displayBooks(books) {
    const selectedLikes = likesFilter.value;
    const selectedViews = viewsFilter.value;

    cardContainer.innerHTML = ""; // Clear existing cards

    books.forEach((book) => {
        const { id, name, author, image, hearts, reads } = book;

        // Filter logic: Apply filters based on selection
        let match = false;

        // Handle Likes Filter
        if (selectedLikes !== 'all') {
            const likesThreshold = parseInt(selectedLikes);
            match = hearts >= likesThreshold;
        }

        // Handle Views Filter
        if (selectedViews !== 'all') {
            const viewsThreshold = parseInt(selectedViews);
            match =  reads >= viewsThreshold;
        }

        // If both filters are 'all', show all books
        if (selectedLikes === 'all' && selectedViews === 'all') {
            match = true;
        }

        if (match) {
            const card = document.createElement('div');
            card.className = 'box';
            card.setAttribute('data-likes', hearts);
            card.setAttribute('data-views', reads);

            card.innerHTML = `
                <h5>${reads} Reads</h5>
                <div class="box-top">
                    <img class="box-image" src="${image}" alt="${name}">
                    <div class="title-flex">
                        <h3 class="box-title">${name}</h3>
                        <p class="user-follow-info">${author}</p>
                    </div>
                    <p class="description">${hearts} ❤️</p>
                </div>
                <a href="genre_details.html?bookId=${id}" class="button">Buod</a>
            `;
            cardContainer.appendChild(card);
        }
    });
}

// Event listener for filter changes
likesFilter.addEventListener('change', () => {
    fetchBooks();
});
viewsFilter.addEventListener('change', () => {
    fetchBooks();
});

// Initial fetch
document.addEventListener("DOMContentLoaded", fetchBooks);
