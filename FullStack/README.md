# K-Everything Memory Game - Full Stack Version

React + Node.js + MySQL을 사용한 완전한 풀스택 버전입니다.

## 기술 스택

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js + Express
- MySQL (XAMPP)
- Google OAuth 2.0
- JWT Authentication
- Express Session

## 프로젝트 구조

```
FullStack/
├── backend/               # Node.js 백엔드
│   ├── server.js         # 메인 서버 파일
│   ├── config/           # 설정 파일
│   │   ├── db.js        # MySQL 연결
│   │   └── oauth.js     # Google OAuth 설정
│   ├── routes/           # API 라우트
│   │   ├── auth.js      # 인증 관련
│   │   └── game.js      # 게임 데이터
│   ├── models/           # 데이터베이스 모델
│   │   ├── User.js
│   │   └── GameRecord.js
│   └── middleware/       # 미들웨어
│       └── auth.js
│
├── frontend/             # React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── components/  # React 컴포넌트
│   │   ├── pages/       # 페이지
│   │   ├── services/    # API 서비스
│   │   └── App.js
│   └── package.json
│
└── database/            # MySQL 스키마
    └── schema.sql
```

## 설치 및 실행

### 1. XAMPP MySQL 시작
```bash
# XAMPP Control Panel에서 MySQL 시작
```

### 2. 데이터베이스 생성
```bash
# http://localhost/phpmyadmin 접속
# database/schema.sql 실행
```

### 3. 백엔드 실행
```bash
cd backend
npm install
npm start
# http://localhost:5000
```

### 4. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
# http://localhost:3000
```

## 환경 변수 설정

`backend/.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=k_everything_game

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

SESSION_SECRET=your_random_secret_key
JWT_SECRET=your_jwt_secret_key

FRONTEND_URL=http://localhost:3000
```

## API 엔드포인트

### 인증
- `POST /auth/google` - Google OAuth 로그인
- `GET /auth/google/callback` - OAuth 콜백
- `GET /auth/logout` - 로그아웃
- `GET /auth/me` - 현재 사용자 정보

### 게임
- `GET /game/progress` - 게임 진행도 조회
- `POST /game/progress` - 게임 진행도 저장
- `POST /game/complete` - 스테이지 완료
- `GET /game/ranking` - 랭킹 조회
- `POST /game/ranking` - 랭킹 등록

## 데이터베이스 스키마

### users 테이블
- id (INT, PK)
- google_id (VARCHAR)
- email (VARCHAR)
- name (VARCHAR)
- avatar (VARCHAR)
- created_at (TIMESTAMP)

### game_progress 테이블
- id (INT, PK)
- user_id (INT, FK)
- current_stage (INT)
- unlocked_stages (JSON)
- completed_stages (JSON)
- updated_at (TIMESTAMP)

### rankings 테이블
- id (INT, PK)
- user_id (INT, FK)
- stage_id (INT)
- moves (INT)
- completion_time (INT)
- created_at (TIMESTAMP)

## 개발 가이드

이 프로젝트는 다음 순서로 개발됩니다:

1. MySQL 데이터베이스 스키마 생성
2. Node.js 백엔드 API 구현
3. React 프론트엔드 개발
4. Google OAuth 통합
5. 게임 로직 연동

각 단계별 상세 가이드는 해당 폴더의 README를 참고하세요.
