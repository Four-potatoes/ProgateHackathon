const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

const { pool } = require('./config/db');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

const app = express();
const PORT = process.env.PORT || 5000;

// ===================================
// 미들웨어 설정
// ===================================

// CORS 설정
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 정적 파일 제공 (HTML 게임)
app.use('/game', express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Session Store (MySQL)
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
}, pool);

// Session 설정
app.use(session({
    key: 'k_everything_session',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// ===================================
// 라우트
// ===================================

// 기본 라우트
app.get('/', (req, res) => {
    res.json({
        message: 'K-Everything Memory Game API',
        version: '1.0.0',
        endpoints: {
            game: '/game',
            api: {
                auth: '/api/auth',
                game: '/api/game'
            }
        },
        status: 'running'
    });
});

// HTML 게임 접속
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: '요청한 엔드포인트를 찾을 수 없습니다.',
        path: req.path
    });
});

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ===================================
// 서버 시작
// ===================================

app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   K-Everything Memory Game Backend API    ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`🎮 HTML Game: http://localhost:${PORT}/game`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME}`);
    console.log(`🔐 Session Store: MySQL`);
    console.log('');
    console.log('Available endpoints:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/game`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   POST http://localhost:${PORT}/api/auth/simple-login`);
    console.log(`   GET  http://localhost:${PORT}/api/game/progress`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('');
});

module.exports = app;
