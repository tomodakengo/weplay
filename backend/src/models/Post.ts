import mongoose, { Document, Schema } from 'mongoose';

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

export interface IPost extends Document {
  gameId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: PostType;
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'ゲームIDは必須です'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ユーザーIDは必須です'],
    },
    type: {
      type: String,
      enum: Object.values(PostType),
      required: [true, '投稿タイプは必須です'],
    },
    content: {
      type: String,
      required: [true, 'コンテンツは必須です'],
      trim: true,
      maxlength: [500, 'コンテンツは500文字以下である必要があります'],
    },
    mediaUrl: {
      type: String,
      default: null,
      validate: {
        validator: function(this: IPost, value: string) {
          // メディア投稿の場合はmediaUrlが必須
          if ((this.type === PostType.PHOTO || this.type === PostType.VIDEO) && !value) {
            return false;
          }
          return true;
        },
        message: 'メディア投稿の場合はメディアURLが必要です',
      },
    },
    mediaType: {
      type: String,
      enum: Object.values(MediaType),
      default: null,
      validate: {
        validator: function(this: IPost, value: string) {
          // メディア投稿の場合はmediaTypeが必須
          if ((this.type === PostType.PHOTO || this.type === PostType.VIDEO) && !value) {
            return false;
          }
          // 写真投稿の場合はIMAGE、動画投稿の場合はVIDEO
          if (this.type === PostType.PHOTO && value !== MediaType.IMAGE) {
            return false;
          }
          if (this.type === PostType.VIDEO && value !== MediaType.VIDEO) {
            return false;
          }
          return true;
        },
        message: 'メディアタイプが投稿タイプと一致しません',
      },
    },
  },
  {
    timestamps: true,
  }
);

// インデックス設定
PostSchema.index({ gameId: 1, createdAt: -1 });
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ type: 1 });

export default mongoose.model<IPost>('Post', PostSchema);