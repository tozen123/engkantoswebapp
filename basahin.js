import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const bookId = params.get('bookId');

// Load Book Details
async function loadBookDetails() {
    const mainContentTitle = document.querySelector('.main-content h1');
    const statsElement = document.querySelector('.views-likes');
    const descriptionElement = document.querySelector('.content-text');
    const readBtn = document.querySelector('.btn');
    const qrSection = document.querySelector('.qr-section img');

    if (!bookId) {
        console.error("No bookId provided in the URL.");
        mainContentTitle.textContent = "Error: Book not found.";
        return;
    }

    try {
        const booksRef = collection(db, 'books');
        const q = query(booksRef, where('bookId', '==', bookId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const book = doc.data();

                // Update the content dynamically
                mainContentTitle.textContent = book.name || "No Title";
                statsElement.textContent = `${book.hearts || 0} ❤️ | ${book.reads || 0} 👁️`;
                descriptionElement.textContent = book.bookDescription || "No description available.";

                // Update QR code image
                if (book.QrCode) {
                    qrSection.src = book.QrCode;
                    qrSection.alt = `${book.name} QR Code`;
                } else {
                    qrSection.style.display = "none"; // Hide QR code section if no QR code is available
                }

                // Update read button
                if (book.bookPdf) {
                    readBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = `read_book.html?bookId=${encodeURIComponent(bookId)}`;
                    });
                } else {
                    readBtn.style.display = "none"; // Hide the button if no PDF is available
                }
            });
        } else {
            console.error("No book found with the provided bookId.");
            mainContentTitle.textContent = "Book not found.";
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
        mainContentTitle.textContent = "Error loading book details.";
    }
}

// Load Comments
async function loadComments() {
    const commentsContainer = document.querySelector('.comment-section-comments');
    const commentsCount = document.getElementById('comment');

    if (!bookId) {
        console.error("No bookId provided in the URL.");
        return;
    }

    try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('bookId', '==', bookId));
        const querySnapshot = await getDocs(q);

        commentsContainer.innerHTML = ''; // Clear existing comments

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const comment = doc.data();

                const published = `
                    <div class="comment-section-parents">
                        <img src="${comment.userImage}" alt="User">
                        <div>
                            <h1>${comment.userName}</h1>
                            <p>${comment.message}</p>
                            <span class="date">${comment.date}</span>
                        </div>
                    </div>`;
                commentsContainer.innerHTML += published;
            });

            // Update comments count
            commentsCount.textContent = querySnapshot.size;
        } else {
            commentsCount.textContent = 0; // No comments
        }
    } catch (error) {
        console.error("Error loading comments:", error);
    }
}

// Add Comment
async function addComment() {
    const userCommentElement = document.querySelector(".comment-section-user-comment");
    const userName = document.querySelector(".comment-section-user")?.value.trim() || "Anonymous";
    const userImage = userName === "Anonymous" ? "anonymous.png" : "user_4_fill.png";

    if (!userCommentElement.value) {
        console.error("User comment is empty. Please add a comment.");
        return;
    }

    if (!bookId) {
        console.error("Missing book ID.");
        return;
    }

    const commentData = {
        bookId: bookId,
        userName: userName,
        userImage: userImage,
        message: userCommentElement.value,
        date: new Date().toLocaleString(),
    };

    try {
        await addDoc(collection(db, 'comments'), commentData);
        console.log("Comment added successfully");
        userCommentElement.value = ""; // Clear input
        loadComments(); // Reload comments
    } catch (error) {
        console.error("Error adding comment:", error);
    }
}

// Event Listeners
document.getElementById("publish_comment").addEventListener("click", addComment);

// Load book details and comments on page load
document.addEventListener("DOMContentLoaded", () => {
    loadBookDetails();
    loadComments();
});
