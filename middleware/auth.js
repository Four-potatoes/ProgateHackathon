const jwt = require('jsonwebtoken');

// JWT 토큰 검증 미들웨어
const authenticateToken = (req, res, next) => {
    // 세션에서 사용자 확인 (우선순위 1)
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }

    // Authorization 헤더에서 토큰 확인 (우선순위 2)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: '로그인이 필요합니다.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Forbidden',
                message: '유효하지 않은 토큰입니다.'
            });
        }
        req.user = user;
        next();
    });
};

// 선택적 인증 미들웨어
const optionalAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user;
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    optionalAuth
};
