# K-Everything Memory Game

## 프로젝트 개요

**K-Everything Memory Game**은 한국 문화재, 음식, 영화를 단계별로 학습할 수 있는 메모리 카드 게임입니다.

### 주요 특징

- 3단계 진행 시스템: 문화재 → 음식 → 영화
- 잠금 해제 메커니즘: 이전 단계를 완료해야 다음 단계 진입 가능
- 진행도 저장: 로컬스토리지로 자동 저장
- 컬렉션 시스템: 클리어한 단계의 항목 확인 가능

---

## 팀 구성

- **UngSik** (기획자): 프로젝트 기획 및 디자인 가이드
- **JunHyeok** (메인 개발자): 게임 로직 구현
- **SungWoo** (데이터 & 디자인): 데이터 수집 및 이미지 정리
- **TaeWoong** (통합): 최종 통합 및 빌드

---

## 실행 방법

```bash
# 방법 1: 더블클릭
TaeWoong/src/index.html

# 방법 2: Python 서버
cd TaeWoong/src
python -m http.server 8000
```

---

## 게임 진행

1. **Stage 1 (문화재)** - 8쌍 매칭 → Stage 2 잠금 해제
2. **Stage 2 (음식)** - 8쌍 매칭 → Stage 3 잠금 해제
3. **Stage 3 (영화)** - 8쌍 매칭 → 모든 단계 클리어!

---

## 기술 스택

- HTML5 + CSS3 + Vanilla JavaScript
- Tailwind CSS
- LocalStorage
- JSON

백엔드 불필요 - 완전한 프론트엔드 애플리케이션
