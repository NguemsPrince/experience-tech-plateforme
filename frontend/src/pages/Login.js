import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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
        const isClient = !isAdmin && (userRole === 'client' || userRole === 'student' || userRole === 'user');
        
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

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Bouton de retour */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Retour
            </button>
          </div>

          {/* Conteneur principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            {/* Header avec logo et titre */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="large" showText={true} showTagline={true} />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-6">
                {t('auth.login.title') || 'Connexion à votre compte'}
              </h1>
              <p className="mt-3 text-base text-gray-600">
                {t('auth.login.subtitle') || 'Connectez-vous à votre compte'}
              </p>
            </div>

            {/* Avertissement si le backend n'est pas accessible */}
            {backendStatus === false && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Serveur backend non accessible
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Le serveur backend n'est pas démarré. Pour démarrer le backend :</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Ouvrez un terminal dans le dossier du projet</li>
                        <li>Exécutez : <code className="bg-yellow-100 px-1 rounded">./demarrer-plateforme.sh</code></li>
                        <li>Ou démarrez manuellement : <code className="bg-yellow-100 px-1 rounded">cd backend && npm start</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Formulaire */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('auth.login.email') || 'Adresse email'}
                </label>
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  type="email"
                  className={`mt-1 input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('auth.login.password') || 'Mot de passe'}
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', {
                      required: 'Le mot de passe est requis'
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    {t('auth.login.rememberMe')}
                  </label>
                </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="loading-spinner w-5 h-5"></div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>

            {/* Lien vers l'inscription */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="font-medium text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
