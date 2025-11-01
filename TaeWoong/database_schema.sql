-- K-Everything Memory Game Database Schema
-- XAMPP MySQL 데이터베이스

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

-- 세션 테이블
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT,
    INDEX idx_expires (expires)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Database schema created successfully!' AS Status;
