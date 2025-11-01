# Claude AI - K-Movie Memory Master 통합 문서

## 🎯 프로젝트 요약

**K-Movie Memory Master**는 한국 명작 영화를 테마로 한 교육용 메모리 게임입니다.
Progate Hackathon in Seoul의 주제인 "K-문화와 기술의 융합"을 구현한 프로젝트로,
게임을 통해 한국 영화를 재미있게 학습할 수 있습니다.

---

## 📂 프로젝트 구조

```
TaeWoong/
├── src/
│   └── index.html              # 메인 애플리케이션 (모든 기능 통합)
├── data/
│   ├── korean-movies.json      # 영화 데이터베이스
│   └── img/                    # 영화 포스터 (8장)
├── claude.md                   # 본 문서
└── readme.md                   # 프로젝트 README
```

---

## 🎬 통합 과정

### 1. UngSik의 기획 (planning.md)
```markdown
- 주제: 한국 문화를 알아볼 수 있는 카드 뒤집기 게임
- 게임 요소: 영화 주제 + AI 학습 방식
- 학습 방법: 카드 뒤집기 → 정보 제공 → AI 퀴즈
```

**통합 결과**:
- ✅ 카드 뒤집기 메커니즘 구현
- ✅ 영화 주제 선정 (8편)
- ✅ AI 기반 퀴즈 시스템

### 2. SungWoo의 데이터셋 (movie.json + images)
```json
{
    "movies": [
        {
            "title": "기생충",
            "genre": "범죄",
            "director": "봉준호",
            "actor": "송강호, 이선균, ..."
        }
    ]
}
```

**통합 결과**:
- ✅ 8편의 영화 데이터 확장 (icon, desc 추가)
- ✅ 영화 포스터 이미지 통합 (data/img/)
- ✅ JSON 구조 표준화 (korean-movies.json)

### 3. JunHyeok의 게임 로직 (geme.html)
```javascript
// 핵심 기능
- 카드 매칭 게임 엔진
- Firebase 인증 & 랭킹 시스템
- AI 학습 UI/UX
- SPA 라우팅 시스템
```

**통합 결과**:
- ✅ 게임 로직 채택 (카드 셔플, 매칭 알고리즘)
- ✅ Firebase 연동 유지
- ✅ AI 학습 페이지 통합
- ✅ 영화 데이터와 게임 로직 연결

---

## 🔄 통합 프로세스

### Step 1: 데이터 통합
```javascript
// Before (JunHyeok): 일반 K-Culture 데이터
const K_CULTURE_ITEMS = [
    { name: '한복', icon: '👘', desc: '한국의 전통 의상.' },
    { name: '김치', icon: '🌶️', desc: '한국의 대표적인 발효 음식.' }
];

// After (통합): SungWoo의 영화 데이터 활용
const K_MOVIE_ITEMS = [
    {
        name: '기생충',
        icon: '🎬',
        desc: '계급 간의 대립과 사회적 격차를 다룬 작품.',
        img: '기생충.jpg',
        genre: '범죄',
        director: '봉준호',
        actor: '송강호, 이선균, ...'
    }
];
```

### Step 2: UI/UX 개선
```html
<!-- Before: 아이콘만 표시 -->
<span class="text-4xl">${card.icon}</span>

<!-- After: 포스터 이미지 + 제목 -->
<img src="../data/img/${card.img}" alt="${card.name}" />
<span class="font-bold">${card.name}</span>
```

### Step 3: 기능 확장
```javascript
// 영화 도감 페이지에 상세 정보 추가
<p class="text-xs">장르: ${item.genre} | 감독: ${item.director}</p>
<p class="text-xs">출연: ${item.actor}</p>
<p class="text-sm">${item.desc}</p>
```

---

## 🎮 구현된 기능

### 1. 메인 게임 (Game Screen)
- [x] 4x4 카드 그리드 (8쌍)
- [x] 카드 뒤집기 애니메이션 (CSS 3D)
- [x] 매칭 성공/실패 감지
- [x] 시도 횟수 추적
- [x] 승리 조건 체크
- [x] 재시작 기능

