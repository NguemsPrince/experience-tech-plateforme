import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { CalendarIcon, UserIcon, TagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const News = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const articles = [
    {
      id: 1,
      title: 'Nouvelle formation en Intelligence Artificielle disponible',
      excerpt: 'Découvrez notre nouvelle formation complète en IA et machine learning, adaptée aux professionnels et étudiants.',
      content: 'Contenu complet de l\'article...',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3',
      category: 'Formation',
      author: 'Équipe Expérience Tech',
      publishedAt: '2024-01-15',
      tags: ['IA', 'Formation', 'Technologie'],
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Expérience Tech lance son nouveau service de cloud computing',
      excerpt: 'Nous étendons nos services avec des solutions cloud sécurisées et évolutives pour les entreprises.',
      content: 'Contenu complet de l\'article...',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3',
      category: 'Services',
      author: 'Jean Paul Mballa',
      publishedAt: '2024-01-10',
      tags: ['Cloud', 'Services', 'Innovation'],
      readTime: '3 min'
    },
    {
      id: 3,
      title: 'Partenariat stratégique avec Microsoft Cameroun',
      excerpt: 'Expérience Tech s\'associe avec Microsoft pour offrir des solutions Microsoft 365 aux entreprises camerounaises.',
      content: 'Contenu complet de l\'article...',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3',
      category: 'Partenariat',
      author: 'Marie Claire Nguema',
      publishedAt: '2024-01-05',
      tags: ['Partenariat', 'Microsoft', 'Collaboration'],
      readTime: '4 min'
    }
  ];

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async () => {
    if (!email || !isValidEmail(email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setIsSubscribing(true);
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubscribed(true);
      toast.success('Abonnement réussi ! Vous recevrez nos dernières actualités.');
      setEmail(''); // Optionnel : vider le champ après succès
      
      // Réinitialiser après 5 secondes pour permettre un nouveau test
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    } catch (error) {
      toast.error('Erreur lors de l\'abonnement. Veuillez réessayer.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Actualités & Blog - Expérience Tech</title>
        <meta name="description" content="Restez informé des dernières actualités, formations et innovations technologiques d'Expérience Tech au Cameroun." />
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Actualités & Blog
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Restez informé de nos dernières actualités et innovations
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src={articles[0].image}
                alt={articles[0].title}
                className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 mb-4">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {articles[0].category}
                </span>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-sm">{articles[0].readTime} de lecture</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {articles[0].title}
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                {articles[0].excerpt}
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <UserIcon className="w-4 h-4" />
                  <span>{articles[0].author}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(articles[0].publishedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              
              <button 
                className="btn-primary"
                onClick={() => {
                  window.location.href = `/news/${articles[0].id}`;
                }}
              >
                Lire l'article complet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article) => (
              <article key={article.id} className="card-hover">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {article.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TagIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                    </div>
                    <button 
                      className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                      onClick={() => {
                        window.location.href = `/news/${article.id}`;
                      }}
                    >
                      Lire la suite →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              Restez informé
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Abonnez-vous à notre newsletter pour recevoir nos dernières actualités et offres.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubscribe();
                  }
                }}
                className={`flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none ${
                  email && !isValidEmail(email) ? 'border-2 border-red-500' : ''
                }`}
                disabled={isSubscribed || isSubscribing}
              />
              <button 
                onClick={handleSubscribe}
                disabled={isSubscribed || isSubscribing || !email || !isValidEmail(email)}
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isSubscribing ? (
                  <span className="animate-spin">⏳</span>
                ) : isSubscribed ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Abonné
                  </>
                ) : (
                  "S'abonner"
                )}
              </button>
            </div>
            {email && !isValidEmail(email) && (
              <p className="text-red-300 text-sm mt-2">Veuillez entrer une adresse email valide</p>
            )}
            {isSubscribed && (
              <p className="text-green-300 text-sm mt-2 flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Vous êtes maintenant abonné à notre newsletter !
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default News;
