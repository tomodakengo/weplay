import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// クライアント用（公開APIキー使用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// サーバー側管理用（サービスキー使用）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// データベーステーブルの型定義
export interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  full_name?: string;
}

export interface Game {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  inning: number;
  status: 'waiting' | 'playing' | 'finished';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GameEvent {
  id: string;
  game_id: string;
  type: string;
  description: string;
  inning: number;
  created_at: string;
  created_by: string;
}