import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  BuildingOfficeIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { SolarAnimation } from '../components/animations';

const About = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: LightBulbIcon,
      title: t('about.values.innovation', 'Innovation'),
      description: t('about.values.descriptions.innovation', 'Nous adoptons les dernières technologies et innovations pour offrir des solutions à la pointe.')
    },
    {
      icon: ShieldCheckIcon,
      title: t('about.values.quality', 'Qualité'),
      description: t('about.values.descriptions.quality', 'Nous nous engageons à fournir des services et produits de la plus haute qualité.')
    },
    {
      icon: UserGroupIcon,
      title: t('about.values.trust', 'Confiance'),
      description: t('about.values.descriptions.trust', 'La confiance de nos clients est notre priorité absolue dans toutes nos interactions.')
    },
    {
      icon: ChartBarIcon,
      title: t('about.values.excellence', 'Excellence'),
      description: t('about.values.descriptions.excellence', 'Nous visons l\'excellence dans chaque projet et service que nous entreprenons.')
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: t('about.timeline.2020.title', 'Création du Centre'),
      description: t('about.timeline.2020.description', 'Fondation d\'Expérience Tech le 10 janvier 2020 comme Centre dédié à la formation et à la vulgarisation technologique.')
    },
    {
      year: '2021',
      title: t('about.timeline.2021.title', 'Évolution vers l\'Établissement'),
      description: t('about.timeline.2021.description', 'Transformation en Établissement le 21 octobre 2021, marquant une étape importante dans le développement organisationnel.')
    },
    {
      year: '2022',
      title: t('about.timeline.2022.title', 'Expansion des Services'),
      description: t('about.timeline.2022.description', 'Ajout des services d\'impression, de commerce et de réseau à notre portefeuille d\'activités.')
    },
    {
      year: '2025',
      title: t('about.timeline.2025.title', 'SARL - Société à Responsabilité Limitée'),
      description: t('about.timeline.2025.description', 'Adoption du statut SARL le 25 janvier 2025, consolidant notre position comme acteur majeur du secteur numérique au Tchad.')
    }
  ];

  return (
    <>
      <Helmet>
        <title>À propos - Expérience Tech</title>
        <meta name="description" content="Découvrez l'histoire, la vision et la mission d'Expérience Tech, votre partenaire numérique de confiance au Tchad." />
        <meta name="keywords" content="à propos, histoire, vision, mission, Expérience Tech, Tchad, Abéché" />
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <SolarAnimation variant="solar" delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                À propos de nous
              </h1>
            </SolarAnimation>
            <SolarAnimation variant="energy" delay={0.2}>
              <p className="text-xl md:text-2xl opacity-90">
                ✨ Votre partenaire numérique de confiance depuis 2020 ✨
              </p>
            </SolarAnimation>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.history.title', 'Notre Histoire')}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {t('about.history.description', 'Expérience Tech est née de la passion pour la technologie et du désir de contribuer au développement numérique du Tchad.')}
              </p>
            </div>

            {/* History Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                    <BuildingOfficeIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t('about.history.founding.title', 'Les Débuts')}
                  </h3>
                  <p className="text-gray-600">
                    {t('about.history.founding.description', 'En 2020, Expérience Tech a été fondée avec une vision claire : démocratiser l\'accès aux technologies numériques au Tchad.')}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                    <RocketLaunchIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t('about.history.growth.title', 'L\'Expansion')}
                  </h3>
                  <p className="text-gray-600">
                    {t('about.history.growth.description', 'Au fil des années, nous avons élargi nos services pour inclure le développement d\'applications, la maintenance informatique, l\'impression professionnelle et l\'import-export de matériel IT.')}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                    <ChartBarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t('about.history.present.title', 'Aujourd\'hui')}
                  </h3>
                  <p className="text-gray-600">
                    {t('about.history.present.description', 'Avec plus de 5 années d\'expérience, nous sommes devenus un acteur majeur du secteur numérique au Tchad, avec des centaines de clients satisfaits et des projets innovants à notre actif.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16">
              <div className="text-center text-white mb-8">
                <h3 className="text-2xl font-bold mb-4">Nos Réalisations en Chiffres</h3>
                <p className="text-blue-100">Plus de 5 années d'excellence au service du numérique</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">5+</div>
                  <div className="text-blue-100 text-sm">Années d'expérience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">1000+</div>
                  <div className="text-blue-100 text-sm">Clients satisfaits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">500+</div>
                  <div className="text-blue-100 text-sm">Projets réalisés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">50+</div>
                  <div className="text-blue-100 text-sm">Certifications délivrées</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start mb-12">
                  <div className="absolute left-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="ml-16">
                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-600">
                      <div className="flex items-center mb-3">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold mr-4">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="card">
              <div className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('about.vision.title', 'Notre Vision')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.vision.description', 'Être le partenaire de référence pour la transformation numérique des entreprises au Tchad et en Afrique.')}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="card">
              <div className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <RocketLaunchIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('about.mission.title', 'Notre Mission')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.mission.description', 'Fournir des solutions technologiques innovantes et des formations de qualité pour accompagner nos clients dans leur croissance.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('about.values.title', 'Nos Valeurs')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos valeurs fondamentales guident chacune de nos actions et décisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('about.team.title', 'Notre Équipe')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.team.subtitle', 'Des professionnels passionnés et expérimentés à votre service')}
            </p>
          </div>

          {/* Direction */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('about.team.direction', 'Direction')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Hassan.jpeg" 
                      alt="Hassane - Direction"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{t('about.team.members.hassane.name', 'HASSANE')}</h4>
                  <p className="text-primary-600 font-semibold mb-2">{t('about.team.members.hassane.position', 'Directeur Général')}</p>
                  <p className="text-sm text-gray-600">{t('about.team.members.hassane.description', 'Direction générale et stratégique de l\'entreprise')}</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Directeur-Technique.jpg" 
                      alt="Issa - Directeur Technique"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{t('about.team.members.issa.name', 'ISSA')}</h4>
                  <p className="text-primary-600 font-semibold mb-2">{t('about.team.members.issa.position', 'Directeur Technique')}</p>
                  <p className="text-sm text-gray-600">{t('about.team.members.issa.description', 'Supervision technique et innovation')}</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Alfred.jpg" 
                      alt="Takene - Directeur des Ressources Humaines"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{t('about.team.members.taken.name', 'TAKEN')}</h4>
                  <p className="text-primary-600 font-semibold mb-2">{t('about.team.members.taken.position', 'Directeur des Ressources Humaines')}</p>
                  <p className="text-sm text-gray-600">{t('about.team.members.taken.description', 'Gestion des ressources humaines et développement du personnel')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Committed Management */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Committed Management</h3>
            <div className="flex justify-center">
              <div className="card text-center max-w-sm">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Djinguebeye-Ngarsandje-Magloireen.jpeg" 
                      alt="Djinguebeye Ngarsandjé Magloireen - Committed Management"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">DJINGUEBEYE NGARSANDJÉ MAGLOIREEN</h4>
                  <p className="text-primary-600 font-semibold mb-2">Committed Management</p>
                  <p className="text-sm text-gray-600">Gestion et engagement managérial</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formation & Technique */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Formation & Technique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Esrom.png" 
                      alt="Esrom - Chargé de Formation"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">NDJEKORNONDE NELOUMSEY ESROM</h4>
                  <p className="text-primary-600 font-semibold mb-2">Chargé de Formation</p>
                  <p className="text-sm text-gray-600">Responsable des programmes de formation professionnelle</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Hamza-Brahim-Ahmat.jpg" 
                      alt="Hamza Brahim Ahmat - Administrateur Réseaux"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">HAMZA BRAHIM AHMAT</h4>
                  <p className="text-primary-600 font-semibold mb-2">Administrateur Réseaux</p>
                  <p className="text-sm text-gray-600">Spécialiste en infrastructure réseau et sécurité</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Bonheur.jpeg" 
                      alt="Bonheur - Administrateur Réseaux Adjoint"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">AZOULEUNNE OUAZOUA BONHEUR</h4>
                  <p className="text-primary-600 font-semibold mb-2">Administrateur Réseaux Adjoint</p>
                  <p className="text-sm text-gray-600">Support technique et maintenance réseau</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Basile.jpg" 
                      alt="Allaramadji Basile - Maintenancier"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">ALLARAMADJI BASILE</h4>
                  <p className="text-primary-600 font-semibold mb-2">Maintenancier</p>
                  <p className="text-sm text-gray-600">Maintenance et réparation d'équipements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Design & Création */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Design & Création</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Issa-Mahamat-Nour.jpg" 
                      alt="Issa Mahamat Nour - Designer"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">ISSA MAHAMAT NOUR</h4>
                  <p className="text-primary-600 font-semibold mb-2">Designer</p>
                  <p className="text-sm text-gray-600">Infographe, Designer, Photographe</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Alexis.jpg" 
                      alt="Alexis Koumoukouye - Designer"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">KOUMOUKOYE BAKOL ALEXIS</h4>
                  <p className="text-primary-600 font-semibold mb-2">Designer</p>
                  <p className="text-sm text-gray-600">Infographe, Sérigraphe, Designer</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Assure.jpg" 
                      alt="Ndoubahidi Neko Assur - Assistant à l'imprimerie"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">NDOUBAHIDI NEKO ASSUR</h4>
                  <p className="text-primary-600 font-semibold mb-2">Assistant à l'imprimerie</p>
                  <p className="text-sm text-gray-600">Support technique et opérationnel de l'imprimerie</p>
                </div>
              </div>
            </div>
          </div>

          {/* Administration & Support */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Administration & Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Viviane.png" 
                      alt="Viviane - Gestionnaire"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">NDISSELTA VIVIANE</h4>
                  <p className="text-primary-600 font-semibold mb-2">Gestionnaire</p>
                  <p className="text-sm text-gray-600">Gestion administrative et financière</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Bechir.jpeg" 
                      alt="Béchir - Réceptionniste"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">KOKÉ BÉCHIR</h4>
                  <p className="text-primary-600 font-semibold mb-2">Réceptionniste</p>
                  <p className="text-sm text-gray-600">Accueil et service client</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/NOUDJIADJIM-PATRICIA.jpeg" 
                      alt="NOUDJIADJIM PATRICIA - Cafetière"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">NOUDJIADJIM PATRICIA</h4>
                  <p className="text-primary-600 font-semibold mb-2">Cafetière</p>
                  <p className="text-sm text-gray-600">Service de restauration et boissons</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Sécurité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/PIANO-BOURDANNE.jpeg" 
                      alt="PIANO BOURDANNE - Gardien"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">PIANO BOURDANNE</h4>
                  <p className="text-primary-600 font-semibold mb-2">Gardien</p>
                  <p className="text-sm text-gray-600">Sécurité et surveillance des locaux</p>
                </div>
              </div>

              <div className="card text-center">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-3 border-primary-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src="/images/team/Bechir.jpeg" 
                      alt="Bachir - Nettoyeur"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">KERTEMA BACHIR</h4>
                  <p className="text-primary-600 font-semibold mb-2">Nettoyeur</p>
                  <p className="text-sm text-gray-600">Entretien et nettoyage des locaux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('about.cta.title', 'Prêt à travailler avec nous ?')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('about.cta.description', 'Contactez-nous dès aujourd\'hui pour discuter de votre projet et découvrir comment nous pouvons vous aider à atteindre vos objectifs numériques.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="/contact" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
                aria-label="Contactez-nous pour plus d'informations"
              >
                {t('about.cta.contact', 'Nous Contacter')}
              </a>
              <a 
                href="/services" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
                aria-label="Découvrez nos services"
              >
                {t('about.cta.services', 'Nos Services')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;