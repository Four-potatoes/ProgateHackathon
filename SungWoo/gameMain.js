const profile = document.querySelector('.profile');
const userMenu = document.querySelector('.profileContainer .user');
const profileContainer = document.querySelector('.profileContainer');

// 프로필 클릭 시 토글
profile.addEventListener('click', (e) => {
  e.stopPropagation();
  profileContainer.classList.toggle('active');
});

// 바깥 클릭 시 닫기
document.addEventListener('click', (e) => {
  if (!profileContainer.contains(e.target)) {
    profileContainer.classList.remove('active');
  }
});
