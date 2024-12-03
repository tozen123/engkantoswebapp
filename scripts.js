import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment  } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { firebaseConfig } from './config.js'; 


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function incrementReads(bookId) {
    const bookRef = doc(db, 'books', bookId); // Reference to the book document

    try {
        await updateDoc(bookRef, {
            reads: increment(1) // Increment the reads count by 1
        });
        console.log("Reads count incremented for book:", bookId);
    } catch (error) {
        console.error("Error incrementing reads count:", error);
    }
}



async function fetchBooks() {
    const bookContainer = document.getElementById('book-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    if (!bookContainer) {
        console.error("Element with ID 'book-container' not found.");
        return;
    }

    // Show the loading spinner
    loadingSpinner.style.display = "block";

    try {
        const books = [];
        const querySnapshot = await getDocs(collection(db, 'books'));

        // Collect all books into an array
        querySnapshot.forEach((docSnapshot) => {
            const book = docSnapshot.data();
            books.push({ id: docSnapshot.id, ...book });
        });

        // Sort books by reads in descending order
        books.sort((a, b) => b.reads - a.reads);

        // Render books
        books.forEach((book) => {
            // Create a box element for each book
            const box = document.createElement('div');
            box.className = 'box fade-in'; // Add fade-in class for animation

            box.innerHTML = `
                <h5>${book.reads} Reads</h5>
                <div class="box-top">
                    <img class="box-image" src="${book.image}" alt="${book.name}">
                    <div class="title-flex">
                        <h3 class="box-title">${book.name}</h3>
                        <p class="user-follow-info">Isinalin sa Filipino ni ${book.author}</p>
                    </div>
                    <p class="description">${book.hearts}</p>
                </div>
                <a href="#" class="button">Buod</a>
            `;

            // Add event listener for redirection
            const button = box.querySelector('.button');
            button.addEventListener('click', async  (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                await incrementReads(book.id); // Increment reads count
                window.location.href = `genre_details.html?bookId=${book.id}`;
                
            });

            // Append the box to the container
            bookContainer.appendChild(box);
        });
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        // Hide the loading spinner after loading is complete
        loadingSpinner.style.display = "none";
    }
}

// Call fetchBooks once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchBooks);


async function fetchBikolBooks() {
    const bikolBooksContainer = document.getElementById('bikol-books-container');
    const loadingSpinner = document.getElementById('bikol-loading-spinner');
    
    if (!bikolBooksContainer) {
        console.error("Element with ID 'bikol-books-container' not found.");
        return;
    }

    // Show the loading spinner
    loadingSpinner.style.display = "block";

    try {
        const querySnapshot = await getDocs(collection(db, 'books')); 
        querySnapshot.forEach((docSnapshot) => {
            const book = docSnapshot.data();

            // Create a card element for each book
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <img src="${book.image}" alt="${book.name}">
                <div class="info">
                    <h1>${book.name}</h1>
                    <p>Isinalin ni ${book.author}</p>
                    <button onclick="openBook('${book.bookPdf}')">Read More</button>
                </div>
            `;

            // Append the card to the container
            bikolBooksContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching Bikol books:", error);
    } finally {
        // Hide the loading spinner after loading is complete
        loadingSpinner.style.display = "none";
    }
}


// Call fetchBikolBooks once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchBikolBooks);
