import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { IMAGES } from '../config/images';

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.about'), href: '/about' },
    { name: t('navigation.services'), href: '/services' },
    { name: t('navigation.products'), href: '/products' },
    { name: t('navigation.news'), href: '/news' },
    { name: t('navigation.contact'), href: '/contact' },
  ];

  const services = [
    { name: t('services.digital.title'), href: '/services/digital' },
    { name: t('services.training.title'), href: '/services/training' },
    { name: t('services.printing.title'), href: '/services/printing' },
    { name: t('services.commerce.title'), href: '/services/commerce' },
    { name: t('services.networks.title'), href: '/services/networks' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/experience_tech_?igsh=dXdpaGRmcmtqMjNn&utm_source=qr', icon: '📷' },
    { name: 'TikTok', href: 'https://tiktok.com/@exprience_tech?_t=8kArSrX0Gv7&_r=1', icon: '🎵' },
    { name: 'WhatsApp', href: 'https://wa.me/23562402051', icon: '💬' },
    { name: 'Website', href: 'https://experiencetech-tchad.com', icon: '🌐' },
    { name: 'Twitter', href: 'https://x.com/experience1tech?s=21&t=3wdQQPYcGdy1_A9EnRYPcg', icon: '🐦' },
  ];

  return (
    <footer className="bg-gray-900 text-white footer-content">
      {/* Main Footer Content */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={IMAGES.logo} 
                  alt="Expérience Tech Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback vers le texte si le logo ne charge pas
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center hidden">
                  <span className="text-white font-bold text-xl">ET</span>
                </div>
              </div>
              <span className="text-xl font-bold">Expérience Tech</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.services')}</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.contactInfo')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Avenue Mareshal Idriss Deby Itno<br />
                    Abéché, Tchad
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <a href="tel:+23560290510" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">
                    +235 60 29 05 10
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <a href="mailto:Contact@experiencetech-tchad.com" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">
                    Contact@experiencetech-tchad.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ClockIcon className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Toujours ouvert<br />
                    Service 24h/7j
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-gray-300 mb-6">
              Restez informé de nos dernières actualités et offres spéciales.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder={t('forms.placeholders.email')}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400"
              />
              <button className="btn-primary px-6">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Expérience Tech. {t('footer.allRightsReserved')}
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
