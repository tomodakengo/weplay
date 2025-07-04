<<<<<<< HEAD
// 共有ライブラリのエントリーポイント

export * from './types';

// ユーティリティ関数
export const generateShareCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const formatScore = (score: number): string => {
  return score.toString().padStart(2, '0');
};

export const formatInning = (inning: number, isTop: boolean): string => {
  const suffix = isTop ? '表' : '裏';
  return `${inning}回${suffix}`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// バリデーション関数
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

// 野球関連の定数
export const BASEBALL_CONSTANTS = {
  MAX_INNINGS: 9,
  MAX_OUTS: 3,
  MAX_STRIKES: 3,
  MAX_BALLS: 4,
  MAX_BASES: 3,
  POSITIONS: [
    '投手', '捕手', '一塁手', '二塁手', '三塁手', 
    '遊撃手', '左翼手', '中堅手', '右翼手', '指名打者'
  ] as const
} as const;

// エラーメッセージ
export const ERROR_MESSAGES = {
  INVALID_EMAIL: '有効なメールアドレスを入力してください',
  INVALID_PASSWORD: 'パスワードは8文字以上で入力してください',
  REQUIRED_FIELD: 'この項目は必須です',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセス権限がありません',
  NOT_FOUND: 'リソースが見つかりません',
  SERVER_ERROR: 'サーバーエラーが発生しました'
} as const; 
=======
// 型定義をエクスポート
export * from './types';

// ユーティリティ関数（将来的に追加予定）
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP');
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ja-JP');
};
>>>>>>> da8b7b2114e71203c1c8b4bda8fda32937a5634a
