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

// 価格設定
export const PRICING = {
  monthly: {
    id: process.env.STRIPE_MONTHLY_PRICE_ID || '',
    amount: 500, // 500円
  },
  yearly: {
    id: process.env.STRIPE_YEARLY_PRICE_ID || '',
    amount: 5000, // 5000円
  },
};

// Webhookの署名シークレット
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// サブスクリプションステータスの型定義
export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

// カスタマーデータの型定義
export interface CustomerData {
  id: string;
  email: string;
  name?: string;
  subscription_status?: SubscriptionStatus;
  subscription_id?: string;
  subscription_end_date?: Date;
}