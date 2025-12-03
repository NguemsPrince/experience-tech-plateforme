import React from 'react';
import { motion } from 'framer-motion';

const DashboardDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🚀 Dashboard Moderne - Expérience Tech
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Interface administrateur modernisée avec design moderne, animations fluides et fonctionnalités avancées
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          {[
            {
              title: "🎨 Design Moderne",
              description: "Interface élégante avec gradients, ombres et animations fluides",
              features: ["Mode sombre natif", "Animations Framer Motion", "Glass morphism", "Typographie Inter"]
            },
            {
              title: "📊 Graphiques Avancés",
              description: "Visualisations interactives avec Chart.js et animations",
              features: ["Graphiques linéaires", "Donut charts", "Filtres temporels", "Export de données"]
            },
            {
              title: "🔔 Notifications",
              description: "Système de notifications en temps réel avec panel latéral",
              features: ["Panel coulissant", "Types multiples", "Actions rapides", "Compteur badges"]
            },
            {
              title: "⚡ Actions Rapides",
              description: "Accès direct aux fonctions principales du dashboard",
              features: ["Ajouter utilisateur", "Nouveau projet", "Formation", "Rapports"]
            },
            {
              title: "📱 Responsive",
              description: "Adaptation parfaite sur tous les appareils",
              features: ["Mobile first", "Sidebar collapsible", "Cards adaptatives", "Touch friendly"]
            },
            {
              title: "🎯 UX Optimisée",
              description: "Expérience utilisateur intuitive et accessible",
              features: ["Navigation claire", "Feedback visuel", "Raccourcis clavier", "Accessibilité"]
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            📈 Statistiques du Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Composants créés", value: "8", color: "from-blue-500 to-cyan-500" },
              { label: "Animations ajoutées", value: "15+", color: "from-purple-500 to-pink-500" },
              { label: "Responsive breakpoints", value: "3", color: "from-green-500 to-emerald-500" },
              { label: "Temps de développement", value: "2h", color: "from-orange-500 to-red-500" }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              🎉 Dashboard Prêt à l'emploi !
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Accédez au nouveau dashboard administrateur moderne
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/admin"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                🚀 Voir le Dashboard
              </a>
              <a
                href="/admin/legacy"
                className="bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200"
              >
                📊 Version Legacy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardDemo;
