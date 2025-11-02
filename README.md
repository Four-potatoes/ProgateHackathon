## Team. 사차원 감자들
- **최웅식** : 기획 담당
- **윤태웅** : PM 통합 담당
- **최성우** : 데이터셋 구성 및 디자인 담당
- **제준혁** : 기능 개발 담당

## 사이트 소개하기

![K-Culture Hub](./ProgateHackathonImg.png)

### 게임 이름 : K-Cluture Hub
- **요약** : 한국 문화를 알아볼 수 있는 카드 뒤집기 게임 구현 (문화 & AI 학습 접목)

### 게임 구상 설명
- **한국 문화 주제** : 문화유산 (문화재, 전통놀이 등 통합 주제) / 음식 / 영화 / 드라마 / K-POP 등
- **AI 활용 방식** : 게임 플레이를 통해 카드를 모아 해당 문화에 대한 정보를 간단한 AI 퀴즈로 풀어볼 수 있는 학습 제공
  - AI api를 활용한 한국 문화 퀴즈 생성 후 사용자에게 제시하기 (데모 : JSON 파일로 구성된 커스텀 api로 간단 구현)
- **백엔드 DB 활용 방식** : 입력 받은 로그인 정보를 기반으로 플레이, 캐릭터 구매, 랭킹 등의 기록을 공유
  - 각 한국 문화에 대한 정보를 DB에서 불러와서 사용자에게 제공
  - React(TypeScript), Node.js, MySQL 활용하여 개발 진행

- **게임 아이디어** : 아래 제시된 아이디어를 기반으로 게임 진행을 구현
  - 스테이지 기능을 통해 각 주제를 새롭게 접근하기 위한 단계를 제공한다.
  - 사용자는 카드 게임을 플레이하여 획득한 카드를 모은다. (수집함에 저장)
  - 사용자는 수집함의 내용을 통해 다양한 문화 정보를 습득하고 이를 통한 AI 퀴즈를 풀어볼 수도 있다.
  - 전자사전처럼 사용자가 다양한 한국 문화에 대해 자세한 정보를 찾아볼 수 있는 도감 제공 (학습 수준 향상)
  - AI 퀴즈를 맞출 때마다 사용자는 포인트를 얻게 된다.
  - 포인트 제도 제공을 통한 캐릭터 아이템 구매 제공하기 -> 케데헌 / 티니핑 등 유명 국내 작품 캐릭터 적용
  - 해커톤 맞춤 특별 캐릭터로 Progate & Entbe 제공
  - 경쟁력 및 학습 의욕 향상을 이끌어내기 위해 개인 프로필을 입력받은 후 랭킹 제도 도입

### 게임 플레이 순서
  - 로그인 (클라우드 저장 및 아이디 설정)
  - 각 스테이지 별 카드 게임 플레이 (문화 카드 수집)
  - 수집함에 수집된 카드들의 정보를 통해 한국 문화 알아가기
  - 도감을 통해 각 문화에 대한 정보 얻어가기
  - AI가 생성해주는 퀴즈를 풀어보며 한국 문화 공부하기 (포인트 획득)
  - 획득한 포인트를 통해 상점에서 다양한 한국 캐릭터를 구매하여 프로필에 적용하기
  - 랭킹 순위를 올려가며 경쟁력 키우기

---

## 🛠 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-3B5998?style=for-the-badge&logo=security&logoColor=white)

### Tools & Libraries
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![dotenv](https://img.shields.io/badge/.env-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![CORS](https://img.shields.io/badge/CORS-00D8FF?style=for-the-badge&logo=fastify&logoColor=white)
