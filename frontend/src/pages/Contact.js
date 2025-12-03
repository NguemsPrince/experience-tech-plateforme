import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { SolarAnimation } from '../components/animations';
import GeolocationMap from '../components/GeolocationMap';

const Contact = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(t('contact.form.success'));
      reset();
    } catch (error) {
      toast.error(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: t('contact.info.address'),
      details: [
        'Avenue Mareshal Idriss Deby Itno',
        'Abéché, Tchad',
        'Immeuble Expérience Tech'
      ]
    },
    {
      icon: PhoneIcon,
      title: t('contact.info.phone'),
      details: [
        '+235 60 29 05 10',
        '+235 62 40 20 51',
        'WhatsApp: +235 62 40 20 51'
      ]
    },
    {
      icon: EnvelopeIcon,
      title: t('contact.info.email'),
      details: [
        'Contact@experiencetech-tchad.com',
        'info@experiencetech-tchad.com',
        'support@experiencetech-tchad.com'
      ]
    },
    {
      icon: ClockIcon,
      title: t('contact.info.hours'),
      details: [
        'Toujours ouvert',
        'Service 24h/7j',
        'Support en ligne disponible'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact - Expérience Tech</title>
        <meta name="description" content="Contactez Expérience Tech pour vos besoins en services numériques, formations, impression et solutions technologiques au Tchad." />
        <meta name="keywords" content="contact, Expérience Tech, Abéché, Tchad, services numériques, formations IT" />
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <SolarAnimation variant="solar" delay={0.2}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contactez-nous
              </h1>
            </SolarAnimation>
            <SolarAnimation variant="energy" delay={0.4}>
              <p className="text-xl md:text-2xl opacity-90">
                Nous sommes là pour répondre à toutes vos questions
              </p>
            </SolarAnimation>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: 'Le nom est requis' })}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                      placeholder={t('common.votreNomComplet')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', { 
                        required: 'L\'email est requis',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email invalide'
                        }
                      })}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="input-field"
                    placeholder="+237 123 456 789"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.subject')} *
                  </label>
                  <select
                    id="subject"
                    {...register('subject', { required: 'Le sujet est requis' })}
                    className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="services">Demande de services</option>
                    <option value="formation">Formation</option>
                    <option value="impression">Impression & Design</option>
                    <option value="reseaux">Réseaux & Connectivité</option>
                    <option value="commerce">Commerce & Import</option>
                    <option value="support">Support technique</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message', { required: 'Le message est requis' })}
                    className={`input-field ${errors.message ? 'border-red-500' : ''}`}
                    placeholder={t('common.decrireDemande')}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner w-5 h-5 mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <SolarAnimation variant="magnetic" delay={0.6}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Informations de contact
                </h2>

                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <SolarAnimation key={index} variant="solar" delay={0.8 + index * 0.1}>
                      <div className="flex items-start space-x-4 hover-solar p-4 rounded-lg transition-all duration-200">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {info.title}
                          </h3>
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-600">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </SolarAnimation>
                  ))}
                </div>

              {/* Map avec géolocalisation */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notre localisation
                </h3>
                <div id="map" className="w-full">
                  <GeolocationMap
                    height="400px"
                    zoom={13}
                    showControls={true}
                    className="w-full"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  La carte se centre automatiquement sur votre position si vous autorisez la géolocalisation
                </p>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/experience_tech_?igsh=dXdpaGRmcmtqMjNn&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    📷
                  </a>
                  <a 
                    href="https://tiktok.com/@exprience_tech?_t=8kArSrX0Gv7&_r=1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    🎵
                  </a>
                  <a 
                    href="https://x.com/experience1tech?s=21&t=3wdQQPYcGdy1_A9EnRYPcg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    🐦
                  </a>
                  <a 
                    href="https://experiencetech-tchad.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200"
                  >
                    🌐
                  </a>
                </div>
              </div>
            </div>
          </SolarAnimation>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
