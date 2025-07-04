import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// ユーザー登録
router.post('/register', (req: Request, res: Response) => {
  // TODO: 実際のユーザー登録処理
  res.status(201).json({
    success: true,
    data: { message: 'ユーザー登録が完了しました' },
  });
});

// ユーザーログイン
router.post('/login', (req: Request, res: Response) => {
  // TODO: 実際のログイン処理
  res.json({
    success: true,
    data: {
      token: 'dummy_jwt_token',
      user: { id: '1', username: 'testuser' },
    },
    message: 'ログインしました',
  });
});

// ユーザー情報取得
router.get('/profile', (req: Request, res: Response) => {
  // TODO: JWTトークン検証とユーザー情報取得
  res.json({
    success: true,
    data: { id: '1', username: 'testuser', email: 'test@example.com' },
    message: 'ユーザー情報を取得しました',
  });
});

// ユーザー情報更新
router.put('/profile', (req: Request, res: Response) => {
  // TODO: ユーザー情報更新処理
  res.json({
    success: true,
    data: req.body,
    message: 'ユーザー情報を更新しました',
  });
});

// パスワードリセット
router.post('/forgot-password', (req: Request, res: Response) => {
  // TODO: パスワードリセット処理
  res.json({
    success: true,
    message: 'パスワードリセットメールを送信しました',
  });
});

export default router;