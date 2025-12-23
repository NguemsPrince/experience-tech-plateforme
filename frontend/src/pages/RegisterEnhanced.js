import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { FormInput, FormCheckbox } from '../components/forms';
import { registerSchema } from '../utils/validationSchemas';
import LoadingButton from '../components/LoadingButton';

/**
 * Page d'inscription améliorée avec validation Zod
 */
const RegisterEnhanced = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isValid } 
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const password = watch('password');

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/client', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Calculer la force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort', 'Très fort'];
    const colors = ['bg-blue-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-600'];
    
    return {
      strength: Math.min(strength, 5),
      label: labels[Math.min(strength, 5)],
      color: colors[Math.min(strength, 5)]
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Enlever confirmPassword avant l'envoi
      const { confirmPassword, acceptTerms, ...userData } = data;
      
      const result = await registerUser(userData);
      
      if (result.success) {
        toast.success('🎉 Inscription réussie ! Bienvenue chez Expérience Tech');
        
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' }
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  // Liste des avantages
  const benefits = [
    'Accès à toutes nos formations en ligne',
    'Suivi personnalisé de vos projets',
    'Support technique prioritaire',
    'Certificats de réussite',
    'Communauté active de professionnels'
  ];

  return (
    <>
      <Helmet>
        <title>Inscription - Expérience Tech</title>
        <meta name="description" content="Créez votre compte Expérience Tech et accédez à nos formations, services et outils professionnels." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full mx-auto flex gap-8">
          {/* Colonne de gauche - Avantages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-1 flex-col justify-center"
          >
            <div className="mb-8">
              <Logo size="large" showText={true} />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rejoignez Expérience Tech
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Créez votre compte gratuitement et accédez à nos services professionnels
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start"
                >
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Colonne de droite - Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Header */}
              <div className="text-center mb-8 lg:hidden">
                <div className="flex justify-center mb-4">
                  <Logo size="medium" showText={true} />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Créer un compte
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Remplissez le formulaire pour commencer
              </p>
              
              {/* Formulaire */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nom et Prénom */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Prénom"
                    name="firstName"
                    placeholder="Jean"
                    register={register}
                    error={errors.firstName}
                    icon={UserIcon}
                    autoComplete="given-name"
                    required
                  />
                  
                  <FormInput
                    label="Nom"
                    name="lastName"
                    placeholder="Dupont"
                    register={register}
                    error={errors.lastName}
                    icon={UserIcon}
                    autoComplete="family-name"
                    required
                  />
                </div>

                {/* Email */}
                <FormInput
                  label="Adresse email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  register={register}
                  error={errors.email}
                  icon={EnvelopeIcon}
                  autoComplete="email"
                  required
                />

                {/* Téléphone */}
                <FormInput
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  placeholder="+235 XX XX XX XX"
                  register={register}
                  error={errors.phone}
                  icon={PhoneIcon}
                  autoComplete="tel"
                  helperText="Format: +235XXXXXXXX"
                />

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                    <span className="text-blue-500 ml-1">*</span>
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`
                        block w-full rounded-lg border pl-10 pr-10 py-2.5
                        text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${errors.password 
                          ? 'border-blue-300 focus:ring-blue-500' 
                          : 'border-gray-300'
                        }
                      `}
                      {...register('password')}
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  {/* Indicateur de force du mot de passe */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        {[...Array(6)].map((_, index) => (
                          <div
                            key={index}
                            className={`h-1 flex-1 rounded-full ${
                              index < passwordStrength.strength
                                ? passwordStrength.color
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        Force: <span className="font-medium">{passwordStrength.label}</span>
                      </p>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-1 text-sm text-blue-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirmation mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                    <span className="text-blue-500 ml-1">*</span>
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`
                        block w-full rounded-lg border pl-10 pr-10 py-2.5
                        text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${errors.confirmPassword 
                          ? 'border-blue-300 focus:ring-blue-500' 
                          : 'border-gray-300'
                        }
                      `}
                      {...register('confirmPassword')}
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-blue-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Accepter les conditions */}
                <FormCheckbox
                  label={
                    <span>
                      J'accepte les{' '}
                      <Link to="/terms" className="text-blue-600 hover:underline">
                        conditions d'utilisation
                      </Link>
                      {' '}et la{' '}
                      <Link to="/privacy" className="text-blue-600 hover:underline">
                        politique de confidentialité
                      </Link>
                    </span>
                  }
                  name="acceptTerms"
                  register={register}
                  error={errors.acceptTerms}
                  required
                />

                {/* Bouton d'inscription */}
                <LoadingButton
                  type="submit"
                  isLoading={isLoading}
                  disabled={!isValid || isLoading}
                  className="w-full"
                  loadingText="Création du compte..."
                >
                  Créer mon compte
                </LoadingButton>

                {/* Lien vers la connexion */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Vous avez déjà un compte ?{' '}
                    <Link 
                      to="/login" 
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Connectez-vous
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterEnhanced;

