# 아이디/이름 기반 로그인 시스템 업데이트

## ✅ 완료된 작업

### 변경 사항 요약
1. **회원가입**: 아이디, 이름, 이메일, 비밀번호 모두 입력받도록 변경
2. **로그인**: 이메일 대신 **아이디**로 로그인
3. **화면 표시**: 아이디가 아닌 **이름**으로 표시

---

## 📊 시스템 구조

### 이전
```
회원가입: 이메일 + 비밀번호 → 이름은 이메일에서 추출
로그인: 이메일 + 비밀번호
화면 표시: 이름
```

### 현재
```
회원가입: 아이디 + 이름 + 이메일 + 비밀번호
로그인: 아이디 + 비밀번호
화면 표시: 이름
```

---

## 🗄️ 데이터베이스 변경

### 1. 마이그레이션 파일
**파일**: `migrations/add_username_field.sql`

```sql
-- users 테이블에 username 컬럼 추가
ALTER TABLE users
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE AFTER email;

-- 기존 데이터에 임시 username 설정
UPDATE users
SET username = SUBSTRING_INDEX(email, '@', 1)
WHERE username IS NULL;

-- username을 NOT NULL로 변경
ALTER TABLE users
MODIFY COLUMN username VARCHAR(50) UNIQUE NOT NULL;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_username ON users(username);
```

### 2. 마이그레이션 실행 방법
```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 선택
USE k_everything_game;

# 마이그레이션 실행
source C:/Users/24457/OneDrive/바탕 화면/ProgateHackathon/TaeWoong/migrations/add_username_field.sql;

# 확인
DESCRIBE users;
```

예상 출력:
```
+-------------------+--------------+------+-----+-------------------+
| Field             | Type         | Null | Key | Default           |
+-------------------+--------------+------+-----+-------------------+
| id                | int          | NO   | PRI | NULL              |
| username          | varchar(50)  | NO   | UNI | NULL              |
| email             | varchar(255) | YES  |     | NULL              |
| name              | varchar(100) | NO   |     | NULL              |
| google_id         | varchar(255) | YES  |     | NULL              |
| avatar            | varchar(50)  | YES  |     | 😊                |
| coins             | int          | YES  |     | 0                 |
| ...               | ...          | ...  | ... | ...               |
+-------------------+--------------+------+-----+-------------------+
```

---

## 🔧 백엔드 변경 사항

### 1. routes/auth.js

#### 회원가입 (POST /api/auth/signup)
**변경 전**:
```javascript
const { email, password, name, avatar } = req.body;
```

**변경 후**:
```javascript
const { username, email, password, name, avatar } = req.body;

// 아이디 중복 체크
const [existingUsername] = await promisePool.query(
  'SELECT * FROM users WHERE username = ?',
  [username]
);

// 사용자 생성
await promisePool.query(
  'INSERT INTO users (username, email, google_id, name, avatar) VALUES (?, ?, ?, ?, ?)',
  [username, email, hashedPassword, name, avatar || '😊']
);
```

#### 로그인 (POST /api/auth/login)
**변경 전**:
```javascript
const { email, password } = req.body;
const [users] = await promisePool.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
```

**변경 후**:
```javascript
const { username, password } = req.body;
const [users] = await promisePool.query(
  'SELECT * FROM users WHERE username = ?',
  [username]
);
```

---

## 💻 프론트엔드 변경 사항

### 1. WelcomePage.tsx

#### State 추가
```typescript
const [username, setUsername] = useState('');
const [name, setName] = useState('');
```

#### 로그인 폼
```jsx
<input
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="아이디"
/>
<label>아이디</label>

<input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="비밀번호"
/>
<label>비밀번호</label>
```

#### 회원가입 폼
```jsx
<input
  type="text"
  value={username}
  placeholder="아이디 (로그인 시 사용)"
/>
<label>아이디</label>

<input
  type="text"
  value={name}
  placeholder="이름 (화면에 표시됨)"
/>
<label>이름</label>

<input
  type="email"
  value={email}
  placeholder="이메일"
/>
<label>이메일</label>

<input
  type="password"
  value={password}
  placeholder="비밀번호 (최소 6자)"
/>
<label>비밀번호</label>
```

### 2. types/index.ts

```typescript
export interface User {
  id?: string;
  username?: string;  // 추가
  email?: string;
  name: string;
  avatar: string;
  createdAt?: string;
}

export interface LoginCredentials {
  username: string;   // email → username
  password: string;
}

export interface SignupCredentials {
  username: string;   // 추가
  email: string;
  password: string;
  name: string;
  avatar: string;
}
```

