# 🚀 K-Everything Full Stack 설치 가이드

React + Node.js + MySQL로 만든 완전한 풀스택 버전입니다!

## 📋 전체 흐름

```
1. XAMPP MySQL 실행 (1분)
2. 데이터베이스 생성 (2분)
3. 백엔드 실행 (2분)
4. 프론트엔드 실행 (나중에)
```

---

## ✅ Step 1: XAMPP MySQL 실행

### Windows
```bash
# XAMPP Control Panel 실행
# MySQL 옆의 "Start" 버튼 클릭
# "Running" 초록불이 켜지면 성공!
```

### 확인
```bash
# 브라우저에서 접속
http://localhost/phpmyadmin

# 접속되면 성공! ✅
```

---

## ✅ Step 2: 데이터베이스 생성

### 방법 1: phpMyAdmin (추천)

```bash
1. http://localhost/phpmyadmin 접속
2. 왼쪽 "New" 클릭
3. 데이터베이스 이름 입력: k_everything_game
4. "Create" 버튼 클릭
5. 생성된 데이터베이스 클릭
6. 상단 "SQL" 탭 클릭
7. 다음 파일 열기:
   C:\Users\24457\OneDrive\바탕 화면\ProgateHackathon\FullStack\database\schema.sql
8. 파일 내용 전체 복사
9. SQL 입력창에 붙여넣기
10. "Go" 버튼 클릭
11. "4 개의 테이블이 생성되었습니다" 메시지 확인
```

### 확인
```bash
# phpMyAdmin 왼쪽 메뉴에서 k_everything_game 확인
# 테이블 목록:
- users ✅
- game_progress ✅
- rankings ✅
- sessions ✅
```

---

## ✅ Step 3: 백엔드 설치 및 실행

### 3-1. 패키지 설치

```bash
# CMD 또는 PowerShell 열기
cd C:\Users\24457\OneDrive\바탕 화면\ProgateHackathon\FullStack\backend

# npm 패키지 설치
npm install

# 설치 완료까지 1-2분 소요
```

### 3-2. 서버 실행

```bash
# 같은 터미널에서
npm start

# 또는 자동 재시작 모드 (개발용)
npm run dev
```

### 3-3. 성공 확인

다음과 같은 메시지가 나타나면 성공입니다:

```
✅ MySQL 데이터베이스 연결 성공!

╔════════════════════════════════════════════╗
║   K-Everything Memory Game Backend API    ║
╚════════════════════════════════════════════╝

🚀 Server running on: http://localhost:5000
🌍 Environment: development
🗄️  Database: k_everything_game
🔐 Session Store: MySQL

Available endpoints:
   GET  http://localhost:5000/
   GET  http://localhost:5000/health
   POST http://localhost:5000/auth/google
   GET  http://localhost:5000/game/progress
```

### 3-4. 테스트

**브라우저에서 접속:**
```
http://localhost:5000
```

**응답 확인:**
```json
{
  "message": "K-Everything Memory Game API",
  "version": "1.0.0",
  "status": "running"
}
```

✅ 이 화면이 나오면 백엔드 완벽하게 작동 중!

---

## 🎮 API 테스트 (선택사항)

### Postman이나 Thunder Client로 테스트

#### 1. 간단 로그인
```http
POST http://localhost:5000/auth/simple-login
Content-Type: application/json

{
  "name": "테스트유저",
  "avatar": "😊"
}
```

**응답:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "테스트유저",
    "avatar": "😊"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. 진행도 조회
```http
GET http://localhost:5000/game/progress
Authorization: Bearer {위에서 받은 token}
```

**응답:**
```json
{
  "userId": 1,
  "currentStage": 1,
  "unlockedStages": [1],
  "completedStages": [],
  "playerAvatar": "😊"
}
```

✅ 이렇게 나오면 모든 API 정상 작동!

---

## 🔧 문제 해결

### 문제 1: MySQL 연결 실패
```
❌ MySQL 연결 실패: ECONNREFUSED
```

**해결:**
1. XAMPP MySQL이 실행 중인지 확인
2. http://localhost/phpmyadmin 접속 확인
3. 안 되면 XAMPP 재시작

### 문제 2: 데이터베이스 없음
```
❌ Error: ER_BAD_DB_ERROR: Unknown database
```

**해결:**
1. Step 2 다시 진행 (데이터베이스 생성)
2. phpMyAdmin에서 k_everything_game 존재 확인

### 문제 3: 포트 이미 사용 중
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```

**해결:**
```bash
# 다른 포트 사용
# .env 파일 열기
PORT=5001

# 서버 재시작
npm start
```

### 문제 4: npm install 실패
```
❌ npm ERR! network timeout
```

**해결:**
```bash
# npm 캐시 삭제
npm cache clean --force

# 다시 설치
npm install
```

---

## 📁 프로젝트 구조

```
FullStack/
├── backend/                    ✅ 완성!
│   ├── server.js              ✅ 메인 서버
│   ├── package.json           ✅ 의존성
│   ├── .env                   ✅ 환경 변수
│   ├── config/
│   │   ├── db.js             ✅ MySQL 연결
│   │   └── passport.js       ✅ Google OAuth
│   ├── routes/
│   │   ├── auth.js           ✅ 인증 API
│   │   └── game.js           ✅ 게임 API
│   └── middleware/
│       └── auth.js           ✅ JWT 검증
│
├── database/
│   └── schema.sql            ✅ DB 스키마
│
└── frontend/                  🔜 다음 단계
    └── (React 프로젝트)
```

---

## 🎯 다음 단계

백엔드가 완벽하게 작동하면:

1. **프론트엔드 React 개발** (다음에 진행)
2. **Google OAuth 설정** (필요시)
3. **배포** (완성 후)

---

## 💡 유용한 명령어

```bash
# 서버 시작
npm start

# 개발 모드 (자동 재시작)
npm run dev

# 서버 중지
Ctrl + C

# 로그 확인
# 터미널에 모든 로그가 표시됩니다

# 데이터베이스 확인
http://localhost/phpmyadmin
```

---

## 🎊 완료!

백엔드 서버가 성공적으로 실행되었습니다!

```
✅ MySQL 연결
✅ 데이터베이스 생성
✅ 백엔드 서버 실행
✅ API 엔드포인트 준비
```

이제 프론트엔드를 개발하거나, 기존 HTML 버전과 연동할 수 있습니다!

---

## 📞 문의

문제가 발생하면:
1. 터미널의 에러 메시지 확인
2. backend/README.md의 문제 해결 섹션 참고
3. XAMPP MySQL 재시작
4. 백엔드 서버 재시작

**모든 것이 정상 작동하면 이 가이드는 끝입니다! 🎉**
