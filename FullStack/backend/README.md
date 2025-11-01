# K-Everything Backend API

Node.js + Express + MySQL 백엔드 서버입니다.

## 빠른 시작 (5분 완료!)

### 1. XAMPP MySQL 시작
```bash
# XAMPP Control Panel 실행
# MySQL "Start" 버튼 클릭
```

### 2. 데이터베이스 생성
```bash
# 방법 1: phpMyAdmin 사용
1. http://localhost/phpmyadmin 접속
2. 왼쪽 "New" 클릭
3. 데이터베이스 이름: k_everything_game
4. "Create" 클릭
5. "SQL" 탭 클릭
6. ../database/schema.sql 파일 내용 복사 & 붙여넣기
7. "Go" 클릭

# 방법 2: MySQL CLI 사용
mysql -u root -p < ../database/schema.sql
```

### 3. 패키지 설치
```bash
npm install
```

### 4. 환경 변수 설정
```bash
# .env 파일은 이미 생성되어 있습니다!
# Google OAuth를 사용하려면 GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET만 변경하세요
```

### 5. 서버 실행
```bash
npm start

# 또는 개발 모드 (nodemon)
npm run dev
```

### 6. 테스트
```bash
# 브라우저에서 접속
http://localhost:5000

# 또는 curl로 테스트
curl http://localhost:5000/health
```

## 성공 메시지

서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
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

Press Ctrl+C to stop the server
```

## API 엔드포인트

### 인증 API (`/auth`)

#### 간단 로그인 (이름만)
```http
POST /auth/simple-login
Content-Type: application/json

{
  "name": "홍길동",
  "avatar": "😊"
}

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "name": "홍길동",
    "avatar": "😊",
    "isLocal": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Google OAuth 로그인
```http
GET /auth/google
# 브라우저가 Google 로그인 페이지로 리다이렉트됩니다

# 콜백 (자동 처리)
GET /auth/google/callback
```

#### 현재 사용자 정보
```http
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "avatar": "😊"
  },
  "progress": {
    "currentStage": 2,
    "unlockedStages": [1, 2],
    "completedStages": [1]
  }
}
```

#### 로그아웃
```http
POST /auth/logout

Response:
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

### 게임 API (`/game`)

#### 진행도 조회
```http
GET /game/progress
Authorization: Bearer {token}

Response:
{
  "userId": 1,
  "currentStage": 2,
  "unlockedStages": [1, 2],
  "completedStages": [1],
  "playerAvatar": "😊"
}
```

#### 진행도 저장
```http
POST /game/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentStage": 2,
  "unlockedStages": [1, 2],
  "completedStages": [1],
  "playerAvatar": "😎"
}

Response:
{
  "success": true,
  "message": "진행도가 저장되었습니다."
}
```

#### 스테이지 완료
```http
POST /game/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "stageId": 1,
  "stageName": "문화재",
  "moves": 25,
  "completionTime": 120
}

Response:
{
  "success": true,
  "message": "스테이지가 완료되었습니다!",
  "stageId": 1,
  "moves": 25
}
```

#### 랭킹 조회
```http
GET /game/ranking?stageId=1&limit=10

Response:
{
  "rankings": [
    {
      "rank": 1,
      "stageId": 1,
      "stageName": "문화재",
      "moves": 18,
      "playerName": "김민수",
      "playerAvatar": "😎"
    }
  ]
}
```

#### 내 기록 조회
```http
GET /game/my-records
Authorization: Bearer {token}

Response:
{
  "records": [
    {
      "stageId": 1,
      "stageName": "문화재",
      "bestMoves": 25,
      "bestTime": 120
    }
  ]
}
```

## 문제 해결

### MySQL 연결 실패
```
❌ MySQL 연결 실패: ECONNREFUSED
```

**해결책:**
1. XAMPP Control Panel에서 MySQL이 실행 중인지 확인
2. MySQL 포트가 3306인지 확인 (Config > my.ini)
3. `.env` 파일의 DB 설정 확인

### 데이터베이스 없음
```
❌ Error: ER_BAD_DB_ERROR: Unknown database 'k_everything_game'
```

**해결책:**
1. phpMyAdmin에서 데이터베이스 생성
2. `database/schema.sql` 실행

### Google OAuth 에러
```
❌ Error: Missing required parameter: client_id
```

**해결책:**
1. `.env` 파일의 `GOOGLE_CLIENT_ID` 설정
2. Google Cloud Console에서 OAuth 2.0 클라이언트 생성
3. 콜백 URL 설정: `http://localhost:5000/auth/google/callback`

## 의존성 패키지

- **express**: 웹 서버 프레임워크
- **mysql2**: MySQL 데이터베이스 드라이버
- **passport**: 인증 미들웨어
- **passport-google-oauth20**: Google OAuth 전략
- **express-session**: 세션 관리
- **jsonwebtoken**: JWT 토큰
- **cors**: CORS 설정
- **dotenv**: 환경 변수

## 개발 모드

```bash
# nodemon으로 자동 재시작
npm run dev
```

## 프로덕션 배포

```bash
# .env 파일 수정
NODE_ENV=production

# 보안 설정
- SESSION_SECRET 변경
- JWT_SECRET 변경
- HTTPS 사용
- CORS 도메인 제한
```

## 라이센스

MIT License
