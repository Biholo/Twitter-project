import mongoose, { Schema, Document } from 'mongoose';

export interface ITweetInteraction extends Document {
  user_id: mongoose.Types.ObjectId;
  tweet_id: mongoose.Types.ObjectId;
  actionType: 'like' | 'retweet' | 'bookmark' | 'reply';
  actionDate: Date;
  created_at: Date;
  updated_at: Date;
}

const TweetInteractionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tweet_id: { type: Schema.Types.ObjectId, ref: 'Tweet', required: true },
  actionType: { 
    type: String, 
    enum: ['like', 'retweet', 'bookmark', 'reply'], 
    required: true 
  },
  actionDate: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index composé pour éviter les doublons d'interactions du même type par le même utilisateur sur le même tweet
TweetInteractionSchema.index({ user_id: 1, tweet_id: 1, actionType: 1 }, { unique: true });

// Middleware pour mettre à jour le champ updated_at avant chaque sauvegarde
TweetInteractionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<ITweetInteraction>('TweetInteraction', TweetInteractionSchema);
