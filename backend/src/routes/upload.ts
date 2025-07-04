import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';
import { uploadSingle, uploadMultiple } from '../utils/upload';
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  uploadAvatar
} from '../controllers/uploadController';

const router = Router();

// 単一ファイルアップロード
router.post(
  '/single',
  authenticateToken,
  uploadLimiter,
  uploadSingle,
  uploadFile
);

// 複数ファイルアップロード
router.post(
  '/multiple',
  authenticateToken,
  uploadLimiter,
  uploadMultiple,
  uploadMultipleFiles
);

// アバター画像アップロード
router.post(
  '/avatar',
  authenticateToken,
  uploadLimiter,
  uploadSingle,
  uploadAvatar
);

// ファイル削除
router.delete(
  '/file',
  authenticateToken,
  deleteFile
);

export default router;