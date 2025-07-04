// 野球関連の基本型定義

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  team: 'home' | 'away';
  battingOrder?: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  score: number;
  hits: number;
  errors: number;
}

export interface GameState {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  currentInning: number;
  isTopInning: boolean;
  outs: number;
  strikes: number;
  balls: number;
  bases: [boolean, boolean, boolean]; // 1塁、2塁、3塁
  currentBatter?: Player;
  currentPitcher?: Player;
  gameStatus: 'not_started' | 'in_progress' | 'finished';
  startTime?: Date;
  endTime?: Date;
  lastUpdated: Date;
}

export interface ScoreUpdate {
  gameId: string;
  type: 'hit' | 'out' | 'strike' | 'ball' | 'walk' | 'home_run' | 'error' | 'run';
  playerId?: string;
  details?: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  type: 'photo' | 'video' | 'message';
  content: string;
  mediaUrl?: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  title: string;
  description?: string;
  homeTeam: Team;
  awayTeam: Team;
  location?: string;
  scheduledTime?: Date;
  isPublic: boolean;
  shareCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// Socket.io関連の型定義

export interface ServerToClientEvents {
  gameStateUpdate: (gameState: GameState) => void;
  scoreUpdate: (update: ScoreUpdate) => void;
  newPost: (post: Post) => void;
  userJoined: (user: User) => void;
  userLeft: (userId: string) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  updateScore: (update: Omit<ScoreUpdate, 'timestamp'>) => void;
  createPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  likePost: (postId: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
}

// API関連の型定義

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 認証関連の型定義

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ファイルアップロード関連

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
} 