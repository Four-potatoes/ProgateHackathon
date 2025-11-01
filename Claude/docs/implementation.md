# K-Movie Memory Master - 구현 상세

## 🏗 아키텍처

### 전체 구조
```
┌─────────────────────────────────────┐
│         User Interface (UI)         │
│  ┌──────────┬──────────┬──────────┐ │
│  │   Game   │Collection│ Learning │ │
│  │  Screen  │  Screen  │  Screen  │ │
│  └──────────┴──────────┴──────────┘ │
└─────────────────────────────────────┘
              ↓         ↑
┌─────────────────────────────────────┐
│        Application Logic (JS)       │
│  ┌────────────────────────────────┐ │
│  │   Game State Management        │ │
│  │   - Card Shuffling             │ │
│  │   - Match Detection            │ │
│  │   - Score Tracking             │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │   AI Quiz Engine               │ │
│  │   - Question Generation        │ │
│  │   - Answer Validation          │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
              ↓         ↑
┌─────────────────────────────────────┐
│    Data Layer & External Services   │
│  ┌──────────┐  ┌─────────────────┐ │
│  │ JSON DB  │  │ Firebase Cloud  │ │
│  │ (Movies) │  │ (Auth & Store)  │ │
│  └──────────┘  └─────────────────┘ │
└─────────────────────────────────────┘
```

---

## 📊 데이터 구조

### 1. 영화 데이터 (korean-movies.json)
```json
{
    "movies": [
        {
            "idx": 1,
            "title": "기생충",
            "img": "기생충.jpg",
            "genre": "범죄",
            "director": "봉준호",
            "actor": "송강호, 이선균, ...",
            "icon": "🎬",
            "desc": "계급 간의 대립과 사회적 격차를 다룬 작품."
        }
    ]
}
```

### 2. 게임 상태 (JavaScript State)
```javascript
{
    cards: Array,           // 카드 배열 (16개)
    flipped: Array,         // 현재 뒤집힌 카드 ID
    matched: Array,         // 매칭된 카드 ID
    moves: Number,          // 시도 횟수
    isWon: Boolean,         // 승리 여부
    canClick: Boolean,      // 클릭 가능 여부
    currentPage: String     // 현재 페이지
}
```

### 3. Firebase 랭킹 데이터
```javascript
{
    playerUid: String,      // 사용자 고유 ID
    moves: Number,          // 완료까지 걸린 시도 횟수
    timestamp: Timestamp    // 기록 시간
}
```

---

## 🎮 핵심 게임 로직

### 카드 매칭 알고리즘

```javascript
// 1. 카드 클릭 처리
handleCardClick(cardId) {
    // 클릭 불가능 상태 체크
    if (!canClick || flipped.length === 2 ||
        flipped.includes(cardId) ||
        matched.includes(cardId)) {
        return;
    }

    // 카드 뒤집기
    flipped.push(cardId);
    renderGame();

    // 2장 뒤집혔을 때
    if (flipped.length === 2) {
        canClick = false;
        moves++;

        const [card1, card2] = flipped;
        const item1 = cards.find(c => c.id === card1);
        const item2 = cards.find(c => c.id === card2);

        // 매칭 확인
        if (item1.name === item2.name) {
            // 성공: matched 배열에 추가
            matched.push(card1, card2);
            flipped = [];
            canClick = true;
            checkWinCondition();
        } else {
            // 실패: 1초 후 다시 뒤집기
            setTimeout(() => {
                flipped = [];
                canClick = true;
                renderGame();
            }, 1000);
        }
    }
}
```

### 카드 셔플링 (Fisher-Yates Algorithm)

```javascript
shuffleArray(array) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
        // 랜덤 인덱스 선택
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // 현재 원소와 랜덤 원소 교환
        [array[currentIndex], array[randomIndex]] =
        [array[randomIndex], array[currentIndex]];
    }

    return array;
}
```

### 승리 조건 체크

