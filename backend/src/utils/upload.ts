import AWS from 'aws-sdk';
import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// AWS S3設定
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-northeast-1',
});

const bucketName = process.env.AWS_S3_BUCKET;

// ファイルタイプ検証
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo', // .avi
];

// ファイルサイズ制限（MB）
const fileSizeLimits = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
};

// ファイル拡張子の取得
const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

// ファイルタイプの判定
const getFileType = (mimetype: string): 'image' | 'video' | null => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return null;
};

// 一意なファイル名の生成
const generateFileName = (originalName: string, userId: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2);
  const extension = getFileExtension(originalName);
  return `${userId}/${timestamp}-${randomString}${extension}`;
};

// S3にファイルをアップロード
export const uploadToS3 = async (
  file: Express.Multer.File,
  userId: string,
  folder: 'avatars' | 'posts' = 'posts'
): Promise<string> => {
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET環境変数が設定されていません');
  }

  const fileName = generateFileName(file.originalname, userId);
  const key = `${folder}/${fileName}`;

  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: 'max-age=31536000', // 1年間キャッシュ
  };

  try {
    const result = await s3.upload(uploadParams).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('ファイルのアップロードに失敗しました');
  }
};

// S3からファイルを削除
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET環境変数が設定されていません');
  }

  try {
    // URLからキーを抽出
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // 先頭の'/'を除去

    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('ファイルの削除に失敗しました');
  }
};

// Multer設定
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: fileSizeLimits.video, // 最大サイズ（動画基準）
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // MIMEタイプチェック
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('サポートされていないファイル形式です'));
    }

    // ファイルサイズチェック
    const fileType = getFileType(file.mimetype);
    if (!fileType) {
      return cb(new Error('無効なファイルタイプです'));
    }

    cb(null, true);
  },
});

// 単一ファイルアップロード用ミドルウェア
export const uploadSingle = upload.single('file');

// 複数ファイルアップロード用ミドルウェア
export const uploadMultiple = upload.array('files', 5); // 最大5ファイル