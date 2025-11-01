import { GameItem, Stage } from '../types';

// 8개 카드 아이템
export const ITEMS: GameItem[] = [
  {
    idx: 0,
    title: '한복',
    icon: '👘',
    desc: '한국의 전통 의상으로 특별한 날에 입습니다.',
    img: 'hanbok.jpg',
    color: 'bg-pink-600'
  },
  {
    idx: 1,
    title: '김치',
    icon: '🌶️',
    desc: '한국의 대표적인 발효 음식입니다.',
    img: 'kimchi.jpg',
    color: 'bg-red-600'
  },
  {
    idx: 2,
    title: '비빔밥',
    icon: '🍚',
    desc: '밥 위에 나물을 얹어 비벼 먹는 음식입니다.',
    img: 'bibimbap.jpg',
    color: 'bg-orange-600'
  },
  {
    idx: 3,
    title: '탈춤',
    icon: '🎭',
    desc: '탈을 쓰고 추는 전통 연희입니다.',
    img: 'talchum.jpg',
    color: 'bg-purple-600'
  },
  {
    idx: 4,
    title: '태극기',
    icon: '🇰🇷',
    desc: '대한민국의 국기입니다.',
    img: 'taegeukgi.jpg',
    color: 'bg-blue-700'
  },
  {
    idx: 5,
    title: '궁궐',
    icon: '🏯',
    desc: '조선 시대 왕이 살던 큰 건축물입니다.',
    img: 'palace.jpg',
    color: 'bg-amber-700'
  },
  {
    idx: 6,
    title: '붓글씨',
    icon: '🖋️',
    desc: '붓으로 쓰는 서예입니다.',
    img: 'calligraphy.jpg',
    color: 'bg-gray-700'
  },
  {
    idx: 7,
    title: '가야금',
    icon: '🎶',
    desc: '한국의 전통 현악기입니다.',
    img: 'gayageum.jpg',
    color: 'bg-green-600'
  }
];

// 스테이지 데이터 (현재는 한 개 스테이지)
export const STAGES: Stage[] = [
  {
    id: 1,
    name: '한국 문화',
    items: ITEMS
  }
  // 추후 추가 스테이지
  // { id: 2, name: '한국 음식', items: [...] },
  // { id: 3, name: '한국 영화', items: [...] }
];

// 프로필 아바타 상점
export interface Avatar {
  id: string;
  name: string;
  price: number;
  category: 'free' | 'basic' | 'premium' | 'legendary';
}

export const AVATAR_SHOP: Avatar[] = [
  { id: '😊', name: '기본', price: 0, category: 'free' },
  { id: '😎', name: '멋짐', price: 10, category: 'basic' },
  { id: '🥳', name: '파티', price: 10, category: 'basic' },
  { id: '🤓', name: '똑똑', price: 10, category: 'basic' },
  { id: '😇', name: '천사', price: 15, category: 'basic' },
  { id: '🤗', name: '포옹', price: 15, category: 'basic' },
  { id: '🥰', name: '사랑', price: 15, category: 'basic' },
  { id: '👑', name: '왕관', price: 50, category: 'premium' },
  { id: '🦄', name: '유니콘', price: 50, category: 'premium' },
  { id: '🐉', name: '드래곤', price: 50, category: 'premium' },
  { id: '💎', name: '다이아', price: 100, category: 'legendary' },
  { id: '🏆', name: '트로피', price: 100, category: 'legendary' },
  { id: '🚀', name: '로켓', price: 100, category: 'legendary' }
];

export const PROFILE_AVATARS = ['😊', '😎', '🥳', '🤓', '😇', '🤗', '🥰', '😁', '🙂', '😄', '😃', '😀', '🤩', '😍', '🥸', '😏'];