# K-Culture Hub 🎮

한국 문화를 배우는 메모리 카드 게임 - React + TypeScript + Node.js + MySQL

---

## 📌 프로젝트 소개

**K-Culture Hub**는 한국 문화(문화재, 음식, 영화, 드라마, K-POP)를 주제로 한 교육용 메모리 카드 게임입니다.

### 핵심 기능
- 🎮 **카드 매칭 게임**: 문화재, 음식, 영화 등 5개 스테이지
- 🔐 **회원 시스템**: 이메일 로그인 + 게스트 로그인 (JWT 인증)
- 🪙 **코인 시스템**: 퀴즈 정답 시 코인 획득
- 🎨 **프로필 샵**: 코인으로 아바타 구매 (케데헌, 티니핑 등)
- 📚 **컬렉션 도감**: 수집한 카드 정보 열람
- 🤖 **AI 퀴즈**: JSON 기반 한국 문화 퀴즈 (25개 문제)
- 🏆 **랭킹 시스템**: 점수 경쟁 기능

---

## 🛠 기술 스택

### Frontend
- React 18 + TypeScript
- React Router v6
- Axios (HTTP 클라이언트)
- Tailwind CSS
- Context API (상태 관리)

### Backend
- Node.js + Express
- MySQL 8.0
- JWT 인증 (jsonwebtoken)
- bcrypt (비밀번호 해싱)
- express-session + express-mysql-session

---

## 📂 프로젝트 구조

```
ProgateHackathon/
├── client/                    # React 프론트엔드
│   ├── src/
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── context/          # AuthContext, GameContext
│   │   ├── services/         # API 서비스
│   │   └── types/            # TypeScript 타입 정의
│   ├── public/
│   └── package.json
│
├── config/
│   └── db.js                 # MySQL 연결 설정
│
├── middleware/
│   └── auth.js               # JWT 인증 미들웨어
│
├── routes/
│   ├── auth.js               # 로그인/회원가입
│   ├── game.js               # 게임 진행 상황
│   └── ai.js                 # 퀴즈 API
│
├── data/
│   └── quiz-questions.json   # 퀴즈 데이터
│
├── server.js                 # Express 서버
├── package.json              # 백엔드 의존성
└── .env                      # 환경 변수
```

---

## 🚀 실행 방법

### 1. 환경 요구사항
- Node.js 18.x 이상
- MySQL 8.0 이상
- npm

### 2. 데이터베이스 설정

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE k_everything_game;
USE k_everything_game;

# 테이블 생성 (아래 스키마 참고)
```

#### 테이블 스키마
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- sessions 테이블
CREATE TABLE sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT
);
```

### 3. 백엔드 설정

```bash
# 프로젝트 루트에서
npm install

# .env 파일 생성 및 설정
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=k_everything_game
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
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

# 개발 서버 실행 (http://localhost:3000)
npm start
```

### 5. 동시 실행 (권장)

```bash
# 터미널 1 - 백엔드
npm start

# 터미널 2 - 프론트엔드
cd client && npm start
```

---

## 🎮 게임 플레이 가이드

1. **로그인/회원가입**: 이메일 로그인 또는 게스트로 시작
2. **스테이지 선택**: 문화재, 음식, 영화 등 원하는 주제 선택
3. **카드 게임**: 같은 카드 2장 찾기 (8쌍 완성)
4. **컬렉션 확인**: 수집한 카드 정보 열람
5. **퀴즈 풀기**: AI 퀴즈로 지식 테스트 (정답 시 +10 코인)
6. **아바타 구매**: 코인으로 프로필 캐릭터 구매
7. **랭킹 확인**: 다른 플레이어와 점수 경쟁

---

## 📊 API 엔드포인트

### 인증 (`/api/auth`)
- `POST /signup` - 회원가입
- `POST /login` - 로그인
- `POST /guest-login` - 게스트 로그인
- `GET /me` - 현재 사용자 정보
- `POST /logout` - 로그아웃

### 게임 (`/api/game`)
- `GET /progress` - 진행 상황 조회
- `POST /progress` - 진행 상황 저장
- `POST /rankings` - 랭킹 제출
- `GET /rankings` - 랭킹 조회

### 퀴즈 (`/api/ai`)
- `POST /quiz` - 퀴즈 제출 및 채점

---

## 🔐 인증 시스템

- **JWT 토큰**: localStorage에 저장
- **Axios Interceptor**: 자동으로 Authorization 헤더 추가
- **게스트 모드**: DB 저장 없이 localStorage만 사용
- **비밀번호 해싱**: bcrypt로 안전하게 저장

---

## 🤝 팀 사차원 감자들

- **최웅식**: 기획 담당
- **윤태웅**: PM 통합 담당
- **최성우**: 데이터셋 구성 및 디자인 담당
- **제준혁**: 기능 개발 담당

**Progate Hackathon in Seoul** (2025.11.01-02)

---

## 📝 라이센스

본 프로젝트는 교육 목적으로 제작되었습니다.

---

**버전**: 2.0.0
**마지막 업데이트**: 2025-11-02
