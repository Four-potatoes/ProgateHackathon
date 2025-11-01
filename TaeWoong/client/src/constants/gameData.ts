import { GameItem, Stage } from '../types';

// 문화재 아이템 (export 추가)
export const CULTURE_ITEMS: GameItem[] = [
  { idx: 1, title: '불국사·석굴암', icon: '🏛️', desc: '경북 경주의 신라시대 불교 유적', img: '석굴암.jpg', color: 'bg-amber-600' },
  { idx: 2, title: '수원 화성', icon: '🏰', desc: '조선 정조시대의 계획도시 성곽', img: '수원화성.jpg', color: 'bg-blue-600' },
  { idx: 3, title: '창덕궁', icon: '🏯', desc: '조선시대 궁궐 중 가장 보존이 잘된 곳', img: '창덕궁.jpg', color: 'bg-purple-600' },
  { idx: 4, title: '훈민정음', icon: '📜', desc: '세종대왕이 창제한 한글의 원리와 사용법', img: '훈민정음.jpg', color: 'bg-yellow-600' },
  { idx: 5, title: '종묘', icon: '⛩️', desc: '조선왕조 역대 왕과 왕비의 신주를 모신 사당', img: '종묘.jpg', color: 'bg-red-700' },
  { idx: 6, title: '김장', icon: '🌶️', desc: '한국의 전통 김치 담그기 문화', img: '김장.jpg', color: 'bg-red-600' },
  { idx: 7, title: '판소리', icon: '🎵', desc: '한국 전통 서사 음악', img: '판소리.jpg', color: 'bg-green-600' },
  { idx: 8, title: '탈춤', icon: '🎭', desc: '탈을 쓰고 추는 한국 전통 춤', img: '탈춤.jpg', color: 'bg-pink-600' }
];

// 음식 아이템 (export 추가)
export const FOOD_ITEMS: GameItem[] = [
  { idx: 1, title: '김치', icon: '🌶️', desc: '한국의 대표적인 발효 음식', img: '김치.jpg', color: 'bg-red-600' },
  { idx: 2, title: '불고기', icon: '🍖', desc: '양념한 고기를 구워 먹는 한국 요리', img: '불고기.jpg', color: 'bg-orange-700' },
  { idx: 3, title: '비빔밥', icon: '🍚', desc: '밥에 여러 나물과 고추장을 넣어 비벼 먹는 음식', img: '비빔밥.jpg', color: 'bg-green-600' },
  { idx: 4, title: '떡볶이', icon: '🌭', desc: '가래떡을 고추장 양념에 볶은 한국 간식', img: '떡볶이.jpg', color: 'bg-red-500' },
  { idx: 5, title: '삼겹살', icon: '🥓', desc: '돼지고기 삼겹살을 구워 먹는 요리', img: '삼겹살.jpg', color: 'bg-pink-700' },
  { idx: 6, title: '치킨 & 맥주', icon: '🍗', desc: '치킨과 맥주를 함께 즐기는 한국 문화', img: '치맥.jpg', color: 'bg-yellow-600' },
  { idx: 7, title: '김밥', icon: '🍱', desc: '김에 밥과 여러 재료를 말아 만든 음식', img: '김밥.jpg', color: 'bg-green-700' },
  { idx: 8, title: '라면', icon: '🍜', desc: '한국식 인스턴트 면 요리', img: '라면.jpg', color: 'bg-orange-600' }
];

// 영화 아이템 (export 추가)
export const MOVIE_ITEMS: GameItem[] = [
  { idx: 1, title: '기생충', icon: '🎬', desc: '계급 간의 대립과 사회적 격차를 다룬 작품', img: '기생충.jpg', color: 'bg-gray-800' },
  { idx: 2, title: '올드보이', icon: '🔨', desc: '15년간의 감금과 복수를 그린 스릴러', img: '올드보이.jpg', color: 'bg-red-900' },
  { idx: 3, title: '부산행', icon: '🚄', desc: '좀비 바이러스로부터 살아남기 위한 사투', img: '부산행.jpg', color: 'bg-blue-900' },
  { idx: 4, title: '더 파이브', icon: '🔍', desc: '5명의 범인을 추적하는 치밀한 스릴러', img: '더파이브.jpg', color: 'bg-purple-900' },
  { idx: 5, title: '명량', icon: '⚔️', desc: '이순신 장군의 명량대첩을 다룬 역사극', img: '명량.jpg', color: 'bg-blue-800' },
  { idx: 6, title: '범죄도시', icon: '👊', desc: '조직폭력배와 경찰의 대결을 그린 액션 영화', img: '범죄도시.jpg', color: 'bg-gray-700' },
  { idx: 7, title: '헤어질 결심', icon: '💔', desc: '형사와 용의자 사이의 비밀스러운 로맨스', img: '헤어질결심.jpg', color: 'bg-indigo-800' },
  { idx: 8, title: '콘크리트 유토피아', icon: '🏢', desc: '대지진 이후 유일하게 남은 아파트의 생존기', img: '콘크리트유토피아.jpg', color: 'bg-slate-700' }
];

