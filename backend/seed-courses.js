const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const courses = [
  {
    title: 'Formation React.js Complète',
    description: 'Maîtrisez React.js de A à Z avec des projets pratiques et des exercices concrets adaptés au marché tchadien.',
    shortDescription: 'Développement web moderne avec React.js',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3',
    price: 75000,
    originalPrice: 95000,
    duration: '4 semaines',
    totalHours: 28,
    lessons: 45,
    level: 'Intermédiaire',
    category: 'Développement Web',
    instructor: {
      name: 'Jean Paul Mballa',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
      bio: 'Développeur full-stack avec 8 ans d\'expérience',
      experience: '8 ans'
    },
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-03-15'),
    maxStudents: 15,
    currentStudents: 0,
    language: 'Français',
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Redux'],
    requirements: [
      'Connaissances de base en HTML/CSS',
      'Notions de JavaScript',
      'Ordinateur avec accès internet'
    ],
    whatYouWillLearn: [
      'Créer des applications React modernes',
      'Gérer l\'état avec Redux',
      'Intégrer des APIs',
      'Déployer des applications'
    ],
    curriculum: [
      {
        section: 'Introduction à React',
        lessons: [
          { title: 'Installation et configuration', duration: '2h', type: 'video' },
          { title: 'Composants et JSX', duration: '3h', type: 'video' },
          { title: 'Props et State', duration: '4h', type: 'video' }
        ]
      },
      {
        section: 'Hooks et Gestion d\'état',
        lessons: [
          { title: 'useState et useEffect', duration: '3h', type: 'video' },
          { title: 'useContext et useReducer', duration: '4h', type: 'video' },
          { title: 'Hooks personnalisés', duration: '2h', type: 'video' }
        ]
      }
    ],
    rating: { average: 4.8, count: 120 },
    isActive: true,
    isBestSeller: true,
    isNew: false,
    isFeatured: true
  },
  {
    title: 'Formation Node.js & Express',
    description: 'Apprenez à créer des APIs robustes avec Node.js et Express.js pour le développement backend.',
    shortDescription: 'Développement backend avec Node.js',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3',
    price: 65000,
    originalPrice: 85000,
    duration: '3 semaines',
    totalHours: 22,
    lessons: 32,
    level: 'Intermédiaire',
    category: 'Développement Backend',
    instructor: {
      name: 'Marie Claire Nguema',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3',
      bio: 'Ingénieure logicielle spécialisée en backend',
      experience: '6 ans'
    },
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-03-13'),
    maxStudents: 12,
    currentStudents: 0,
    language: 'Français',
    tags: ['Node.js', 'Express', 'API', 'Backend', 'JavaScript'],
    requirements: [
      'Connaissances en JavaScript',
      'Notions de bases de données',
      'Environnement de développement'
    ],
    whatYouWillLearn: [
      'Créer des APIs RESTful',
      'Gérer les bases de données',
      'Authentification et sécurité',
      'Déploiement d\'applications'
    ],
    curriculum: [
      {
        section: 'Introduction à Node.js',
        lessons: [
          { title: 'Installation et premiers pas', duration: '2h', type: 'video' },
          { title: 'Modules et NPM', duration: '3h', type: 'video' },
          { title: 'Gestion des fichiers', duration: '2h', type: 'video' }
        ]
      }
    ],
    rating: { average: 4.9, count: 95 },
    isActive: true,
    isBestSeller: false,
    isNew: true,
    isFeatured: false
  },
  {
    title: 'Formation Bureautique Microsoft Office',
    description: 'Formation complète sur Microsoft Word, Excel, PowerPoint et Outlook pour améliorer votre productivité.',
    shortDescription: 'Maîtrise des outils bureautiques',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3',
    price: 35000,
    originalPrice: 50000,
    duration: '1 semaine',
    totalHours: 12,
    lessons: 20,
    level: 'Débutant',
    category: 'Bureautique',
    instructor: {
      name: 'Paul Biya',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3',
      bio: 'Formateur certifié Microsoft Office',
      experience: '10 ans'
    },
    startDate: new Date('2024-02-25'),
    endDate: new Date('2024-03-03'),
    maxStudents: 20,
    currentStudents: 0,
    language: 'Français',
    tags: ['Office', 'Excel', 'Word', 'PowerPoint', 'Bureautique'],
    requirements: [
      'Ordinateur avec Microsoft Office',
      'Connaissances de base en informatique'
    ],
    whatYouWillLearn: [
      'Maîtriser Word pour la rédaction',
      'Utiliser Excel pour les calculs',
      'Créer des présentations PowerPoint',
      'Gérer les emails avec Outlook'
    ],
    curriculum: [
      {
        section: 'Microsoft Word',
        lessons: [
          { title: 'Interface et navigation', duration: '1h', type: 'video' },
          { title: 'Mise en forme du texte', duration: '2h', type: 'video' },
          { title: 'Tableaux et images', duration: '2h', type: 'video' }
        ]
      }
    ],
    rating: { average: 4.6, count: 150 },
    isActive: true,
    isBestSeller: true,
    isNew: false,
    isFeatured: true
  },
  {
    title: 'Formation Intelligence Artificielle',
    description: 'Introduction à l\'IA, machine learning et deep learning avec Python pour les applications modernes.',
    shortDescription: 'Introduction à l\'intelligence artificielle',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3',
    price: 120000,
    originalPrice: 150000,
    duration: '6 semaines',
    totalHours: 42,
    lessons: 60,
    level: 'Avancé',
    category: 'Intelligence Artificielle',
    instructor: {
      name: 'Dr. Sarah Mballa',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3',
      bio: 'Docteure en Intelligence Artificielle',
      experience: '12 ans'
    },
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-04-26'),
    maxStudents: 8,
    currentStudents: 0,
    language: 'Français',
    tags: ['IA', 'Machine Learning', 'Python', 'Deep Learning', 'TensorFlow'],
    requirements: [
      'Connaissances en mathématiques',
      'Notions de programmation',
      'Ordinateur puissant recommandé'
    ],
    whatYouWillLearn: [
      'Concepts fondamentaux de l\'IA',
      'Algorithmes de machine learning',
      'Deep learning avec TensorFlow',
      'Projets pratiques d\'IA'
    ],
    curriculum: [
      {
        section: 'Introduction à l\'IA',
        lessons: [
          { title: 'Histoire et concepts', duration: '3h', type: 'video' },
          { title: 'Types d\'intelligence artificielle', duration: '2h', type: 'video' },
          { title: 'Applications pratiques', duration: '2h', type: 'video' }
        ]
      }
    ],
    rating: { average: 5.0, count: 25 },
    isActive: true,
    isBestSeller: true,
    isNew: true,
    isFeatured: true
  }
];

const seedCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech');
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert new courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`Created ${createdCourses.length} courses`);

    console.log('Courses seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
