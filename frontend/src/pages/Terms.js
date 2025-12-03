import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Conditions d'utilisation - Expérience Tech</title>
        <meta name="description" content="Conditions d'utilisation d'Expérience Tech - Termes et conditions d'utilisation de nos services" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-8">
              <DocumentTextIcon className="w-12 h-12 text-primary-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">
                Conditions d'utilisation
              </h1>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Acceptation des conditions
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  En accédant et en utilisant le site web d'Expérience Tech, vous acceptez d'être lié 
                  par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, 
                  veuillez ne pas utiliser notre site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Utilisation du site
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vous vous engagez à utiliser notre site de manière légale et appropriée. Il est interdit de :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Utiliser le site à des fins illégales ou non autorisées</li>
                  <li>Tenter d'accéder à des zones restreintes du site</li>
                  <li>Transmettre des virus ou tout code malveillant</li>
                  <li>Copier, reproduire ou exploiter le contenu sans autorisation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Compte utilisateur
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Lors de la création d'un compte, vous vous engagez à :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Fournir des informations exactes et à jour</li>
                  <li>Maintenir la confidentialité de vos identifiants</li>
                  <li>Être responsable de toutes les activités sous votre compte</li>
                  <li>Nous informer immédiatement de toute utilisation non autorisée</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Services et formations
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous nous efforçons de fournir des services de qualité. Cependant, nous ne garantissons pas 
                  que les services seront ininterrompus, sécurisés ou exempts d'erreurs. Les formations sont 
                  fournies "en l'état" et nous nous réservons le droit de modifier ou d'interrompre tout service 
                  à tout moment.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Paiements et remboursements
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les paiements sont traités de manière sécurisée. Les conditions de remboursement sont les suivantes :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Les remboursements sont traités selon notre politique de remboursement</li>
                  <li>Les demandes de remboursement doivent être faites dans les délais spécifiés</li>
                  <li>Certains services peuvent ne pas être remboursables</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Propriété intellectuelle
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Tout le contenu du site, y compris les textes, graphiques, logos, images et logiciels, 
                  est la propriété d'Expérience Tech ou de ses partenaires et est protégé par les lois 
                  sur la propriété intellectuelle.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Limitation de responsabilité
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Dans la mesure permise par la loi, Expérience Tech ne sera pas responsable des dommages 
                  directs, indirects, accessoires ou consécutifs résultant de l'utilisation ou de l'impossibilité 
                  d'utiliser notre site ou nos services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Modifications
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. 
                  Les modifications entreront en vigueur dès leur publication sur le site. 
                  Il est de votre responsabilité de consulter régulièrement ces conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Contact
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à :{' '}
                  <a href="mailto:contact@experiencetech-tchad.com" className="text-primary-600 hover:text-primary-700">
                    contact@experiencetech-tchad.com
                  </a>
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;

