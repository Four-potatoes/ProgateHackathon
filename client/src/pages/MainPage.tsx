import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

const MainPage: React.FC = () => {
  const introContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const textDivsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      const partIntroContainer = introContainerRef.current;
      const partDivs = textDivsRef.current;

      if (!header || !partIntroContainer || partDivs.length === 0) return;

      const headerHeight = header.offsetHeight;
      const partTop = partIntroContainer.offsetTop;
      const partHeight = partIntroContainer.offsetHeight;
      const scrollY = window.scrollY;

      // Exact formula from script.js
      let progress = 0;
      if (scrollY + headerHeight >= partTop && scrollY < partTop + partHeight) {
        progress = (scrollY + headerHeight - partTop) / partHeight;
      } else if (scrollY + headerHeight >= partTop + partHeight) {
        progress = 1;
      }
      progress = Math.max(0, Math.min(1, progress));

      // Background scale effect
      const scale = 1.5 - 0.4 * progress;
      partIntroContainer.style.backgroundSize = `${scale * 100}%`;

      // Text divs animation - direct translation of the original script's logic
      partDivs.forEach((div, index) => {
        if (!div) return;
        const step = 1 / partDivs.length;
        const start = step * index;
        const end = step * (index + 1);

        const isInsideContainer = scrollY + headerHeight >= partTop && scrollY < partTop + partHeight;

        if (isInsideContainer) {
          div.style.position = 'fixed';
          div.style.top = '50%';
          div.style.left = '50%';
          div.style.transform = 'translate(-50%, -50%)';
          div.style.opacity = (progress >= start && progress < end) ? '1' : '0';
        } else {
          // Reset styles when outside the container
          div.style.position = 'absolute';
          div.style.opacity = '0';
          // The initial top/left/transform from CSS will take over
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header ref={headerRef}>
        <div className="headerInner">
          <div className="logo">
            <img src="/assets/img/logo.png" alt="" />
          </div>
          <div className="moblieLogo">
            <img src="/assets/img/mobile_logo.png" alt="" />
          </div>
          <nav className="gnbContainer">
            <ul className="gnbInner">
            </ul>
          </nav>
          <ul className="util">
            <li><Link to="/welcome" style={{
        fontSize: '20px',
      }}>로그인 / 회원가입</Link></li>
          </ul>
          <nav className="hambugerNav" id="hambugerNav">
            <i className="fa-solid fa-bars"></i>
            <div className="hambugerGnbContainer">
              <div className="closeBtn" id="closeBtn"><i className="fa-solid fa-xmark"></i></div>
              <ul className="hambugerGnb">
                <li className="gnb">게임하기</li>
                <li className="gnb">내 카드</li>
                <li className="gnb">마이페이지</li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
      <main>
        <div className="visual">
          <img src="/assets/img/태극.png" alt="" />
          <img src="/assets/img/곤.png" alt="" />
          <img src="/assets/img/리.png" alt="" />
          <img src="/assets/img/감.png" alt="" />
          <img src="/assets/img/건.png" alt="" />
          <div className="visualText">
            <h1 style={{
  fontWeight: '700'  
}}>
  K-Culture Hub
              <div className="line"></div>

</h1>
            <h1 >게임을 통해 한국의 모든 것을 배울 수 있어요!</h1>
          </div>
          <div className="scrollText">
            <h3><i className="fa-solid fa-computer-mouse"></i></h3>
            <div></div>
          </div>
        </div>
        <div 
          className="partIntroContainer" 
          id="partIntroContainer"
          ref={introContainerRef}
          style={{
            backgroundImage: `url(/assets/img/introBg2.jpg)`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center center'
          }}
        >
          <div ref={el => { textDivsRef.current[0] = el; }}>
            <h1>다양한 K-Culture를 <br />
              간단한 게임을 통해 경험해보세요</h1>
          </div>
          <div ref={el => { textDivsRef.current[1] = el; }}>
            <h1>AI를 통해 <br />
              새로운 문제를 풀어보아요</h1>
          </div>
          <div ref={el => { textDivsRef.current[2] = el; }}>
            <h1>문제를 풀고 얻은 포인트로 <br />
              다양한 프로필과 캐릭터를 꾸며보세요</h1>
          </div>
          <div ref={el => { textDivsRef.current[3] = el; }}>
            <h1>한국의 모든 문화를 K-Culture Hub에서 만나보아요</h1>
          </div>
        </div>
      </main>
      <footer style={{
  backgroundColor: '#1a1a1a',
  borderTop: '1px solid #333',
  padding: '60px 20px',
}}>
  <div style={{
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '60px',
  }}>
    {/* 왼쪽: 로고 및 회사 정보 */}
    <div style={{
      flex: 1,
      minWidth: '1000px',
    }}>
      <img 
        src="./assets/img/footer_logo.png" 
        alt="Four-potatoes Logo"
        style={{
          height: '70px',
          marginBottom: '20px',
          objectFit: 'contain',
        }}
      />
      
      <div style={{
        fontSize: '13px',
        color: '#aaa',
        lineHeight: '1.8',
        marginBottom: '20px',
      }}>
        <p style={{ margin: '5px 0' }}>상호명 (주)사차원 감자들 | 대표 : 최웅식</p>
        <p style={{ margin: '5px 0' }}>개인정보책임자 : 제준혁 | 사업자등록번호 : 010-9982-6851</p>
        <p style={{ margin: '5px 0' }}>통신판매업신고번호 : 제 2025-서울서대문-01102</p>
        <p style={{ margin: '5px 0' }}>주소 : 서울 서대문구 연세로5다길 3 지층</p>
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        marginTop: '20px',
      }}>
      </div>
    </div>

    {/* 오른쪽: 링크 및 저작권 */}
    <div style={{
      flex: 1,
      minWidth: '300px',
    }}>
      {/* GitHub 링크 */}
      <div style={{
        marginBottom: '30px',
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#269dd9',
          marginBottom: '12px',
          margin: '0 0 12px 0',
        }}>
          개발팀
        </h4>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}>
          <li style={{ marginBottom: '8px' }}>
            <a 
              href="https://github.com/choius0528"
              style={{
                color: '#ccc',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#269dd9'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              최웅식: https://github.com/choius0528
            </a>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <a 
              href="https://github.com/24JunHyeock"
              style={{
                color: '#ccc',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#269dd9'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              제준혁: https://github.com/24JunHyeock
            </a>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <a 
              href="https://github.com/TaeWoongYoun"
              style={{
                color: '#ccc',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#269dd9'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              윤태웅: https://github.com/TaeWoongYoun
            </a>
          </li>
          <li>
            <a 
              href="https://github.com/choitjddn0311"
              style={{
                color: '#ccc',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#269dd9'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              최성우: https://github.com/choitjddn0311
            </a>
          </li>
        </ul>
      </div>

      {/* 행사 정보 및 저작권 */}
      <div style={{
        fontSize: '12px',
        color: '#777',
        lineHeight: '1.8',
      }}>
        <p style={{ margin: '5px 0' }}>from nov 1st to nov 2nd, at Progate Hackthon</p>
        <p style={{ margin: '5px 0' }}>created by 최웅식, 제준혁, 윤태웅, 최성우</p>
        <p style={{ margin: '5px 0' }}>copyright 2025 © Four-potatoes All rights reserved.</p>
      </div>
    </div>
  </div>

  {/* 하단 구분선 */}
  <div style={{
    maxWidth: '1280px',
    margin: '40px auto 0 auto',
    paddingTop: '20px',
    borderTop: '1px solid #333',
    textAlign: 'center',
    fontSize: '12px',
    color: '#777',
  }}>
    <p style={{ margin: 0 }}>이용약관 | 개인정보처리방침 | 고객지원</p>
  </div>
</footer>
    </>
  );
};

export default MainPage;
