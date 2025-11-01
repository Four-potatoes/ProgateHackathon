-- K-Everything Memory Game Database Schema
-- XAMPP MySQL 데이터베이스

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS k_everything_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE k_everything_game;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '😊',
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_google_id (google_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 게임 진행도 테이블
CREATE TABLE IF NOT EXISTS game_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    current_stage INT DEFAULT 1,
    unlocked_stages JSON DEFAULT ('[]'),
    completed_stages JSON DEFAULT ('[]'),
    player_avatar VARCHAR(10) DEFAULT '😊',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_progress (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 랭킹 테이블
CREATE TABLE IF NOT EXISTS rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stage_id INT NOT NULL,
    stage_name VARCHAR(50) NOT NULL,
    moves INT NOT NULL,
    completion_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_stage_moves (stage_id, moves),
    INDEX idx_user_stage (user_id, stage_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 세션 테이블 (express-session 용)
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT,
    INDEX idx_expires (expires)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 초기 테스트 데이터 (선택사항)
-- INSERT INTO users (email, name, avatar) VALUES
-- ('test@example.com', '테스트 유저', '😊');

-- INSERT INTO game_progress (user_id, unlocked_stages, completed_stages) VALUES
-- (1, JSON_ARRAY(1), JSON_ARRAY());

-- 뷰: 랭킹 보드 (사용자 정보 포함)
CREATE OR REPLACE VIEW ranking_board AS
SELECT
    r.id,
    r.stage_id,
    r.stage_name,
    r.moves,
    r.completion_time,
    r.created_at,
    u.name AS player_name,
    u.avatar AS player_avatar,
    u.profile_picture
FROM rankings r
INNER JOIN users u ON r.user_id = u.id
ORDER BY r.stage_id, r.moves ASC, r.completion_time ASC;

-- 스토어드 프로시저: 사용자별 최고 기록 조회
DELIMITER //
CREATE PROCEDURE GetUserBestRecords(IN userId INT)
BEGIN
    SELECT
        stage_id,
        stage_name,
        MIN(moves) as best_moves,
        MIN(completion_time) as best_time
    FROM rankings
    WHERE user_id = userId
    GROUP BY stage_id, stage_name
    ORDER BY stage_id;
END //
DELIMITER ;

-- 스토어드 프로시저: 스테이지별 Top 10 랭킹
DELIMITER //
CREATE PROCEDURE GetStageRanking(IN stageId INT)
BEGIN
    SELECT
        r.id,
        r.moves,
        r.completion_time,
        r.created_at,
        u.name AS player_name,
        u.avatar AS player_avatar,
        u.profile_picture,
        RANK() OVER (ORDER BY r.moves ASC, r.completion_time ASC) AS rank_position
    FROM rankings r
    INNER JOIN users u ON r.user_id = u.id
    WHERE r.stage_id = stageId
    ORDER BY r.moves ASC, r.completion_time ASC
    LIMIT 10;
END //
DELIMITER ;

-- 권한 설정 (로컬 개발용)
GRANT ALL PRIVILEGES ON k_everything_game.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- 완료 메시지
SELECT 'Database schema created successfully!' AS Status;
