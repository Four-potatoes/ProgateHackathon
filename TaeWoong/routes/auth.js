const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Google OAuth 로그인 시작
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Google OAuth 콜백
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const token = jwt.sign(
                { id: req.user.id, email: req.user.email, name: req.user.name },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            req.session.user = req.user;
            res.redirect(`/game?token=${token}`);
        } catch (error) {
            console.error('OAuth Callback Error:', error);
            res.redirect('/game?error=auth_failed');
        }
    }
);

// 간단 로그인
router.post('/simple-login', async (req, res) => {
    try {
        const { name, avatar } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Bad Request',
                message: '이름을 입력해주세요.'
            });
        }

        const tempEmail = `local_${Date.now()}@k-everything.local`;

        const [result] = await promisePool.query(
            'INSERT INTO users (email, name, avatar) VALUES (?, ?, ?)',
            [tempEmail, name, avatar || '😊']
        );

        const userId = result.insertId;

        await promisePool.query(
            'INSERT INTO game_progress (user_id, unlocked_stages, completed_stages, player_avatar) VALUES (?, ?, ?, ?)',
            [userId, JSON.stringify([1]), JSON.stringify([]), avatar || '😊']
        );

        const user = {
            id: userId,
            email: tempEmail,
            name,
            avatar: avatar || '😊',
            isLocal: true
        };

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        req.session.user = user;

        res.json({
            success: true,
            user,
            token,
            message: '로컬 사용자로 로그인되었습니다.'
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
            'SELECT id, google_id, email, name, avatar, profile_picture, created_at FROM users WHERE id = ?',
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
                googleId: user.google_id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
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
