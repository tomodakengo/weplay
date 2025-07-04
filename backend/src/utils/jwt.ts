import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
}

export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    id: (user._id as any).toString(),
    username: user.username,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET環境変数が設定されていません');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '7d', // 7日間有効
    issuer: 'weplay',
    audience: 'weplay-users',
  });
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET環境変数が設定されていません');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'weplay',
      audience: 'weplay-users',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('トークンの有効期限が切れています');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('無効なトークンです');
    } else {
      throw new Error('トークンの検証に失敗しました');
    }
  }
};

export const generateRefreshToken = (user: IUser): string => {
  const payload = {
    id: (user._id as any).toString(),
    type: 'refresh',
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET環境変数が設定されていません');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '30d', // 30日間有効
    issuer: 'weplay',
    audience: 'weplay-refresh',
  });
};