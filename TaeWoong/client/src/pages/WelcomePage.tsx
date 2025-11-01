import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { PROFILE_AVATARS } from '../constants/gameData';
import { useNavigate } from 'react-router-dom';

type WelcomeMode = 'initial' | 'guest' | 'login' | 'signup';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsGuest, login, signup, playerAvatar } = useAuth();
  const { setCurrentStage, setUnlockedStages, setCompletedStages } = useGame();
  
  const [mode, setMode] = useState<WelcomeMode>('initial');
  const [playerName, setPlayerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(playerAvatar);
  const [loading, setLoading] = useState(false);

  const handleGuestStart = async (name: string) => {
    if (!name.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    
    setLoading(true);
    try {
      await loginAsGuest(name.trim(), selectedAvatar);
      setCurrentStage(1);
      setUnlockedStages([1]);
      setCompletedStages([]);
      navigate('/stages');
    } catch (error) {
      alert('게스트 로그인 실패: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      alert('로그인 성공! 🎉');
      setCurrentStage(1);
      navigate('/stages');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
      alert('로그인 실패: ' + errorMsg);
      console.error('로그인 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    try {
      // name을 email에서 추출 (@ 앞부분)
      const nameFromEmail = email.split('@')[0];
      await signup(email.trim(), password.trim(), nameFromEmail, selectedAvatar);

      // 회원가입 성공
      alert('회원가입이 완료되었습니다! 🎉');
      setCurrentStage(1);
      setUnlockedStages([1]);
      setCompletedStages([]);
      navigate('/stages');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
      alert('회원가입 실패: ' + errorMsg);
      console.error('회원가입 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const avatarGrid = (
    <div className="grid grid-cols-8 gap-2 p-3 bg-[#e0e7eb] rounded-lg">
      {PROFILE_AVATARS.map((avatar) => (
        <button
          key={avatar}
          onClick={() => setSelectedAvatar(avatar)}
          className={`w-12 h-12 text-2xl rounded-full border-2 transition-all duration-200 ${
            selectedAvatar === avatar
              ? 'border-[#269dd9] scale-110 shadow-md'
              : 'border-[#bfd0d9] hover:border-[#269dd9]'
          }`}
        >
          {avatar}
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (mode) {
      case 'initial':
        return (
          <div className="space-y-4">
            <button
              onClick={() => setMode('guest')}
              className="w-full bg-[#269dd9] hover:bg-[#1e7db0] text-white font-bold py-4 px-6 rounded-lg shadow-md transition"
            >
              게스트로 시작하기
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setMode('login')}
                className="flex-1 bg-white border-2 border-[#269dd9] hover:bg-[#e0e7eb] text-[#269dd9] font-bold py-3 px-4 rounded-lg transition"
              >
                로그인
              </button>
              <button
                onClick={() => setMode('signup')}
                className="flex-1 bg-[#33ccb3] hover:bg-[#29a895] text-white font-bold py-3 px-4 rounded-lg transition"
              >
                회원가입
              </button>
            </div>
          </div>
        );

      case 'guest':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-left text-sm font-semibold text-[#2e3538] mb-2">
                프로필 아바타 선택
              </label>
              {avatarGrid}
            </div>

            <div>
              <label className="block text-left text-sm font-semibold text-[#2e3538] mb-2">
                닉네임 입력
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-3 border-2 border-[#bfd0d9] rounded-lg focus:border-[#269dd9] focus:outline-none transition"
                placeholder="예: 홍길동"
                maxLength={10}
                onKeyPress={(e) => e.key === 'Enter' && handleGuestStart(playerName)}
              />
            </div>

            <button
              onClick={() => handleGuestStart(playerName)}
              disabled={loading}
              className="w-full bg-[#269dd9] hover:bg-[#1e7db0] disabled:bg-[#e7ecef] disabled:text-[#61686b] text-white font-bold py-4 px-6 rounded-lg shadow-md transition mb-3"
            >
              {loading ? '로딩 중...' : '게임 시작 (데이터 저장 안됨)'}
            </button>

            <button
              onClick={() => setMode('initial')}
              className="w-full bg-white border-2 border-[#bfd0d9] hover:border-[#269dd9] text-[#2e3538] font-bold py-3 px-4 rounded-lg transition"
            >
              뒤로 가기
            </button>
          </div>
        );

      case 'login':
        return (
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-[#bfd0d9] rounded-lg focus:border-[#269dd9] focus:outline-none transition"
              placeholder="이메일"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />

            <input
              id="login-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-[#bfd0d9] rounded-lg focus:border-[#269dd9] focus:outline-none transition"
              placeholder="비밀번호"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <label htmlFor="login-password" className="text-xs text-[#61686b]">비밀번호</label>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#269dd9] hover:bg-[#1e7db0] disabled:bg-[#e7ecef] disabled:text-[#61686b] text-white font-bold py-4 px-6 rounded-lg shadow-md transition mb-3"
            >
              {loading ? '로딩 중...' : '로그인'}
            </button>

            <button
              onClick={() => setMode('initial')}
              className="w-full bg-white border-2 border-[#bfd0d9] hover:border-[#269dd9] text-[#2e3538] font-bold py-3 px-4 rounded-lg transition"
            >
              뒤로 가기
            </button>
          </div>
        );

      case 'signup':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-left text-sm font-semibold text-[#2e3538] mb-2">
                프로필 아바타 선택
              </label>
              {avatarGrid}
            </div>

            <input
              id="signup-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-[#bfd0d9] rounded-lg focus:border-[#269dd9] focus:outline-none transition"
              placeholder="이메일"
              onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
            />
            <label htmlFor="signup-email" className="text-xs text-[#61686b]">이메일</label>

            <input
              id="signup-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-[#bfd0d9] rounded-lg focus:border-[#269dd9] focus:outline-none transition"
              placeholder="비밀번호 (최소 6자)"
              onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
            />
            <label htmlFor="signup-password" className="text-xs text-[#61686b]">비밀번호</label>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-[#33ccb3] hover:bg-[#29a895] disabled:bg-[#e7ecef] disabled:text-[#61686b] text-white font-bold py-4 px-6 rounded-lg shadow-md transition mb-3"
            >
              {loading ? '로딩 중...' : '회원가입'}
            </button>

            <button
              onClick={() => setMode('initial')}
              className="w-full bg-white border-2 border-[#bfd0d9] hover:border-[#269dd9] text-[#2e3538] font-bold py-3 px-4 rounded-lg transition"
            >
              뒤로 가기
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e5f7ff] p-4">
      <div className="bg-[#f5fcff] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#bfd0d9]">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-[#269dd9] mb-2">
            K-Everything Memory Game
          </h1>
          <p className="text-[#2e3538]">한국 문화를 배우는 카드 게임</p>
        </div>

        {renderContent()}

        <div className="mt-6 pt-6 border-t border-[#bfd0d9] text-center">
          <p className="text-sm font-semibold text-[#2e3538] mb-3">게임 방법</p>
          <div className="text-xs text-[#61686b] space-y-1">
            <p>• 같은 카드를 찾아 맞추세요</p>
            <p>• 스테이지를 클리어하면 다음 단계 잠금 해제</p>
            <p>• 회원가입하면 데이터가 저장됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;