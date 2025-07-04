import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// 投稿一覧取得（ゲーム別）
router.get('/game/:gameId', (req: Request, res: Response) => {
  const { gameId } = req.params;
  // TODO: 実際のデータベースから投稿一覧を取得
  res.json({
    success: true,
    data: [],
    message: `ゲーム${gameId}の投稿一覧を取得しました`,
  });
});

// 投稿詳細取得
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: 実際のデータベースから投稿詳細を取得
  res.json({
    success: true,
    data: { id },
    message: '投稿詳細を取得しました',
  });
});

// 投稿作成（テキスト）
router.post('/', (req: Request, res: Response) => {
  // TODO: 実際のデータベースに投稿を作成
  res.status(201).json({
    success: true,
    data: req.body,
    message: '投稿を作成しました',
  });
});

// 投稿作成（画像・動画）
router.post('/media', (req: Request, res: Response) => {
  // TODO: ファイルアップロード処理とデータベース保存
  res.status(201).json({
    success: true,
    data: req.body,
    message: 'メディア投稿を作成しました',
  });
});

// 投稿更新
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: 実際のデータベースで投稿を更新
  res.json({
    success: true,
    data: { id, ...req.body },
    message: '投稿を更新しました',
  });
});

// 投稿削除
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: 実際のデータベースから投稿を削除
  res.json({
    success: true,
    message: '投稿を削除しました',
  });
});

export default router;