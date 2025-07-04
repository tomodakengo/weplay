import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import User, { IUser } from '../models/User';
import { CustomError } from './errorHandler';

// Requestインターフェースを拡張してuserプロパティを追加
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userPayload?: JWTPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      const error: CustomError = new Error('認証トークンが必要です');
      error.statusCode = 401;
      return next(error);
    }

    // トークンを検証
    const payload = verifyToken(token);
    
    // ユーザー情報をデータベースから取得
    const user = await User.findById(payload.id);
    if (!user) {
      const error: CustomError = new Error('ユーザーが見つかりません');
      error.statusCode = 401;
      return next(error);
    }

    // リクエストオブジェクトにユーザー情報を設定
    req.user = user;
    req.userPayload = payload;
    
    next();
  } catch (error: any) {
    const authError: CustomError = new Error(error.message || '認証に失敗しました');
    authError.statusCode = 401;
    next(authError);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (token) {
      try {
        const payload = verifyToken(token);
        const user = await User.findById(payload.id);
        if (user) {
          req.user = user;
          req.userPayload = payload;
        }
      } catch (error) {
        // オプショナル認証では認証エラーを無視
        console.log('Optional auth failed:', error);
      }
    }

    next();
  } catch (error) {
    // オプショナル認証では全てのエラーを無視
    next();
  }
};