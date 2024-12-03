import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc}  from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const bookId = params.get('bookId');

async function loadBookDetails() {
    const mainContentTitle = document.querySelector('.main-content h1');
    const statsElement = document.querySelector('.views-likes');
    const descriptionElement = document.querySelector('.content-text');
    const readBtn = document.querySelector('.btn');

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

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadBookDetails);
// Function to load comments from Firestore
async function loadComments() {
    const commentsContainer = document.querySelector('.comments');
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

                let published = `
                    <div class="parents">
                        <img src="${comment.userImage}">
                        <div>
                            <h1>${comment.userName}</h1>
                            <p>${comment.message}</p>
                            <div class="engagements">
                                <img src="like.png">
                                <img src="share.png">
                            </div>
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
async function addComment() {
    const userCommentElement = document.querySelector(".usercomment");
    if (!userCommentElement) {
        console.error("Element '.usercomment' not found.");
        return;
    }

    const userComment = userCommentElement.value; // Ensure no extra spaces
    const userName = document.querySelector(".user")?.value.trim() || "Anonymous";
    const userImage = userName === "Anonymous" ? "anonymous.png" : "user_4_fill.png";

    console.log("User Comment:", userComment);
    console.log("Book ID:", bookId);

    if (!userComment) {
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
        message: userComment,
        date: new Date().toLocaleString(),
    };

    console.log("Comment Data to Add:", commentData);

    try {
        await addDoc(collection(db, 'comments'), commentData);
        console.log("Comment added successfully");
        userCommentElement.value = ""; // Clear input
        loadComments(); // Reload comments
    } catch (error) {
        console.error("Error adding comment:", error);
    }
}




// Event listener for the publish button
document.getElementById("publish_comment").addEventListener("click", () => {
    addComment();
});

// Load comments when the page is fully loaded
document.addEventListener("DOMContentLoaded", loadComments);