const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { promisePool } = require('./db');

// Passport Google OAuth 전략 설정
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const profilePicture = profile.photos[0]?.value || null;

        // 사용자 조회
        const [existingUsers] = await promisePool.query(
            'SELECT * FROM users WHERE google_id = ? OR email = ?',
            [googleId, email]
        );

        if (existingUsers.length > 0) {
            // 기존 사용자 업데이트
            const user = existingUsers[0];
            await promisePool.query(
                'UPDATE users SET google_id = ?, name = ?, profile_picture = ?, updated_at = NOW() WHERE id = ?',
                [googleId, name, profilePicture, user.id]
            );

            return done(null, {
                id: user.id,
                googleId,
                email,
                name,
                avatar: user.avatar,
                profilePicture
            });
        } else {
            // 새 사용자 생성
            const [result] = await promisePool.query(
                'INSERT INTO users (google_id, email, name, profile_picture) VALUES (?, ?, ?, ?)',
                [googleId, email, name, profilePicture]
            );

            const newUserId = result.insertId;

            // 초기 게임 진행도 생성
            await promisePool.query(
                'INSERT INTO game_progress (user_id, unlocked_stages, completed_stages) VALUES (?, ?, ?)',
                [newUserId, JSON.stringify([1]), JSON.stringify([])]
            );

            return done(null, {
                id: newUserId,
                googleId,
                email,
                name,
                avatar: '😊',
                profilePicture
            });
        }
    } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
    }
}));

// 세션에 사용자 정보 저장
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// 세션에서 사용자 정보 복원
passport.deserializeUser(async (id, done) => {
    try {
        const [users] = await promisePool.query(
            'SELECT id, google_id, email, name, avatar, profile_picture FROM users WHERE id = ?',
            [id]
        );

        if (users.length > 0) {
            done(null, users[0]);
        } else {
            done(new Error('User not found'), null);
        }
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
