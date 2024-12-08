import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { firebaseConfig } from './config.js'; // Ensure you have a `config.js` file with your Firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the `bookId` from the URL query parameters
const params = new URLSearchParams(window.location.search);
const bookId = params.get('bookId');

// Fetch and display the book details
async function loadBookDetails() {
    if (!bookId) {
        console.error("No bookId provided in the URL.");
        return;
    }

    try {
        const bookRef = doc(db, 'books', bookId); // Reference to the specific book
        const bookSnapshot = await getDoc(bookRef);

        if (bookSnapshot.exists()) {
            const book = bookSnapshot.data();

            // Update the page content dynamically
            document.querySelector('.box h5').textContent = `${book.reads} Reads`;
            document.querySelector('.box-image').src = book.image;
            document.querySelector('.box-image').alt = book.name;

            document.querySelector('.right-column .title').textContent = book.name;
            document.querySelector('.right-column .author').textContent = `Isinalin sa Filipino ni ${book.author}`;
            document.querySelector('.buod').textContent = book.buod;

            const downloadBtn = document.querySelector('.buttons .button');
            const readBtn = document.querySelector('.buttons .read-btn');

            downloadBtn.href = book.bookPdf; // Set the download link
            readBtn.href = `basahin_page.html?bookId=${book.bookId}`;

        } else {
            console.error("No book found with the provided bookId.");
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
    }
}

// Call `loadBookDetails` once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadBookDetails);