### 3. AuthContext.tsx

```typescript
// 함수 시그니처 변경
login: (username: string, password: string) => Promise<void>;
signup: (username: string, email: string, password: string, name: string, avatar: string) => Promise<void>;

// 구현 변경
const login = async (username: string, password: string) => {
  const response = await authService.login({ username, password });
  // ...
};

const signup = async (username: string, email: string, password: string, name: string, avatar: string) => {
  const response = await authService.signup({
    username,
    email,
    password,
    name: name || '사용자',
    avatar: avatar || PROFILE_AVATARS[0]
  });
  // ...
};
```

### 4. authService.ts

Mock 함수들도 username 기반으로 변경:

```typescript
const DEMO_USERS = [
  {
    id: 'demo_1',
    username: 'demo',  // 추가
    email: 'demo@example.com',
    password: 'demo123',
    name: '테스트 사용자',
    avatar: '😊'
  }
];

const mockLogin = async (credentials: LoginCredentials) => {
  const user = users.find(
    (u: any) => u.username === credentials.username && u.password === credentials.password
  );
  // ...
};

const mockSignup = async (credentials: SignupCredentials) => {
  // 아이디 중복 체크
  if (users.some((u: any) => u.username === credentials.username)) {
    reject(new Error('이미 존재하는 아이디입니다.'));
    return;
  }

  const newUser = {
    id: `user_${Date.now()}`,
    username: credentials.username,
    email: credentials.email,
    password: credentials.password,
    name: credentials.name || '사용자',
    avatar: credentials.avatar || '😊'
  };
  // ...
};
```

---

## 🎮 사용 예시

### 회원가입
1. 아이디: `player123`
2. 이름: `홍길동`
3. 이메일: `player@example.com`
4. 비밀번호: `password123`

### 로그인
- 아이디: `player123`
- 비밀번호: `password123`

### 화면 표시
- **헤더/프로필**: `홍길동` (이름으로 표시)
- **데이터베이스**: `player123` (아이디로 저장)

---

## 🧪 테스트 시나리오

### 시나리오 1: 새 회원가입
1. `http://localhost:3000` 접속
2. "회원가입" 버튼 클릭
3. 폼 입력:
   - 아바타 선택: 원하는 아바타 클릭
   - 아이디: `testuser`
   - 이름: `테스트유저`
   - 이메일: `test@example.com`
   - 비밀번호: `test123`
4. "회원가입" 버튼 클릭
5. 성공 메시지 확인

### 시나리오 2: 로그인
1. "로그인" 버튼 클릭
2. 폼 입력:
   - 아이디: `testuser`
   - 비밀번호: `test123`
3. "로그인" 버튼 클릭
4. 스테이지 선택 화면으로 이동
5. 우측 상단에 **"테스트유저"** (이름) 표시 확인

### 시나리오 3: 데이터베이스 확인
```sql
SELECT id, username, email, name FROM users WHERE username = 'testuser';
```

예상 결과:
```
+----+----------+-------------------+--------------+
| id | username | email             | name         |
+----+----------+-------------------+--------------+
| 1  | testuser | test@example.com  | 테스트유저   |
+----+----------+-------------------+--------------+
```

---

## 🐛 주의사항

### 1. 기존 사용자 데이터
- 마이그레이션 실행 시 기존 사용자들은 이메일의 `@` 앞부분이 username으로 설정됩니다
- 예: `user@example.com` → username: `user`

### 2. 아이디 중복
- 아이디는 UNIQUE 제약조건이 있어 중복 불가
- 회원가입 시 "이미 사용 중인 아이디입니다" 오류 발생 시 다른 아이디 사용

### 3. 이메일 중복
- 이메일도 여전히 중복 체크됨
- 같은 이메일로 여러 계정 생성 불가

---

## 📝 체크리스트

실행 전에 확인:
- [ ] MySQL 서버 실행 중
- [ ] 데이터베이스 마이그레이션 완료 (`add_username_field.sql`)
- [ ] 기존 데이터베이스 백업 완료
- [ ] 백엔드 서버 재시작 (`npm start`)
- [ ] 프론트엔드 서버 재시작 (`cd client && npm start`)
- [ ] 브라우저 캐시 및 localStorage 클리어 (권장)

---

## 🎉 완료!

이제 사용자는:
- ✅ **아이디**로 로그인
- ✅ 회원가입 시 **아이디, 이름, 이메일, 비밀번호** 모두 입력
- ✅ 화면에는 **이름**으로 표시됨

**데모 계정**:
- 아이디: `demo`
- 비밀번호: `demo123`
- 이름: `테스트 사용자`
