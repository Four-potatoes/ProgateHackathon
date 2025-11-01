# 🚀 백엔드 서버 설치 가이드 (TaeWoong 폴더)

## 빠른 시작 (5분!)

### 1단계: XAMPP MySQL 실행
```bash
XAMPP Control Panel 실행
MySQL "Start" 버튼 클릭
```

### 2단계: 데이터베이스 생성
```bash
1. http://localhost/phpmyadmin 접속
2. "New" 클릭
3. 데이터베이스 이름: k_everything_game
4. "Create" 클릭
5. "SQL" 탭 클릭
6. database_schema.sql 파일 내용 복사 & 실행
```

### 3단계: Node.js 패키지 설치
```bash
cd C:\Users\24457\OneDrive\바탕 화면\ProgateHackathon\TaeWoong
npm install
```

### 4단계: 서버 실행
```bash
npm start
```

### 5단계: 확인
```bash
브라우저: http://localhost:5000
게임: http://localhost:5000/game
```

## 성공 메시지

```
✅ MySQL 데이터베이스 연결 성공!

╔════════════════════════════════════════════╗
║   K-Everything Memory Game Backend API    ║
╚════════════════════════════════════════════╝

🚀 Server running on: http://localhost:5000
🎮 HTML Game: http://localhost:5000/game
🗄️  Database: k_everything_game
```

## API 엔드포인트

```
POST   /api/auth/simple-login    # 간단 로그인
GET    /api/auth/google           # Google OAuth
POST   /api/auth/logout           # 로그아웃

GET    /api/game/progress         # 진행도 조회
POST   /api/game/progress         # 진행도 저장
POST   /api/game/complete         # 스테이지 완료
GET    /api/game/ranking          # 랭킹 조회
GET    /api/game/stages           # 스테이지 데이터
```

## 폴더 구조

```
TaeWoong/
├── server.js                   ✅ 메인 서버
├── package.json                ✅ 의존성
├── .env                        ✅ 환경 변수
├── database_schema.sql         ✅ DB 스키마
├── config/
│   ├── db.js                   ✅ MySQL 연결
│   └── passport.js             ✅ Google OAuth
├── routes/
│   ├── auth.js                 ✅ 인증 API
│   └── game.js                 ✅ 게임 API
├── middleware/
│   └── auth.js                 ✅ JWT 인증
├── src/                        ✅ 기존 HTML 게임
├── data/                       ✅ 게임 데이터
└── assets/                     ✅ 이미지
```

## 완료! 🎉

이제 TaeWoong 폴더 안에서 모든 것이 작동합니다!
