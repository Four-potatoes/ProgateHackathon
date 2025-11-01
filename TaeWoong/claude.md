# K-Everything Memory Game - 완전 통합 문서

## 🎯 프로젝트 개요

**K-Everything Memory Game**은 한국 문화(문화재, 음식, 영화)를 주제로 한 교육용 메모리 카드 게임입니다.
React + TypeScript + Node.js + MySQL 스택으로 구현된 풀스택 웹 애플리케이션입니다.

**핵심 기능:**
- 🎮 3단계 메모리 카드 게임 (문화재, 음식, 영화)
- 🔐 이메일/비밀번호 인증 + 게스트 로그인
- 🪙 코인 시스템 (퀴즈 정답 시 획득)
- 🎨 프로필 샵 (아바타 구매)
- 📚 컬렉션 카드 (3D 플립 애니메이션)
- 🤖 AI 퀴즈 시스템 (25개 JSON 기반 문제)
- 🏆 랭킹 시스템 (MySQL 저장)

---

## 📂 프로젝트 구조

```
TaeWoong/
├── client/                          # React 프론트엔드
│   ├── src/
│   │   ├── types/                   # TypeScript 타입 정의
│   │   │   ├── user.ts              # User, AuthResponse, LoginCredentials
│   │   │   ├── game.ts              # GameProgress, GameCard, RankingEntry
│   │   │   └── quiz.ts              # QuizQuestion, QuizState, QuizResult
│   │   ├── services/                # API 서비스 레이어
│   │   │   ├── api.ts               # Axios 설정 (JWT 인터셉터)
│   │   │   ├── authService.ts       # 로그인, 회원가입, 게스트 로그인
│   │   │   ├── gameService.ts       # 게임 진행 상황 저장/로드
│   │   │   └── quizService.ts       # 퀴즈 데이터 로드
│   │   ├── context/                 # React Context API
│   │   │   ├── AuthContext.tsx      # 인증 상태 관리
│   │   │   └── GameContext.tsx      # 게임 진행 상태 관리
│   │   ├── components/              # React 컴포넌트
│   │   │   └── Header.tsx           # 공통 헤더
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   │   ├── WelcomePage.tsx      # 시작 화면
│   │   │   ├── StagesPage.tsx       # 스테이지 선택
│   │   │   ├── GamePage.tsx         # 카드 게임
│   │   │   ├── CollectionPage.tsx   # 컬렉션 도감
│   │   │   ├── ShopPage.tsx         # 프로필 샵
│   │   │   ├── QuizPage.tsx         # AI 퀴즈
│   │   │   └── RankingPage.tsx      # 랭킹 보드
│   │   ├── App.tsx                  # 라우팅 설정
│   │   └── index.tsx                # 엔트리 포인트
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── src/                             # 백엔드 (Node.js + Express)
│   ├── server.js                    # Express 서버 진입점
│   ├── config/
│   │   └── db.js                    # MySQL 연결 풀
│   ├── middleware/
│   │   └── auth.js                  # JWT 인증 미들웨어
│   ├── routes/
│   │   ├── auth.js                  # 인증 라우트
│   │   ├── game.js                  # 게임 진행 상황
│   │   └── ai.js                    # AI 퀴즈
│   └── utils/
│       └── jwt.js                   # JWT 토큰 생성/검증
│
├── data/
│   └── quiz-questions.json          # 25개 퀴즈 데이터 (문화재 8, 음식 8, 영화 9)
│
├── .env                             # 환경 변수
├── .env.example                     # 환경 변수 예제
├── .gitignore
├── package.json                     # 백엔드 의존성
└── claude.md                        # 본 문서
```

---

## 🛠 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|-----|------|------|
| React | 18.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안전성 |
| React Router | 6.x | 클라이언트 라우팅 |
| Axios | 1.x | HTTP 클라이언트 |
| Tailwind CSS | 3.x | 유틸리티 CSS |
| Context API | - | 전역 상태 관리 |

