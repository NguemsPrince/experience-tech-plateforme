import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Politique de confidentialité - Expérience Tech</title>
        <meta name="description" content="Politique de confidentialité d'Expérience Tech - Protection de vos données personnelles" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-8">
              <ShieldCheckIcon className="w-12 h-12 text-primary-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">
                Politique de confidentialité
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
                  1. Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Expérience Tech s'engage à protéger votre vie privée et vos données personnelles. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons, 
                  stockons et protégeons vos informations lorsque vous utilisez notre site web et nos services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Données collectées
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous collectons les types de données suivants :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Informations d'identification (nom, prénom, email, téléphone)</li>
                  <li>Données de connexion (adresse IP, type de navigateur, pages visitées)</li>
                  <li>Informations de paiement (traitées de manière sécurisée via nos partenaires)</li>
                  <li>Données de formation et de progression dans les cours</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Utilisation des données
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous utilisons vos données pour :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Fournir et améliorer nos services</li>
                  <li>Traiter vos commandes et paiements</li>
                  <li>Vous envoyer des communications importantes concernant votre compte</li>
                  <li>Personnaliser votre expérience utilisateur</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Protection des données
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles 
                  appropriées pour protéger vos données personnelles contre l'accès non autorisé, 
                  la perte, la destruction ou l'altération.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Vos droits
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Conformément à la réglementation en vigueur, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Cookies
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Notre site utilise des cookies pour améliorer votre expérience. 
                  Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Contact
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                  veuillez nous contacter à :{' '}
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

export default Privacy;

