import api from './api';
import { AuthResponse, LoginCredentials, SignupCredentials } from '../types';
import { User } from '../types';

export interface GuestLoginData {
  name: string;
  avatar: string;
}

// ===================================
// Mock 함수들 (백엔드 없을 때 사용)
// ===================================

const MOCK_USERS_KEY = 'mock_users_db';
const DEMO_USERS = [
  {
    id: 'demo_1',
    username: 'demo',
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
  localStorage.setItem('current_user_id', userId);
  return token;
};

const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getAllMockUsers();
      const user = users.find(
        (u: any) => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        const token = generateMockToken(user.id);
        localStorage.setItem('current_user_id', user.id);
        resolve({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            avatar: user.avatar
          }
        });
      } else {
        reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.'));
      }
    }, 500);
  });
};

const mockSignup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getAllMockUsers();

      if (users.some((u: any) => u.username === credentials.username)) {
        reject(new Error('이미 존재하는 아이디입니다.'));
        return;
      }

      if (users.some((u: any) => u.email === credentials.email)) {
        reject(new Error('이미 존재하는 이메일입니다.'));
        return;
      }

      const newUser = {
        id: `user_${Date.now()}`,
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || '사용자',
        avatar: credentials.avatar || '😊'
      };

      saveMockUser(newUser);
      const token = generateMockToken(newUser.id);
      localStorage.setItem('current_user_id', newUser.id);

      resolve({
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar
        }
      });
    }, 500);
  });
};

const mockGetCurrentUser = async (): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('auth_token');
      const userId = localStorage.getItem('current_user_id');

      if (!token || !userId) {
        reject(new Error('인증되지 않은 사용자입니다.'));
        return;
      }

      const users = getAllMockUsers();
      const user = users.find((u: any) => u.id === userId);

      if (!user) {
        reject(new Error('사용자를 찾을 수 없습니다.'));
        return;
      }

      resolve({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      });
    }, 100);
  });
};

const mockUpdateProfile = async (data: { avatar?: string; name?: string }): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userId = localStorage.getItem('current_user_id');

      if (!userId) {
        reject(new Error('인증되지 않은 사용자입니다.'));
        return;
      }

      const users = getAllMockUsers();
      const user = users.find((u: any) => u.id === userId);

      if (!user) {
        reject(new Error('사용자를 찾을 수 없습니다.'));
        return;
      }

      if (data.avatar !== undefined) {
        user.avatar = data.avatar;
      }
      if (data.name !== undefined) {
        user.name = data.name;
      }

      saveMockUser(user);

      resolve({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      });
    }, 300);
  });
};

// ===================================
// AuthService 정의
// ===================================

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
      try {
        const response = await api.post('/auth/login', credentials);
        const authData = response.data as AuthResponse;
        if (authData.token) {
          localStorage.setItem('auth_token', authData.token);
          if (authData.user && authData.user.id) {
            localStorage.setItem('current_user_id', authData.user.id);
          }
        }
        return authData;
      } catch (backendError) {
        console.warn('백엔드 로그인 실패, 로컬 모드로 전환:', backendError);
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
      try {
        const response = await api.post('/auth/signup', credentials);
        const authData = response.data as AuthResponse;
        if (authData.token) {
          localStorage.setItem('auth_token', authData.token);
          if (authData.user && authData.user.id) {
            localStorage.setItem('current_user_id', authData.user.id);
          }
        }
        return authData;
      } catch (backendError) {
        console.warn('백엔드 회원가입 실패, 로컬 모드로 전환:', backendError);
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
      localStorage.removeItem('current_user_id');
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    try {
      try {
        const response = await api.get('/auth/me');
        return response.data as User;
      } catch (backendError) {
        console.warn('백엔드 사용자 정보 조회 실패, 로컬 모드로 전환:', backendError);
        return mockGetCurrentUser();
      }
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

      try {
        await api.get('/auth/verify');
        return true;
      } catch (error) {
        // 백엔드 실패 시 로컬 토큰만 확인
        return token && localStorage.getItem('current_user_id') ? true : false;
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user_id');
      return false;
    }
  },

  // 프로필 업데이트
  updateProfile: async (data: { avatar?: string; name?: string }): Promise<User> => {
    try {
      try {
        const response = await api.put('/auth/profile', data);
        return response.data as User;
      } catch (backendError) {
        console.warn('백엔드 프로필 업데이트 실패, 로컬 모드로 전환:', backendError);
        return mockUpdateProfile(data);
      }
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
      throw error;
    }
  }
};