### Backend
| 기술 | 버전 | 용도 |
|-----|------|------|
| Node.js | 18.x+ | 런타임 |
| Express.js | 4.x | 웹 프레임워크 |
| MySQL | 8.0 | 데이터베이스 |
| mysql2 | 3.x | MySQL 드라이버 |
| bcrypt | 5.x | 비밀번호 해싱 |
| jsonwebtoken | 9.x | JWT 인증 |
| express-session | 1.x | 세션 관리 |
| express-mysql-session | 3.x | MySQL 세션 저장소 |
| dotenv | 16.x | 환경 변수 관리 |
| cors | 2.x | CORS 처리 |

### Database Schema
```sql
-- users 테이블
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(50),
    coins INT DEFAULT 0,
    is_guest BOOLEAN DEFAULT FALSE,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- game_progress 테이블
CREATE TABLE game_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    unlocked_stages JSON,
    completed_stages JSON,
    current_stage INT DEFAULT 1,
    viewed_collections JSON,
    purchased_avatars JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- rankings 테이블
CREATE TABLE rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    moves INT NOT NULL,
    time_taken INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- sessions 테이블 (express-mysql-session)
CREATE TABLE sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT
);
```

---

## 🔐 인증 시스템

### 1. 이메일/비밀번호 인증 (JWT)

**회원가입 플로우:**
```typescript
// authService.ts:27
export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', credentials);
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token);
  }
  return response.data;
};
```

**로그인 플로우:**
```typescript
// authService.ts:18
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token);
  }
  return response.data;
};
```

**백엔드 검증:**
```javascript
// routes/auth.js:23
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [users] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);

  if (users.length === 0) {
    return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }

  const user = users[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, user: { ...user, isGuest: false }, token });
});
```

### 2. 게스트 로그인 (임시 계정)

**특징:**
- DB에 저장되지만 `is_guest = true`
- 이메일/비밀번호 없음
- localStorage에만 진행 상황 저장
- 서버 동기화 없음

```typescript
// authService.ts:36
export const guestLogin = async (data: GuestLoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/guest-login', data);
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token);
  }
  return response.data;
};
```

### 3. JWT 자동 주입 (Axios Interceptor)

```typescript
// services/api.ts:15
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 자동 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

---

## 🎮 게임 시스템

### 1. 스테이지 구조

```typescript
// types/game.ts:8
export interface Stage {
  id: number;
  name: string;
  items: StageItem[];
}

// 3개 스테이지
const STAGES = [
  { id: 1, name: '문화재', items: [...] },
  { id: 2, name: '음식', items: [...] },
  { id: 3, name: '영화', items: [...] }
];
```

### 2. 게임 진행 상황 (GameProgress)

```typescript
// types/game.ts:32
export interface GameProgress {
  unlockedStages: number[];        // [1, 2, 3]
  completedStages: number[];       // [1, 2]
  currentStage: number;            // 3
  coins: number;                   // 120
  viewedCollections: string[];     // ['문화재', '음식']
  purchasedAvatars: string[];      // ['😊', '🎮', '🌟']
}
```

### 3. 카드 매칭 로직

```typescript
// types/game.ts:23
export interface GameState {
  cards: GameCard[];           // 16장 (8쌍)
  flippedCards: number[];      // 현재 뒤집힌 카드 인덱스
  matchedPairs: number;        // 매칭된 쌍 개수
  moves: number;               // 시도 횟수
  timeStarted: number | null;  // 시작 시간
  isComplete: boolean;         // 완료 여부
}

