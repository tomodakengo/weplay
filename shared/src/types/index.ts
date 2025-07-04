// ユーザー関連の型定義
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 試合関連の型定義
export interface Game {
  id: string;
  title: string;
  homeTeam: Team;
  awayTeam: Team;
  status: GameStatus;
  inning: number;
  isTopHalf: boolean;
  homeScore: number;
  awayScore: number;
  outs: number;
  balls: number;
  strikes: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  SUSPENDED = 'suspended'
}

// Socket.io イベント関連の型定義
export interface ServerToClientEvents {
  gameUpdate: (game: Game) => void;
  newPost: (post: Post) => void;
  userJoined: (user: User) => void;
  userLeft: (user: User) => void;
}

export interface ClientToServerEvents {
  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  updateScore: (gameId: string, scoreUpdate: ScoreUpdate) => void;
  createPost: (gameId: string, post: Omit<Post, 'id' | 'createdAt'>) => void;
}

export interface ScoreUpdate {
  homeScore?: number;
  awayScore?: number;
  inning?: number;
  isTopHalf?: boolean;
  outs?: number;
  balls?: number;
  strikes?: number;
}

// 投稿関連の型定義
export interface Post {
  id: string;
  gameId: string;
  userId: string;
  user: User;
  type: PostType;
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  createdAt: Date;
}

export enum PostType {
  TEXT = 'text',
  PHOTO = 'photo',
  VIDEO = 'video',
  CHEER = 'cheer'
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

// API関連の型定義
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}