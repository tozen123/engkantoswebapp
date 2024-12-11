// Author information stored in an object
const authorData = {
    1: {
      name: "KRISTINE A. PURGANAN",
      description: "Mapagpalang Araw!Ako si Kristine A. Purganan, isa sa mga nagpapakadalubhasa sa Filipino at ang tagapaglikha ng e-kagamitang pantulong na ito. Nawa’y maging mas kawili-wili ang iyong pagbabasa at pag-aaral ng mga kuwentong mitolohiyang ito. Maraming salamat sa iyong pagbisita, at nawa’y maging kapaki-pakinabang ang paggamit mo ng ENGKANTO!"
    },
    2: {
      name: "DANICA C. SAMAN",
      description: "Magandang Buhay! Ako si Danica C. Saman. Isa sa mga nagpapakadalubhasa sa asignaturang Filipino at isa rin  tagapaglikha ng e-kagamitang pantulong na ito. Hangad kong makatulong sa iyo ang ENGKANTO na naglalaman ng mga mitolohiyang pinag-aaralan sa ika-sampung baitang. Bukas-palad naming tatanggapin ang anumang suhestiyon o katanungan. Hanggang sa muli!"
    },
    3: {
      name: "Edwin R. Ichiano, PhD",
      description: "Tagapayo"
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
  