// 게임 로직 (src/index.html:456)
const handleCardClick = (idx) => {
  if (gameState.flippedCards.length >= 2) return;
  if (gameState.cards[idx].flipped || gameState.cards[idx].matched) return;

  gameState.cards[idx].flipped = true;
  gameState.flippedCards.push(idx);

  if (gameState.flippedCards.length === 2) {
    gameState.moves++;
    const [first, second] = gameState.flippedCards;

    if (gameState.cards[first].id === gameState.cards[second].id) {
      // 매칭 성공
      gameState.cards[first].matched = true;
      gameState.cards[second].matched = true;
      gameState.matchedPairs++;
      gameState.flippedCards = [];

      if (gameState.matchedPairs === 8) {
        gameState.isComplete = true;
        unlockNextStage();
      }
    } else {
      // 매칭 실패 - 1초 후 다시 뒤집기
      setTimeout(() => {
        gameState.cards[first].flipped = false;
        gameState.cards[second].flipped = false;
        gameState.flippedCards = [];
        render();
      }, 1000);
    }
  }
  render();
};
```

### 4. 듀얼 저장 전략 (localStorage + MySQL)

```typescript
// GameContext.tsx:40
const updateProgress = (newProgress: Partial<GameProgress>) => {
  setProgress((prev) => {
    const updated = { ...prev, ...newProgress };
    localStorage.setItem('game_progress', JSON.stringify(updated));
    return updated;
  });
};

const saveProgressToServer = async () => {
  if (user && !user.isGuest) {
    try {
      await gameService.saveProgress(progress);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }
};

// 게스트: localStorage만 사용
// 인증된 사용자: localStorage + MySQL 자동 동기화
```

---

## 🤖 AI 퀴즈 시스템

### 1. 문제 데이터 구조 (JSON)

```json
// data/quiz-questions.json
{
  "문화재": [
    {
      "question": "조선 왕조의 법궁으로, 1395년에 창건된 서울의 대표적인 궁궐은?",
      "options": ["경복궁", "창덕궁", "덕수궁", "경희궁"],
      "answer": "경복궁",
      "explanation": "경복궁은 조선 왕조의 정궁이자 가장 큰 궁궐로, 태조 이성계가 1395년에 창건했습니다. '큰 복을 받아 번영한다'는 뜻을 담고 있습니다."
    }
    // ... 총 8개
  ],
  "음식": [/* 8개 */],
  "영화": [/* 9개 */]
}
```

### 2. 퀴즈 상태 관리

```typescript
// types/quiz.ts:9
export interface QuizState {
  currentQuestion: QuizQuestion | null;
  selectedAnswer: string | null;
  showResult: boolean;
  result: QuizResult | null;
  loading: boolean;
  quizProgress: number;       // 0-8 진행률
  totalAnswered: number;      // 총 답변 개수
}
```

### 3. 클라이언트 사이드 정답 체크

```javascript
// src/index.html:1234
const checkAnswer = () => {
  const isCorrect = quizState.selectedAnswer === quizState.currentQuestion.answer;
  const reward = isCorrect ? 10 : 0;

  if (isCorrect) {
    coins += reward;
    quizState.quizProgress++;
    saveProgress();
    syncToServer(); // 인증된 사용자만 서버 동기화
  }

  quizState.result = {
    isCorrect,
    reward,
    explanation: quizState.currentQuestion.explanation
  };
  quizState.showResult = true;
  render();
};
```

### 4. 해금된 컬렉션만 퀴즈 출제

```javascript
// src/index.html:1201
const getNextQuestion = () => {
  // 해금된 스테이지의 컬렉션만 필터링
  const availableCategories = STAGES
    .filter(stage => unlockedStages.includes(stage.id))
    .map(stage => stage.name);

  if (availableCategories.length === 0) return null;

  // 랜덤 카테고리 선택
  const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  const questions = QUIZ_DATA[category];

  // 랜덤 문제 선택
  return questions[Math.floor(Math.random() * questions.length)];
};
```

---

## 🪙 코인 & 샵 시스템

### 1. 코인 획득 방법

- 퀴즈 정답: **+10 코인**
- 게임 클리어: **+0 코인** (현재는 퀴즈만)

```javascript
// src/index.html:1240
if (isCorrect) {
  coins += 10;
  saveProgress();
  syncToServer();
}
```

### 2. 프로필 샵 (아바타 구매)

```typescript
// types/game.ts:51
export interface Avatar {
  id: string;           // '😊'
  name: string;         // '스마일'
  price: number;        // 0, 50, 100, 200
  category: 'free' | 'basic' | 'premium' | 'legendary';
}

// 구매 로직
const purchaseAvatar = (avatar: Avatar) => {
  if (coins < avatar.price) {
    alert('코인이 부족합니다!');
    return;
  }

  coins -= avatar.price;
  purchasedAvatars.push(avatar.id);
  saveProgress();
  syncToServer();
};
```

---

## 🏆 랭킹 시스템

### 1. 랭킹 데이터 구조

```typescript
// types/game.ts:41
export interface RankingEntry {
  id: number;
  userName: string;      // 'Player123'
  stageName: string;     // '문화재'
  score: number;         // 1000 (점수 = 10000 / moves)
  moves: number;         // 10
  timeTaken: number;     // 45 (초)
  createdAt: string;     // '2025-11-02T10:30:00Z'
}
```

### 2. 점수 계산 공식

```javascript
// src/index.html:567
const calculateScore = () => {
  const baseScore = 10000;
  const movesPenalty = gameState.moves * 50;
  const timePenalty = Math.floor((Date.now() - gameState.timeStarted) / 1000) * 10;

  return Math.max(0, baseScore - movesPenalty - timePenalty);
};
```

### 3. 랭킹 제출 & 조회

```typescript
// gameService.ts:28
export const submitRanking = async (data: {
  stageName: string;
  score: number;
  moves: number;
  timeTaken: number;
}) => {
  const response = await api.post('/game/rankings', data);
  return response.data;
};

export const getRankings = async (stageName?: string) => {
  const response = await api.get('/game/rankings', {
    params: { stageName }
  });
  return response.data.rankings;
};
```

---

## 🎨 UI/UX 특징

### 1. 3D 카드 플립 애니메이션

```css
/* CSS Transform */
.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}
```

### 2. 다크 그라디언트 UI

```css
/* Tailwind 클래스 */
bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
```

### 3. 반응형 그리드

```css
/* 컬렉션 그리드 */
grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4

