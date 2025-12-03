const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // Qui a fait l'action
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Type d'action
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT',
      'EXPORT', 'IMPORT', 'BULK_ACTION', 'SETTINGS_CHANGE',
      'PERMISSION_CHANGE', 'ROLE_CHANGE', 'PAYMENT_PROCESSED',
      'BACKUP_CREATED', 'BACKUP_RESTORED', 'SYSTEM_CONFIG',
      'USER_SUSPENDED', 'USER_ACTIVATED', 'PASSWORD_RESET'
    ],
    index: true
  },
  
  // Ressource concernée
  resource: {
    type: String,
    required: true,
    enum: [
      'USER', 'ORDER', 'PRODUCT', 'COURSE', 'CONTENT', 'SETTINGS',
      'PAYMENT', 'MESSAGE', 'QUOTE_REQUEST', 'JOB_APPLICATION',
      'CHATBOT_QUESTION', 'TICKET', 'FORUM_POST', 'FORUM_COMMENT',
      'PERMISSION', 'ROLE', 'BACKUP', 'SYSTEM'
    ],
    index: true
  },
  
  // ID de la ressource
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  
  // Données avant modification
  beforeState: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Données après modification
  afterState: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Description de l'action
  description: {
    type: String,
    required: true
  },
  
  // Détails supplémentaires
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // IP address
  ipAddress: {
    type: String,
    index: true
  },
  
  // User agent
  userAgent: String,
  
  // Statut (success, error, warning)
  status: {
    type: String,
    enum: ['SUCCESS', 'ERROR', 'WARNING'],
    default: 'SUCCESS',
    index: true
  },
  
  // Message d'erreur si applicable
  errorMessage: String,
  
  // Durée de l'opération en ms
  duration: Number,
  
  // Métadonnées
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les requêtes fréquentes
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ status: 1, createdAt: -1 });

// Index pour les recherches de plage de dates
auditLogSchema.index({ createdAt: 1 });

// Virtual pour obtenir les changements
auditLogSchema.virtual('changes').get(function() {
  if (this.beforeState && this.afterState) {
    const changes = {};
    const before = this.beforeState;
    const after = this.afterState;
    
    Object.keys(after).forEach(key => {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changes[key] = {
          before: before[key],
          after: after[key]
        };
      }
    });
    
    return changes;
  }
  return null;
});

// Méthode statique pour créer un log
auditLogSchema.statics.log = async function(data) {
  try {
    const log = await this.create({
      user: data.user,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      beforeState: data.beforeState || null,
      afterState: data.afterState || null,
      description: data.description,
      details: data.details || {},
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: data.status || 'SUCCESS',
      errorMessage: data.errorMessage,
      duration: data.duration,
      metadata: data.metadata || {}
    });
    
    return log;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Ne pas bloquer l'opération si le log échoue
    return null;
  }
};

// Méthode statique pour obtenir les statistiques
auditLogSchema.statics.getStats = async function(startDate, endDate) {
  const matchStage = {};
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalActions: { $sum: 1 },
        byAction: {
          $push: '$action'
        },
        byResource: {
          $push: '$resource'
        },
        byStatus: {
          $push: '$status'
        },
        byUser: {
          $push: '$user'
        }
      }
    },
    {
      $project: {
        totalActions: 1,
        actionCounts: {
          $arrayToObject: {
            $map: {
              input: { $setUnion: '$byAction' },
              as: 'action',
              in: {
                k: '$$action',
                v: {
                  $size: {
                    $filter: {
                      input: '$byAction',
                      cond: { $eq: ['$$this', '$$action'] }
                    }
                  }
                }
              }
            }
          }
        },
        resourceCounts: {
          $arrayToObject: {
            $map: {
              input: { $setUnion: '$byResource' },
              as: 'resource',
              in: {
                k: '$$resource',
                v: {
                  $size: {
                    $filter: {
                      input: '$byResource',
                      cond: { $eq: ['$$this', '$$resource'] }
                    }
                  }
                }
              }
            }
          }
        },
        statusCounts: {
          $arrayToObject: {
            $map: {
              input: { $setUnion: '$byStatus' },
              as: 'status',
              in: {
                k: '$$status',
                v: {
                  $size: {
                    $filter: {
                      input: '$byStatus',
                      cond: { $eq: ['$$this', '$$status'] }
                    }
                  }
                }
              }
            }
          }
        },
        uniqueUsers: { $size: { $setUnion: '$byUser' } }
      }
    }
  ]);
  
  return stats[0] || {
    totalActions: 0,
    actionCounts: {},
    resourceCounts: {},
    statusCounts: {},
    uniqueUsers: 0
  };
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;

