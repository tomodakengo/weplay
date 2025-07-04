import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
});

// 商品価格設定
export const PRODUCTS = {
  // 試合パック
  singleGame: {
    id: process.env.STRIPE_SINGLE_GAME_PRICE_ID || '',
    amount: 300, // 300円/試合
    name: '試合パック（1試合）',
  },
  gameBundle5: {
    id: process.env.STRIPE_GAME_BUNDLE_5_PRICE_ID || '',
    amount: 1200, // 1,200円（5試合）
    name: '試合パック（5試合）',
  },
  gameBundle10: {
    id: process.env.STRIPE_GAME_BUNDLE_10_PRICE_ID || '',
    amount: 2000, // 2,000円（10試合）
    name: '試合パック（10試合）',
  },
  gameBundle30: {
    id: process.env.STRIPE_GAME_BUNDLE_30_PRICE_ID || '',
    amount: 5000, // 5,000円（30試合）
    name: '試合パック（30試合）',
  },
  // チームプラン（月額）
  teamPlan: {
    id: process.env.STRIPE_TEAM_PLAN_PRICE_ID || '',
    amount: 1000, // 1,000円/月
    name: 'チームプラン',
    recurring: true,
  },
};

// Webhookの署名シークレット
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// 購入タイプ
export type PurchaseType = 
  | 'single_game'
  | 'game_bundle_5'
  | 'game_bundle_10'
  | 'game_bundle_30'
  | 'team_plan';

// ユーザークレジット情報の型定義
export interface UserCredits {
  userId: string;
  gameCredits: number; // 利用可能な試合クレジット数
  teamPlanActive: boolean; // チームプランがアクティブか
  teamPlanExpiresAt?: Date; // チームプランの有効期限
}