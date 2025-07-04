import express from 'express';
<<<<<<< HEAD
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// 環境変数の読み込み
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// ミドルウェアの設定
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// レート制限の設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // リクエスト制限
  message: 'リクエストが多すぎます。しばらく時間をおいてから再試行してください。'
});
app.use('/api/', limiter);

// JSONボディパーサー
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 基本的なルート
app.get('/', (req, res) => {
  res.json({
    message: 'WePlay API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.io接続処理
io.on('connection', (socket) => {
  console.log(`ユーザーが接続しました: ${socket.id}`);

  // ゲーム参加
  socket.on('joinGame', (gameId: string) => {
    socket.join(gameId);
    console.log(`ユーザー ${socket.id} がゲーム ${gameId} に参加しました`);
    
    // 他のユーザーに通知
    socket.to(gameId).emit('userJoined', {
      id: socket.id,
      name: 'Anonymous User'
    });
  });

  // ゲーム退出
  socket.on('leaveGame', (gameId: string) => {
    socket.leave(gameId);
    console.log(`ユーザー ${socket.id} がゲーム ${gameId} から退出しました`);
    
    // 他のユーザーに通知
    socket.to(gameId).emit('userLeft', socket.id);
  });

  // スコア更新
  socket.on('updateScore', (update) => {
    const gameId = update.gameId;
    console.log(`ゲーム ${gameId} のスコアが更新されました:`, update);
    
    // 同じゲームの他のユーザーに通知
    socket.to(gameId).emit('scoreUpdate', {
      ...update,
      timestamp: new Date()
    });
  });

  // 投稿作成
  socket.on('createPost', (post) => {
    const gameId = post.gameId;
    console.log(`ゲーム ${gameId} に新しい投稿が作成されました:`, post);
    
    // 同じゲームの他のユーザーに通知
    socket.to(gameId).emit('newPost', {
      ...post,
      id: Math.random().toString(36).substring(2),
      timestamp: new Date(),
      likes: 0,
      comments: []
    });
  });

  // 接続切断
  socket.on('disconnect', () => {
    console.log(`ユーザーが切断しました: ${socket.id}`);
  });
});

// エラーハンドリング
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('エラーが発生しました:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'サーバーエラーが発生しました' : err.message
  });
});

// 404ハンドリング
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'リソースが見つかりません'
=======
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import { connectDatabase } from './utils/database';

// 環境変数を読み込み
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// ミドルウェア設定
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// レート制限
app.use(generalLimiter);

// ルート設定
app.use('/', routes);

// 404ハンドラー
app.use(notFoundHandler);

// エラーハンドラー
app.use(errorHandler);

// Socket.IO接続処理
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // ゲームルームに参加
  socket.on('joinGame', (gameId: string) => {
    socket.join(gameId);
    console.log(`User ${socket.id} joined game ${gameId}`);
  });

  // ゲームルームから離脱
  socket.on('leaveGame', (gameId: string) => {
    socket.leave(gameId);
    console.log(`User ${socket.id} left game ${gameId}`);
  });

  // スコア更新
  socket.on('updateScore', (gameId: string, scoreUpdate: any) => {
    // TODO: データベースにスコア更新を保存
    io.to(gameId).emit('gameUpdate', scoreUpdate);
    console.log(`Score updated for game ${gameId}:`, scoreUpdate);
  });

  // 投稿作成
  socket.on('createPost', (gameId: string, post: any) => {
    // TODO: データベースに投稿を保存
    io.to(gameId).emit('newPost', post);
    console.log(`New post in game ${gameId}:`, post);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
>>>>>>> da8b7b2114e71203c1c8b4bda8fda32937a5634a
  });
});

// サーバー起動
<<<<<<< HEAD
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 WePlay API Server が起動しました`);
  console.log(`📍 ポート: ${PORT}`);
  console.log(`🌍 環境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  console.log('SIGTERM シグナルを受信しました。サーバーをシャットダウンします...');
  server.close(() => {
    console.log('サーバーが正常にシャットダウンされました');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT シグナルを受信しました。サーバーをシャットダウンします...');
  server.close(() => {
    console.log('サーバーが正常にシャットダウンされました');
    process.exit(0);
  });
}); 
=======
const startServer = async () => {
  try {
    // MongoDB接続
    await connectDatabase();
    
    // サーバー起動
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
>>>>>>> da8b7b2114e71203c1c8b4bda8fda32937a5634a