/* 카드 게임 그리드 */
grid-cols-4 gap-4 max-w-2xl
```

---

## 🚀 설치 & 실행 가이드

### 1. 환경 요구사항

- Node.js 18.x 이상
- MySQL 8.0 이상
- npm 또는 yarn

### 2. 데이터베이스 설정

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE k_everything_game;
USE k_everything_game;

# 테이블 생성 (위의 Database Schema 참고)
```

### 3. 백엔드 설정

```bash
# 프로젝트 루트에서
cd TaeWoong

# 의존성 설치
npm install

# .env 파일 생성
cp .env.example .env

# .env 파일 수정
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=k_everything_game
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
PORT=5000

# 서버 실행
npm start
```

### 4. 프론트엔드 설정

```bash
# client 폴더로 이동
cd client

# 의존성 설치
npm install
npm install axios react-router-dom
npm install -D @types/react-router-dom tailwindcss postcss autoprefixer

# Tailwind 초기화
npx tailwindcss init -p

# package.json에 proxy 추가
{
  "proxy": "http://localhost:5000",
  ...
}

# 개발 서버 실행
npm start
```

### 5. 동시 실행 (선택사항)

```bash
# 루트에서 concurrently 사용
npm install -D concurrently

# package.json scripts 추가
{
  "scripts": {
    "server": "node src/server.js",
    "client": "cd client && npm start",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}

# 실행
npm run dev
```

---

## 🔧 트러블슈팅

### 1. Gemini API 오류 (해결됨)

**문제:**
```
[GoogleGenerativeAI Error]: API key not valid
models/gemini-pro is not found
```

