import mongoose, { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
  follower_id: mongoose.Types.ObjectId;
  following_id: mongoose.Types.ObjectId;
  follow_date: Date;
  created_at: Date;
  updated_at: Date;
}

const FollowSchema = new Schema({
  follower_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  following_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  follow_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index composé pour éviter qu'un utilisateur suive plusieurs fois la même personne
FollowSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

// Middleware pour mettre à jour le champ updated_at avant chaque sauvegarde
FollowSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IFollow>('Follow', FollowSchema);
