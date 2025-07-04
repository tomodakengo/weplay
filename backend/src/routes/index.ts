import { Router } from 'express';
import gameRoutes from './games';
import userRoutes from './users';
import postRoutes from './posts';
import uploadRoutes from './upload';

const router = Router();

// API v1 ルート
router.use('/api/v1/games', gameRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/posts', postRoutes);
router.use('/api/v1/upload', uploadRoutes);

// ヘルスチェック
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;