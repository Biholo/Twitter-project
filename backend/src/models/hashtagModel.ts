import mongoose, { Schema, Document } from 'mongoose';

export interface IHashtag extends Document {
  label: string;
  created_at: Date;
  updated_at: Date;
}

const HashtagSchema = new Schema({
  label: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Middleware pour mettre à jour le champ updated_at avant chaque sauvegarde
HashtagSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IHashtag>('Hashtag', HashtagSchema);
