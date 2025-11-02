const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { promisePool } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// 회원가입
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, name, avatar } = req.body;

        if (!username || !email || !password || !name) {
            return res.status(400).json({
                error: 'Bad Request',
                message: '아이디, 이메일, 비밀번호, 이름을 모두 입력해주세요.'
            });
        }

        // 아이디 중복 체크
        const [existingUsername] = await promisePool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUsername.length > 0) {
            return res.status(400).json({
                error: 'Username Already Exists',
                message: '이미 사용 중인 아이디입니다.'
            });
        }

        // 이메일 중복 체크
        const [existingEmail] = await promisePool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(400).json({
                error: 'Email Already Exists',
                message: '이미 사용 중인 이메일입니다.'
            });
        }

        // 비밀번호 해시
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        const [result] = await promisePool.query(
            'INSERT INTO users (username, email, google_id, name, avatar) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, name, avatar || '😊']
        );

        const userId = result.insertId;

        // 초기 게임 진행도 생성
        await promisePool.query(
            'INSERT INTO game_progress (user_id, unlocked_stages, completed_stages, player_avatar) VALUES (?, ?, ?, ?)',
            [userId, JSON.stringify([1]), JSON.stringify([]), avatar || '😊']
        );

        const user = {
            id: userId,
            username,
            email,
            name,
            avatar: avatar || '😊',
            coins: 0
        };

        // JWT 토큰 생성
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        req.session.user = user;

        res.json({
            success: true,
            user,
            token,
            message: '회원가입이 완료되었습니다.'
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '회원가입에 실패했습니다.'
        });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Bad Request',
                message: '아이디와 비밀번호를 입력해주세요.'
            });
        }

        // 사용자 조회 (아이디로)
        const [users] = await promisePool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: '아이디 또는 비밀번호가 잘못되었습니다.'
            });
        }

        const user = users[0];

        // 비밀번호 확인
        const passwordMatch = await bcrypt.compare(password, user.google_id);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: '아이디 또는 비밀번호가 잘못되었습니다.'
            });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            avatar: user.avatar
        };

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                coins: user.coins
            },
            token,
            message: '로그인되었습니다.'
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '로그인에 실패했습니다.'
        });
    }
});

// 간단 로그인 (비회원, DB 저장 안됨)
router.post('/simple-login', async (req, res) => {
    try {
        const { name, avatar } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Bad Request',
                message: '이름을 입력해주세요.'
            });
        }

        const user = {
            id: null,
            name,
            avatar: avatar || '😊',
            isGuest: true
        };

        res.json({
            success: true,
            user,
            message: '게스트 모드로 플레이합니다. (데이터 저장 안됨)'
        });
    } catch (error) {
        console.error('Simple Login Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '로그인에 실패했습니다.'
        });
    }
});

// 현재 사용자 정보
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await promisePool.query(
            'SELECT id, email, name, avatar, coins, profile_picture, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: '사용자를 찾을 수 없습니다.'
            });
        }

        const user = users[0];
        const [progress] = await promisePool.query(
            'SELECT * FROM game_progress WHERE user_id = ?',
            [user.id]
        );

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                coins: user.coins,
                profilePicture: user.profile_picture,
                createdAt: user.created_at
            },
            progress: progress[0] || null
        });
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '사용자 정보를 가져오는데 실패했습니다.'
        });
    }
});

// 로그아웃
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                error: 'Logout Failed',
                message: '로그아웃에 실패했습니다.'
            });
        }
        res.clearCookie('k_everything_session');
        res.json({
            success: true,
            message: '로그아웃되었습니다.'
        });
    });
});

module.exports = router;