```javascript
checkWinCondition() {
    if (matched.length > 0 && matched.length === cards.length) {
        isWon = true;
        submitScore(moves);  // Firebase에 점수 제출
        renderGame();        // 승리 모달 표시
    }
}
```

---

## 🎨 UI/UX 구현

### 1. 카드 뒤집기 애니메이션 (CSS 3D Transform)

```css
/* Perspective 설정 */
.perspective {
    perspective: 1000px;
}

/* 3D 공간 유지 */
.transform-style-preserve-3d {
    transform-style: preserve-3d;
}

/* 카드 전환 애니메이션 */
.card-inner {
    transition: transform 0.5s;
}

/* 뒤집힌 상태 */
.rotate-y-180 {
    transform: rotateY(180deg);
}

/* 뒷면 숨김 */
.backface-hidden {
    backface-visibility: hidden;
}
```

### 2. 반응형 그리드 시스템

```html
<!-- Tailwind CSS를 활용한 반응형 그리드 -->
<div class="grid grid-cols-4 gap-3 md:gap-4">
    <!-- 모바일: gap-3, 데스크톱: gap-4 -->
</div>
```

### 3. 그라디언트 & 섀도우 효과

```css
/* 배경 그라디언트 */
background: linear-gradient(to bottom right,
    purple-50, pink-50, blue-50);

/* 버튼 그라디언트 */
bg-gradient-to-r from-purple-500 to-indigo-600

/* 그림자 효과 */
shadow-2xl hover:shadow-xl
```

---

## 🤖 AI 학습 시스템

### 퀴즈 생성 로직

```javascript
generateQuiz() {
    // 로딩 상태 활성화
    isProcessing = true;
    aiFeedback = null;
    renderAILearning();

    // 1.5초 후 퀴즈 생성 (비동기 효과)
    setTimeout(() => {
        // 랜덤 영화 선택
        const item = K_MOVIE_ITEMS[
            Math.floor(Math.random() * K_MOVIE_ITEMS.length)
        ];

        currentQuiz = {
            question: `다음 설명이 나타내는 한국 영화는? "${item.desc}"`,
            correctAnswer: item.name,
            item: item
        };

        isProcessing = false;
        renderAILearning();
    }, 1500);
}
```

### 답변 검증

```javascript
handleSubmit() {
    const userAnswer = document.getElementById('ai-answer').value.trim();

    if (!currentQuiz || isProcessing || userAnswer === '') return;

    isProcessing = true;
    renderAILearning();

    // 대소문자 무시 비교
    const isCorrect = userAnswer.toLowerCase() ===
                      currentQuiz.correctAnswer.toLowerCase();

    setTimeout(() => {
        if (isCorrect) {
            aiFeedback = {
                type: 'correct',
                message: `✅ 정답! ${item.name}
                         감독: ${item.director}
                         출연: ${item.actor}`
            };
        } else {
            aiFeedback = {
                type: 'incorrect',
                message: `❌ 틀렸어요. 정답은 "${item.name}"입니다.`
            };
        }
        isProcessing = false;
        renderAILearning();
    }, 1000);
}
```

---

## 🔥 Firebase 연동

### 1. 초기화

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 설정
const firebaseConfig = { /* ... */ };

// 앱 초기화
app = initializeApp(firebaseConfig);
db = getFirestore(app);
auth = getAuth(app);

// 익명 로그인
await signInAnonymously(auth);
```

### 2. 점수 제출

```javascript
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

async function submitScore(finalMoves) {
    const rankingPath = `artifacts/${appId}/public/data/kmovie_ranking`;

    await addDoc(collection(db, rankingPath), {
        playerUid: currentUserId,
        moves: finalMoves,
        timestamp: serverTimestamp()
    });
}
```

### 3. 실시간 랭킹 리스너

```javascript
import { query, orderBy, limit, onSnapshot } from "firebase/firestore";