### 2. 영화 도감 (Collection Screen)
- [x] 8편 영화 전체 목록
- [x] 포스터 이미지 표시
- [x] 장르, 감독, 출연진 정보
- [x] 영화 설명
- [x] 반응형 그리드 (1-4 columns)

### 3. AI 학습 (AI Learning Screen)
- [x] 랜덤 퀴즈 생성
- [x] 사용자 입력 처리
- [x] 정답/오답 피드백
- [x] 상세 정보 제공 (감독, 출연진)
- [x] 로딩 애니메이션
- [ ] LLM API 연동 (향후 계획)

### 4. 랭킹 시스템 (Leaderboard Screen)
- [x] Firebase Firestore 연동
- [x] 익명 사용자 인증
- [x] 점수 자동 제출
- [x] 실시간 Top 10
- [x] 본인 점수 하이라이트

---

## 🛠 기술 스택

| 분야 | 기술 | 사용 목적 |
|-----|------|----------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ | 기본 웹 구조 |
| **Styling** | Tailwind CSS | 유틸리티 기반 디자인 |
| **Icons** | Lucide Icons | SVG 아이콘 라이브러리 |
| **Database** | JSON (로컬), Firebase Firestore | 영화 데이터 & 랭킹 |
| **Auth** | Firebase Auth (Anonymous) | 사용자 식별 |
| **Animation** | CSS Transitions, Transform | 카드 뒤집기 효과 |

---

## 📊 데이터 흐름

```
사용자 액션
    ↓
┌─────────────────────────────────┐
│   index.html (View Layer)       │
│   - 게임 화면                    │
│   - 도감 화면                    │
│   - 학습 화면                    │
│   - 랭킹 화면                    │
└─────────────────────────────────┘
    ↓                    ↑
┌─────────────────────────────────┐
│  JavaScript (Controller)        │
│  - handleCardClick()            │
│  - generateQuiz()               │
│  - submitScore()                │
│  - render()                     │
└─────────────────────────────────┘
    ↓                    ↑
┌──────────────┐  ┌──────────────┐
│ korean-      │  │  Firebase    │
│ movies.json  │  │  Firestore   │
│ (로컬 데이터) │  │  (클라우드)   │
└──────────────┘  └──────────────┘
```

---

## 🚀 실행 방법

### 1. 로컬 환경
```bash
# 1. 프로젝트 디렉토리로 이동
cd TaeWoong/src

# 2. HTML 파일 실행
# - 더블 클릭으로 브라우저 열기
# - 또는 Live Server 확장 사용

# 3. 게임 시작!
```

### 2. Firebase 설정 (선택사항)
```javascript
// index.html 내 Firebase Config 수정
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    // ...
};
```

### 3. 디렉토리 구조 확인
```bash
TaeWoong/
├── src/index.html          ✅ 필수
├── data/korean-movies.json ✅ 필수
└── data/img/               ✅ 필수 (8개 이미지)
```

---

## 🎯 팀원별 기여도

### UngSik (대대장) - 기획 총괄
- [x] 프로젝트 컨셉 수립
- [x] 게임 메커니즘 설계
- [x] AI 학습 방식 기획
- **파일**: UngSik/planning.md

### SungWoo (쫄병샊) - 데이터 큐레이션
- [x] 한국 영화 8편 선정
- [x] 영화 정보 수집 (장르, 감독, 출연진)
- [x] 포스터 이미지 수집
- **파일**: SungWoo/movie.json, SungWoo/data/img/

### JunHyeok (부대장) - 게임 개발
- [x] 카드 매칭 게임 구현
- [x] Firebase 인증 & DB 연동
- [x] AI 학습 UI/UX 구현
- [x] 랭킹 시스템 개발
- **파일**: JunHyeok/geme.html

### TaeWoong (일반병) - 통합 & 최적화
- [x] 모든 컴포넌트 통합
- [x] 데이터 구조 표준화
- [x] UI/UX 개선
- [x] 문서화
- **파일**: TaeWoong/src/index.html, TaeWoong/claude.md

