import { Request, Response, NextFunction } from 'express';
import { uploadToS3, deleteFromS3 } from '../utils/upload';
import { CustomError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';

// 単一ファイルアップロード
export const uploadFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    const error: CustomError = new Error('ファイルが選択されていません');
    error.statusCode = 400;
    return next(error);
  }

  if (!req.user) {
    const error: CustomError = new Error('認証が必要です');
    error.statusCode = 401;
    return next(error);
  }

  const userId = (req.user._id as any).toString();
  const folder = req.body.folder || 'posts'; // デフォルトはposts

  // フォルダ名の検証
  if (!['avatars', 'posts'].includes(folder)) {
    const error: CustomError = new Error('無効なフォルダ名です');
    error.statusCode = 400;
    return next(error);
  }

  try {
    const fileUrl = await uploadToS3(req.file, userId, folder);

    res.json({
      success: true,
      data: {
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      message: 'ファイルのアップロードが完了しました',
    });
  } catch (error: any) {
    const uploadError: CustomError = new Error(error.message || 'ファイルのアップロードに失敗しました');
    uploadError.statusCode = 500;
    return next(uploadError);
  }
});

// 複数ファイルアップロード
export const uploadMultipleFiles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    const error: CustomError = new Error('ファイルが選択されていません');
    error.statusCode = 400;
    return next(error);
  }

  if (!req.user) {
    const error: CustomError = new Error('認証が必要です');
    error.statusCode = 401;
    return next(error);
  }

  const userId = (req.user._id as any).toString();
  const folder = req.body.folder || 'posts';

  // フォルダ名の検証
  if (!['avatars', 'posts'].includes(folder)) {
    const error: CustomError = new Error('無効なフォルダ名です');
    error.statusCode = 400;
    return next(error);
  }

  try {
    const uploadPromises = req.files.map(file => uploadToS3(file, userId, folder));
    const fileUrls = await Promise.all(uploadPromises);

    const uploadedFiles = req.files.map((file, index) => ({
      url: fileUrls[index],
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      success: true,
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length,
      },
      message: `${uploadedFiles.length}個のファイルのアップロードが完了しました`,
    });
  } catch (error: any) {
    const uploadError: CustomError = new Error(error.message || 'ファイルのアップロードに失敗しました');
    uploadError.statusCode = 500;
    return next(uploadError);
  }
});

// ファイル削除
export const deleteFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { fileUrl } = req.body;

  if (!fileUrl) {
    const error: CustomError = new Error('ファイルURLが必要です');
    error.statusCode = 400;
    return next(error);
  }

  if (!req.user) {
    const error: CustomError = new Error('認証が必要です');
    error.statusCode = 401;
    return next(error);
  }

  try {
    // TODO: ユーザーがファイルの所有者かどうかの確認ロジックを追加
    await deleteFromS3(fileUrl);

    res.json({
      success: true,
      message: 'ファイルを削除しました',
    });
  } catch (error: any) {
    const deleteError: CustomError = new Error(error.message || 'ファイルの削除に失敗しました');
    deleteError.statusCode = 500;
    return next(deleteError);
  }
});

// アバター画像アップロード
export const uploadAvatar = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    const error: CustomError = new Error('アバター画像が選択されていません');
    error.statusCode = 400;
    return next(error);
  }

  if (!req.user) {
    const error: CustomError = new Error('認証が必要です');
    error.statusCode = 401;
    return next(error);
  }

  // 画像ファイルのみ許可
  if (!req.file.mimetype.startsWith('image/')) {
    const error: CustomError = new Error('アバターには画像ファイルのみアップロード可能です');
    error.statusCode = 400;
    return next(error);
  }

  const userId = (req.user._id as any).toString();

  try {
    const avatarUrl = await uploadToS3(req.file, userId, 'avatars');

    // TODO: ユーザーのアバターURLをデータベースに保存

    res.json({
      success: true,
      data: {
        avatarUrl,
      },
      message: 'アバター画像のアップロードが完了しました',
    });
  } catch (error: any) {
    const uploadError: CustomError = new Error(error.message || 'アバター画像のアップロードに失敗しました');
    uploadError.statusCode = 500;
    return next(uploadError);
  }
});