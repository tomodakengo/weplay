// 型定義をエクスポート
export * from './types';

// ユーティリティ関数（将来的に追加予定）
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP');
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ja-JP');
};