---

## 📈 평가 기준 충족도

| 평가 항목 | 배점 | 구현 내용 | 자체 평가 |
|---------|------|----------|----------|
| **기술적 난이도** | 20pt | CSS 3D Transform, Firebase 실시간 DB, ES6 모듈 | ⭐⭐⭐⭐ |
| **기술 활용도** | 20pt | 5가지 기술 스택 활용 (HTML5, Tailwind, Firebase, JSON, Lucide) | ⭐⭐⭐⭐⭐ |
| **AI 구현력** | 20pt | AI 퀴즈 엔진, 자동 피드백 (LLM 연동 준비 완료) | ⭐⭐⭐⭐ |
| **제품 완성도** | 40pt | 4개 페이지, 완전한 게임 플로우, 반응형 UI | ⭐⭐⭐⭐⭐ |
| **데모 퀄리티** | 40pt | 5분 데모 가능, 라이브 플레이 가능 | ⭐⭐⭐⭐⭐ |

---

## 🎤 발표 시나리오 (5분)

### 1분: 소개 & 문제 정의
```
안녕하세요, 팀 '사차원 감자들'입니다.
우리는 "K-문화를 어떻게 재미있게 전파할 수 있을까?"라는 질문에서 시작했습니다.
특히 한국 영화는 세계적으로 주목받고 있지만, 체계적으로 학습할 방법이 부족합니다.
```

### 4분: 라이브 데모
```
[화면 공유: index.html]

1. 게임 플레이 (1분)
   - 카드 뒤집기 시연
   - 매칭 성공/실패 보여주기
   - 승리 화면

2. 영화 도감 (30초)
   - 8편 영화 정보 소개
   - 포스터 및 상세 정보

3. AI 학습 (1분)
   - 퀴즈 생성 시연
   - 정답/오답 피드백 보여주기

4. 랭킹 (30초)
   - 실시간 리더보드
   - Firebase 연동 강조

5. 기술 스택 (1분)
   - CSS 3D Transform 강조
   - Firebase 실시간 동기화
   - 향후 LLM 연동 계획
```

---

## 🔮 향후 개선 계획

### Phase 1: LLM 연동 (우선순위: 높음)
```javascript
// OpenAI/Anthropic API 연동
const generateAIQuiz = async (movieData) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: `${movieData.title}에 대한 퀴즈 3개 생성해줘`
            }]
        })
    });
    return response.json();
};
```

### Phase 2: 컨텐츠 확장
- [ ] K-Drama (드라마 16편)
- [ ] K-Pop (아이돌 그룹 16팀)
- [ ] K-Food (음식 16가지)

### Phase 3: 소셜 기능
- [ ] 친구 초대 (공유 링크)
- [ ] 점수 비교
- [ ] 일일 챌린지

### Phase 4: PWA 변환
- [ ] Service Worker 등록
- [ ] 오프라인 지원
- [ ] 앱 설치 가능

---

## 📞 문의 & 기여

### 팀 사차원 감자들
- **대대장** UngSik (기획)
- **부대장** JunHyeok (개발)
- **일반병** TaeWoong (통합)
- **쫄병샊** SungWoo (데이터)

### 프로젝트 디렉토리
```
C:\Users\24457\OneDrive\바탕 화면\ProgateHackathon\TaeWoong\
```

### 관련 문서
- 📄 `../readme.md` - 해커톤 정보
- 📄 `../Claude/docs/project-overview.md` - 프로젝트 개요
- 📄 `../Claude/docs/implementation.md` - 구현 상세

---

## 📝 라이센스

본 프로젝트는 Progate Hackathon in Seoul (2025.11.01-02)의 결과물입니다.
교육 목적으로 제작되었으며, 영화 포스터는 Fair Use 원칙에 따라 사용되었습니다.

---

**마지막 업데이트**: 2025-11-01
**버전**: 1.0.0
**상태**: ✅ 해커톤 제출 준비 완료
