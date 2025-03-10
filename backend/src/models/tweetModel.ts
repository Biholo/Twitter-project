import mongoose, { Schema, Document } from 'mongoose';

export interface ITweet extends Document {
  content?: string;
  post_date: Date;
  author_id: mongoose.Types.ObjectId;
  parent_tweet_id?: mongoose.Types.ObjectId;
  tweet_type: 'tweet' | 'reply' | 'retweet';
  likes_count: number;
  retweets_count: number;
  bookmarks_count: number;
  media_url?: string;
  is_edited: boolean;
  created_at: Date;
  updated_at: Date;
}

const TweetSchema = new Schema({
  content: { type: String, maxlength: 280 },
  post_date: { type: Date, default: Date.now },
  author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent_tweet_id: { type: Schema.Types.ObjectId, ref: 'Tweet', default: null },
  tweet_type: { 
    type: String, 
    enum: ['tweet', 'reply', 'retweet'], 
    required: true,
    default: 'tweet'
  },
  likes_count: { type: Number, default: 0 },
  retweets_count: { type: Number, default: 0 },
  bookmarks_count: { type: Number, default: 0 },
  media_url: { type: String },
  is_edited: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Middleware pour mettre à jour le champ updated_at avant chaque sauvegarde
TweetSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<ITweet>('Tweet', TweetSchema);
