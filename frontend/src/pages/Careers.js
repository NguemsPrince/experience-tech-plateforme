import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPinIcon, ClockIcon, CurrencyDollarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import JobApplicationForm from '../components/JobApplicationForm';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedJob(null);
  };

  const jobs = [
    {
      id: 1,
      title: 'Développeur Full Stack Senior',
      type: 'CDI',
      location: 'Yaoundé',
      salary: '400 000 - 600 000 FCFA',
      description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe dynamique.',
      requirements: [
        '5+ ans d\'expérience en développement web',
        'Maîtrise de React, Node.js, et MongoDB',
        'Expérience avec les architectures microservices',
        'Connaissance des bonnes pratiques DevOps'
      ],
      benefits: [
        'Salaire compétitif',
        'Formation continue',
        'Environnement de travail moderne',
        'Assurance santé'
      ],
      postedAt: '2024-01-15',
      deadline: '2024-02-15'
    },
    {
      id: 2,
      title: 'Formateur en Développement Web',
      type: 'CDD',
      location: 'Yaoundé',
      salary: '300 000 - 450 000 FCFA',
      description: 'Rejoignez notre équipe de formation pour transmettre vos connaissances en développement web.',
      requirements: [
        '3+ ans d\'expérience en développement',
        'Expérience en formation ou enseignement',
        'Excellente communication',
        'Certifications techniques appréciées'
      ],
      benefits: [
        'Impact sur la formation des jeunes',
        'Horaires flexibles',
        'Développement professionnel',
        'Prime de performance'
      ],
      postedAt: '2024-01-12',
      deadline: '2024-02-12'
    },
    {
      id: 3,
      title: 'Stagiaire Développeur Frontend',
      type: 'Stage',
      location: 'Yaoundé',
      salary: '50 000 FCFA',
      description: 'Stage de 6 mois pour étudiants en informatique souhaitant se spécialiser en développement frontend.',
      requirements: [
        'Étudiant en informatique ou équivalent',
        'Connaissance de base en HTML, CSS, JavaScript',
        'Motivation et esprit d\'équipe',
        'Disponibilité 6 mois'
      ],
      benefits: [
        'Formation pratique',
        'Mentorat personnalisé',
        'Possibilité d\'embauche',
        'Certificat de stage'
      ],
      postedAt: '2024-01-10',
      deadline: '2024-02-10'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Carrières - Expérience Tech</title>
        <meta name="description" content="Rejoignez l'équipe Expérience Tech ! Découvrez nos offres d'emploi et stages dans le domaine des technologies au Cameroun." />
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rejoignez Notre Équipe
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Développez votre carrière dans un environnement innovant et stimulant
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi travailler chez Expérience Tech ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous offrons un environnement de travail exceptionnel avec des opportunités de croissance et d'innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                Travaillez sur des projets technologiques de pointe
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Croissance
              </h3>
              <p className="text-gray-600">
                Opportunités d'évolution et de développement
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Équipe
              </h3>
              <p className="text-gray-600">
                Collaboration et esprit d'équipe
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Formation
              </h3>
              <p className="text-gray-600">
                Formation continue et développement des compétences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Offres d'Emploi Actuelles
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos opportunités de carrière
            </p>
          </div>

          <div className="space-y-8">
            {jobs.map((job) => (
              <div key={job.id} className="card">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApplyClick(job)}
                      className="btn-primary"
                    >
                      Postuler
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Exigences :</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Avantages :</h4>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Publié le {new Date(job.postedAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Candidature avant le {new Date(job.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Processus de Candidature
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre processus de recrutement est simple et transparent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Candidature
              </h3>
              <p className="text-gray-600">
                Envoyez votre CV et lettre de motivation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sélection
              </h3>
              <p className="text-gray-600">
                Étude de votre profil et présélection
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Entretien
              </h3>
              <p className="text-gray-600">
                Entretien technique et culturel
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Intégration
              </h3>
              <p className="text-gray-600">
                Onboarding et intégration à l'équipe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pas d'offre qui vous correspond ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Envoyez-nous votre candidature spontanée. Nous sommes toujours à la recherche de talents exceptionnels.
            </p>
            <button 
              onClick={() => handleApplyClick({ title: 'Candidature spontanée' })}
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Candidature spontanée
            </button>
          </div>
        </div>
      </section>

      {/* Job Application Form Modal */}
      <JobApplicationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        jobTitle={selectedJob?.title || 'Poste'}
      />
    </>
  );
};

export default Careers;
