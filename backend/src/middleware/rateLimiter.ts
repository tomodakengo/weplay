import rateLimit from 'express-rate-limit';

// 一般的なAPI制限（100リクエスト/15分）
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: {
    success: false,
    error: 'リクエストが多すぎます。しばらく待ってから再試行してください。',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ログイン制限（5リクエスト/15分）
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // 最大5リクエスト
  message: {
    success: false,
    error: 'ログイン試行回数が上限に達しました。しばらく待ってから再試行してください。',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // 成功したリクエストはカウントしない
});

// アップロード制限（10リクエスト/時間）
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1時間
  max: 10, // 最大10リクエスト
  message: {
    success: false,
    error: 'アップロード回数が上限に達しました。1時間後に再試行してください。',
  },
  standardHeaders: true,
  legacyHeaders: false,
});