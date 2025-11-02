import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

// Typewriter effect component
const Typewriter: React.FC = () => {
  const texts = [
    "안녕하세요!",
    "Welcome!",
    "Bonjour!",
    "こんにちは!",
    "你好!",
    "Xin chào!"
  ];
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[index];
      if (isDeleting) {
        setText(currentText.substring(0, text.length - 1));
      } else {
        setText(currentText.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }
    };

    const typingSpeed = isDeleting ? 100 : 200;
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, index, texts]);

  return <h1>{text}<span className="cursor">|</span></h1>;
};

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [formType, setFormType] = useState('login'); // 'login' or 'signup'

  // Form states
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !password.trim()) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await login(id.trim(), password.trim());
      alert('로그인 성공! 🎉');
      navigate('/stages');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
      alert('로그인 실패: ' + errorMsg);
      console.error('로그인 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !id.trim() || !email.trim() || !password.trim()) {
      alert('이름, 아이디, 이메일, 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    try {
      await signup(id.trim(), email.trim(), password.trim(), name.trim(), '😊');
      alert('회원가입이 완료되었습니다! 🎉');
      navigate('/stages');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
      alert('회원가입 실패: ' + errorMsg);
      console.error('회원가입 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <img src="/assets/img/태극.png" alt="" />
      <img src="/assets/img/건.png" alt="" />
      <img src="/assets/img/감.png" alt="" />
      <img src="/assets/img/곤.png" alt="" />
      <img src="/assets/img/리.png" alt="" />

      <div className="mainContent">
        <div className="inner">
          <form id="formBox" onSubmit={formType === 'login' ? handleLogin : handleSignup}>
            <div className="logo">
              <img src="/assets/img/logo.png" alt="" />
            </div>

            <div className="utilTab">
              <div className="utilTabInner">
                <button type="button" id="loginTab" className={formType === 'login' ? 'active' : ''} onClick={() => setFormType('login')}>로그인</button>
                <button type="button" id="signupTab" className={formType === 'signup' ? 'active' : ''} onClick={() => setFormType('signup')}>회원가입</button>
              </div>
            </div>

            {/* 로그인 폼 */}
            <div className={`formInner ${formType === 'login' ? '' : 'hidden'}`} id="loginForm">
              <div className="inputContainer">
                <h3>아이디</h3>
                <input type="text" name="id" placeholder="아이디를 입력해주세요." value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="inputContainer">
                <h3>비밀번호</h3>
                <input type="password" name="pw" placeholder="비밀번호를 입력해주세요." value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="buttonContainer">
                <button type="submit" disabled={loading}>{loading ? '로딩 중...' : '로그인'}</button>
              </div>
            </div>

            {/* 회원가입 폼 */}
            <div className={`formInner ${formType === 'signup' ? '' : 'hidden'}`} id="signupForm">
              <div className="inputContainer">
                <h3>이름</h3>
                <input type="text" name="name" placeholder="이름을 입력해주세요." value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="inputContainer">
                <h3>아이디</h3>
                <input type="text" name="signupId" placeholder="아이디를 입력해주세요." value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="inputContainer">
                <h3>이메일</h3>
                <input type="email" name="signupEmail" placeholder="이메일을 입력해주세요." value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="inputContainer">
                <h3>비밀번호</h3>
                <input type="password" name="signupPw" placeholder="비밀번호를 입력해주세요." value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="buttonContainer">
                <button type="submit" disabled={loading}>{loading ? '로딩 중...' : '회원가입'}</button>
              </div>
            </div>
          </form>
        </div>

        <div className="rightSide">
          <Typewriter />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;