import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { STAGES, AVATAR_SHOP } from '../constants/gameData';

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: string;
  item: {
    title: string;
    desc: string;
    icon: string;
  };
}

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { isGuest, playerAvatar, playerName } = useAuth();
  const { completedStages, addCoins, coins } = useGame();

  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'loading' | 'question' | 'checking' | 'result'>('loading');
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [usedItems, setUsedItems] = useState<number[]>([]);

  useEffect(() => {
    if (isGuest || completedStages.length === 0) {
      setQuizState('loading');
    } else {
      loadQuiz();
    }
  }, []);

  const loadQuiz = () => {
    const unlockedItems = STAGES.flatMap((stage) =>
      completedStages.includes(stage.id)
        ? stage.items.map((item) => ({
            ...item,
            stageName: stage.name
          }))
        : []
    );

    if (unlockedItems.length === 0) {
      setQuizState('loading');
      return;
    }

    // 사용하지 않은 아이템만 필터링
    const availableItems = unlockedItems.filter(item => !usedItems.includes(item.idx));

    // 8문제를 다 풀었거나 사용 가능한 아이템이 없으면 리셋
    if (availableItems.length === 0) {
      setUsedItems([]);
      const randomItem = unlockedItems[Math.floor(Math.random() * unlockedItems.length)];
      createQuiz(randomItem, unlockedItems);
      setUsedItems([randomItem.idx]);
      return;
    }

    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    const allItems = STAGES.flatMap((stage) => stage.items);
    const wrongOptions = allItems
      .filter((item) => item.idx !== randomItem.idx)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => item.desc);

    const options = [randomItem.desc, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentQuiz({
      question: `"${randomItem.title}"은(는) 무엇을 설명하는 것일까요?`,
      options: options,
      correctAnswer: randomItem.desc,
      item: {
        title: randomItem.title,
        desc: randomItem.desc,
        icon: randomItem.icon
      }
    });

    setUsedItems(prev => [...prev, randomItem.idx]);
    setSelectedAnswer(null);
    setQuizState('question');
  };

  const createQuiz = (randomItem: any, unlockedItems: any[]) => {
    const allItems = STAGES.flatMap((stage) => stage.items);
    const wrongOptions = allItems
      .filter((item) => item.idx !== randomItem.idx)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => item.desc);

    const options = [randomItem.desc, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentQuiz({
      question: `"${randomItem.title}"은(는) 무엇을 설명하는 것일까요?`,
      options: options,
      correctAnswer: randomItem.desc,
      item: {
        title: randomItem.title,
        desc: randomItem.desc,
        icon: randomItem.icon
      }
    });
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setQuizState('checking');

    const correct = answer === currentQuiz?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      addCoins(10);
    }

    setTimeout(() => {
      setQuizState('result');
    }, 500);
  };

  const handleNextQuiz = () => {
    setQuizCount((prev) => prev + 1);
    loadQuiz();
  };

  const currentAvatar = AVATAR_SHOP.find(a => a.id === playerAvatar);

  if (isGuest) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#e5f7ff' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #bfd0d9',
          padding: '32px 24px',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}>
            {/* 프로필 + 버튼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                {currentAvatar?.image ? (
                  <img
                    src={currentAvatar.image}
                    alt={currentAvatar.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      border: '3px solid #269dd9',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#269dd9',
                    border: '3px solid #269dd9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0,
                  }}>
                    {playerAvatar || '😊'}
                  </div>
                )}
                <span style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#2e3538',
                }}>
                  {playerName || 'Player'}
                </span>
              </div>

              <button
                onClick={() => navigate('/stages')}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                style={{
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#ffffff',
                  backgroundColor: buttonHovered ? '#1e7db0' : '#269dd9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                뒤로가기
              </button>
            </div>

            {/* 제목 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <h1 style={{
                fontSize: '40px',
                fontWeight: '700',
                color: '#269dd9',
                margin: '0',
                padding: '0',
              }}>
                AI 퀴즈
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#61686b',
                margin: '0',
                padding: '0',
              }}>
                한국 문화를 배워봅시다!
              </p>
            </div>
          </div>
        </div>

        <main style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 24px',
        }}>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '20px',
              color: '#269dd9',
              fontWeight: '700',
              marginBottom: '16px',
              margin: '0 0 16px 0',
            }}>로그인 필요</p>
            <p style={{
              fontSize: '16px',
              color: '#2e3538',
              marginBottom: '24px',
              margin: '0 0 24px 0',
            }}>
              AI 퀴즈는 로그인한 사용자만 이용할 수 있습니다.
            </p>
            <button
              onClick={() => navigate('/')}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7db0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#269dd9'}
              style={{
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#269dd9',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              로그인하러 가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (completedStages.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#e5f7ff' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #bfd0d9',
          padding: '32px 24px',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}>
            {/* 프로필 + 버튼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                {currentAvatar?.image ? (
                  <img
                    src={currentAvatar.image}
                    alt={currentAvatar.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      border: '3px solid #269dd9',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#269dd9',
                    border: '3px solid #269dd9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0,
                  }}>
                    {playerAvatar || '😊'}
                  </div>
                )}
                <span style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#2e3538',
                }}>
                  {playerName || 'Player'}
                </span>
              </div>

              <button
                onClick={() => navigate('/stages')}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                style={{
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#ffffff',
                  backgroundColor: buttonHovered ? '#1e7db0' : '#269dd9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                뒤로가기
              </button>
            </div>

            {/* 제목 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <h1 style={{
                fontSize: '40px',
                fontWeight: '700',
                color: '#269dd9',
                margin: '0',
                padding: '0',
              }}>
                AI 퀴즈
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#61686b',
                margin: '0',
                padding: '0',
              }}>
                한국 문화를 배워봅시다!
              </p>
            </div>
          </div>
        </div>

        <main style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 24px',
        }}>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '20px',
              color: '#269dd9',
              fontWeight: '700',
              marginBottom: '16px',
              margin: '0 0 16px 0',
            }}>스테이지 클리어 필요</p>
            <p style={{
              fontSize: '16px',
              color: '#2e3538',
              marginBottom: '24px',
              margin: '0 0 24px 0',
            }}>
              퀴즈를 풀려면 먼저 스테이지를 하나 이상 클리어해야 합니다.
            </p>
            <button
              onClick={() => navigate('/stages')}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7db0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#269dd9'}
              style={{
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#269dd9',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              게임 시작하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5f7ff' }}>
      {/* 헤더 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #bfd0d9',
        padding: '32px 24px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}>
          {/* 프로필 + 버튼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              {currentAvatar?.image ? (
                <img
                  src={currentAvatar.image}
                  alt={currentAvatar.name}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '3px solid #269dd9',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#269dd9',
                  border: '3px solid #269dd9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                }}>
                  {playerAvatar || '😊'}
                </div>
              )}
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2e3538',
              }}>
                {playerName || 'Player'}
              </span>
            </div>

            <button
              onClick={() => navigate('/stages')}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: buttonHovered ? '#1e7db0' : '#269dd9',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              뒤로가기
            </button>
          </div>

          {/* 제목 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <h1 style={{
              fontSize: '40px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0',
              padding: '0',
            }}>
              AI 퀴즈
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#61686b',
              margin: '0',
              padding: '0',
            }}>
              한국 문화를 배워봅시다!
            </p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        <div style={{
          backgroundColor: '#f5fcff',
          border: '2px solid #269dd9',
          borderRadius: '8px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {/* 진행 상황 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            <div>
              <p style={{
                fontSize: '14px',
                color: '#61686b',
                margin: '0',
              }}>객관식 퀴즈</p>
              <p style={{
                color: '#269dd9',
                fontWeight: '700',
                margin: '8px 0 0 0',
              }}>{quizCount + 1}번째 문제</p>
            </div>
            <div style={{
              backgroundColor: '#269dd9',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '700',
            }}>
              {quizCount}/8 완료
            </div>
          </div>

          {/* 진행 바 */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e7eb',
            borderRadius: '9999px',
            marginBottom: '32px',
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#269dd9',
                width: `${(quizCount / 8) * 100}%`,
                transition: 'width 0.5s ease',
              }}
            />
          </div>

          {/* 퀴즈 상태별 렌더링 */}
          {quizState === 'loading' ? (
            <div style={{
              padding: '48px 0',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'inline-block',
                animation: 'spin 1s linear infinite',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                borderTop: '4px solid #269dd9',
                borderRight: '4px solid #269dd9',
                borderBottom: '4px solid #269dd9',
                borderLeft: '4px solid #e0e7eb',
                marginBottom: '16px',
              }}></div>
              <p style={{
                color: '#61686b',
                margin: '0',
              }}>퀴즈 준비 중...</p>
            </div>
          ) : quizState === 'question' && currentQuiz ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}>
              {/* 질문 */}
              <div style={{
                backgroundColor: '#ffffff',
                borderLeft: '4px solid #269dd9',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#61686b',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}>문제</p>
                <p style={{
                  color: '#269dd9',
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0',
                }}>{currentQuiz.question}</p>
              </div>

              {/* 선택지 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {currentQuiz.options.map((option, idx) => {
                  const labels = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        border: '2px solid',
                        backgroundColor: selectedAnswer === option ? '#269dd9' : '#ffffff',
                        borderColor: selectedAnswer === option ? '#269dd9' : '#bfd0d9',
                        color: selectedAnswer === option ? '#ffffff' : '#2e3538',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAnswer !== option) {
                          e.currentTarget.style.backgroundColor = '#e0e7eb';
                          e.currentTarget.style.borderColor = '#269dd9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAnswer !== option) {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#bfd0d9';
                        }
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: selectedAnswer === option ? 'rgba(255,255,255,0.2)' : '#e0e7eb',
                        fontWeight: '700',
                        fontSize: '14px',
                      }}>
                        {labels[idx]}
                      </div>
                      <span style={{ flex: 1 }}>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* 정답 확인 버튼 */}
              <button
                onClick={() => selectedAnswer && handleSelectAnswer(selectedAnswer)}
                disabled={!selectedAnswer}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '16px',
                  color: selectedAnswer ? '#ffffff' : '#61686b',
                  backgroundColor: selectedAnswer ? '#33ccb3' : '#e7ecef',
                  border: 'none',
                  cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedAnswer) {
                    e.currentTarget.style.backgroundColor = '#29a895';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswer) {
                    e.currentTarget.style.backgroundColor = '#33ccb3';
                  }
                }}
              >
                정답 확인
              </button>
            </div>
          ) : quizState === 'checking' || quizState === 'result' ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              textAlign: 'center',
              padding: '24px 0',
            }}>
              {/* 결과 표시 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                <div>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    margin: '0',
                    color: isCorrect ? '#33ccb3' : '#e61919',
                  }}>
                    {isCorrect ? '정답입니다!' : '틀렸습니다!'}
                  </p>
                  {isCorrect && (
                    <p style={{
                      fontSize: '18px',
                      color: '#269dd9',
                      fontWeight: '600',
                      margin: '8px 0 0 0',
                    }}>
                      +10 코인 획득! (총: {coins}코인)
                    </p>
                  )}
                </div>

                {/* 정답 표시 */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #bfd0d9',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '8px',
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#61686b',
                    margin: '0 0 8px 0',
                  }}>정답:</p>
                  <p style={{
                    color: '#269dd9',
                    fontWeight: '600',
                    margin: '0',
                  }}>{currentQuiz?.correctAnswer}</p>
                </div>
              </div>

              {/* 다음 문제 버튼 */}
              {quizCount < 8 ? (
                <button
                  onClick={handleNextQuiz}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '16px',
                    color: '#ffffff',
                    backgroundColor: '#269dd9',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7db0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#269dd9'}
                >
                  다음 문제
                </button>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  <p style={{
                    fontSize: '18px',
                    color: '#33ccb3',
                    fontWeight: '700',
                    margin: '0',
                  }}>오늘의 8문제를 완료했습니다!</p>
                  <button
                    onClick={() => navigate('/stages')}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '16px',
                      color: '#ffffff',
                      backgroundColor: '#269dd9',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7db0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#269dd9'}
                  >
                    게임으로 돌아가기
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* 정보 섹션 */}
        <div style={{
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#61686b',
              margin: '0',
            }}>정답: +10 코인</p>
          </div>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#61686b',
              margin: '0',
            }}>오답: 재시도</p>
          </div>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#61686b',
              margin: '0',
            }}>보유: {coins} 코인</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;