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

// 연결 테스트
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL 연결 실패:', err.message);
        console.error('XAMPP MySQL이 실행 중인지 확인하세요!');
        return;
    }
    console.log('✅ MySQL 데이터베이스 연결 성공!');
    connection.release();
});

module.exports = { pool, promisePool };