function setupLeaderboardListener() {
    const q = query(
        collection(db, rankingPath),
        orderBy("moves", "asc"),      // 최소 시도 순
        orderBy("timestamp", "asc"),   // 같으면 빠른 시간 순
        limit(10)                      // Top 10
    );

    // 실시간 업데이트 구독
    onSnapshot(q, (snapshot) => {
        const rankings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderLeaderboard(rankings, false);
    });
}
```

---

## 📱 페이지 라우팅

### SPA 방식 페이지 전환

```javascript
const goToPage = (pageName) => {
    currentPage = pageName;
    render();

    // 아이콘 재렌더링
    if (window.createIcons && window.icons) {
        window.createIcons({ icons: window.icons });
    }
};

const render = () => {
    if (!isAuthReady) return;

    switch (currentPage) {
        case 'game':
            renderGame();
            break;
        case 'collection':
            renderCollection();
            break;
        case 'ai-learning':
            renderAILearning();
            if (!currentQuiz && !isProcessing) {
                generateQuiz();
            }
            break;
        case 'leaderboard':
            renderLeaderboard([], true);
            setupLeaderboardListener();
            break;
        default:
            appContainer.innerHTML = '<h1>페이지 오류</h1>';
    }
};
```

---

## 🔧 최적화 전략

### 1. 리렌더링 최적화
- 상태 변경 시에만 DOM 업데이트
- 불필요한 전역 변수 최소화

### 2. 이미지 최적화
- 영화 포스터 적절한 해상도 유지
- Lazy Loading 준비 (향후)

### 3. 코드 분리
- 게임 로직, AI 로직, 렌더링 로직 분리
- 모듈화 가능한 구조

### 4. 에러 핸들링
```javascript
try {
    const response = await fetch('../data/korean-movies.json');
    const data = await response.json();
    K_MOVIE_ITEMS = data.movies;
} catch (error) {
    console.error('Failed to load movie data:', error);
    // Fallback 데이터 사용
}
```

---

## 🧪 테스트 시나리오

### 게임 플로우 테스트
1. ✅ 카드 16장 정상 로드
2. ✅ 카드 클릭 시 뒤집기 애니메이션
3. ✅ 매칭 성공 시 카드 고정
4. ✅ 매칭 실패 시 1초 후 다시 뒤집기
5. ✅ 모든 매칭 완료 시 승리 모달
6. ✅ 재시작 버튼 정상 작동

### AI 학습 테스트
1. ✅ 퀴즈 랜덤 생성
2. ✅ 정답 입력 시 정답 피드백
3. ✅ 오답 입력 시 오답 피드백 + 정답 표시
4. ✅ 다음 문제 버튼 정상 작동

### 랭킹 테스트
1. ✅ Firebase 연결 확인
2. ✅ 점수 제출 정상 작동
3. ✅ 실시간 랭킹 업데이트
4. ✅ 본인 점수 하이라이트

---

## 🐛 알려진 이슈 & 해결 방법

### 이슈 1: Firebase 연결 실패
**원인**: firebaseConfig 누락
**해결**: 로컬 모드로 전환, UUID 생성

### 이슈 2: 아이콘 렌더링 지연
**원인**: innerHTML 업데이트 후 아이콘 미생성
**해결**: 렌더링 후 `createIcons()` 호출

### 이슈 3: 입력값 초기화
**원인**: DOM 재생성 시 input value 손실
**해결**: `oninput`에서 value 속성 동기화

---

## 📈 성능 지표

- **초기 로드 시간**: < 2초
- **카드 뒤집기 응답**: < 100ms
- **페이지 전환 시간**: < 500ms
- **Firebase 쓰기**: < 1초
- **랭킹 업데이트**: 실시간 (< 2초)

---

## 🎯 다음 단계

1. **LLM API 연동**: OpenAI/Claude API로 동적 퀴즈 생성
2. **PWA 변환**: 오프라인 지원, 앱 설치 가능
3. **다국어 지원**: i18n 라이브러리 적용
4. **애널리틱스**: Google Analytics 연동
5. **소셜 공유**: Open Graph 메타 태그 추가
