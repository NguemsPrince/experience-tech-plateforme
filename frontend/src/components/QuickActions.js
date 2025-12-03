import React, { useState } from 'react';
import { 
  PlusIcon, 
  CogIcon, 
  AcademicCapIcon, 
  CubeIcon, 
  LightBulbIcon, 
  StarIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import QuickAddModal from './QuickAddModal';

const QuickActions = ({ userRole = 'user', onItemCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('project');

  const actions = [
    {
      id: 'project',
      name: 'Nouveau Projet',
      icon: CogIcon,
      color: 'blue',
      description: 'Créer un projet',
      adminOnly: false
    },
    {
      id: 'training',
      name: 'Nouvelle Formation',
      icon: AcademicCapIcon,
      color: 'green',
      description: 'Créer une formation',
      adminOnly: true
    },
    {
      id: 'product',
      name: 'Nouveau Produit',
      icon: CubeIcon,
      color: 'orange',
      description: 'Créer un produit',
      adminOnly: true
    },
    {
      id: 'suggestion',
      name: 'Nouvelle Suggestion',
      icon: LightBulbIcon,
      color: 'purple',
      description: 'Proposer une idée',
      adminOnly: false
    },
    {
      id: 'testimonial',
      name: 'Nouveau Témoignage',
      icon: StarIcon,
      color: 'yellow',
      description: 'Ajouter un avis',
      adminOnly: false
    },
    {
      id: 'support',
      name: 'Demande de Support',
      icon: ChatBubbleLeftRightIcon,
      color: 'indigo',
      description: 'Contacter le support',
      adminOnly: false
    }
  ];

  const handleActionClick = (action) => {
    if (action.id === 'project') {
      // Pour les projets, on déclenche l'ouverture du modal dans le parent
      if (onItemCreated) {
        onItemCreated({ type: 'project', action: 'openModal' });
      }
    } else {
      setModalType(action.id);
      setShowModal(true);
    }
  };

  const handleSuccess = (item) => {
    if (onItemCreated) {
      onItemCreated(item);
    }
    setShowModal(false);
  };

  const filteredActions = actions.filter(action => 
    !action.adminOnly || userRole === 'admin'
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Actions Rapides
        </h3>
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <span>Ctrl+N</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {filteredActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 border-transparent hover:border-${action.color}-200 dark:hover:border-${action.color}-800 transition-all group`}
            >
              <div className={`p-3 bg-${action.color}-100 dark:bg-${action.color}-900 rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {action.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      <QuickAddModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        type={modalType}
      />
    </div>
  );
};

export default QuickActions;
