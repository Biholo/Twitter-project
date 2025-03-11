import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  type: 'like' | 'retweet' | 'reply' | 'follow' | 'mention';
  message: string;
  is_read: boolean;
  notification_date: Date;
  user_id: mongoose.Types.ObjectId;
  source_id?: mongoose.Types.ObjectId; // ID de l'élément source (tweet, utilisateur, etc.)
  source_type?: string; // Type de la source (Tweet, User, etc.)
  created_at: Date;
  updated_at: Date;
}

const NotificationSchema = new Schema({
  
  type: { 
    type: String, 
    enum: ['like', 'retweet', 'reply', 'follow', 'mention'], 
    required: true 
  },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  notification_date: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Destinataire de la notification
  source_id: { type: Schema.Types.ObjectId, refPath: 'source_type' }, // ID dynamique selon le type de source
  source_type: { type: String, enum: ['Tweet', 'User'] }, // Type de la référence
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index pour optimiser les requêtes par utilisateur et par statut de lecture
NotificationSchema.index({ user_id: 1, is_read: 1 });

// Middleware pour mettre à jour le champ updated_at avant chaque sauvegarde
NotificationSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
