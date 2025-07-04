import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController';

const router = Router();

// ユーザー登録
router.post('/register', authLimiter, register);

// ユーザーログイン
router.post('/login', authLimiter, login);

// プロフィール取得（認証必須）
router.get('/profile', authenticateToken, getProfile);

// プロフィール更新（認証必須）
router.put('/profile', authenticateToken, updateProfile);

// パスワード変更（認証必須）
router.put('/change-password', authenticateToken, changePassword);

// パスワードリセット（今後実装予定）
router.post('/forgot-password', (req, res) => {
  res.json({
    success: true,
    message: 'パスワードリセット機能は今後実装予定です',
  });
});

export default router;