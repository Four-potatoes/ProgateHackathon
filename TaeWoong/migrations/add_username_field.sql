-- Migration: Add username field to users table
-- Date: 2025-11-02
-- Description: 아이디(username) 필드 추가 - 로그인 시 사용

-- 1. users 테이블에 username 컬럼 추가
ALTER TABLE users
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE AFTER email;

-- 2. 기존 데이터에 임시 username 설정 (email의 @ 앞부분 사용)
UPDATE users
SET username = SUBSTRING_INDEX(email, '@', 1)
WHERE username IS NULL;

-- 3. username을 NOT NULL로 변경
ALTER TABLE users
MODIFY COLUMN username VARCHAR(50) UNIQUE NOT NULL;

-- 4. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_username ON users(username);

-- 확인
SELECT id, username, email, name FROM users LIMIT 5;
