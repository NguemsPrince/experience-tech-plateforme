import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, CheckCircleIcon, PhoneIcon, EnvelopeIcon, CogIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { servicesService } from '../services/services';

const ServiceDetail = ({ service, onBack }) => {
  const { t } = useTranslation();

  // Protection contre le rendu d'objets problématiques
  const safeRender = (content) => {
    if (content && typeof content === 'object' && !React.isValidElement(content)) {
      if ('basic' in content || 'intermediate' in content || 'advanced' in content) {
        console.error('Objet problématique détecté et bloqué:', content);
        return null;
      }
    }
    return content;
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service non trouvé</h2>
          <p className="text-gray-600 mb-6">Le service demandé n'existe pas.</p>
          <button
            onClick={onBack}
            className="btn-primary"
          >
            Retour aux services
          </button>
        </div>
      </div>
    );
  }

  const { title, description, icon: Icon, features, pricing, technologies, duration } = service;
  
  // Use default icon if none provided
  const ServiceIcon = Icon || CogIcon;

  // Composant formulaire de demande d'aide
  const HelpRequestForm = ({ serviceTitle: _serviceTitle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      message: '',
      budget: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validatePhone = (phone) => {
      if (!phone || !phone.trim()) return true; // Phone is optional
      // Format compatible with backend: /^[\+]?[1-9][\d]{0,15}$/
      // Also accept Chad formats: +235XXXXXXXX, 235XXXXXXXX, +225XXXXXXXX, 225XXXXXXXX
      const cleaned = phone.replace(/\s/g, '');
      // Backend validation is more permissive, but we'll validate for Chad formats
      const chadPhoneRegex = /^(\+?235\d{8,9}|235\d{8,9}|\+?225\d{8,10}|225\d{8,10})$/;
      // Also accept general international format for backend
      const generalPhoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return chadPhoneRegex.test(cleaned) || generalPhoneRegex.test(cleaned);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear error for this field
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
      
      // Validation en temps réel pour le téléphone
      if (name === 'phone' && value) {
        if (!validatePhone(value)) {
          setErrors(prev => ({ ...prev, phone: 'Format invalide. Utilisez +235XXXXXXXX ou +225XXXXXXXX' }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.phone;
            return newErrors;
          });
        }
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validation
      const newErrors = {};
      if (!formData.name.trim()) {
        newErrors.name = 'Le nom est requis';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
      // Phone is optional but if provided, must be valid
      if (formData.phone.trim() && !validatePhone(formData.phone)) {
        newErrors.phone = 'Format invalide. Utilisez +235XXXXXXXX ou +225XXXXXXXX';
      }
      // Message is optional but recommended

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        // Prepare data for API
        const quoteData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          requirements: formData.message.trim() || undefined,
          budget: formData.budget.trim() ? parseFloat(formData.budget.trim()) : undefined
        };

        // Call API - use service.id or fallback to service name/id field
        const serviceId = service.id || service._id || 'default';
        const response = await servicesService.requestQuote(serviceId, quoteData);
        
        if (response.data && response.data.success !== false) {
          toast.success('Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.');
          setFormData({ name: '', email: '', phone: '', message: '', budget: '' });
          setErrors({});
          setIsOpen(false);
        } else {
          throw new Error(response.data?.message || 'Erreur lors de l\'envoi');
        }
      } catch (error) {
        console.error('Error submitting quote request:', error);
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Erreur lors de l\'envoi. Veuillez réessayer.';
        toast.error(errorMessage);
        
        // Set field errors if provided by backend
        if (error.response?.data?.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            if (err.param) {
              backendErrors[err.param] = err.msg || err.message;
            }
          });
          if (Object.keys(backendErrors).length > 0) {
            setErrors(backendErrors);
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {isOpen ? 'Fermer le formulaire' : 'Demander de l\'aide'}
        </button>

        {isOpen && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Votre nom *"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg text-gray-900 ${errors.name ? 'border-2 border-blue-400' : ''}`}
            />
            {errors.name && <p className="text-blue-200 text-xs">{errors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder="Votre email *"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg text-gray-900 ${errors.email ? 'border-2 border-blue-400' : ''}`}
            />
            {errors.email && <p className="text-blue-200 text-xs">{errors.email}</p>}

            <input
              type="tel"
              name="phone"
              placeholder="+235XXXXXXXX (optionnel)"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg text-gray-900 ${errors.phone ? 'border-2 border-blue-400' : ''}`}
            />
            {errors.phone && <p className="text-blue-200 text-xs">{errors.phone}</p>}
            {!errors.phone && formData.phone && (
              <p className="text-white/70 text-xs">Format accepté: +235XXXXXXXX ou +225XXXXXXXX</p>
            )}
            {!errors.phone && !formData.phone && (
              <p className="text-white/70 text-xs">Numéro de téléphone (optionnel)</p>
            )}

            <textarea
              name="message"
              placeholder="Décrivez vos besoins et exigences..."
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg text-gray-900 ${errors.message ? 'border-2 border-blue-400' : ''}`}
            />
            {errors.message && <p className="text-blue-200 text-xs">{errors.message}</p>}
            {!errors.message && (
              <p className="text-white/70 text-xs">Décrivez vos besoins (optionnel mais recommandé)</p>
            )}

            <input
              type="number"
              name="budget"
              placeholder="Budget estimé (FCFA) - optionnel"
              value={formData.budget}
              onChange={handleInputChange}
              min="0"
              step="1000"
              className={`w-full px-3 py-2 rounded-lg text-gray-900 ${errors.budget ? 'border-2 border-blue-400' : ''}`}
            />
            {errors.budget && <p className="text-blue-200 text-xs">{errors.budget}</p>}
            {!errors.budget && formData.budget && (
              <p className="text-white/70 text-xs">Budget: {parseFloat(formData.budget || 0).toLocaleString('fr-FR')} FCFA</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-primary-600 hover:bg-gray-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{safeRender(title) || 'Service'} - Expérience Tech</title>
        <meta name="description" content={safeRender(description) || 'Service Expérience Tech'} />
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Retour aux services
            </button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Service Icon */}
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <ServiceIcon className="w-10 h-10 text-white" />
              </div>

              {/* Service Info */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {safeRender(title)}
                </h1>
                <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                  {safeRender(description)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Features */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Ce que nous offrons
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircleIcon className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                {technologies && technologies.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Technologies utilisées
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duration */}
                {duration && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Durée des formations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {typeof duration === 'string' ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Durée
                          </h4>
                          <p className="text-primary-600 font-medium">{duration}</p>
                        </div>
                      ) : (
                        duration && typeof duration === 'object' && duration !== null ? 
                          Object.entries(duration).map(([level, time]) => (
                            <div key={level} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 capitalize mb-2">
                                {level === 'basic' ? 'Débutant' : 
                                 level === 'intermediate' ? 'Intermédiaire' : 
                                 'Avancé'}
                              </h4>
                              <p className="text-primary-600 font-medium">
                                {typeof time === 'string' ? time : typeof time === 'number' ? `${time} heures` : '-'}
                              </p>
                            </div>
                          ))
                        : null
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  {/* Pricing */}
                  {pricing && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Tarifs
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(pricing).map(([type, price]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-gray-600 capitalize">
                              {type === 'consultation' ? 'Consultation' :
                               type === 'development' ? 'Développement' :
                               type === 'maintenance' ? 'Maintenance' :
                               type === 'individual' ? 'Individuel' :
                               type === 'group' ? 'Groupe' :
                               type === 'certification' ? 'Certification' :
                               type}
                            </span>
                            <span className="font-semibold text-primary-600">
                              {price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="bg-primary-600 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">
                      Intéressé par ce service ?
                    </h3>
                    <p className="text-primary-100 mb-6">
                      Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.
                    </p>
                    
                    {/* Formulaire de demande d'aide */}
                    <HelpRequestForm serviceTitle={safeRender(title)} />
                    
                    <div className="space-y-3 mt-4 pt-4 border-t border-white/20">
                      <Link
                        to="/contact"
                        className="w-full bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
                      >
                        <EnvelopeIcon className="w-5 h-5 mr-2" />
                        Demander un devis
                      </Link>
                      <a
                        href="tel:+23562402051"
                        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
                      >
                        <PhoneIcon className="w-5 h-5 mr-2" />
                        Appeler maintenant
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Découvrez nos autres services
            </h2>
            <p className="text-xl text-gray-600">
              Nous proposons une gamme complète de services technologiques
            </p>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/services'}
              className="btn-primary inline-flex items-center"
            >
              Voir tous nos services
              <ArrowLeftIcon className="w-5 h-5 ml-2 rotate-180" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
