// Shared types from backend
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

// Frontend-specific types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateGameFormData {
  title: string;
  homeTeamName: string;
  awayTeamName: string;
  description?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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