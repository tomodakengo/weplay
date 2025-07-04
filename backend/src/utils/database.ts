import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI環境変数が設定されていません');
    }

    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // IPv4を使用
    };

    await mongoose.connect(mongoUri, options);

    console.log('MongoDB接続成功');

    // 接続エラーのハンドリング
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB接続エラー:', error);
    });

    // 接続が切断された時のハンドリング
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDBとの接続が切断されました');
    });

    // プロセス終了時にMongoDBとの接続を閉じる
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDBとの接続を終了しました');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB接続エラー:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDBとの接続を終了しました');
  } catch (error) {
    console.error('MongoDB切断エラー:', error);
  }
};