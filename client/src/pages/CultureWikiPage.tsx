import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AVATAR_SHOP } from '../constants/gameData';

interface CultureContent {
  title: string;
  subtitle: string;
  description: string;
  history: string;
  interesting: string[];
  relatedItems: string[];
}

const CultureWikiPage: React.FC = () => {
  const navigate = useNavigate();
  const { playerAvatar, playerName } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string>('김장');
  const [searchQuery, setSearchQuery] = useState('');
  const [buttonHovered, setButtonHovered] = useState(false);

  const cultureWiki: Record<string, CultureContent> = {
    '김장': {
      title: '김장 (Kimjang)',
      subtitle: '한국의 겨울 문화유산',
      description: '김장은 가을에서 겨울로 넘어가는 계절에 배추, 무 등을 이용해 여러 반찬을 만들어 겨울 동안 먹을 수 있도록 준비하는 한국의 전통적인 음식 준비 과정입니다.',
      history: '김장은 조선 시대부터 시작되었으며, 가족과 이웃이 함께 모여 음식을 나누는 한국 문화의 정수입니다. 2013년 유네스코 무형문화유산으로 등재되었습니다.',
      interesting: [
        '한 가정에서 한 번에 100kg 이상의 배추를 준비합니다',
        '김장은 단순한 음식 준비가 아닌 가족과 공동체의 결합을 나타냅니다',
        '매년 11월 중순~12월 초에 전국적으로 김장 문화가 펼쳐집니다',
        '젓갈, 고추, 마늘 등 다양한 재료가 사용됩니다'
      ],
      relatedItems: ['비빔밥', '김치', '한식 문화']
    },
    '석굴암': {
      title: '석굴암 (Seokguram)',
      subtitle: '불국사의 숨겨진 보석',
      description: '석굴암은 8세기 신라의 건축 기술을 대표하는 불교 건축물로, 불국사 위쪽 산 정상에 위치한 석조 궁전입니다. 팔만대장경과 같은 시대에 지어졌습니다.',
      history: '751년 신라의 재상 김대성이 건설을 시작하여 774년에 완성되었습니다. 신라의 과학 기술과 예술의 최고봉을 보여주는 유산입니다.',
      interesting: [
        '원형 계획의 건물로 한국 고대 건축의 우수성을 보여줍니다',
        '360개의 화강암 블록으로 만들어진 정교한 건축물입니다',
        '1966년 국보 24호로 지정되었습니다',
        '동궁과 서궁으로 나뉜 독특한 구조입니다'
      ],
      relatedItems: ['불국사', '신라 문명', '한국 건축']
    },
    '수원화성': {
      title: '수원화성 (Hwaseong Fortress)',
      subtitle: '조선시대의 최고 건축물',
      description: '수원화성은 18세기 조선시대 정조 국왕이 축조한 성곽으로, 동양과 서양의 건축 기술이 결합된 독특한 건축물입니다.',
      history: '1794년부터 1796년까지 약 2년 반에 걸쳐 완성되었습니다. 약 5.74km의 성곽으로 구성되어 있으며, 전략적 방어 체계를 갖추고 있습니다.',
      interesting: [
        '동양식과 서양식 건축 기법이 결합된 유일한 요새입니다',
        '총 1,866개의 포혈(포를 쏠 수 있는 구멍)이 있습니다',
        '1997년 유네스코 세계문화유산으로 등재되었습니다',
        '현재도 많은 관광객들이 방문하는 명소입니다'
      ],
      relatedItems: ['정조 국왕', '조선 건축', '한국 역사']
    },
    '종묘': {
      title: '종묘 (Jongmyo Shrine)',
      subtitle: '왕실의 신성한 공간',
      description: '종묘는 조선 왕조의 역대 왕과 왕비의 신위를 모신 신성한 종사(廟)입니다. 동양 최대 규모의 유교 신사로 알려져 있습니다.',
      history: '1395년 태조 이성계가 창건하였으며, 약 600년 이상 왕실의 제향 중심지였습니다. 유교 문화의 정신을 지켜온 중요한 문화유산입니다.',
      interesting: [
        '세계에서 가장 오래되고 가장 높은 위상의 유교 신사입니다',
        '매년 5월과 10월에 종묘제례가 봉행됩니다',
        '1995년 유네스코 세계문화유산으로 등재되었습니다',
        '한국 전통 예술의 보고로 인정받고 있습니다'
      ],
      relatedItems: ['유교 문화', '조선 왕조', '한국 종교']
    },
    '창덕궁': {
      title: '창덕궁 (Changdeokgung Palace)',
      subtitle: '조선의 아름다운 궁궐',
      description: '창덕궁은 1405년 태종이 건설한 조선시대의 궁궐로, 자연과의 조화를 이룬 아름다운 건축물입니다.',
      history: '약 270년간 조선 왕실의 중심 궁궐로 사용되었으며, 임진왜란 이후 재건되어 지금까지 보존되고 있습니다.',
      interesting: [
        '비원(후원)은 한국 정원 건축의 최고 걸작입니다',
        '자연 지형을 최대한 활용한 설계가 특징입니다',
        '1997년 유네스코 세계문화유산으로 등재되었습니다',
        '봄의 벚꽃이 특히 아름다운 명소입니다'
      ],
      relatedItems: ['조선 궁궐', '한국 건축', '서울 문화유산']
    },
    '탈춤': {
      title: '탈춤 (Tal Dance)',
      subtitle: '전통 가면극의 예술',
      description: '탈춤은 탈을 쓰고 추는 전통 연희로, 한국의 고유한 연극 문화를 대표합니다. 양반을 풍자하고 민중의 감정을 표현합니다.',
      history: '삼국시대부터 시작된 탈춤은 조선시대에 널리 성행했으며, 지역마다 독특한 특색을 가지고 있습니다.',
      interesting: [
        '각 탈은 인물의 성격과 신분을 나타냅니다',
        '양반, 양반 아내, 노승, 낭자 등 다양한 인물이 등장합니다',
        '2001년 유네스코 인류 구전 및 무형유산 걸작으로 지정되었습니다',
        '현재도 각 지역에서 전승되고 있습니다'
      ],
      relatedItems: ['한국 전통 예술', '민속 문화', '한국 연극']
    }
  };

  const allItems = Object.keys(cultureWiki);
  const filteredItems = allItems.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const content = selectedItem && cultureWiki[selectedItem] ? cultureWiki[selectedItem] : null;
  const currentAvatar = AVATAR_SHOP.find(a => a.id === playerAvatar);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5f7ff' }}>
      {/* 헤더 */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #bfd0d9',
        padding: '24px 32px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* 프로필 | 제목 | 버튼 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '60px',
        }}>
          {/* 왼쪽 - 프로필 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '200px',
          }}>
            {currentAvatar?.image ? (
              <img
                src={currentAvatar.image}
                alt={currentAvatar.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '3px solid #269dd9',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#269dd9',
                border: '3px solid #269dd9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                {playerAvatar || '😊'}
              </div>
            )}
            <span style={{
              fontWeight: '700',
              color: '#2e3538',
              fontSize: '18px',
            }}>
              {playerName || 'Player'}
            </span>
          </div>

          {/* 중앙 - 제목 */}
          <div style={{
            textAlign: 'center',
            flex: 1,
          }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0',
              padding: '0',
            }}>
              한국 문화 백과사전
            </h1>
          </div>

          {/* 오른쪽 - 버튼 */}
          <div style={{
            minWidth: '200px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={() => navigate('/stages')}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              style={{
                padding: '10px 28px',
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
              돌아가기
            </button>
          </div>
        </div>
      </header>

      {/* 검색 섹션 */}
      <div style={{
        backgroundColor: '#e5f7ff',
        padding: '16px 32px',
        borderBottom: '1px solid #bfd0d9',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <input
            type="text"
            id="wiki-search"
            name="wiki-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색..."
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              border: '2px solid #bfd0d9',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#2e3538',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#269dd9'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#bfd0d9'}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 16px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '32px',
        }}>
          {/* 목록 */}
          <div>
            <div style={{
              backgroundColor: '#f5fcff',
              border: '2px solid #bfd0d9',
              borderRadius: '12px',
              padding: '24px',
              position: 'sticky',
              top: '24px',
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#269dd9',
                marginBottom: '16px',
                margin: '0 0 16px 0',
              }}>
                항목 목록
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedItem(item)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        border: '2px solid',
                        backgroundColor: selectedItem === item ? '#269dd9' : '#ffffff',
                        borderColor: selectedItem === item ? '#269dd9' : '#bfd0d9',
                        color: selectedItem === item ? '#ffffff' : '#2e3538',
                        fontWeight: selectedItem === item ? '700' : '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedItem !== item) {
                          e.currentTarget.style.backgroundColor = '#e5f7ff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedItem !== item) {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      {cultureWiki[item].title}
                    </button>
                  ))
                ) : (
                  <p style={{
                    color: '#61686b',
                    fontSize: '14px',
                    margin: '0',
                  }}>
                    검색 결과가 없습니다
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 상세 내용 */}
          <div>
            {content ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}>
                {/* 제목 */}
                <div style={{
                  backgroundColor: '#f5fcff',
                  border: '2px solid #bfd0d9',
                  borderRadius: '12px',
                  padding: '32px',
                }}>
                  <h2 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#269dd9',
                    marginBottom: '8px',
                    margin: '0 0 8px 0',
                  }}>
                    {content.title}
                  </h2>
                  <p style={{
                    fontSize: '18px',
                    color: '#61686b',
                    margin: '0',
                  }}>
                    {content.subtitle}
                  </p>
                </div>

                {/* 설명 */}
                <div style={{
                  backgroundColor: '#f5fcff',
                  border: '2px solid #bfd0d9',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#269dd9',
                    marginBottom: '12px',
                    margin: '0 0 12px 0',
                  }}>
                    설명
                  </h3>
                  <p style={{
                    color: '#2e3538',
                    lineHeight: '1.6',
                    margin: '0',
                  }}>
                    {content.description}
                  </p>
                </div>

                {/* 역사 */}
                <div style={{
                  backgroundColor: '#f5fcff',
                  border: '2px solid #bfd0d9',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#269dd9',
                    marginBottom: '12px',
                    margin: '0 0 12px 0',
                  }}>
                    역사
                  </h3>
                  <p style={{
                    color: '#2e3538',
                    lineHeight: '1.6',
                    margin: '0',
                  }}>
                    {content.history}
                  </p>
                </div>

                {/* 흥미로운 사실 */}
                <div style={{
                  backgroundColor: '#f5fcff',
                  border: '2px solid #bfd0d9',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#269dd9',
                    marginBottom: '16px',
                    margin: '0 0 16px 0',
                  }}>
                    흥미로운 사실
                  </h3>
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    margin: '0',
                    paddingLeft: '0',
                  }}>
                    {content.interesting.map((fact, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          color: '#2e3538',
                          fontSize: '14px',
                          listStyle: 'none',
                        }}
                      >
                        <span style={{
                          color: '#33ccb3',
                          fontWeight: '700',
                          flexShrink: 0,
                        }}>
                          •
                        </span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 관련 항목 */}
                {content.relatedItems.length > 0 && (
                  <div style={{
                    backgroundColor: '#f5fcff',
                    border: '2px solid #bfd0d9',
                    borderRadius: '12px',
                    padding: '24px',
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#269dd9',
                      marginBottom: '16px',
                      margin: '0 0 16px 0',
                    }}>
                      관련 항목
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}>
                      {content.relatedItems.map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#ffffff',
                            border: '2px solid #bfd0d9',
                            borderRadius: '9999px',
                            color: '#269dd9',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                backgroundColor: '#f5fcff',
                border: '2px solid #bfd0d9',
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '18px',
                  color: '#61686b',
                  margin: '0',
                }}>
                  항목을 선택하세요
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CultureWikiPage;