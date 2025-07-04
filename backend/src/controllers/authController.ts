import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { CustomError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';

// ユーザー登録
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  // 入力値検証
  if (!username || !email || !password) {
    const error: CustomError = new Error('全ての必須項目を入力してください');
    error.statusCode = 400;
    return next(error);
  }

  // 既存ユーザーチェック
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    const error: CustomError = new Error('このメールアドレスまたはユーザー名は既に使用されています');
    error.statusCode = 409;
    return next(error);
  }

  // ユーザー作成
  const user = new User({
    username,
    email,
    password
  });

  await user.save();

  // パスワードを除いたユーザー情報を取得
  const userWithoutPassword = await User.findById(user._id);

  // JWTトークン生成
  const token = generateToken(userWithoutPassword as IUser);
  const refreshToken = generateRefreshToken(userWithoutPassword as IUser);

  res.status(201).json({
    success: true,
    data: {
      user: userWithoutPassword,
      token,
      refreshToken
    },
    message: 'ユーザー登録が完了しました'
  });
});

// ユーザーログイン
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // 入力値検証
  if (!email || !password) {
    const error: CustomError = new Error('メールアドレスとパスワードを入力してください');
    error.statusCode = 400;
    return next(error);
  }

  // ユーザー検索（パスワードも含める）
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error: CustomError = new Error('メールアドレスまたはパスワードが正しくありません');
    error.statusCode = 401;
    return next(error);
  }

  // パスワード確認
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    const error: CustomError = new Error('メールアドレスまたはパスワードが正しくありません');
    error.statusCode = 401;
    return next(error);
  }

  // パスワードを除いたユーザー情報を取得
  const userWithoutPassword = await User.findById(user._id);

  // JWTトークン生成
  const token = generateToken(userWithoutPassword as IUser);
  const refreshToken = generateRefreshToken(userWithoutPassword as IUser);

  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
      token,
      refreshToken
    },
    message: 'ログインしました'
  });
});

// プロフィール取得
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: req.user,
    message: 'プロフィール情報を取得しました'
  });
});

// プロフィール更新
export const updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, avatar } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    const error: CustomError = new Error('認証が必要です');
    error.statusCode = 401;
    return next(error);
  }

  // 更新データの準備
  const updateData: any = {};
  if (username) updateData.username = username;
  if (avatar) updateData.avatar = avatar;

  // ユーザー名の重複チェック
  if (username) {
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: userId } 
    });

    if (existingUser) {
      const error: CustomError = new Error('このユーザー名は既に使用されています');
      error.statusCode = 409;
      return next(error);
    }
  }

  // ユーザー情報更新
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedUser,
    message: 'プロフィールを更新しました'
  });
});

// パスワード変更
export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    const error: CustomError = new Error('認証が必要です');
    error.statusCode = 401;
    return next(error);
  }

  if (!currentPassword || !newPassword) {
    const error: CustomError = new Error('現在のパスワードと新しいパスワードを入力してください');
    error.statusCode = 400;
    return next(error);
  }

  // ユーザー検索（パスワードも含める）
  const user = await User.findById(userId).select('+password');

  if (!user) {
    const error: CustomError = new Error('ユーザーが見つかりません');
    error.statusCode = 404;
    return next(error);
  }

  // 現在のパスワード確認
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordValid) {
    const error: CustomError = new Error('現在のパスワードが正しくありません');
    error.statusCode = 401;
    return next(error);
  }

  // 新しいパスワードを設定
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'パスワードを変更しました'
  });
});