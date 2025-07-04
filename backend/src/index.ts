import express from 'express';
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
  });
});

// サーバー起動
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