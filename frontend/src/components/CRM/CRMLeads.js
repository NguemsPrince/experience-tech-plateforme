import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const CRMLeads = ({ darkMode = false }) => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0
  });

  // États des leads
  const leadStatuses = [
    { value: 'new', label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
    { value: 'contacted', label: 'Contacté', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'qualified', label: 'Qualifié', color: 'bg-orange-100 text-orange-800' },
    { value: 'converted', label: 'Converti', color: 'bg-green-100 text-green-800' },
    { value: 'lost', label: 'Perdu', color: 'bg-red-100 text-red-800' }
  ];

  // Sources des leads
  const leadSources = [
    { value: 'website', label: 'Site Web' },
    { value: 'social', label: 'Réseaux Sociaux' },
    { value: 'referral', label: 'Parrainage' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Téléphone' },
    { value: 'event', label: 'Événement' }
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/crm/leads', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
        calculateStats(data.leads);
      }
    } catch (error) {
      console.error('Erreur récupération leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leadsData) => {
    const stats = {
      total: leadsData.length,
      new: leadsData.filter(lead => lead.status === 'new').length,
      contacted: leadsData.filter(lead => lead.status === 'contacted').length,
      qualified: leadsData.filter(lead => lead.status === 'qualified').length,
      converted: leadsData.filter(lead => lead.status === 'converted').length
    };
    setStats(stats);
  };

  const filterLeads = () => {
    let filtered = leads;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Filtre par source
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));
      }
    } catch (error) {
      console.error('Erreur mise à jour lead:', error);
    }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) return;

    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== leadId));
      }
    } catch (error) {
      console.error('Erreur suppression lead:', error);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = leadStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusObj = leadStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Leads
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Suivi et conversion des prospects
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nouveau Lead</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center">
            <UserPlusIcon className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Nouveaux</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.new}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center">
            <PhoneIcon className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Contactés</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.contacted}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center">
            <FunnelIcon className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Qualifiés</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.qualified}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Convertis</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.converted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          {leadStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Toutes les sources</option>
          {leadSources.map(source => (
            <option key={source.value} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des leads */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Nom</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Contact</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Source</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Statut</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      {lead.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      {lead.phone}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {leadSources.find(s => s.value === lead.source)?.label || lead.source}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                  >
                    {leadStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-1 text-blue-600 hover:text-blue-700"
                      title="Voir détails"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-1 text-green-600 hover:text-green-700"
                      title="Modifier"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <UserPlusIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' 
              ? 'Aucun lead ne correspond aux critères de recherche'
              : 'Aucun lead trouvé'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CRMLeads;
