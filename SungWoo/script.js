const hambugerNav = document.getElementById('hambugerNav');
const hambugerGnbContainer = document.querySelector('.hambugerGnbContainer');
const closeBtnCon = document.getElementById('closeBtn');
const closeBtn = closeBtnCon.querySelector('i');
const partIntroContainer = document.getElementById('partIntroContainer');
const header = document.querySelector('header');
const partDivs = partIntroContainer.querySelectorAll('div');

// 햄버거 메뉴 열기/닫기
hambugerNav.addEventListener('click', () => {
  const isOpen = hambugerGnbContainer.style.display === "block";
  hambugerGnbContainer.style.display = isOpen ? "none" : "block";
});

closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  hambugerGnbContainer.style.display = "none";
});

// 스크롤 이벤트
window.addEventListener("scroll", () => {
  const headerHeight = header.offsetHeight;
  const partTop = partIntroContainer.offsetTop;
  const partHeight = partIntroContainer.offsetHeight;
  const partBottom = partTop + partHeight;
  const scrollY = window.scrollY;

  // 스크롤 진행률 계산 (0 ~ 1)
  let progress = 0;
  if (scrollY + headerHeight >= partTop && scrollY < partBottom) {
    progress = (scrollY + headerHeight - partTop) / partHeight;
  } else if (scrollY + headerHeight >= partBottom) {
    progress = 1;
  }

  // 배경 고정 + 스케일
  const scale = 1.5 - 0.4 * progress; // 1.5 → 1.1
  partIntroContainer.style.backgroundSize = `${scale * 100}% auto`;
  partIntroContainer.style.backgroundPosition = "center center";
  partIntroContainer.style.backgroundAttachment = "fixed";

  // partDivs opacity 및 중앙 고정 처리
  partDivs.forEach((div, index) => {
    const step = 1 / partDivs.length;
    const start = step * index;
    const end = step * (index + 1);

    if (scrollY + headerHeight >= partTop && scrollY < partBottom) {
      div.style.position = "fixed";
      div.style.top = "50%";
      div.style.left = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.transition = "opacity 0.4s ease";
      div.style.opacity = progress >= start && progress < end ? "1" : "0";
    } else if (scrollY + headerHeight < partTop) {
      div.style.position = "fixed";
      div.style.top = "50%";
      div.style.left = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.opacity = "0";
    } else {
      div.style.position = "absolute";
      div.style.top = "50%";
      div.style.left = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.opacity = "0";
    }
  });
});
 