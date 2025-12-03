const mongoose = require('mongoose');

const forumNotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'post_reply',           // Quelqu'un a répondu à votre sujet
      'comment_reply',        // Quelqu'un a répondu à votre commentaire
      'post_like',           // Quelqu'un a liké votre sujet
      'comment_like',        // Quelqu'un a liké votre commentaire
      'solution_marked',     // Votre réponse a été marquée comme solution
      'mention',             // Vous avez été mentionné
      'badge_earned',        // Vous avez obtenu un badge
      'level_up',            // Vous avez monté de niveau
      'post_pinned',         // Votre sujet a été épinglé
      'post_locked',         // Votre sujet a été verrouillé
      'content_reported',    // Votre contenu a été signalé
      'content_removed',     // Votre contenu a été supprimé
      'warning',             // Avertissement de modération
      'following_post'       // Nouvelle activité sur un sujet que vous suivez
    ],
    required: true
  },
  
  // Contenu de la notification
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Lien vers le contenu concerné
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost'
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumComment'
  },
  
  // Données supplémentaires
  metadata: {
    badgeName: String,
    level: Number,
    points: Number,
    reason: String
  },
  
  // État de la notification
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  
  // Priorité
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Email envoyé
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  }
  
}, {
  timestamps: true
});

// Index composés pour améliorer les performances
forumNotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
forumNotificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });
forumNotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Expire après 30 jours

// Méthode pour marquer comme lu
forumNotificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Méthode statique pour marquer toutes les notifications d'un user comme lues
forumNotificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Méthode statique pour créer une notification
forumNotificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  
  // TODO: Émettre un événement Socket.io pour notification temps réel
  // socketService.emitToUser(data.recipient, 'new_notification', notification);
  
  // TODO: Envoyer un email si l'utilisateur a activé les notifications par email
  // if (user.preferences.emailNotifications) {
  //   await emailService.sendNotification(user.email, notification);
  // }
  
  return notification;
};

// Méthode statique pour obtenir les notifications non lues d'un user
forumNotificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ recipient: userId, isRead: false });
};

module.exports = mongoose.model('ForumNotification', forumNotificationSchema);

