# Firebase 설정 가이드

## Google OAuth 로그인 및 Firestore 데이터베이스 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: k-everything-game)
4. Google 애널리틱스 설정 (선택사항)
5. 프로젝트 생성 완료

---

### 2. 웹 앱 등록

1. Firebase 프로젝트 개요 페이지에서 웹 아이콘 `</>` 클릭
2. 앱 닉네임 입력 (예: K-Everything Memory Game)
3. "Firebase Hosting 설정" 체크박스는 선택사항
4. 앱 등록 클릭
5. **Firebase 구성 정보 복사** - 이 정보를 나중에 사용합니다

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

### 3. Google 로그인 활성화

1. Firebase Console 왼쪽 메뉴에서 **"Authentication"** 클릭
2. "Sign-in method" 탭 클릭
3. **"Google"** 제공업체 클릭
4. "사용 설정" 토글 활성화
5. 프로젝트 지원 이메일 선택
6. "저장" 클릭

---

### 4. Firestore 데이터베이스 설정

1. Firebase Console 왼쪽 메뉴에서 **"Firestore Database"** 클릭
2. "데이터베이스 만들기" 클릭
3. **보안 규칙 선택**:
   - 개발/테스트: "테스트 모드에서 시작" 선택
   - 프로덕션: "프로덕션 모드에서 시작" 선택 (아래 규칙 참고)
4. Cloud Firestore 위치 선택 (예: asia-northeast3 - 서울)
5. "사용 설정" 클릭

#### 권장 보안 규칙 (프로덕션)

Firebase Console > Firestore Database > 규칙 탭에서 다음 규칙 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 읽고 쓸 수 있습니다
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 랭킹은 모든 인증된 사용자가 읽을 수 있습니다
    match /rankings/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

### 5. 프로젝트에 Firebase 구성 정보 적용

`TaeWoong/src/index.html` 파일에서 Firebase 구성 정보를 업데이트하세요:

**위치**: 파일 상단의 `<script type="module">` 섹션

```javascript
// Firebase configuration - 여기에 실제 Firebase 프로젝트 설정을 넣어주세요
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",              // 2단계에서 복사한 값으로 변경
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

---

### 6. 도메인 인증 (선택사항 - localhost는 자동 허용)

배포 후 실제 도메인을 사용할 경우:

1. Firebase Console > Authentication > Settings 탭
2. "승인된 도메인" 섹션
3. "도메인 추가" 클릭
4. 배포할 도메인 입력 (예: yourapp.com)

---

### 7. 테스트

1. `index.html` 파일을 브라우저에서 열기
2. 우측 상단의 "Google 로그인" 버튼 클릭
3. Google 계정으로 로그인
4. 프로필 사진이 우측 상단에 표시되는지 확인
5. 게임 플레이 후 Firebase Console > Firestore Database에서 데이터 확인

---

### 8. Firestore 데이터 구조

#### users 컬렉션
```javascript
users/{userId}
├── uid: string
├── email: string
├── displayName: string
├── photoURL: string
├── unlockedStages: array[number]
├── completedStages: array[number]
├── currentStage: number
├── playerName: string
├── playerNameSet: boolean
└── lastUpdated: timestamp
```

#### rankings 컬렉션 (향후 확장용)
```javascript
rankings/{rankingId}
├── userId: string
├── playerName: string
├── stageName: string
├── moves: number
└── timestamp: timestamp
```

---

## 문제 해결

### "Firebase: Error (auth/unauthorized-domain)"
- Firebase Console > Authentication > Settings > 승인된 도메인에 현재 도메인 추가

### "Missing or insufficient permissions"
- Firestore 보안 규칙을 확인하고 위의 권장 규칙으로 업데이트

### "Firebase: Firebase App named '[DEFAULT]' already exists"
- 페이지를 새로고침하거나 브라우저 캐시 삭제

### Google 로그인 팝업이 안 열림
- 브라우저 팝업 차단 설정 확인
- HTTPS 또는 localhost에서 실행 중인지 확인

---

## 로컬 개발 vs 프로덕션

### 로컬 개발
- `localhost` 도메인은 Firebase에서 자동 허용
- 테스트 모드로 Firestore 시작 가능
- HTTP도 지원 (HTTPS 권장)

### 프로덕션 배포
- HTTPS 필수
- 프로덕션 보안 규칙 설정
- 승인된 도메인 등록 필요
- API 할당량 및 사용량 모니터링

---

## 비용

Firebase의 무료 Spark 플랜으로도 충분합니다:
- **Authentication**: 무제한 사용자
- **Firestore**:
  - 50,000 reads/day
  - 20,000 writes/day
  - 1GB 저장공간

자세한 정보: [Firebase 요금제](https://firebase.google.com/pricing)

---

## 추가 리소스

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firebase Authentication 가이드](https://firebase.google.com/docs/auth)
- [Firestore 시작하기](https://firebase.google.com/docs/firestore)
- [Firebase 보안 규칙](https://firebase.google.com/docs/rules)

---

**마지막 업데이트**: 2025-11-01
