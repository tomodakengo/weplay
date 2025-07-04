import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
}

export interface ITeam {
  id: string;
  name: string;
  logo?: string;
  players: IPlayer[];
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  SUSPENDED = 'suspended'
}

export interface IGame extends Document {
  title: string;
  homeTeam: ITeam;
  awayTeam: ITeam;
  status: GameStatus;
  inning: number;
  isTopHalf: boolean;
  homeScore: number;
  awayScore: number;
  outs: number;
  balls: number;
  strikes: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  number: { type: Number, required: true },
  position: { type: String, required: true },
}, { _id: false });

const TeamSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  logo: { type: String, default: null },
  players: [PlayerSchema],
}, { _id: false });

const GameSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'タイトルは必須です'],
      trim: true,
      maxlength: [100, 'タイトルは100文字以下である必要があります'],
    },
    homeTeam: {
      type: TeamSchema,
      required: [true, 'ホームチームは必須です'],
    },
    awayTeam: {
      type: TeamSchema,
      required: [true, 'アウェイチームは必須です'],
    },
    status: {
      type: String,
      enum: Object.values(GameStatus),
      default: GameStatus.WAITING,
    },
    inning: {
      type: Number,
      default: 1,
      min: [1, 'イニングは1以上である必要があります'],
      max: [20, 'イニングは20以下である必要があります'],
    },
    isTopHalf: {
      type: Boolean,
      default: true,
    },
    homeScore: {
      type: Number,
      default: 0,
      min: [0, 'スコアは0以上である必要があります'],
    },
    awayScore: {
      type: Number,
      default: 0,
      min: [0, 'スコアは0以上である必要があります'],
    },
    outs: {
      type: Number,
      default: 0,
      min: [0, 'アウト数は0以上である必要があります'],
      max: [3, 'アウト数は3以下である必要があります'],
    },
    balls: {
      type: Number,
      default: 0,
      min: [0, 'ボール数は0以上である必要があります'],
      max: [4, 'ボール数は4以下である必要があります'],
    },
    strikes: {
      type: Number,
      default: 0,
      min: [0, 'ストライク数は0以上である必要があります'],
      max: [3, 'ストライク数は3以下である必要があります'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '作成者は必須です'],
    },
  },
  {
    timestamps: true,
  }
);

// インデックス設定
GameSchema.index({ createdBy: 1 });
GameSchema.index({ status: 1 });
GameSchema.index({ createdAt: -1 });

export default mongoose.model<IGame>('Game', GameSchema);