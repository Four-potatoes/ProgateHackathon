-- Migration: Add coins and purchased_avatars to game_progress table
-- Date: 2025-11-02
-- Description: 플레이어별 코인과 구매한 아바타 저장을 위한 컬럼 추가

-- 1. game_progress 테이블에 coins 컬럼 추가 (없으면)
ALTER TABLE game_progress
ADD COLUMN IF NOT EXISTS coins INT DEFAULT 0 AFTER player_avatar;

-- 2. game_progress 테이블에 purchased_avatars 컬럼 추가 (없으면)
ALTER TABLE game_progress
ADD COLUMN IF NOT EXISTS purchased_avatars JSON DEFAULT NULL AFTER coins;

-- 3. 기존 데이터에 기본값 설정
UPDATE game_progress
SET coins = 0
WHERE coins IS NULL;

UPDATE game_progress
SET purchased_avatars = JSON_ARRAY('😊')
WHERE purchased_avatars IS NULL;

-- 4. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_user_id ON game_progress(user_id);

-- 확인 쿼리
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'game_progress'
ORDER BY ORDINAL_POSITION;
