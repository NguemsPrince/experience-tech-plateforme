import { z } from 'zod';

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom ne peut contenir que des lettres'),
  
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres'),
  
  email: z.string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  
  confirmPassword: z.string(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(1, 'Le mot de passe est requis')
});

// Schéma de validation pour la mise à jour du profil
export const updateProfileSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .optional(),
  
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .optional(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  
  street: z.string().max(100).optional().or(z.literal('')),
  city: z.string().max(50).optional().or(z.literal('')),
  state: z.string().max(50).optional().or(z.literal('')),
  zipCode: z.string().max(20).optional().or(z.literal('')),
  country: z.string().max(50).optional().or(z.literal('')),
  
  companyName: z.string().max(100).optional().or(z.literal('')),
  position: z.string().max(100).optional().or(z.literal('')),
  industry: z.string().max(50).optional().or(z.literal(''))
});

// Schéma de validation pour le changement de mot de passe
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Le mot de passe actuel est requis'),
  
  newPassword: z.string()
    .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmNewPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Le nouveau mot de passe doit être différent de l\'ancien',
  path: ['newPassword']
});

// Schéma de validation pour le formulaire de contact
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  email: z.string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  
  subject: z.string()
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
});

// Schéma de validation pour l'inscription à une formation
export const courseEnrollmentSchema = z.object({
  courseId: z.string().min(1, 'ID du cours requis'),
  
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  
  email: z.string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide'),
  
  company: z.string().optional().or(z.literal('')),
  position: z.string().optional().or(z.literal('')),
  
  experience: z.enum(['debutant', 'intermediaire', 'avance'], {
    errorMap: () => ({ message: 'Sélectionnez votre niveau d\'expérience' })
  }),
  
  motivation: z.string()
    .min(20, 'Veuillez décrire votre motivation en au moins 20 caractères')
    .max(500, 'La motivation ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
  
  paymentMethod: z.enum(['card', 'mobile_money', 'bank_transfer'], {
    errorMap: () => ({ message: 'Sélectionnez un mode de paiement' })
  })
});

// Schéma de validation pour la demande de devis
export const quoteRequestSchema = z.object({
  serviceId: z.string().min(1, 'ID du service requis'),
  
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  email: z.string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide'),
  
  company: z.string().max(100).optional().or(z.literal('')),
  
  description: z.string()
    .min(20, 'Veuillez décrire votre projet en au moins 20 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  
  budget: z.string().optional().or(z.literal('')),
  
  deadline: z.string().optional().or(z.literal('')),
  
  requirements: z.array(z.string()).optional()
});

// Schéma de validation pour la candidature
export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, 'ID de l\'offre requis'),
  
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  
  email: z.string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide'),
  
  currentPosition: z.string().max(100).optional().or(z.literal('')),
  
  linkedIn: z.string()
    .url('URL LinkedIn invalide')
    .optional()
    .or(z.literal('')),
  
  portfolio: z.string()
    .url('URL du portfolio invalide')
    .optional()
    .or(z.literal('')),
  
  experience: z.string()
    .min(50, 'Veuillez décrire votre expérience en au moins 50 caractères')
    .max(2000, 'L\'expérience ne peut pas dépasser 2000 caractères'),
  
  motivation: z.string()
    .min(50, 'Veuillez décrire votre motivation en au moins 50 caractères')
    .max(1000, 'La motivation ne peut pas dépasser 1000 caractères'),
  
  availability: z.string().optional().or(z.literal('')),
  
  expectedSalary: z.string().optional().or(z.literal(''))
});

// Schéma de validation pour l'ajout d'un témoignage
export const testimonialSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  company: z.string().max(100).optional().or(z.literal('')),
  
  position: z.string().max(100).optional().or(z.literal('')),
  
  rating: z.number()
    .int()
    .min(1, 'La note minimum est 1')
    .max(5, 'La note maximum est 5'),
  
  comment: z.string()
    .min(20, 'Le témoignage doit contenir au moins 20 caractères')
    .max(500, 'Le témoignage ne peut pas dépasser 500 caractères'),
  
  serviceType: z.enum(['formation', 'service', 'produit', 'autre'], {
    errorMap: () => ({ message: 'Sélectionnez le type de service' })
  }).optional()
});

// Schéma de validation pour la création d'un post forum
export const forumPostSchema = z.object({
  title: z.string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  
  category: z.string()
    .min(1, 'Sélectionnez une catégorie'),
  
  content: z.string()
    .min(20, 'Le contenu doit contenir au moins 20 caractères')
    .max(5000, 'Le contenu ne peut pas dépasser 5000 caractères'),
  
  tags: z.array(z.string()).max(5, 'Maximum 5 tags').optional()
});

// Schéma de validation pour les commentaires forum
export const forumCommentSchema = z.object({
  content: z.string()
    .min(5, 'Le commentaire doit contenir au moins 5 caractères')
    .max(2000, 'Le commentaire ne peut pas dépasser 2000 caractères')
});

// Schéma de validation pour les tickets de support
export const supportTicketSchema = z.object({
  subject: z.string()
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  
  category: z.enum(['technique', 'facturation', 'formation', 'autre'], {
    errorMap: () => ({ message: 'Sélectionnez une catégorie' })
  }),
  
  priority: z.enum(['basse', 'normale', 'haute', 'urgente'], {
    errorMap: () => ({ message: 'Sélectionnez une priorité' })
  }),
  
  description: z.string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
});

// Schéma de validation pour le paiement
export const paymentSchema = z.object({
  amount: z.number()
    .positive('Le montant doit être positif')
    .min(1, 'Le montant minimum est 1'),
  
  method: z.enum(['card', 'mobile_money', 'bank_transfer'], {
    errorMap: () => ({ message: 'Sélectionnez un mode de paiement' })
  }),
  
  // Pour Mobile Money
  phoneNumber: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide')
    .optional(),
  
  provider: z.enum(['orange', 'mtn', 'moov'], {
    errorMap: () => ({ message: 'Sélectionnez un opérateur' })
  }).optional(),
  
  // Pour carte bancaire (géré par Stripe)
  saveCard: z.boolean().optional()
});

// Export par défaut de tous les schémas
export default {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  contactSchema,
  courseEnrollmentSchema,
  quoteRequestSchema,
  jobApplicationSchema,
  testimonialSchema,
  forumPostSchema,
  forumCommentSchema,
  supportTicketSchema,
  paymentSchema
};

