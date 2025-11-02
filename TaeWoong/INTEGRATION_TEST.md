# 백엔드 통합 테스트 가이드

## 🎯 구현 완료 사항

이제 다음 기능들이 자동으로 데이터베이스에 저장됩니다:

### ✅ 자동 저장되는 데이터
1. **스테이지 진행 상황**
   - 현재 스테이지 (`currentStage`)
   - 잠금 해제된 스테이지 (`unlockedStages`)
   - 완료한 스테이지 (`completedStages`)

2. **프로필 정보**
   - 선택한 아바타 (`playerAvatar`)
   - 보유 코인 (`coins`)
   - 구매한 아바타 목록 (`purchasedAvatars`)

### 🔄 자동 저장 트리거
- ✅ 스테이지 클리어 시
- ✅ 퀴즈 정답 시 (코인 +10)
- ✅ 프로필 상점에서 아바타 구매 시
- ✅ 로그인 시 자동으로 저장된 데이터 불러오기

---

## 🚀 설정 및 실행 방법

### 1. 데이터베이스 마이그레이션

먼저 데이터베이스에 필요한 컬럼을 추가합니다:

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 선택
USE k_everything_game;

# 마이그레이션 실행
source C:/Users/24457/OneDrive/바탕 화면/ProgateHackathon/TaeWoong/migrations/add_coins_and_purchases.sql;

# 확인
DESCRIBE game_progress;
```

### 2. 백엔드 서버 시작

```bash
cd C:/Users/24457/OneDrive/바탕\ 화면/ProgateHackathon/TaeWoong

# .env 파일 확인
cat .env

# 서버 실행
npm start
```

서버가 정상적으로 실행되면:
```
╔════════════════════════════════════════════╗
║   K-Everything Memory Game Backend API    ║
╚════════════════════════════════════════════╝

🚀 Server running on: http://localhost:5000
🎮 HTML Game: http://localhost:5000/game
🌍 Environment: development
🗄️  Database: k_everything_game
🔐 Session Store: MySQL
```

### 3. 프론트엔드 개발 서버 시작

```bash
cd C:/Users/24457/OneDrive/바탕\ 화면/ProgateHackathon/TaeWoong/client

# 개발 서버 실행
npm start
```

브라우저가 자동으로 열리면서 `http://localhost:3000` 접속

---

## 🧪 테스트 시나리오

### 시나리오 1: 회원가입 및 게임 진행

1. **회원가입**
   - 브라우저에서 `http://localhost:3000` 접속
   - 회원가입 버튼 클릭
   - 이메일, 비밀번호, 이름 입력
   - 회원가입 완료

2. **스테이지 1 플레이**
   - 스테이지 1 선택
   - 게임 시작
   - 카드 매칭 완료

3. **데이터베이스 확인**
   ```sql
   SELECT * FROM game_progress WHERE user_id = 1;
   ```

   예상 결과:
   ```
   current_stage: 1
   unlocked_stages: [1, 2]
   completed_stages: [1]
   coins: 0
   purchased_avatars: ["😊"]
   ```

### 시나리오 2: AI 퀴즈 풀고 코인 획득

1. **퀴즈 페이지 접속**
   - 스테이지 선택 화면에서 "AI 퀴즈" 버튼 클릭

2. **퀴즈 풀기**
   - 문제 읽고 정답 선택
   - 정답 확인 버튼 클릭
   - 정답이면 코인 +10

3. **데이터베이스 확인**
   ```sql
   SELECT coins FROM game_progress WHERE user_id = 1;
   ```

   예상 결과:
   ```
   coins: 10
   ```

### 시나리오 3: 프로필 아바타 구매

1. **프로필 상점 접속**
   - 스테이지 선택 화면에서 "프로필 상점" 버튼 클릭

2. **아바타 구매**
   - 코인으로 구매 가능한 아바타 선택
   - 구매하기 버튼 클릭
   - 코인 차감 확인

3. **데이터베이스 확인**
   ```sql
   SELECT coins, purchased_avatars FROM game_progress WHERE user_id = 1;
   ```

   예상 결과:
   ```
   coins: 0 (10 - 10 = 0)
   purchased_avatars: ["😊", "pororo"]
   ```

