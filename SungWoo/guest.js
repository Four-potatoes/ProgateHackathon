const texts = [
  "안녕하세요!",
  "Welcome!",
  "Bonjour!",
  "こんにちは!",
  "你好!",
  "Xin chào!"
];

const rightSide = document.querySelector('.rightSide');
let currentIndex = 0;
let charIndex = 0;
let typingDelay = 150;      // 글자 나오는 속도
let eraseDelay = 50;        // 글자 지우는 속도
let delayBetweenTexts = 1500; // 다음 텍스트 전 대기 시간

function typeText() {
  const currentText = texts[currentIndex];
  rightSide.innerHTML = `<h1>${currentText.slice(0, charIndex + 1)}<span class="cursor">|</span></h1>`;
  charIndex++;

  if (charIndex < currentText.length) {
    setTimeout(typeText, typingDelay);
  } else {
    setTimeout(eraseText, delayBetweenTexts);
  }
}

function eraseText() {
  const currentText = texts[currentIndex];
  rightSide.innerHTML = `<h1>${currentText.slice(0, charIndex)}<span class="cursor">|</span></h1>`;
  charIndex--;

  if (charIndex >= 0) {
    setTimeout(eraseText, eraseDelay);
  } else {
    charIndex = 0;
    currentIndex = (currentIndex + 1) % texts.length; // 다음 텍스트, 무한 반복
    setTimeout(typeText, typingDelay);
  }
}

// 시작
typeText();
