import mongoose, { Schema, Document } from 'mongoose';

export interface ITweetHashtag extends Document {
  tweet_id: mongoose.Types.ObjectId;
  hashtag_id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const TweetHashtagSchema = new Schema({
  tweet_id: { type: Schema.Types.ObjectId, ref: 'Tweet', required: true },
  hashtag_id: { type: Schema.Types.ObjectId, ref: 'Hashtag', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index composé pour éviter les doublons de hashtags dans un même tweet
TweetHashtagSchema.index({ tweetId: 1, hashtagId: 1 }, { unique: true });

// Middleware pour mettre à jour le champ updated_at avant chaque sauvegarde
TweetHashtagSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<ITweetHashtag>('TweetHashtag', TweetHashtagSchema);