// 드라마 아이템 (export 추가)
export const DRAMA_ITEMS: GameItem[] = [
  { idx: 1, title: '오징어 게임', icon: '🎮', desc: '빚에 시달리는 사람들이 참여하는 의문의 게임 서바이벌', img: '오징어게임.jpg', color: 'bg-red-700' },
  { idx: 2, title: '더 글로리', icon: '💔', desc: '학교 폭력의 피해자가 30년 후 가해자들을 마주하며 복수를 꿈꾼다', img: '더글로리.jpg', color: 'bg-slate-800' },
  { idx: 3, title: '이상한 변호사 우영우', icon: '⚖️', desc: '발달장애인 천재 변호사가 펼치는 따뜻하고 통쾌한 법정 이야기', img: '이상한변호사우영우.jpg', color: 'bg-blue-700' },
  { idx: 4, title: '이태원 클라쓰', icon: '🍸', desc: '감옥에서 나온 전직 죄수가 이태원 술집을 중심으로 복수와 성공을 꿈꾼다', img: '이태원클라쓰.jpg', color: 'bg-orange-700' },
  { idx: 5, title: '도깨비', icon: '👻', desc: '신비한 능력을 가진 도깨비와 저승사자, 그리고 평범한 여인이 펼치는 판타지 로맨스', img: '도깨비.jpg', color: 'bg-purple-700' },
  { idx: 6, title: '태양의 후예', icon: '☀️', desc: '전쟁터와 재난 현장을 배경으로 펼쳐지는 군인들의 로맨스와 우정', img: '태양의후예.jpg', color: 'bg-yellow-700' },
  { idx: 7, title: '지금 우리 학교는', icon: '🧟', desc: '학교에서 벌어지는 좀비 사태 속에서 학생들이 펼치는 생존 이야기', img: '지금우리학교는.jpg', color: 'bg-green-800' },
  { idx: 8, title: '굿닥터', icon: '🏥', desc: '자폐증을 가진 천재 소아외과 의사가 환자들을 치료하며 펼치는 감동적인 이야기', img: '굿닥터.jpg', color: 'bg-teal-700' }
];

// K-POP 아이템 (export 추가)
export const KPOP_ITEMS: GameItem[] = [
  { idx: 1, title: 'BTS', icon: '🎤', desc: '한국 음악을 세계적으로 알린 7명의 멤버로 이루어진 그룹', img: 'bts.jpg', color: 'bg-purple-800' },
  { idx: 2, title: 'BLACKPINK', icon: '✨', desc: '유튜브 뮤직비디오 최다 조회수 기록을 보유한 전 세계적 인기 걸그룹', img: 'blackpink.jpg', color: 'bg-pink-700' },
  { idx: 3, title: 'TWICE', icon: '💕', desc: '한국, 미국, 일본에서 모두 성공한 9명의 멤버로 이루어진 걸그룹', img: 'twice.jpg', color: 'bg-pink-600' },
  { idx: 4, title: 'EXO', icon: '🌟', desc: 'K-pop 3세대를 대표하는 그룹으로 아시아를 중심으로 큰 인기를 얻었다', img: 'exo.jpg', color: 'bg-blue-800' },
  { idx: 5, title: '동방신기', icon: '🌙', desc: 'K-pop 역사상 가장 오래되고 영향력 있는 그룹', img: '동방신기.jpg', color: 'bg-red-800' },
  { idx: 6, title: 'NewJeans', icon: '🎀', desc: '최신 세대를 대표하는 신예 걸그룹으로 빠르게 전 세계 팬층을 확보', img: 'newjeans.jpg', color: 'bg-cyan-600' },
  { idx: 7, title: 'Stray Kids', icon: '🎬', desc: '자신들의 음악을 직접 제작하는 음악성 강한 9명의 아이돌 그룹', img: 'Stray Kids.jpg', color: 'bg-slate-700' },
  { idx: 8, title: 'IVE', icon: '💫', desc: '차세대 걸그룹으로 신선한 개성과 뛰어난 무대 실력을 갖춘 그룹', img: 'IVE.jpg', color: 'bg-indigo-700' }
];

