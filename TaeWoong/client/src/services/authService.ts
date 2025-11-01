import api from './api';
import { AuthResponse, LoginCredentials, SignupCredentials } from '../types';
import { User } from '../types';

export interface GuestLoginData {
  name: string;
  avatar: string;
}

export const authService = {
  // 게스트 로그인
  guestLogin: async (data: GuestLoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/guest-login', data);
      return response.data as AuthResponse;
    } catch (error) {
      console.error('게스트 로그인 에러:', error);
      throw error;
    }
  },

  // 일반 로그인
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // 백엔드 시도
      try {
        const response = await api.post('/auth/login', credentials);
        const authData = response.data as AuthResponse;
        if (authData.token) {
          localStorage.setItem('auth_token', authData.token);
        }
        return authData;
      } catch (backendError) {
        console.warn('백엔드 로그인 실패, 로컬 모드로 전환:', backendError);
        // 백엔드 실패 시 로컬 모드로 진행
        return mockLogin(credentials);
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  },

  // 회원가입
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      // 백엔드 시도
      try {
        const response = await api.post('/auth/signup', credentials);
        const authData = response.data as AuthResponse;
        if (authData.token) {
          localStorage.setItem('auth_token', authData.token);
        }
        return authData;
      } catch (backendError) {
        console.warn('백엔드 회원가입 실패, 로컬 모드로 전환:', backendError);
        // 백엔드 실패 시 로컬 모드로 진행
        return mockSignup(credentials);
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      console.warn('로그아웃 API 요청 실패:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data as User;
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      throw error;
    }
  },

  // 토큰 유효성 확인
  verifyToken: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      await api.get('/auth/verify');
      return true;
    } catch (error) {
      localStorage.removeItem('auth_token');
      return false;
    }
  }
};

// ===================================
// Mock 함수들 (백엔드 없을 때 사용)
// ===================================

const MOCK_USERS_KEY = 'mock_users_db';
const DEMO_USERS = [
  {
    id: 'demo_1',
    email: 'demo@example.com',
    password: 'demo123',
    name: '테스트 사용자',
    avatar: '😊'
  }
];

const initMockDB = () => {
  if (!localStorage.getItem(MOCK_USERS_KEY)) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEMO_USERS));
  }
};

const getAllMockUsers = () => {
  initMockDB();
  const data = localStorage.getItem(MOCK_USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveMockUser = (user: any) => {
  const users = getAllMockUsers();
  const index = users.findIndex((u: any) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const generateMockToken = (userId: string): string => {
  const token = `mock_jwt_${userId}_${Date.now()}`;
  localStorage.setItem('auth_token', token);
  return token;
};

const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getAllMockUsers();
      const user = users.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        const token = generateMockToken(user.id);
        resolve({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar
          }
        });
      } else {
        reject(new Error('이메일 또는 비밀번호가 올바르지 않습니다.'));
      }
    }, 500);
  });
};

const mockSignup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getAllMockUsers();

      // 이미 존재하는 이메일 확인
      if (users.some((u: any) => u.email === credentials.email)) {
        reject(new Error('이미 존재하는 이메일입니다.'));
        return;
      }

      // 새 사용자 생성
      const newUser = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || '사용자',
        avatar: credentials.avatar || '😊'
      };

      saveMockUser(newUser);
      const token = generateMockToken(newUser.id);

      resolve({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar
        }
      });
    }, 500);
  });
};