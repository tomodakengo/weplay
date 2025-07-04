import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { sendValidationError } from './response';

/**
 * バリデーションエラーをチェックするミドルウェア
 */
export const checkValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error: any) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));
    sendValidationError(res, errorMessages);
    return;
  }
  next();
};

/**
 * ユーザー登録のバリデーションルール
 */
export const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('ユーザー名は3文字以上20文字以下で入力してください')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('ユーザー名は英数字とアンダースコアのみ使用可能です'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('有効なメールアドレスを入力してください'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上で入力してください')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('パスワードは英字と数字を含む必要があります'),
  
  checkValidation
];

/**
 * ユーザーログインのバリデーションルール
 */
export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('有効なメールアドレスを入力してください'),
  
  body('password')
    .notEmpty()
    .withMessage('パスワードを入力してください'),
  
  checkValidation
];

/**
 * 試合作成のバリデーションルール
 */
export const validateGameCreation = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('試合タイトルは1文字以上100文字以下で入力してください')
    .trim(),
  
  body('homeTeamName')
    .isLength({ min: 1, max: 50 })
    .withMessage('ホームチーム名は1文字以上50文字以下で入力してください')
    .trim(),
  
  body('awayTeamName')
    .isLength({ min: 1, max: 50 })
    .withMessage('アウェイチーム名は1文字以上50文字以下で入力してください')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('試合の説明は500文字以下で入力してください')
    .trim(),
  
  checkValidation
];

/**
 * 投稿作成のバリデーションルール
 */
export const validatePostCreation = [
  body('gameId')
    .isMongoId()
    .withMessage('有効な試合IDを指定してください'),
  
  body('type')
    .isIn(['text', 'photo', 'video', 'cheer'])
    .withMessage('有効な投稿タイプを指定してください'),
  
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('投稿内容は1文字以上1000文字以下で入力してください')
    .trim(),
  
  body('mediaUrl')
    .optional()
    .isURL()
    .withMessage('有効なメディアURLを指定してください'),
  
  checkValidation
];

/**
 * プロフィール更新のバリデーションルール
 */
export const validateProfileUpdate = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('ユーザー名は3文字以上20文字以下で入力してください')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('ユーザー名は英数字とアンダースコアのみ使用可能です'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('有効なメールアドレスを入力してください'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('有効なアバターURLを指定してください'),
  
  checkValidation
];

/**
 * スコア更新のバリデーションルール
 */
export const validateScoreUpdate = [
  body('homeScore')
    .optional()
    .isInt({ min: 0, max: 99 })
    .withMessage('ホームスコアは0から99の整数で入力してください'),
  
  body('awayScore')
    .optional()
    .isInt({ min: 0, max: 99 })
    .withMessage('アウェイスコアは0から99の整数で入力してください'),
  
  body('inning')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('イニングは1から12の整数で入力してください'),
  
  body('isTopHalf')
    .optional()
    .isBoolean()
    .withMessage('表/裏の指定は真偽値で入力してください'),
  
  body('outs')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage('アウト数は0から3の整数で入力してください'),
  
  body('balls')
    .optional()
    .isInt({ min: 0, max: 4 })
    .withMessage('ボール数は0から4の整数で入力してください'),
  
  body('strikes')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage('ストライク数は0から3の整数で入力してください'),
  
  checkValidation
];