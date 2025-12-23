import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { IMAGES, handleImageError } from '../config/images';
import { 
  ArrowRightIcon,
  CheckCircleIcon,
  UserGroupIcon,
  CogIcon,
  AcademicCapIcon,
  PrinterIcon,
  TruckIcon,
  WifiIcon,
  SparklesIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import CountUp from 'react-countup';
import { InView } from 'react-intersection-observer';

// Import components
import HeroSlider from '../components/HeroSlider';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import { SolarAnimation } from '../components/animations';

const Home = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 'digital',
      title: t('services.digital.title'),
      description: 'Solutions numériques complètes pour votre transformation digitale',
      icon: CogIcon,
      image: '/images/services/solution-numerique.png',
      features: [
        'Développement Web & Mobile',
        'Logiciels sur mesure',
        'Maintenance IT',
        'Conseil Technologique'
      ],
      href: '/services/digital'
    },
    {
      id: 'training',
      title: t('services.training.title'),
      description: 'Formations professionnelles certifiantes',
      icon: AcademicCapIcon,
      image: '/images/services/formation-professionnelle.jpg',
      features: [
        'Formations IT',
        'Bureautique',
        'Certifications',
        'Formations sur mesure'
      ],
      href: '/services/training'
    },
    {
      id: 'printing',
      title: t('services.printing.title'),
      description: 'Services d\'impression et design professionnel',
      icon: PrinterIcon,
      image: '/images/services/Impression.jpg',
      features: [
        'Affiches & Banderoles',
        'Cartes de visite',
        'Brochures',
        'Emballages'
      ],
      href: '/services/printing'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Informatique',
      description: 'Support technique et maintenance préventive de vos équipements IT',
      icon: WrenchScrewdriverIcon,
      image: '/images/services/Maintenance-informatique.avif',
      features: [
        'Support technique 24/7',
        'Maintenance préventive',
        'Réparation d\'équipements',
        'Mise à jour et optimisation'
      ],
      href: '/services/maintenance'
    },
    {
      id: 'networks',
      title: t('services.networks.title'),
      description: 'Solutions réseaux et connectivité',
      icon: WifiIcon,
      image: '/images/services/reseaux-infrastructures.jpg',
      features: [
        'Configuration réseaux',
        'Supervision',
        'Maintenance',
        'Sécurité'
      ],
      href: '/services/networks'
    },
    {
      id: 'commerce',
      title: t('services.commerce.title'),
      description: 'Commerce et import-export de matériel IT',
      icon: TruckIcon,
      image: '/images/services/commerce-import-export.jpg',
      features: [
        'Import équipements',
        'Distribution',
        'Conseil commercial',
        'Logistique'
      ],
      href: '/services/commerce'
    }
  ];

  const stats = [
    { number: 5, suffix: '+', label: t('home.stats.experience') },
    { number: 500, suffix: '+', label: t('home.stats.clients') },
    { number: 1000, suffix: '+', label: t('home.stats.projects') },
    { number: 50, suffix: '+', label: t('home.stats.certifications') }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Amina Mahamat',
      position: 'Directrice IT, Entreprise ABC',
      content: 'Expérience Tech nous a accompagnés dans notre transformation digitale. Leur expertise et leur professionnalisme sont remarquables.',
      rating: 5,
      avatar: IMAGES.testimonials.avatar1,
      fallbackAvatar: IMAGES.testimonials.avatar1
    },
    {
      id: 2,
      name: 'Mahamat Saleh',
      position: 'CEO, Startup XYZ',
      content: 'Les formations dispensées par Expérience Tech sont de qualité exceptionnelle. Je recommande vivement leurs services.',
      rating: 5,
      avatar: IMAGES.testimonials.avatar2,
      fallbackAvatar: IMAGES.testimonials.avatar2
    },
    {
      id: 3,
      name: 'Fatima Oumar',
      position: 'Responsable Marketing, Société DEF',
      content: 'Excellent service d\'impression et de design. Leurs créations ont grandement contribué au succès de nos campagnes.',
      rating: 5,
      avatar: IMAGES.testimonials.avatar3,
      fallbackAvatar: IMAGES.testimonials.avatar3
    }
  ];

  return (
    <>
      <Helmet>
        <title>Expérience Tech - Votre partenaire numérique de confiance</title>
        <meta name="description" content="Expérience Tech propose des services numériques, formations, impression et solutions technologiques innovantes au Tchad." />
        <meta name="keywords" content="services numériques, formation IT, impression, réseaux, Tchad, Abéché, technologie" />
        <meta property="og:title" content="Expérience Tech - Votre partenaire numérique" />
        <meta property="og:description" content="Solutions technologiques complètes pour votre entreprise" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://experiencetech-tchad.com" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative">
        <HeroSlider />
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white section-spacing">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <InView key={index} triggerOnce>
                {({ inView, ref }) => (
                  <div ref={ref} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      {inView && (
                        <CountUp
                          end={stat.number}
                          duration={2.5}
                          suffix={stat.suffix}
                        />
                      )}
                    </div>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                )}
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Animation style Impression ND */}
      <section className="section-padding bg-gray-50 section-spacing relative overflow-hidden">
        <div className="container-custom">
          <SolarAnimation variant="solar" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez notre gamme complète de services pour répondre à tous vos besoins technologiques
              </p>
            </div>
          </SolarAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id} 
                initial={{ 
                  opacity: 0, 
                  y: 60,
                  scale: 0.9,
                  rotateX: 15
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1,
                  rotateX: 0
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{
                  y: -12,
                  scale: 1.05,
                  rotateY: 2,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                    duration: 0.3
                  }
                }}
                className="group"
                style={{ position: 'relative' }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-lg overflow-hidden h-full relative"
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Effet de brillance au survol (style Impression ND) */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-5"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ zIndex: 5 }}
                  />
                  
                  {/* Image avec effet parallaxe */}
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    <motion.img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      onError={(e) => {
                        // Fallback vers gradient si l'image ne charge pas
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    {/* Fallback gradient si l'image ne charge pas */}
                    {service.icon && (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center" style={{display: 'none'}}>
                        {React.createElement(service.icon, { className: "w-20 h-20 text-white opacity-80" })}
                      </div>
                    )}
                    
                    {/* Overlay au survol */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    
                    {/* Badge animé */}
                    <motion.div
                      className="absolute top-4 left-4"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {service.title.split(' ')[0]}
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-6 relative z-10">
                    {/* Titre avec animation */}
                    <motion.h3
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {service.title}
                    </motion.h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                      {service.description}
                    </p>

                    {/* Features List avec animation séquentielle */}
                    <ul className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-center text-sm text-gray-600"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + featureIndex * 0.1 + 0.6 }}
                          whileHover={{ x: 5, color: "#3b82f6" }}
                        >
                          <motion.div
                            className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0"
                            whileHover={{ scale: 1.5 }}
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA avec animation */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative z-20"
                    >
                      <Link
                        to={service.href}
                        className="inline-flex items-center w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl relative z-20"
                        style={{ position: 'relative', zIndex: 20 }}
                        onClick={(e) => {
                          // S'assurer que le clic fonctionne
                          e.stopPropagation();
                        }}
                      >
                        En savoir plus
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Effet de bordure animée */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/50 transition-all duration-300"
                    style={{
                      background: "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                      backgroundSize: "200% 200%"
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <SolarAnimation variant="wave" delay={0.8}>
            <div className="text-center mt-12">
              <Link to="/services" className="btn-primary inline-flex items-center">
                Voir tous nos services
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </SolarAnimation>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-white section-spacing">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SolarAnimation variant="magnetic" delay={0.2}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {t('home.whyChoose.title')}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {t('home.whyChoose.subtitle')}
                </p>
                
                <div className="space-y-6">
                  {(() => {
                    const features = t('home.whyChoose.features', { returnObjects: true });
                    if (!Array.isArray(features)) return null;
                    
                    return features.map((feature, index) => {
                      // Gérer les deux formats : chaîne simple ou objet {title, description}
                      const featureTitle = typeof feature === 'string' ? feature : (feature?.title || '');
                      const featureDescription = feature?.description;
                      
                      return (
                        <motion.div 
                          key={index} 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircleIcon className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <span className="text-gray-700 font-medium block">{featureTitle}</span>
                            {featureDescription && (
                              <span className="text-gray-600 text-sm block mt-1">{featureDescription}</span>
                            )}
                          </div>
                        </motion.div>
                      );
                    });
                  })()}
                </div>

                <div className="mt-8">
                  <Link to="/about" className="btn-primary">
                    En savoir plus sur nous
                  </Link>
                </div>
              </div>
            </SolarAnimation>

            <SolarAnimation variant="magnetic" delay={0.4}>
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={IMAGES.team.main}
                    alt={t('common.notreEquipe')}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, IMAGES.fallback.team)}
                  />
                </div>
              
                {/* Floating stats */}
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6"
                  initial={{ scale: 0, rotate: -10 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <UserGroupIcon className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">500+</div>
                      <div className="text-sm text-gray-600">Clients satisfaits</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </SolarAnimation>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gray-50 section-spacing">
        <div className="container-custom">
          <SolarAnimation variant="wave" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('home.testimonials.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('home.testimonials.subtitle')}
              </p>
            </div>
          </SolarAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <SolarAnimation 
                key={testimonial.id} 
                variant="solar" 
                delay={index * 0.1 + 0.4}
              >
                <TestimonialCard testimonial={testimonial} />
              </SolarAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Prêt à transformer votre entreprise ?
            </h2>
            <p className="text-xl mb-8 text-white opacity-95">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Demander un devis
              </button>
              <button 
                onClick={() => window.location.href = '/services'}
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Nos services
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
