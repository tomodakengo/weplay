import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 成功レスポンスを送信
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  res.status(statusCode).json(response);
};

/**
 * エラーレスポンスを送信
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 400
): void => {
  const response: ApiResponse = {
    success: false,
    error,
  };
  res.status(statusCode).json(response);
};

/**
 * バリデーションエラーレスポンスを送信
 */
export const sendValidationError = (
  res: Response,
  errors: any[],
  message: string = 'バリデーションエラー'
): void => {
  const response: ApiResponse = {
    success: false,
    error: message,
    data: errors,
  };
  res.status(400).json(response);
};

/**
 * 認証エラーレスポンスを送信
 */
export const sendAuthError = (
  res: Response,
  message: string = '認証が必要です'
): void => {
  const response: ApiResponse = {
    success: false,
    error: message,
  };
  res.status(401).json(response);
};

/**
 * 権限エラーレスポンスを送信
 */
export const sendForbiddenError = (
  res: Response,
  message: string = 'アクセス権限がありません'
): void => {
  const response: ApiResponse = {
    success: false,
    error: message,
  };
  res.status(403).json(response);
};

/**
 * 404エラーレスポンスを送信
 */
export const sendNotFoundError = (
  res: Response,
  resource: string = 'リソース'
): void => {
  const response: ApiResponse = {
    success: false,
    error: `${resource}が見つかりません`,
  };
  res.status(404).json(response);
};

/**
 * サーバーエラーレスポンスを送信
 */
export const sendServerError = (
  res: Response,
  message: string = 'サーバーエラーが発生しました'
): void => {
  const response: ApiResponse = {
    success: false,
    error: message,
  };
  res.status(500).json(response);
};