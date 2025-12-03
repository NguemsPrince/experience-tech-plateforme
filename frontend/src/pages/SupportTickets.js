import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import CreateTicketModal from '../components/CreateTicketModal';

const SupportTickets = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'create'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleTicketSelect = (ticket) => {
    if (ticket === 'create') {
      setShowCreateModal(true);
    } else {
      setSelectedTicket(ticket);
      setCurrentView('detail');
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTicket(null);
  };

  const handleTicketCreated = (newTicket) => {
    setShowCreateModal(false);
    setSelectedTicket(newTicket);
    setCurrentView('detail');
  };

  const handleTicketUpdate = (updatedTicket) => {
    // Optionnel: mettre à jour la liste si nécessaire
    console.log('Ticket updated:', updatedTicket);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Centre de support
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Gérez vos demandes de support et obtenez de l'aide de notre équipe
          </p>
        </div>

        {/* Contenu principal */}
        {currentView === 'list' && (
          <TicketList
            onTicketSelect={handleTicketSelect}
            showCreateButton={true}
          />
        )}

        {currentView === 'detail' && selectedTicket && (
          <TicketDetail
            ticketId={selectedTicket._id}
            onBack={handleBackToList}
            onUpdate={handleTicketUpdate}
          />
        )}

        {/* Modal de création de ticket */}
        <CreateTicketModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTicketCreated={handleTicketCreated}
        />
      </div>
    </div>
  );
};

export default SupportTickets;
