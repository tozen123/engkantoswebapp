import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configure PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

async function loadBookPdf() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("bookId");

  const pdfContainer = document.getElementById("pdf-container");
  const loadingSpinner = document.getElementById("loading-spinner");
  const likePanel = document.getElementById("like-panel");
  const likeButton = document.getElementById("like-button");
  const homePanel = document.getElementById("home-panel");
  const homeButton = document.getElementById("home-button");
  const bookTitle = document.getElementById("book-title");

  if (!bookId) {
    bookTitle.textContent = "Error: No book ID provided.";
    return;
  }

  try {
    // Fetch book data from Firestore
    const booksRef = collection(db, "books");
    const q = query(booksRef, where("bookId", "==", bookId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      bookTitle.textContent = "Book not found.";
      return;
    }

    const bookDoc = querySnapshot.docs[0];
    const bookData = bookDoc.data();
    bookTitle.textContent = bookData.name;

    const pdfPath = `pdfs/${bookId}.pdf`; // Path to the local PDF
    const pdfDoc = await pdfjsLib.getDocument(pdfPath).promise;

    loadingSpinner.style.display = "none";

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      renderPage(page, pdfContainer);
    }

    // Show panels after rendering all pages
    likePanel.style.display = "block";
    homePanel.style.display = "block";

    // Increment hearts on like button click
    likeButton.addEventListener("click", async () => {
      try {
        await updateDoc(bookDoc.ref, {
          hearts: increment(1),
        });
        alert("Thanks for liking the book!");
      } catch (error) {
        console.error("Error updating hearts:", error);
      }
    });

    // Redirect to home on home button click
    homeButton.addEventListener("click", () => {
      window.location.href = "index.html"; // Replace with your actual home page path
    });
  } catch (error) {
    console.error("Error loading book PDF:", error);
    loadingSpinner.textContent = "An error occurred while loading the book.";
  }
}

// Render a single page
async function renderPage(page, container) {
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement("canvas");
  canvas.className = "pdf-page";
  const context = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  container.appendChild(canvas);

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;
}

document.addEventListener("DOMContentLoaded", loadBookPdf);