**원인:**
- `.env` 파일에 API 키가 `G E M I N I _ A P I _ K E Y = A I z a...` 형태로 공백 포함
- 잘못된 모델명 사용 (`gemini-pro` → 지원 종료)

**해결:**
1. `.env` 파일 수정: `GEMINI_API_KEY=AIzaSyBvXRis2SwpGRatMPO932yoC9SYpZ8u_1E`
2. 모델명 변경: `gemini-2.5-flash`
3. **최종 해결**: AI API 완전히 제거, JSON 기반 퀴즈로 전환 (100% 안정성)

### 2. 퀴즈 API Unauthorized (해결됨)

**문제:**
```json
{
  "error": "Unauthorized",
  "message": "로그인이 필요합니다."
}
```

**원인:**
- `routes/ai.js`에서 `authenticateToken` 미들웨어 사용
- 게스트 사용자 접근 차단

**해결:**
```javascript
// routes/ai.js:3
const { optionalAuth } = require('../middleware/auth');

// routes/ai.js:7
router.post('/quiz', optionalAuth, async (req, res) => {
  // ...
  // 코인 보상은 인증된 사용자만
  if (isCorrect && req.user && req.user.id) {
    await promisePool.query(
      'UPDATE users SET coins = coins + ? WHERE id = ?',
      [reward, req.user.id]
    );
  }
});
```

### 3. Placeholder 이미지 로딩 실패 (해결됨)

**문제:**
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
https://via.placeholder.com/40
```

**해결:**
```jsx
// Before
<img src="https://via.placeholder.com/40" />

// After
<div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
  {currentUser.avatar || '😊'}
</div>
```

### 4. React 빌드 오류

**문제:**
```
Module not found: Can't resolve 'axios'
```

**해결:**
```bash
cd client
npm install axios react-router-dom
npm install -D @types/react-router-dom
```

### 5. CORS 오류

**문제:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**해결:**
```javascript
// server.js:15
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 📊 API 엔드포인트

### 인증 (`/api/auth`)

| Method | Endpoint | 설명 | Body | Response |
|--------|----------|------|------|----------|
| POST | `/signup` | 회원가입 | `{ email, password, name, avatar }` | `{ success, user, token }` |
| POST | `/login` | 로그인 | `{ email, password }` | `{ success, user, token }` |
| POST | `/guest-login` | 게스트 로그인 | `{ name, avatar }` | `{ success, user, token }` |
| GET | `/me` | 현재 사용자 | - | `{ success, user }` |
| POST | `/logout` | 로그아웃 | - | `{ success, message }` |

### 게임 (`/api/game`)

| Method | Endpoint | 설명 | Body | Response |
|--------|----------|------|------|----------|
| GET | `/progress` | 진행 상황 조회 | - | `{ success, progress }` |
| POST | `/progress` | 진행 상황 저장 | `GameProgress` | `{ success, message }` |
| POST | `/rankings` | 랭킹 제출 | `{ stageName, score, moves, timeTaken }` | `{ success, message }` |
| GET | `/rankings` | 랭킹 조회 | `?stageName=문화재` | `{ success, rankings }` |

### AI 퀴즈 (`/api/ai`)

| Method | Endpoint | 설명 | Body | Response |
|--------|----------|------|------|----------|
| POST | `/quiz` | 퀴즈 제출 | `{ category, userAnswer }` | `{ success, isCorrect, reward, explanation }` |

---

## 🎯 React 아키텍처 패턴

### 1. Context API 기반 상태 관리

```
App.tsx
  └─ AuthProvider (AuthContext)
       └─ GameProvider (GameContext)
            └─ Router
                 ├─ WelcomePage
                 ├─ StagesPage
                 ├─ GamePage
                 ├─ CollectionPage
                 ├─ ShopPage
                 ├─ QuizPage
                 └─ RankingPage
```

