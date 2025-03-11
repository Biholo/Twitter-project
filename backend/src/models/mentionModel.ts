import mongoose, { Schema, Document } from 'mongoose';

export interface IMention extends Document {
  tweet_id: mongoose.Types.ObjectId;
  mentioned_user_id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const MentionSchema = new Schema({
  tweet_id: { type: Schema.Types.ObjectId, ref: 'Tweet', required: true },
  mentioned_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index composé pour éviter les doublons de mentions d'un même utilisateur dans un même tweet
MentionSchema.index({ tweet_id: 1, mentioned_user_id: 1 }, { unique: true });

// Middleware pour mettre à jour le champ updated_at avant chaque sauvegarde
MentionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IMention>('Mention', MentionSchema);
