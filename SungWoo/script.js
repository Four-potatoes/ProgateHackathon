const hambugerNav = document.getElementById('hambugerNav');
const hambugerGnbContainer = document.querySelector('.hambugerGnbContainer');
const closeBtn = document.getElementById('closeBtn');

hambugerNav.addEventListener('click', () => {
  const isOpen = hambugerGnbContainer.style.display === "block";
  hambugerGnbContainer.style.display = isOpen ? "none" : "block";
});

closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  hambugerGnbContainer.style.display = "none";
});
