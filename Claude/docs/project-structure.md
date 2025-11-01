# 프로젝트 구조 문서

## 📂 전체 디렉토리 구조

```
ProgateHackathon/
├── readme.md                       # 해커톤 정보
│
├── UngSik/                         # 대대장 (기획)
│   └── planning.md                 # 프로젝트 기획서
│
├── SungWoo/                        # 쫄병샊 (데이터)
│   ├── movie.json                  # 원본 영화 데이터
│   ├── data/img/                   # 영화 포스터 (8장)
│   ├── main.html                   # UI 프로토타입
│   └── style.css                   # 기본 스타일
│
├── JunHyeok/                       # 부대장 (개발)
│   └── geme.html                   # 게임 로직 구현
│
├── TaeWoong/                       # 일반병 (통합) ⭐ 최종 결과물
│   ├── claude.md                   # Claude AI 통합 문서
│   ├── readme.md                   # 프로젝트 README
│   ├── src/
│   │   └── index.html              # 메인 애플리케이션
│   └── data/
│       ├── korean-movies.json      # 통합 영화 데이터
│       └── img/                    # 영화 포스터 (8장)
│           ├── 기생충.jpg
│           ├── 올드보이.jpg
│           ├── 부산행.jpg
│           ├── 더파이브.jpg
│           ├── 명량.jpg
│           ├── 범죄도시.jpg
│           ├── 헤어질결심.jpg
│           └── 콘크리트유토피아.jpg
│
└── Claude/                         # 프로젝트 관리 문서
    ├── README.md                   # Claude 폴더 안내
    ├── docs/
    │   ├── project-overview.md     # 프로젝트 개요
    │   ├── implementation.md       # 구현 상세
    │   └── project-structure.md    # 본 문서
    └── assets/
        └── screenshots/            # (예정) 스크린샷
```

---

## 🎯 핵심 파일 설명

### 최종 결과물 (TaeWoong 폴더)

#### 1. `TaeWoong/src/index.html`
**메인 애플리케이션 파일**
- 모든 기능이 통합된 단일 HTML 파일
- 4개 페이지 (게임, 도감, 학습, 랭킹)
- Firebase 연동
- 반응형 UI

**크기**: ~25KB
**라인 수**: ~620줄
**기술**: HTML5, Tailwind CSS, Vanilla JS, Firebase

#### 2. `TaeWoong/data/korean-movies.json`
**영화 데이터베이스**
```json
{
    "movies": [
        {
            "idx": 1,
            "title": "기생충",
            "img": "기생충.jpg",
            "genre": "범죄",
            "director": "봉준호",
            "actor": "송강호, 이선균, ...",
            "icon": "🎬",
            "desc": "계급 간의 대립과 사회적 격차를 다룬 작품."
        }
        // ... 총 8편
    ]
}
```

**영화 목록**:
1. 기생충 (2019)
2. 올드보이 (2003)
3. 부산행 (2016)
4. 더 파이브 (2013)
5. 명량 (2014)
6. 범죄도시 (2017)
7. 헤어질 결심 (2022)
8. 콘크리트 유토피아 (2023)

#### 3. `TaeWoong/data/img/`
**영화 포스터 이미지**
- 총 8장의 JPG 파일
- 각 영화당 1개의 대표 포스터
- 게임 카드 및 도감에 사용

#### 4. `TaeWoong/claude.md`
**Claude AI 통합 문서**
- 프로젝트 요약
- 통합 과정 설명
- 실행 방법
- 발표 시나리오
- 향후 계획

---

### 관리 문서 (Claude 폴더)

#### 1. `Claude/docs/project-overview.md`
**프로젝트 전체 개요**
- 주제 및 핵심 기능
- 기술 스택
- 평가 기준 대응
- 팀 기여도

#### 2. `Claude/docs/implementation.md`
**기술 구현 상세**
- 아키텍처 다이어그램
- 코드 예시 및 설명
- 알고리즘 상세
- 성능 지표

#### 3. `Claude/docs/project-structure.md`
**본 문서**
- 디렉토리 구조
- 파일별 설명
- 개발 워크플로우

---

### 원본 작업 파일

#### 1. `UngSik/planning.md`
**프로젝트 기획서**
```markdown
- 게임 종류: 한국 문화 카드 뒤집기
- 문화 주제: 영화
- AI 학습: 게임 → 정보 제공 → 퀴즈
```

#### 2. `SungWoo/movie.json`
**원본 영화 데이터**
- 8편의 영화 기본 정보
- 제목, 장르, 감독, 출연진
- 이미지 파일명

#### 3. `JunHyeok/geme.html`
**게임 로직 원본**
- 카드 매칭 알고리즘
- Firebase 연동 코드
- AI 학습 UI
- 랭킹 시스템

---

## 🔄 통합 프로세스

### Step 1: 데이터 통합
```
SungWoo/movie.json
    ↓ (확장)
TaeWoong/data/korean-movies.json
    + icon 추가
    + desc 추가
    + 구조 표준화
```