### 시나리오 4: 로그아웃 후 재로그인

1. **로그아웃**
   - 우측 상단 로그아웃 버튼 클릭

2. **재로그인**
   - 같은 계정으로 로그인

3. **데이터 확인**
   - 스테이지 진행 상황이 그대로 유지되는지 확인
   - 보유 코인이 그대로 있는지 확인
   - 구매한 아바타가 그대로 있는지 확인

---

## 🐛 디버깅 가이드

### 백엔드 로그 확인

서버 콘솔에서 다음과 같은 로그를 확인할 수 있습니다:

```
Save Progress Error: ...  → 진행 상황 저장 실패
Get Progress Error: ...   → 진행 상황 불러오기 실패
```

### 프론트엔드 콘솔 확인

브라우저 개발자 도구(F12) 콘솔에서:

```
Auto-save failed: ...                → 자동 저장 실패
Auto-save coins failed: ...          → 코인 저장 실패
Auto-save avatar purchase failed: ...→ 아바타 구매 저장 실패
Failed to load progress from backend:→ 진행 상황 로드 실패
```

### 일반적인 문제 해결

#### 1. 데이터가 저장되지 않아요
- 백엔드 서버가 실행 중인지 확인
- 데이터베이스 마이그레이션이 완료되었는지 확인
- 로그인 상태인지 확인 (게스트는 백엔드 저장 안됨)

#### 2. 로그인 후 데이터가 불러와지지 않아요
```sql
-- 데이터베이스에 데이터가 있는지 확인
SELECT * FROM game_progress WHERE user_id = [YOUR_USER_ID];

-- 데이터가 없다면 초기 데이터 생성
INSERT INTO game_progress (user_id, unlocked_stages, completed_stages, coins, purchased_avatars)
VALUES (1, JSON_ARRAY(1), JSON_ARRAY(), 0, JSON_ARRAY('😊'));
```

#### 3. CORS 오류가 발생해요
`.env` 파일에서 `FRONTEND_URL`이 올바르게 설정되어 있는지 확인:
```
FRONTEND_URL=http://localhost:3000
```

---

## 📊 API 엔드포인트

### 1. 진행 상황 불러오기
```http
GET /api/game/progress
Authorization: Bearer [JWT_TOKEN]
```

**응답:**
```json
{
  "userId": 1,
  "currentStage": 1,
  "unlockedStages": [1, 2],
  "completedStages": [1],
  "playerAvatar": "😊",
  "coins": 10,
  "purchasedAvatars": ["😊", "pororo"],
  "updatedAt": "2025-11-02T10:30:00Z"
}
```

### 2. 진행 상황 저장하기
```http
POST /api/game/progress
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json

{
  "currentStage": 2,
  "unlockedStages": [1, 2, 3],
  "completedStages": [1, 2],
  "playerAvatar": "pororo",
  "coins": 20,
  "purchasedAvatars": ["😊", "pororo", "crong"]
}
```

**응답:**
```json
{
  "success": true,
  "message": "진행도가 저장되었습니다."
}
```

---

## ✅ 체크리스트

테스트 전에 다음을 확인하세요:

- [ ] MySQL 서버가 실행 중
- [ ] 데이터베이스 `k_everything_game`이 존재함
- [ ] 마이그레이션이 성공적으로 실행됨
- [ ] `.env` 파일이 올바르게 설정됨
- [ ] 백엔드 서버가 `http://localhost:5000`에서 실행 중
- [ ] 프론트엔드 서버가 `http://localhost:3000`에서 실행 중
- [ ] 브라우저 콘솔에 CORS 오류가 없음

---

## 🎉 완료!

모든 테스트가 통과하면 플레이어별 데이터가 완벽하게 데이터베이스에 저장됩니다!

**저장되는 데이터:**
- ✅ 스테이지 클리어 기록
- ✅ 획득한 코인
- ✅ 구매한 프로필 아바타
- ✅ 잠금 해제된 스테이지

**게스트 모드:**
- ❌ 백엔드에 저장되지 않음
- ✅ localStorage에만 임시 저장
- 💡 회원가입하면 영구적으로 저장 가능