// 스테이지 데이터 (5개 스테이지)
export const STAGES: Stage[] = [
  {
    id: 1,
    name: '문화재',
    folder: 'culture',
    items: CULTURE_ITEMS
  },
  {
    id: 2,
    name: '음식',
    folder: 'food',
    items: FOOD_ITEMS
  },
  {
    id: 3,
    name: '영화',
    folder: 'movie',
    items: MOVIE_ITEMS
  },
  {
    id: 4,
    name: '드라마',
    folder: 'drama',
    items: DRAMA_ITEMS
  },
  {
    id: 5,
    name: 'K-POP',
    folder: 'kpop',
    items: KPOP_ITEMS
  }
];

// 프로필 아바타 상점
export interface Avatar {
  id: string;
  name: string;
  price: number;
  category: 'free' | 'basic' | 'premium' | 'legendary';
  image?: string; // 이미지 경로 (선택적)
}

export const AVATAR_SHOP: Avatar[] = [
  // Free - 기본 이모티콘
  { id: '😊', name: '기본', price: 0, category: 'free' },

  // Basic - 뽀로로 & 친구들
  { id: 'pororo', name: '뽀로로', price: 10, category: 'basic', image: '/img/avatars/Pororo.jpg' },
  { id: 'crong', name: '크롱', price: 10, category: 'basic', image: '/img/avatars/Crong.jpg' },
  { id: 'eddy', name: '에디', price: 10, category: 'basic', image: '/img/avatars/Eddy.jpg' },
  { id: 'rody', name: '로디', price: 10, category: 'basic', image: '/img/avatars/Rody.jpg' },

  // Basic - 런닝맨 핑핑이들
  { id: 'baroping', name: '바로핑', price: 15, category: 'basic', image: '/img/avatars/CN_RN_Baroping.jpg' },
  { id: 'ajaping', name: '아자핑', price: 15, category: 'basic', image: '/img/avatars/CN_RN_Ajaping.jpg' },
  { id: 'chachaping', name: '차차핑', price: 15, category: 'basic', image: '/img/avatars/CN_RN_Chachaping.jpg' },
  { id: 'happing', name: '해핑', price: 15, category: 'basic', image: '/img/avatars/CN_RN_Happing.jpg' },
  { id: 'hatchuping', name: '하츄핑', price: 15, category: 'basic', image: '/img/avatars/CN_RN_Hatchuping.jpg' },
  { id: 'laraping', name: '라라핑', price: 15, category: 'basic', image: '/img/avatars/CN_RN_Laraping.jpg' },

  // Premium - 띠띠뽀 친구들
  { id: 'jinu', name: '진우', price: 50, category: 'premium', image: '/img/avatars/DH_Jinu.jpg' },
  { id: 'mira', name: '미라', price: 50, category: 'premium', image: '/img/avatars/DH_Mira.jpg' },
  { id: 'baby', name: '베이비', price: 50, category: 'premium', image: '/img/avatars/DH_Baby.jpg' },
  { id: 'abby', name: '애비', price: 50, category: 'premium', image: '/img/avatars/DH_Abby.jpg' },
  { id: 'rumi', name: '루미', price: 50, category: 'premium', image: '/img/avatars/DH_Rumi.jpg' },
  { id: 'zoey', name: '조이', price: 50, category: 'premium', image: '/img/avatars/DH_Zoey.jpg' },

  // Legendary
  { id: 'mystery', name: '미스터리', price: 100, category: 'legendary', image: '/img/avatars/DH_Mystery.jpg' },
  { id: 'romance', name: '로맨스', price: 100, category: 'legendary', image: '/img/avatars/DH_Romance.jpg' }
];

export const PROFILE_AVATARS = ['😊', '😎', '🥳', '🤓', '😇', '🤗', '🥰', '😁', '🙂', '😄', '😃', '😀', '🤩', '😍', '🥸', '😏'];