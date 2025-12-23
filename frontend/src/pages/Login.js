import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import toast from 'react-hot-toast';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToCart } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null); // null = vérification en cours, true = OK, false = KO
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Gérer la redirection depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const redirectParam = urlParams.get('redirect');
    if (redirectParam) {
      // Stocker la redirection dans le state pour l'utiliser après connexion
      navigate(location.pathname, { 
        state: { from: { pathname: redirectParam } },
        replace: true 
      });
    }
  }, [location.search, navigate, location.pathname]);

  // Vérifier le statut du backend au chargement (silencieusement, sans déclencher de toast)
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    let controller;
    
    const checkBackend = async () => {
      try {
        controller = new AbortController();
        timeoutId = setTimeout(() => {
          if (controller) controller.abort();
        }, 3000); // Timeout de 3 secondes
        
        const response = await fetch('http://localhost:5000/api/health', {
          method: 'GET',
          signal: controller.signal,
          // Ne pas déclencher de toast pour cette vérification
          headers: {
            'X-Silent-Check': 'true' // Marquer comme vérification silencieuse
          }
        });
        
        if (timeoutId) clearTimeout(timeoutId);
        
        if (isMounted) {
          if (response.ok) {
            setBackendStatus(true);
          } else {
            setBackendStatus(false);
          }
        }
      } catch (err) {
        // Backend non accessible - c'est normal au démarrage
        // Ne pas afficher de toast, juste mettre à jour le statut
        if (isMounted) {
          setBackendStatus(false);
        }
      }
    };

    // Ne vérifier qu'après un court délai pour éviter les requêtes inutiles
    const delayId = setTimeout(checkBackend, 1000);
    
    return () => {
      isMounted = false;
      if (delayId) clearTimeout(delayId);
      if (timeoutId) clearTimeout(timeoutId);
      if (controller) controller.abort();
    };
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      if (result.success) {
        // Vérifier le rôle de l'utilisateur pour rediriger correctement
        // Récupérer le rôle depuis plusieurs sources possibles pour être sûr
        const userRole = result.data?.user?.role || 
                        JSON.parse(localStorage.getItem('user') || '{}')?.role || 
                        'client';
        
        console.log('🔐 [Login] Rôle utilisateur détecté:', userRole);
        
        // SÉCURITÉ CRITIQUE : Vérifier explicitement le rôle avant toute redirection
        // Seuls admin, super_admin et moderator peuvent accéder au dashboard admin
        const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
        const isAdmin = allowedAdminRoles.includes(userRole);
        
        // Vérifier s'il y a une formation en attente à ajouter au panier
        const pendingCourseJson = localStorage.getItem('pendingCourseToAdd');
        const courseToAdd = location.state?.courseToAdd || (pendingCourseJson ? JSON.parse(pendingCourseJson) : null);
        
        if (courseToAdd) {
          try {
            addToCart({ ...courseToAdd, itemType: 'course' });
            localStorage.removeItem('pendingCourseToAdd');
            toast.success(`${courseToAdd.title} a été ajouté à votre panier !`);
          } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
          }
        }
        
        // Rediriger selon le rôle de l'utilisateur et la page d'origine
        let redirectPath = '/'; // Par défaut vers la page d'accueil pour tous les utilisateurs
        
        // Utiliser la page d'origine si elle existe et si elle est appropriée
        const from = location.state?.from?.pathname || location.state?.from;
        if (from && from !== '/admin/login' && from !== '/login') {
          // SÉCURITÉ : Ne JAMAIS rediriger vers /admin si l'utilisateur n'est pas admin
          if (from.startsWith('/admin')) {
            if (!isAdmin) {
              console.warn('🚫 [Login] Tentative de redirection vers /admin bloquée pour non-admin');
              redirectPath = '/'; // Rediriger vers la page d'accueil
            } else {
              redirectPath = from;
            }
          } else {
            // Pour les routes non-admin, utiliser la page d'origine
            redirectPath = from;
          }
        } else if (isAdmin) {
          // SEULEMENT si l'utilisateur est explicitement admin ou super_admin et pas de page d'origine
          redirectPath = '/admin';
          toast.success('Connexion réussie en tant qu\'administrateur !');
          console.log('✅ [Login] Redirection vers /admin pour admin');
        } else {
          // Pour les utilisateurs normaux sans page d'origine, rester sur la page d'accueil
          redirectPath = '/';
          console.log('✅ [Login] Redirection vers la page d\'accueil pour utilisateur non-admin');
        }
        
        console.log('🔄 [Login] Redirection finale vers:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        // Afficher le message d'erreur traduit
        if (result.message === 'Identifiants invalides') {
          toast.error(t('auth.login.invalidCredentials'));
        } else {
          toast.error(result.message || t('auth.login.invalidCredentials'));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Vérifier si c'est une erreur réseau
      const isNetworkError = !error.response && (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('Failed to fetch')
      );
      
      if (isNetworkError) {
        toast.error('Le serveur backend n\'est pas accessible. Veuillez démarrer le serveur backend sur http://localhost:5000');
      } else {
        toast.error(t('auth.login.invalidCredentials'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const from = location.state?.from?.pathname || location.state?.from || '/';
    navigate(from);
  };

  return (
    <>
      <Helmet>
        <title>Connexion - Expérience Tech</title>
        <meta name="description" content="Connectez-vous à votre compte Expérience Tech pour accéder à vos services et formations." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -left-10 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-slate-200 hover:text-white transition-colors duration-200 mb-6 text-sm font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Retour
          </button>

          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <Logo size="large" showText showTagline className="mb-4" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {t('auth.login.title') || 'Connexion'}
                </h1>
                <p className="mt-2 text-slate-600">
                  {t('auth.login.subtitle') || 'Accédez à votre compte en toute sécurité'}
                </p>
              </div>

              {backendStatus === false && (
                <div className="mb-6 flex items-start space-x-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Serveur backend non accessible</p>
                    <p className="mt-1 text-sm text-amber-700">
                      Démarrez le backend :{' '}
                      <code className="bg-amber-100 px-1 rounded">cd backend && npm start</code>
                    </p>
                  </div>
                </div>
              )}
            
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                      {t('auth.login.email') || 'Adresse email'}
                    </label>
                    <div className="mt-2 relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <EnvelopeIcon className="w-5 h-5" />
                      </span>
                      <input
                        {...register('email', {
                          required: 'L\'email est requis',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email invalide'
                          }
                        })}
                        type="email"
                        className={`block w-full rounded-xl border px-10 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                          errors.email ? 'border-blue-500 ring-blue-100' : 'border-slate-200'
                        }`}
                        placeholder="votre@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-blue-600 flex items-center space-x-1">
                        <XCircleIcon className="w-4 h-4" />
                        <span>{errors.email.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      {t('auth.login.password') || 'Mot de passe'}
                    </label>
                    <div className="mt-2 relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <LockClosedIcon className="w-5 h-5" />
                      </span>
                      <input
                        {...register('password', {
                          required: 'Le mot de passe est requis'
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`block w-full rounded-xl border px-10 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition pr-12 ${
                          errors.password ? 'border-blue-500 ring-blue-100' : 'border-slate-200'
                        }`}
                        placeholder="Votre mot de passe"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-blue-600 flex items-center space-x-1">
                        <XCircleIcon className="w-4 h-4" />
                        <span>{errors.password.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm text-slate-700">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>{t('auth.login.rememberMe') || 'Se souvenir de moi'}</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Se connecter'
                  )}
                </motion.button>

                <div className="text-center text-sm text-slate-600">
                  <span>Pas encore de compte ? </span>
                  <Link
                    to="/register"
                    className="font-semibold text-primary-600 hover:text-primary-500"
                  >
                    Créer un compte
                  </Link>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