### 2. 서비스 레이어 패턴

```
Components/Pages
       ↓
    Services
       ↓
   Axios (api.ts)
       ↓
  Backend API
```

### 3. PrivateRoute 패턴

```typescript
// App.tsx:25
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/" replace />;
};

// 사용
<Route
  path="/stages"
  element={
    <PrivateRoute>
      <StagesPage />
    </PrivateRoute>
  }
/>
```

---

## 📈 성능 최적화

### 1. localStorage 캐싱

```typescript
// 게임 진행 상황을 localStorage에 캐시
// 서버 요청 최소화
useEffect(() => {
  const cached = localStorage.getItem('game_progress');
  if (cached) {
    setProgress(JSON.parse(cached));
  } else {
    loadProgressFromServer();
  }
}, []);
```

### 2. Axios 인터셉터로 중복 코드 제거

```typescript
// JWT 토큰을 모든 요청에 자동 추가
// 매번 헤더를 수동으로 설정할 필요 없음
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. MySQL 커넥션 풀

```javascript
// config/db.js:8
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

---

## 🔮 향후 개선 계획

### Phase 1: 기능 완성
- [ ] React 페이지 전체 구현 완료
  - [x] WelcomePage
  - [ ] StagesPage
  - [ ] GamePage
  - [ ] CollectionPage
  - [ ] ShopPage
  - [ ] QuizPage
  - [ ] RankingPage
- [ ] 프로필 편집 기능
- [ ] 친구 초대 시스템

### Phase 2: UX 개선
- [ ] 로딩 스켈레톤 추가
- [ ] 애니메이션 최적화
- [ ] 모바일 반응형 개선
- [ ] 다크 모드 토글

### Phase 3: 기능 확장
- [ ] 일일 챌린지
- [ ] 업적 시스템
- [ ] 소셜 공유 기능
- [ ] 실시간 멀티플레이어

### Phase 4: 배포
- [ ] Frontend: Vercel/Netlify
- [ ] Backend: Heroku/Railway
- [ ] Database: PlanetScale/AWS RDS
- [ ] CDN: Cloudflare

---

## 📞 개발 히스토리

### 2025-11-01: 초기 개발
- Gemini API 통합 시도
- Firebase 제거, MySQL 마이그레이션
- Email/Password 인증 구현
- 코인 시스템 추가

### 2025-11-02: React 마이그레이션
- Gemini API 제거 → JSON 퀴즈 전환
- React + TypeScript 앱 생성
- Context API 아키텍처 설계
- 서비스 레이어 구현
- TypeScript 타입 정의 완성

---

## 📝 라이센스 & 저작권

본 프로젝트는 교육 목적으로 제작되었습니다.
퀴즈 데이터는 공개 정보를 기반으로 작성되었으며, Fair Use 원칙을 따릅니다.

---

**마지막 업데이트**: 2025-11-02
**버전**: 2.0.0 (React Migration)
**상태**: 🚧 개발 진행 중 (React 페이지 구현 필요)

---

## 🎓 학습 포인트

이 프로젝트를 통해 다음을 학습할 수 있습니다:

1. **풀스택 개발**: React + Node.js + MySQL 통합
2. **인증 시스템**: JWT + bcrypt 구현
3. **타입스크립트**: 타입 안전성 확보
4. **상태 관리**: Context API 패턴
5. **API 설계**: RESTful 엔드포인트
6. **보안**: 비밀번호 해싱, SQL Injection 방지
7. **성능**: 커넥션 풀, localStorage 캐싱
8. **아키텍처**: 서비스 레이어 패턴, 관심사 분리

---

## 🤝 팀 사차원 감자들

- **대대장** UngSik (기획)
- **부대장** JunHyeok (개발)
- **일반병** TaeWoong (통합)
- **쫄병샊** SungWoo (데이터)

**Progate Hackathon in Seoul** (2025.11.01-02)
