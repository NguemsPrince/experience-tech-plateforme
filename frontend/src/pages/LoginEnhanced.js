import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../components/forms';
import { loginSchema } from '../utils/validationSchemas';
import LoadingButton from '../components/LoadingButton';

/**
 * Page de connexion améliorée avec validation Zod
 */
const LoginEnhanced = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/client';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      
      if (result.success) {
        toast.success('Connexion réussie ! Bienvenue 👋');
        
        // Rediriger vers la page d'origine ou le dashboard
        const from = location.state?.from?.pathname || '/client';
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion - Expérience Tech</title>
        <meta name="description" content="Connectez-vous à votre compte Expérience Tech pour accéder à vos services, formations et projets." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="large" showText={true} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Bon retour !
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Connectez-vous pour accéder à votre espace
              </p>
            </div>
            
            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              {/* Mot de passe */}
              <div className="relative">
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
                    autoComplete="current-password"
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
                
                {errors.password && (
                  <p className="mt-1 text-sm text-blue-600">{errors.password.message}</p>
                )}
              </div>

              {/* Options supplémentaires */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              {/* Bouton de connexion */}
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                disabled={!isValid || isLoading}
                className="w-full"
                loadingText="Connexion en cours..."
              >
                <span className="flex items-center justify-center">
                  Se connecter
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </span>
              </LoadingButton>

              {/* Séparateur */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou</span>
                </div>
              </div>

              {/* Lien vers l'inscription */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas de compte ?{' '}
                  <Link 
                    to="/register" 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Inscrivez-vous gratuitement
                  </Link>
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                En vous connectant, vous acceptez nos{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Conditions d'utilisation
                </Link>
                {' '}et notre{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Politique de confidentialité
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Mode démo - Pour les tests */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <p className="text-xs text-yellow-800 font-medium mb-2">
                🧪 Mode Développement - Comptes de test :
              </p>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>👤 Utilisateur: <code className="bg-yellow-100 px-1 rounded">user@test.com</code> / <code className="bg-yellow-100 px-1 rounded">Test123</code></p>
                <p>👑 Admin: <code className="bg-yellow-100 px-1 rounded">admin@test.com</code> / <code className="bg-yellow-100 px-1 rounded">Admin123</code></p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginEnhanced;

