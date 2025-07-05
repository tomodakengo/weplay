import { supabaseAdmin } from '../config/supabase';
import { CustomError } from '../middleware/errorHandler';

// バケット名
export const BUCKETS = {
  AVATARS: 'avatars',
  GAME_IMAGES: 'game-images',
} as const;

// ファイルアップロード
export const uploadFile = async (
  bucket: string,
  path: string,
  file: Buffer | Blob,
  contentType?: string
) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // 公開URLを取得
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      path: data.path,
      publicUrl,
    };
  } catch (error: any) {
    const uploadError: CustomError = new Error('ファイルのアップロードに失敗しました');
    uploadError.statusCode = 500;
    throw uploadError;
  }
};

// ファイル削除
export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    const deleteError: CustomError = new Error('ファイルの削除に失敗しました');
    deleteError.statusCode = 500;
    throw deleteError;
  }
};

// ファイルURLを取得
export const getFileUrl = (bucket: string, path: string): string => {
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
};

// ファイルサイズの検証
export const validateFileSize = (file: Express.Multer.File, maxSizeMB: number = 5): void => {
  const maxSize = maxSizeMB * 1024 * 1024; // MB to bytes
  if (file.size > maxSize) {
    const error: CustomError = new Error(`ファイルサイズは${maxSizeMB}MB以下である必要があります`);
    error.statusCode = 400;
    throw error;
  }
};

// 画像ファイルの検証
export const validateImageFile = (file: Express.Multer.File): void => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error: CustomError = new Error('画像ファイル（JPEG、PNG、GIF、WebP）のみアップロード可能です');
    error.statusCode = 400;
    throw error;
  }
};