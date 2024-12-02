import { firebaseConfig } from './config.js';

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();

const bookContainer = document.getElementById('book-container');

function fetchBooks() {
  database.collection('books')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const book = doc.data();

        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
          <img src="${book.image}" alt="${book.name}">
          <div class="info">
            <h1>${book.name}</h1>
            <p>${book.author}</p>
            <p>${book.reads} Reads</p>
            <button onclick="openBook('${book.bookPdf}')">Read More</button>
          </div>
        `;

        bookContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error('Error fetching books:', error);
    });
}

function openBook(pdfUrl) {
  window.open(pdfUrl, '_blank');
}

fetchBooks();

const wrap = document.querySelector('.wrap');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

let currentIndex = 0;

leftBtn.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, 0); // Prevent sliding beyond the first item
    wrap.style.transform = `translateX(${currentIndex * 320}px)`;
});

rightBtn.addEventListener('click', () => {
    const maxIndex = -(wrap.children.length - 1); // Prevent sliding beyond the last item
    currentIndex = Math.max(currentIndex - 1, maxIndex);
    wrap.style.transform = `translateX(${currentIndex * 320}px)`;
});