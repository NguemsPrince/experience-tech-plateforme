import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageTest = () => {
  const { t, i18n } = useTranslation();

  const testTranslations = [
    'common.loading',
    'common.error',
    'common.success',
    'header.home',
    'header.about',
    'header.services',
    'header.products',
    'header.news',
    'header.training',
    'header.client',
    'header.careers',
    'header.forum',
    'header.contact',
    'dashboard.title',
    'dashboard.welcome',
    'dashboard.stats.activeProjects',
    'dashboard.stats.totalClients',
    'dashboard.stats.totalRevenue',
    'dashboard.stats.supportTickets',
    'dashboard.stats.completedProjects',
    'dashboard.stats.pendingInvoices',
    'services.title',
    'services.subtitle',
    'contact.title',
    'contact.subtitle',
    'auth.login.title',
    'auth.register.title',
    'home.hero.title',
    'home.hero.subtitle',
    'home.hero.description',
    'products.title',
    'news.title',
    'training.title',
    'forum.title',
    'careers.title'
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Test de Traduction - Langue Actuelle: {i18n.language}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testTranslations.map((key, index) => (
          <div key={index} className="p-3 border rounded-lg">
            <div className="text-sm text-gray-500 mb-1">{key}</div>
            <div className="font-medium">{t(key)}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Direction du texte:</h3>
        <p className="text-sm">
          Direction actuelle: {document.documentElement.getAttribute('dir') || 'ltr'}
        </p>
        <p className="text-sm">
          Langue HTML: {document.documentElement.getAttribute('lang') || 'fr'}
        </p>
        <p className="text-sm">
          Classe RTL: {document.documentElement.classList.contains('rtl') ? 'Oui' : 'Non'}
        </p>
      </div>
    </div>
  );
};

export default LanguageTest;