### Step 2: 이미지 통합
```
SungWoo/data/img/*.jpg
    ↓ (복사)
TaeWoong/data/img/*.jpg
    8개 파일 모두 이동
```

### Step 3: 코드 통합
```
JunHyeok/geme.html (게임 로직)
    + SungWoo 데이터 연결
    + UI/UX 개선
    ↓
TaeWoong/src/index.html
    완전한 애플리케이션
```

### Step 4: 문서화
```
UngSik/planning.md (기획)
SungWoo/readme.md (데이터)
JunHyeok/readme.md (개발)
    ↓ (통합)
TaeWoong/claude.md
Claude/docs/*.md
```

---

## 🎮 파일 의존성

### 런타임 의존성
```
index.html
    ├── korean-movies.json       (데이터)
    ├── img/*.jpg                (이미지)
    ├── Tailwind CSS CDN         (외부)
    ├── Lucide Icons CDN         (외부)
    └── Firebase SDK CDN         (외부)
```

### 문서 의존성
```
claude.md
    ├── project-overview.md
    ├── implementation.md
    └── project-structure.md
```

---

## 📊 파일 크기 및 라인 수

| 파일 | 크기 | 라인 수 | 비고 |
|-----|------|--------|------|
| `index.html` | ~25KB | 620 | 메인 애플리케이션 |
| `korean-movies.json` | ~2KB | 68 | 영화 데이터 |
| `claude.md` | ~15KB | 450 | 통합 문서 |
| `project-overview.md` | ~10KB | 300 | 프로젝트 개요 |
| `implementation.md` | ~18KB | 500 | 구현 상세 |
| `이미지 8개` | ~2MB | - | 포스터 이미지 |

**총 프로젝트 크기**: ~2.1MB

---

## 🚀 개발 워크플로우

### 1단계: 기획 (UngSik)
```
planning.md 작성
    ↓
게임 메커니즘 설계
    ↓
AI 학습 방식 정의
```

### 2단계: 데이터 수집 (SungWoo)
```
영화 8편 선정
    ↓
정보 수집 (장르, 감독, 출연진)
    ↓
포스터 이미지 다운로드
    ↓
movie.json 생성
```

### 3단계: 개발 (JunHyeok)
```
카드 매칭 게임 구현
    ↓
Firebase 연동
    ↓
AI 학습 UI 개발
    ↓
랭킹 시스템 구현
```

### 4단계: 통합 (TaeWoong)
```
데이터 표준화
    ↓
게임 로직 + 영화 데이터 연결
    ↓
UI/UX 개선
    ↓
문서화
    ↓
최종 테스트
```

---

## 🔍 파일 검색 가이드

### 기능별 파일 위치

**게임 로직을 보고 싶다면?**
→ `TaeWoong/src/index.html` (line 84-207)

**영화 데이터를 수정하고 싶다면?**
→ `TaeWoong/data/korean-movies.json`

**AI 학습 코드를 보고 싶다면?**
→ `TaeWoong/src/index.html` (line 334-450)

**Firebase 연동을 보고 싶다면?**
→ `TaeWoong/src/index.html` (line 152-169, 452-531)

**프로젝트 개요를 알고 싶다면?**
→ `Claude/docs/project-overview.md`

**구현 상세를 알고 싶다면?**
→ `Claude/docs/implementation.md`

---

## 📝 파일 네이밍 규칙

### HTML 파일
- `index.html` - 메인 애플리케이션
- `main.html` - 프로토타입 (SungWoo)
- `geme.html` - 게임 로직 (JunHyeok, 오타 의도적 유지)

### JSON 파일
- `korean-movies.json` - 통합 영화 데이터 (최종)
- `movie.json` - 원본 영화 데이터 (SungWoo)

### 마크다운 파일
- `readme.md` - 프로젝트 README (소문자)
- `README.md` - Claude 폴더 README (대문자)
- `*.md` - 문서 파일

### 이미지 파일
- `{영화제목}.jpg` - 한글 파일명 사용
- 예: `기생충.jpg`, `올드보이.jpg`

---

## 🎯 중요 체크리스트

### 발표 전 확인사항
- [ ] `TaeWoong/src/index.html` 정상 작동 확인
- [ ] 영화 이미지 8개 모두 로드되는지 확인
- [ ] Firebase 연결 상태 확인 (선택)
- [ ] 4개 페이지 모두 정상 작동 확인
- [ ] 발표 시나리오 숙지 (`TaeWoong/claude.md` 참고)

### 제출 파일
- ✅ `TaeWoong/` 폴더 전체
- ✅ `Claude/` 폴더 전체
- ✅ 메인 `readme.md` (해커톤 정보)

### 백업 파일
- ✅ `UngSik/` 폴더 (기획 원본)
- ✅ `SungWoo/` 폴더 (데이터 원본)
- ✅ `JunHyeok/` 폴더 (개발 원본)

---

**마지막 업데이트**: 2025-11-01
**총 파일 수**: 20+
**총 디렉토리**: 10+
**상태**: ✅ 통합 완료
