import mongoose, { Schema, Document } from 'mongoose';

export enum TweetInteractionType {
  LIKE = 'like',
  RETWEET = 'retweet',
  BOOKMARK = 'bookmark',
}

export interface ITweetInteraction extends Document {
  user_id: mongoose.Types.ObjectId;
  tweet_id: mongoose.Types.ObjectId;
  action_type: TweetInteractionType;
  action_date: Date;
  created_at: Date;
  updated_at: Date;
}

const TweetInteractionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tweet_id: { type: Schema.Types.ObjectId, ref: 'Tweet', required: true },
  action_type: { 
    type: String, 
    enum: Object.values(TweetInteractionType), 
    required: true 
  },
  action_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Middleware pour mettre à jour le champ updated_at avant chaque sauvegarde
TweetInteractionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<ITweetInteraction>('TweetInteraction', TweetInteractionSchema);
