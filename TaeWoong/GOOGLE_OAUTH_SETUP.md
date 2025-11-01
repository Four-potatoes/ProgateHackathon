# Google OAuth 설정 가이드

## 1단계: Google Cloud Console 접속

1. https://console.cloud.google.com/ 접속
2. Google 계정으로 로그인

## 2단계: 새 프로젝트 생성

1. 상단 프로젝트 선택 드롭다운 클릭
2. "NEW PROJECT" 클릭
3. Project name: `K-Everything-Game` 입력
4. "CREATE" 클릭

## 3단계: OAuth Consent Screen 설정

1. 왼쪽 메뉴에서 "APIs & Services" > "OAuth consent screen" 선택
2. User Type: "External" 선택 후 "CREATE" 클릭
3. 필수 정보 입력:
   - App name: `K-Everything Memory Game`
   - User support email: 본인 이메일
   - Developer contact email: 본인 이메일
4. "SAVE AND CONTINUE" 클릭
5. Scopes 단계에서 "ADD OR REMOVE SCOPES" 클릭
   - `/auth/userinfo.email` 체크
   - `/auth/userinfo.profile` 체크
   - "UPDATE" 클릭
6. "SAVE AND CONTINUE" 계속 클릭
7. Test users 단계에서 "ADD USERS" 클릭하여 본인 이메일 추가
8. "SAVE AND CONTINUE" 클릭

## 4단계: OAuth 2.0 Client ID 생성

1. 왼쪽 메뉴에서 "APIs & Services" > "Credentials" 선택
2. 상단 "+ CREATE CREDENTIALS" 클릭
3. "OAuth client ID" 선택
4. Application type: "Web application" 선택
5. Name: `K-Everything Web Client` 입력
6. Authorized JavaScript origins:
   - `http://localhost:5000` 추가
7. Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` 추가
8. "CREATE" 클릭

## 5단계: Client ID와 Secret 복사

1. 생성 완료 후 팝업에서 다음 정보 복사:
   - **Client ID**: `1234567890-abcdefghijklmnop.apps.googleusercontent.com` 형식
   - **Client Secret**: `GOCSPX-abcdefghijklmnop` 형식

2. TaeWoong/.env 파일을 열어서 다음 값을 업데이트:

```env
GOOGLE_CLIENT_ID=복사한_Client_ID_여기에_붙여넣기
GOOGLE_CLIENT_SECRET=복사한_Client_Secret_여기에_붙여넣기
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## 6단계: 서버 재시작

```bash
# 현재 실행 중인 서버를 Ctrl+C로 종료 후
npm start
```

## 완료!

이제 Google 로그인 버튼을 클릭하면 정상적으로 작동합니다.

## 테스트 방법

1. http://localhost:5000/game 접속
2. "Google로 로그인" 버튼 클릭
3. Google 계정 선택
4. 권한 승인
5. 게임 화면으로 자동 리다이렉트
6. 우측 상단에 프로필 표시 확인

## 문제 해결

### "redirect_uri_mismatch" 에러
- Authorized redirect URIs에 정확히 `http://localhost:5000/api/auth/google/callback` 추가했는지 확인

### "invalid_client" 에러
- .env 파일의 GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET이 올바른지 확인
- 따옴표 없이 값만 입력했는지 확인

### "access_denied" 에러
- OAuth consent screen에서 본인 이메일을 Test users에 추가했는지 확인
