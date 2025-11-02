import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { PROFILE_AVATARS } from '../constants/gameData';
import { authService } from '../services/authService';

export interface AuthContextType {
  // 사용자 정보
  currentUser: User | null;
  playerName: string;
  playerAvatar: string;
  coins: number;
  isGuest: boolean;
  isLoggedIn: boolean;

  // 아바타
  setPlayerAvatar: (avatar: string) => void;

  // 인증
  loginAsGuest: (name: string, avatar: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, avatar: string) => Promise<void>;
  logout: () => Promise<void>;

  // 세션
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState(PROFILE_AVATARS[0]);
  const [coins, setCoins] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 세션 복원
  const restoreSession = async () => {
    // 비동기 작업을 useEffect에서 처리하도록 변경
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      try {
        const userData = await authService.getCurrentUser();
        setCurrentUser(userData);
        setPlayerName(userData.name);
        setPlayerAvatar(userData.avatar || PROFILE_AVATARS[0]);
        setIsLoggedIn(true);
        setIsGuest(false);

        const progress = localStorage.getItem(`game_progress_${userData.id}`);
        if (progress) {
          const data = JSON.parse(progress);
          setCoins(data.coins || 0);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        localStorage.removeItem('auth_token');
      }
    } else {
      const guestData = localStorage.getItem('guest_session');
      if (guestData) {
        try {
          const data = JSON.parse(guestData);
          setPlayerName(data.name);
          setPlayerAvatar(data.avatar);
          setCoins(data.coins || 0);
          setIsGuest(true);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('게스트 데이터 복원 실패:', error);
        }
      }
    }
  };

  // 게스트 로그인
  const loginAsGuest = async (name: string, avatar: string) => {
    try {
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const guestData = {
        id: guestId,
        name: name.trim() || '익명',
        avatar: avatar || PROFILE_AVATARS[0],
        email: undefined,
        createdAt: new Date().toISOString()
      };

      setCurrentUser(guestData as User);
      setPlayerName(guestData.name);
      setPlayerAvatar(guestData.avatar);
      setIsGuest(true);
      setIsLoggedIn(true);
      setCoins(0);

      // 로컬스토리지에 저장
      localStorage.setItem('guest_session', JSON.stringify({
        ...guestData,
        coins: 0
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '게스트 로그인 실패');
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      localStorage.setItem('auth_token', response.token);
      setCurrentUser(response.user);
      setPlayerName(response.user.name);
      setPlayerAvatar(response.user.avatar || PROFILE_AVATARS[0]);
      setIsLoggedIn(true);
      setIsGuest(false);
      
      // 게스트 세션 제거
      localStorage.removeItem('guest_session');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '로그인 실패');
    }
  };

  // 회원가입
  const signup = async (email: string, password: string, name: string, avatar: string) => {
    try {
      const response = await authService.signup({
        email,
        password,
        name: name || '사용자',
        avatar: avatar || PROFILE_AVATARS[0]
      });

      localStorage.setItem('auth_token', response.token);
      setCurrentUser(response.user);
      setPlayerName(response.user.name);
      setPlayerAvatar(response.user.avatar || PROFILE_AVATARS[0]);
      setIsLoggedIn(true);
      setIsGuest(false);

      // 게스트 세션 제거
      localStorage.removeItem('guest_session');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '회원가입 실패');
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      if (!isGuest && currentUser) {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('백엔드 로그아웃 실패, 로컬 정리 진행:', error);
        }
      }
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('guest_session');
      setCurrentUser(null);
      setPlayerName('');
      setPlayerAvatar(PROFILE_AVATARS[0]);
      setCoins(0);
      setIsLoggedIn(false);
      setIsGuest(false);
    }
  };

  // 아바타 변경
  const handleSetPlayerAvatar = (avatar: string) => {
    setPlayerAvatar(avatar);
    
    // 데이터베이스에 저장
    if (currentUser && !isGuest) {
      localStorage.setItem(`player_avatar_${currentUser.id}`, avatar);
    } else if (isGuest) {
      const guestData = localStorage.getItem('guest_session');
      if (guestData) {
        const data = JSON.parse(guestData);
        data.avatar = avatar;
        localStorage.setItem('guest_session', JSON.stringify(data));
      }
    }
  };

  const value: AuthContextType = {
    currentUser,
    playerName,
    playerAvatar,
    coins,
    isGuest,
    isLoggedIn,
    setPlayerAvatar: handleSetPlayerAvatar,
    loginAsGuest,
    login,
    signup,
    logout,
    restoreSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};