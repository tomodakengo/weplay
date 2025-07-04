import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// 全ゲーム取得
router.get('/', (req: Request, res: Response) => {
  // TODO: 実際のデータベースからゲーム一覧を取得
  res.json({
    success: true,
    data: [],
    message: 'ゲーム一覧を取得しました',
  });
});

// ゲーム詳細取得
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: 実際のデータベースからゲーム詳細を取得
  res.json({
    success: true,
    data: { id },
    message: 'ゲーム詳細を取得しました',
  });
});

// ゲーム作成
router.post('/', (req: Request, res: Response) => {
  // TODO: 実際のデータベースにゲームを作成
  res.status(201).json({
    success: true,
    data: req.body,
    message: 'ゲームを作成しました',
  });
});

// ゲーム更新
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: 実際のデータベースでゲームを更新
  res.json({
    success: true,
    data: { id, ...req.body },
    message: 'ゲームを更新しました',
  });
});

// ゲーム削除
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: 実際のデータベースからゲームを削除
  res.json({
    success: true,
    message: 'ゲームを削除しました',
  });
});

export default router;