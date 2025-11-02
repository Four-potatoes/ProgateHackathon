const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// 게임 진행도 조회
router.get('/progress', authenticateToken, async (req, res) => {
    try {
        const [progress] = await promisePool.query(
            'SELECT * FROM game_progress WHERE user_id = ?',
            [req.user.id]
        );

        if (progress.length === 0) {
            await promisePool.query(
                'INSERT INTO game_progress (user_id, unlocked_stages, completed_stages, coins, purchased_avatars) VALUES (?, ?, ?, ?, ?)',
                [req.user.id, JSON.stringify([1]), JSON.stringify([]), 0, JSON.stringify(['😊'])]
            );

            return res.json({
                userId: req.user.id,
                currentStage: 1,
                unlockedStages: [1],
                completedStages: [],
                playerAvatar: '😊',
                coins: 0,
                purchasedAvatars: ['😊']
            });
        }

        const data = progress[0];
        res.json({
            userId: data.user_id,
            currentStage: data.current_stage,
            unlockedStages: JSON.parse(data.unlocked_stages),
            completedStages: JSON.parse(data.completed_stages),
            playerAvatar: data.player_avatar,
            coins: data.coins || 0,
            purchasedAvatars: data.purchased_avatars ? JSON.parse(data.purchased_avatars) : ['😊'],
            updatedAt: data.updated_at
        });
    } catch (error) {
        console.error('Get Progress Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '진행도를 가져오는데 실패했습니다.'
        });
    }
});

// 게임 진행도 저장
router.post('/progress', authenticateToken, async (req, res) => {
    try {
        const { currentStage, unlockedStages, completedStages, playerAvatar, coins, purchasedAvatars } = req.body;

        await promisePool.query(
            `INSERT INTO game_progress (user_id, current_stage, unlocked_stages, completed_stages, player_avatar, coins, purchased_avatars)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             current_stage = VALUES(current_stage),
             unlocked_stages = VALUES(unlocked_stages),
             completed_stages = VALUES(completed_stages),
             player_avatar = VALUES(player_avatar),
             coins = VALUES(coins),
             purchased_avatars = VALUES(purchased_avatars),
             updated_at = NOW()`,
            [
                req.user.id,
                currentStage,
                JSON.stringify(unlockedStages),
                JSON.stringify(completedStages),
                playerAvatar || '😊',
                coins || 0,
                JSON.stringify(purchasedAvatars || ['😊'])
            ]
        );

        res.json({
            success: true,
            message: '진행도가 저장되었습니다.'
        });
    } catch (error) {
        console.error('Save Progress Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '진행도 저장에 실패했습니다.'
        });
    }
});

// 스테이지 완료
router.post('/complete', authenticateToken, async (req, res) => {
    try {
        const { stageId, stageName, moves, completionTime } = req.body;

        await promisePool.query(
            'INSERT INTO rankings (user_id, stage_id, stage_name, moves, completion_time) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, stageId, stageName, moves, completionTime || 0]
        );

        const [progress] = await promisePool.query(
            'SELECT * FROM game_progress WHERE user_id = ?',
            [req.user.id]
        );

        if (progress.length > 0) {
            const completedStages = JSON.parse(progress[0].completed_stages);
            if (!completedStages.includes(stageId)) {
                completedStages.push(stageId);

                const unlockedStages = JSON.parse(progress[0].unlocked_stages);
                const nextStage = stageId + 1;
                if (nextStage <= 3 && !unlockedStages.includes(nextStage)) {
                    unlockedStages.push(nextStage);
                }

                await promisePool.query(
                    'UPDATE game_progress SET completed_stages = ?, unlocked_stages = ?, updated_at = NOW() WHERE user_id = ?',
                    [JSON.stringify(completedStages), JSON.stringify(unlockedStages), req.user.id]
                );
            }
        }

        res.json({
            success: true,
            message: '스테이지가 완료되었습니다!',
            stageId,
            moves
        });
    } catch (error) {
        console.error('Complete Stage Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '스테이지 완료 처리에 실패했습니다.'
        });
    }
});

// 랭킹 조회
router.get('/ranking', optionalAuth, async (req, res) => {
    try {
        const { stageId, limit = 20 } = req.query;

        let query = `
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
        `;

        const params = [];

        if (stageId) {
            query += ' WHERE r.stage_id = ?';
            params.push(parseInt(stageId));
        }

        query += ' ORDER BY r.moves ASC, r.completion_time ASC LIMIT ?';
        params.push(parseInt(limit));

        const [rankings] = await promisePool.query(query, params);

        res.json({
            rankings: rankings.map((rank, index) => ({
                rank: index + 1,
                id: rank.id,
                stageId: rank.stage_id,
                stageName: rank.stage_name,
                moves: rank.moves,
                completionTime: rank.completion_time,
                playerName: rank.player_name,
                playerAvatar: rank.player_avatar,
                profilePicture: rank.profile_picture,
                createdAt: rank.created_at
            }))
        });
    } catch (error) {
        console.error('Get Ranking Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '랭킹을 가져오는데 실패했습니다.'
        });
    }
});

// 스테이지 데이터 조회
router.get('/stages', optionalAuth, (req, res) => {
    try {
        const stagesPath = path.join(__dirname, '..', 'data', 'stages.json');
        const stages = JSON.parse(fs.readFileSync(stagesPath, 'utf8'));
        res.json(stages);
    } catch (error) {
        console.error('Get Stages Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: '스테이지 데이터를 가져오는데 실패했습니다.'
        });
    }
});

module.exports = router;
