# 이미지 로딩 및 로그인/회원가입 폼 수정 완료

## ✅ 완료된 작업

### 1. 모든 로그인/회원가입 폼에서 아바타 선택 제거
- ❌ 게스트 로그인: 아바타 선택 그리드 제거
- ❌ 회원가입: 아바타 선택 그리드 제거
- ✅ 모든 사용자: 기본 아바타(😊)로 자동 설정

### 2. 한글 파일명 이미지 URL 인코딩 처리
모든 이미지 경로에 `encodeURIComponent()` 적용하여 한글 파일명 지원

---

## 🔧 수정된 파일

### 1. WelcomePage.tsx

#### 변경 사항:
- **게스트 로그인**: "프로필 아바타 선택" 섹션 완전 제거
- **회원가입**: "프로필 아바타 선택" 섹션 완전 제거
- 모든 로그인 방식에서 기본 아바타 '😊' 자동 설정
- 불필요한 코드 정리:
  - `selectedAvatar` state 제거
  - `avatarGrid` 컴포넌트 제거
  - `PROFILE_AVATARS` import 제거
  - `playerAvatar` 사용 제거

#### 수정된 폼 구조:

**게스트 로그인:**
```
1. 닉네임
```

**회원가입:**
```
1. 아이디
2. 이름
3. 이메일
4. 비밀번호
```

**로그인:**
```
1. 아이디
2. 비밀번호
```

#### 코드:
```typescript
// 게스트 로그인 - 기본 아바타
await loginAsGuest(name.trim(), '😊');

// 회원가입 - 기본 아바타
await signup(username.trim(), email.trim(), password.trim(), name.trim(), '😊');
```

---

### 2. StagesPage.tsx

#### 문제:
```jsx
// ❌ 한글 파일명이 URL로 제대로 전달되지 않음
<img src={`/img/${stage.folder}/${item.img}`} />
```

#### 해결:
```jsx
// ✅ URL 인코딩 처리
<img
  src={`/img/${stage.folder}/${encodeURIComponent(item.img)}`}
  onError={(e) => {
    console.error(`이미지 로드 실패: /img/${stage.folder}/${item.img}`);
    e.currentTarget.src = 'data:image/svg+xml,...'; // 대체 이미지
  }}
/>
```

#### 적용 예시:
- `석굴암.jpg` → `/img/culture/%EC%84%9D%EA%B5%B4%EC%95%94.jpg`
- `수원화성.jpg` → `/img/culture/%EC%88%98%EC%9B%90%ED%99%94%EC%84%B1.jpg`
- `김치.jpg` → `/img/food/%EA%B9%80%EC%B9%98.jpg`

---

### 3. GamePage.tsx

#### 카드 앞면 이미지 URL 인코딩:
```jsx
<img
  src={`/img/${stage?.folder}/${encodeURIComponent(card.img)}`}
  alt={card.title}
  onError={(e) => {
    console.error(`이미지 로드 실패: /img/${stage?.folder}/${card.img}`);
    e.currentTarget.style.display = 'none';
  }}
/>
```

---

### 4. CollectionPage.tsx

#### 컬렉션 그리드 이미지:
```jsx
<img
  src={`/img/${item.folder}/${encodeURIComponent(item.img)}`}
  alt={item.title}
  onError={(e) => {
    console.error(`이미지 로드 실패: /img/${item.folder}/${item.img}`);
  }}
/>
```

#### 모달 상세 이미지:
```jsx
<img
  src={`/img/${selectedItem.folder}/${encodeURIComponent(selectedItem.img)}`}
  alt={selectedItem.title}
  onError={(e) => {
    console.error(`이미지 로드 실패: /img/${selectedItem.folder}/${selectedItem.img}`);
  }}
/>
```

---

## 📊 영향받는 이미지 파일

### 문화재 (culture/)
- 석굴암.jpg
- 수원화성.jpg
- 창덕궁.jpg
- 훈민정음.jpg
- 종묘.jpg
- 김장.jpg
- 판소리.jpg
- 탈춤.jpg

### 음식 (food/)
- 김치.jpg
- 불고기.jpg
- 비빔밥.jpg
- 떡볶이.jpg
- 삼겹살.jpg
- 치맥.jpg
- 김밥.jpg
- 라면.jpg

