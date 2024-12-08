// Author information stored in an object
const authorData = {
    1: {
      name: "KRISTINE A. PURGANAN",
      description: "May-Akda ng 'Pagsibol' at isang bihasang manunulat sa larangan ng panitikang Pilipino."
    },
    2: {
      name: "DANICA C. SAMAN",
      description: "May-Akda na nagpakadalubhasa sa pagsusulat ng makabagong kwentong pambata."
    },
    3: {
      name: "Edwin R. Ichiano, PhD",
      description: "Tagapayo sa proyekto, may malawak na karanasan sa pananaliksik at edukasyon."
    }
  };
  
  // Select all author cards
  const authorCards = document.querySelectorAll('.author-card');
  
  // Select the elements to update
  const authorName = document.getElementById('unique-author-name');
  const authorDescription = document.getElementById('unique-author-description');
  
  // Add click event listeners to each card
  authorCards.forEach(card => {
    card.addEventListener('mouseover', () => {
      // Get the unique identifier for the clicked card
      const authorId = card.getAttribute('data-id');
      
      // Retrieve the data from the authorData object
      const { name, description } = authorData[authorId];
  
      // Update the info container with the card's data
      authorName.textContent = name;
      authorDescription.textContent = description;
    });
  });
  