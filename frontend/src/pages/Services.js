import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { servicesService } from '../services/services';
import ServiceCard from '../components/ServiceCard';
import ServiceDetail from '../components/ServiceDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { SolarAnimation } from '../components/animations';
import { 
  CogIcon,
  AcademicCapIcon,
  PrinterIcon,
  TruckIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const { t } = useTranslation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Services identiques à ceux de la page d'accueil avec les vraies images
        const defaultServices = [
          {
            id: 'digital',
            title: t('services.digital.title'),
            description: 'Solutions numériques complètes pour votre transformation digitale',
            image: '/images/services/solution-numerique.png',
            icon: CogIcon,
            features: [
              'Développement Web & Mobile',
              'Logiciels sur mesure',
              'Maintenance IT',
              'Conseil Technologique'
            ],
            price: 'Sur devis',
            duration: 'Variable',
            category: 'Solutions Numériques',
            href: '/services/digital'
          },
          {
            id: 'training',
            title: t('services.training.title'),
            description: 'Formations professionnelles certifiantes',
            image: '/images/services/formation-professionnelle.jpg',
            icon: AcademicCapIcon,
            features: [
              'Formations IT',
              'Bureautique',
              'Certifications',
              'Formations sur mesure'
            ],
            price: 'À partir de 25,000 FCFA',
            duration: '1-6 mois',
            category: 'Formation',
            href: '/services/training'
          },
          {
            id: 'printing',
            title: t('services.printing.title'),
            description: 'Services d\'impression et design professionnel',
            image: '/images/services/service-impression.jpg',
            icon: PrinterIcon,
            features: [
              'Affiches & Banderoles',
              'Cartes de visite',
              'Brochures',
              'Emballages'
            ],
            price: 'À partir de 2,000 FCFA',
            duration: '24h-48h',
            category: 'Impression',
            href: '/services/printing'
          },
          {
            id: 'commerce',
            title: t('services.commerce.title'),
            description: 'Commerce et import-export de matériel IT',
            image: '/images/services/commerce-import-export.jpg',
            icon: TruckIcon,
            features: [
              'Import équipements',
              'Distribution',
              'Conseil commercial',
              'Logistique'
            ],
            price: 'Sur devis',
            duration: 'Variable',
            category: 'Commerce',
            href: '/services/commerce'
          },
          {
            id: 'networks',
            title: t('services.networks.title'),
            description: 'Solutions réseaux et connectivité',
            image: '/images/services/reseaux-infrastructures.jpg',
            icon: WifiIcon,
            features: [
              'Configuration réseaux',
              'Supervision',
              'Maintenance',
              'Sécurité'
            ],
            price: 'À partir de 200,000 FCFA',
            duration: '1-3 jours',
            category: 'Réseaux',
            href: '/services/networks'
          }
        ];

        // Essayer d'abord l'API, puis utiliser les services par défaut en cas d'erreur
        try {
          const response = await servicesService.getAllServices();
          // Si l'API retourne des données, les mapper pour inclure les images
          const apiServices = response.data || [];
          const mappedServices = apiServices.map(apiService => {
            // Trouver le service correspondant par ID
            const defaultService = defaultServices.find(s => s.id === apiService.id);
            return {
              ...apiService,
              image: defaultService?.image || apiService.image || '/images/services/solution-numerique.png',
              icon: defaultService?.icon,
              category: defaultService?.category || apiService.category || 'Service'
            };
          });
          setServices(mappedServices.length > 0 ? mappedServices : defaultServices);
        } catch (apiError) {
          console.log('API non disponible, utilisation des services par défaut');
          setServices(defaultServices);
        }
        
      } catch (err) {
        setError('Erreur lors du chargement des services');
        console.error('Error fetching services:', err);
        // En cas d'erreur, utiliser les services par défaut
        const defaultServices = [
          {
            id: 'digital',
            title: t('services.digital.title'),
            description: 'Solutions numériques complètes pour votre transformation digitale',
            image: '/images/services/solution-numerique.png',
            features: ['Développement Web & Mobile', 'Logiciels sur mesure', 'Maintenance IT', 'Conseil Technologique'],
            price: 'Sur devis',
            duration: 'Variable',
            category: 'Solutions Numériques'
          },
          {
            id: 'training',
            title: t('services.training.title'),
            description: 'Formations professionnelles certifiantes',
            image: '/images/services/formation-professionnelle.jpg',
            features: ['Formations IT', 'Bureautique', 'Certifications', 'Formations sur mesure'],
            price: 'À partir de 25,000 FCFA',
            duration: '1-6 mois',
            category: 'Formation'
          },
          {
            id: 'printing',
            title: t('services.printing.title'),
            description: 'Services d\'impression et design professionnel',
            image: '/images/services/service-impression.jpg',
            features: ['Affiches & Banderoles', 'Cartes de visite', 'Brochures', 'Emballages'],
            price: 'À partir de 2,000 FCFA',
            duration: '24h-48h',
            category: 'Impression'
          },
          {
            id: 'commerce',
            title: t('services.commerce.title'),
            description: 'Commerce et import-export de matériel IT',
            image: '/images/services/commerce-import-export.jpg',
            features: ['Import équipements', 'Distribution', 'Conseil commercial', 'Logistique'],
            price: 'Sur devis',
            duration: 'Variable',
            category: 'Commerce'
          },
          {
            id: 'networks',
            title: t('services.networks.title'),
            description: 'Solutions réseaux et connectivité',
            image: '/images/services/reseaux-infrastructures.jpg',
            features: ['Configuration réseaux', 'Supervision', 'Maintenance', 'Sécurité'],
            price: 'À partir de 200,000 FCFA',
            duration: '1-3 jours',
            category: 'Réseaux'
          }
        ];
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [t]);

  // Find the specific service if serviceId is provided
  const selectedService = serviceId ? services.find(service => service.id === serviceId) : null;

  if (loading) {
    return <LoadingSpinner size="large" text="Chargement des services..." variant="solar" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // If a specific service is requested but not found, redirect to services list
  if (serviceId && !selectedService) {
    navigate('/services');
    return null;
  }

  // If a specific service is requested, show service detail
  if (serviceId && selectedService) {
    return <ServiceDetail service={selectedService} onBack={() => navigate('/services')} />;
  }

  return (
    <>
      <Helmet>
        <title>Services - Expérience Tech</title>
        <meta name="description" content="Découvrez nos services complets : développement web, formations IT, impression, réseaux et solutions technologiques au Cameroun." />
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <SolarAnimation variant="solar" delay={0.2}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nos Services
              </h1>
            </SolarAnimation>
            <SolarAnimation variant="energy" delay={0.4}>
              <p className="text-xl md:text-2xl opacity-90">
                Des solutions technologiques complètes pour transformer votre entreprise
              </p>
            </SolarAnimation>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <SolarAnimation key={service.id} variant="solar" delay={index * 0.1}>
                <ServiceCard service={service} index={index} />
              </SolarAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-900">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <SolarAnimation variant="wave" delay={0.2}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Besoin d'un devis personnalisé ?
              </h2>
            </SolarAnimation>
            <SolarAnimation variant="energy" delay={0.4}>
              <p className="text-xl text-gray-300 mb-8">
                Contactez-nous pour discuter de vos besoins spécifiques et obtenir un devis adapté à votre projet.
              </p>
            </SolarAnimation>
            <SolarAnimation variant="magnetic" delay={0.6}>
              <button
                onClick={() => {
                  window.location.href = '/contact';
                }}
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
              >
                Demander un devis
              </button>
            </SolarAnimation>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
