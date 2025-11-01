const mysql = require('mysql2');
require('dotenv').config();

// MySQL 연결 풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'k_everything_game',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Promise 기반 연결
const promisePool = pool.promise();

// 테이블 자동 생성 함수
const initializeTables = async () => {
    try {
        // 사용자 테이블
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255),
                name VARCHAR(100) NOT NULL,
                avatar VARCHAR(10) DEFAULT '😊',
                profile_picture VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 게임 진행도 테이블
        await promisePool.query(`
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 랭킹 테이블
        await promisePool.query(`
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 세션 테이블
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                session_id VARCHAR(128) PRIMARY KEY,
                expires INT UNSIGNED NOT NULL,
                data MEDIUMTEXT,
                INDEX idx_expires (expires)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('✅ 데이터베이스 테이블 초기화 완료!');
    } catch (error) {
        console.error('❌ 테이블 생성 실패:', error.message);
    }
};

// 연결 테스트 및 테이블 초기화
pool.getConnection(async (err, connection) => {
    if (err) {
        console.error('❌ MySQL 연결 실패:', err.message);
        console.error('XAMPP MySQL이 실행 중인지 확인하세요!');
        return;
    }
    console.log('✅ MySQL 데이터베이스 연결 성공!');
    connection.release();

    // 테이블 자동 생성
    await initializeTables();
});

module.exports = { pool, promisePool };
