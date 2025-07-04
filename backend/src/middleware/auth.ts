import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { CustomError } from './errorHandler';

// Requestインターフェースを拡張してuserプロパティを追加
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username?: string;
        avatar_url?: string;
        full_name?: string;
      };
      userToken?: string;
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

    // Supabaseでトークンを検証
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      const authError: CustomError = new Error('認証に失敗しました');
      authError.statusCode = 401;
      return next(authError);
    }

    // プロフィール情報を取得
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('username, avatar_url, full_name')
      .eq('id', user.id)
      .single();

    // リクエストオブジェクトにユーザー情報を設定
    req.user = {
      id: user.id,
      email: user.email!,
      username: profile?.username,
      avatar_url: profile?.avatar_url,
      full_name: profile?.full_name,
    };
    req.userToken = token;
    
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
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        
        if (!error && user) {
          // プロフィール情報を取得
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, avatar_url, full_name')
            .eq('id', user.id)
            .single();

          req.user = {
            id: user.id,
            email: user.email!,
            username: profile?.username,
            avatar_url: profile?.avatar_url,
            full_name: profile?.full_name,
          };
          req.userToken = token;
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