### 영화 (movie/)
- 기생충.jpg
- 올드보이.jpg
- 부산행.jpg
- 더파이브.jpg
- 명량.jpg
- 범죄도시.jpg
- 헤어질결심.jpg
- 콘크리트유토피아.jpg

### 드라마 (drama/)
- 오징어게임.jpg
- 더글로리.jpg
- 이상한변호사우영우.jpg
- 이태원클라쓰.jpg
- 도깨비.jpg
- 태양의후예.jpg
- 지금우리학교는.jpg
- 굿닥터.jpg

### K-POP (kpop/)
- bts.jpg
- blackpink.jpg
- twice.jpg
- exo.jpg
- 동방신기.jpg
- newjeans.jpg
- Stray Kids.jpg
- IVE.jpg

**총 40개 이미지 파일**의 경로가 URL 인코딩 처리됨

---

## 🧪 테스트 방법

### 1. 게스트 로그인 테스트
1. 브라우저에서 `http://localhost:3000` 접속
2. "게스트로 시작하기" 클릭
3. 폼 입력:
   - ✅ 닉네임: `게스트유저`
   - ❌ 아바타 선택 없음 (자동으로 😊)
4. 게임 시작 후 프로필 확인 → 😊 아바타 표시

### 2. 회원가입 테스트
1. "회원가입" 클릭
2. 폼 입력:
   - ✅ 아이디: `testuser`
   - ✅ 이름: `테스트`
   - ✅ 이메일: `test@example.com`
   - ✅ 비밀번호: `test123`
   - ❌ 아바타 선택 없음 (자동으로 😊)
3. 회원가입 완료 후 프로필 확인 → 😊 아바타 표시

### 3. 이미지 로딩 테스트
1. 스테이지 선택 화면에서 각 스테이지 카드 확인
2. 한글 파일명 이미지가 정상적으로 표시되는지 확인
3. 브라우저 개발자 도구(F12) → 콘솔 탭
4. 이미지 로드 오류가 없는지 확인

### 4. 게임 플레이 테스트
1. 스테이지 1 (문화재) 시작
2. 카드 뒤집기 → 한글 파일명 이미지 정상 표시
3. 컬렉션 페이지 → 한글 파일명 이미지 정상 표시
4. 카드 상세 모달 → 한글 파일명 이미지 정상 표시

---

## 🐛 디버깅 정보

### 이미지 로드 실패 시
브라우저 콘솔에 다음과 같은 에러 메시지 표시:
```
이미지 로드 실패: /img/culture/석굴암.jpg
```

### 해결 방법
1. 이미지 파일이 올바른 경로에 있는지 확인:
   ```
   client/public/img/culture/석굴암.jpg
   client/public/img/food/김치.jpg
   ...
   ```

2. 파일명이 gameData.ts의 정의와 일치하는지 확인

3. 브라우저 캐시 클리어 후 재시도

---

## 📝 주요 개선사항

### Before:
```jsx
// ❌ 한글 파일명 미지원
<img src="/img/culture/석굴암.jpg" />
// 결과: 404 Not Found

// ❌ 게스트 로그인 시 아바타 선택 필수
<div>프로필 아바타 선택</div>
{avatarGrid}
await loginAsGuest(name, selectedAvatar);

// ❌ 회원가입 시 아바타 선택 필수
<div>프로필 아바타 선택</div>
{avatarGrid}
await signup(username, email, password, name, selectedAvatar);
```

### After:
```jsx
// ✅ 한글 파일명 자동 인코딩
<img src="/img/culture/%EC%84%9D%EA%B5%B4%EC%95%94.jpg" />
// 결과: 이미지 정상 로드

// ✅ 게스트 로그인 - 기본 아바타 자동 설정
await loginAsGuest(name, '😊');

// ✅ 회원가입 - 기본 아바타 자동 설정
await signup(username, email, password, name, '😊');
```

---

## 🎉 완료!

- ✅ **게스트 로그인** 폼 간소화 (아바타 선택 제거)
- ✅ **회원가입** 폼 간소화 (아바타 선택 제거)
- ✅ 한글 파일명 이미지 완벽 지원
- ✅ 모든 페이지에서 이미지 정상 로딩
- ✅ 에러 핸들링 추가
- ✅ 디버깅 로그 추가
- ✅ 불필요한 코드 정리

**이제 모든 한글 파일명 이미지가 정상적으로 표시되고, 로그인/회원가입이 더 간편해졌습니다!** 🖼️✨
