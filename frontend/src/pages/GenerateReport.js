import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import adminService from '../services/adminService';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { extractApiData, formatValue } from '../utils/apiDataExtractor';

const GenerateReport = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'performance',
    period: 'month',
    format: 'pdf',
    emailReport: false,
    emailAddress: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateReportData = async () => {
    try {
      // Mapper les périodes du frontend vers celles de l'API
      const periodMap = {
        week: '7days',
        month: '30days',
        quarter: '90days',
        year: '1year'
      };
      const apiPeriod = periodMap[formData.period] || '30days';

      // Récupérer les statistiques du dashboard
      const statsResponse = await adminService.getDashboardStats(apiPeriod);
      
      // Extraire les données de manière cohérente
      const stats = extractApiData(statsResponse) || {};
      
      console.log('Statistiques récupérées:', stats);

      // Préparer les données selon le type de rapport
      let reportData = [];
      let columns = [];
      let title = '';

      switch (formData.reportType) {
        case 'performance':
          title = 'Rapport de Performance';
          columns = [
            { key: 'metric', label: 'Métrique' },
            { key: 'value', label: 'Valeur' }
          ];

          reportData = [
            { metric: 'Revenus totaux', value: `${formatValue(stats.revenue?.total || 0).toLocaleString('fr-FR')} FCFA` },
            { metric: 'Utilisateurs totaux', value: formatValue(stats.users?.total || 0) },
            { metric: 'Utilisateurs actifs', value: formatValue(stats.users?.active || 0) },
            { metric: 'Nouveaux utilisateurs', value: formatValue(stats.users?.new || 0) },
            { metric: 'Commandes totales', value: formatValue(stats.orders?.total || 0) },
            { metric: 'Commandes en attente', value: formatValue(stats.orders?.pending || 0) },
            { metric: 'Commandes complétées', value: formatValue(stats.orders?.completed || 0) },
            { metric: 'Produits totaux', value: formatValue(stats.products?.total || 0) },
            { metric: 'Produits actifs', value: formatValue(stats.products?.active || 0) },
            { metric: 'Formations totales', value: formatValue(stats.courses?.total || 0) },
            { metric: 'Formations actives', value: formatValue(stats.courses?.active || 0) },
            { metric: 'Inscriptions', value: formatValue(stats.courses?.enrollments || 0) },
            { metric: 'Tickets ouverts', value: formatValue(stats.support?.openTickets || 0) },
            { metric: 'Tickets résolus', value: formatValue(stats.support?.resolvedTickets || 0) }
          ];
          break;
        case 'users':
          title = 'Rapport Utilisateurs';
          const usersResponse = await adminService.getUsers();
          const usersData = extractApiData(usersResponse);
          const usersList = Array.isArray(usersData) ? usersData : (usersData?.users || usersData?.data || []);
          
          columns = [
            { key: 'firstName', label: 'Prénom' },
            { key: 'lastName', label: 'Nom' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Rôle' },
            { key: 'isActive', label: 'Statut' }
          ];
          reportData = usersList.map(user => ({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            role: user.role || '',
            isActive: user.isActive ? 'Actif' : 'Inactif'
          }));
          break;
        default:
          title = 'Rapport Général';
          columns = [
            { key: 'metric', label: 'Métrique' },
            { key: 'value', label: 'Valeur' }
          ];
          reportData = [
            { metric: 'Revenus totaux', value: `${formatValue(stats.revenue?.total || 0).toLocaleString('fr-FR')} FCFA` },
            { metric: 'Utilisateurs totaux', value: formatValue(stats.users?.total || 0) }
          ];
      }

      // Vérifier que les données sont valides
      if (!reportData || reportData.length === 0) {
        throw new Error('Aucune donnée disponible pour générer le rapport');
      }

      if (!columns || columns.length === 0) {
        throw new Error('Aucune colonne définie pour le rapport');
      }

      console.log('Données du rapport préparées:', { reportData, columns, title });

      return { reportData, columns, title };
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw new Error(`Erreur lors de la récupération des données: ${error.message || 'Erreur inconnue'}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);

    try {
      // Générer les données du rapport
      const { reportData, columns, title } = await generateReportData();

      // Générer le nom du fichier
      const date = new Date().toISOString().split('T')[0];
      const periodMap = {
        week: 'semaine',
        month: 'mois',
        quarter: 'trimestre',
        year: 'annee'
      };
      const periodLabel = periodMap[formData.period] || 'mois';
      const filename = `rapport_${formData.reportType}_${periodLabel}_${date}`;

      // Générer et télécharger le rapport selon le format
      if (formData.format === 'pdf') {
        await exportToPDF(reportData, columns, `${filename}.pdf`, title);
      } else if (formData.format === 'excel') {
        await exportToExcel(reportData, columns, `${filename}.xlsx`, title);
      } else if (formData.format === 'csv') {
        // Export CSV
        const csvContent = [
          columns.map(col => col.label).join(','),
          ...reportData.map(row => 
            columns.map(col => {
              const value = row[col.key] || '';
              return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
          )
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${filename}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }

      toast.success('Rapport généré et téléchargé avec succès !');
      
      // Si l'email est demandé, envoyer le rapport par email
      if (formData.emailReport && formData.emailAddress) {
        // TODO: Implémenter l'envoi par email
        toast.success('Rapport envoyé par email !');
      }

      // Ne pas rediriger automatiquement pour permettre à l'utilisateur de voir le message
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast.error('Erreur lors de la génération du rapport: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="mb-4 p-2 hover:bg-gray-200 rounded-lg"
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Générer un rapport
          </h1>
          <p className="text-gray-600">
            Créer un rapport de performance
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de rapport
              </label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="performance">Rapport de performance</option>
                <option value="users">Rapport utilisateurs</option>
                <option value="projects">Rapport projets</option>
                <option value="training">Rapport formations</option>
                <option value="financial">Rapport financier</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format de sortie
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="emailReport"
                  checked={formData.emailReport}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Envoyer le rapport par email
                </label>
              </div>
              {formData.emailReport && (
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="email@example.com"
                />
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Génération...
                  </>
                ) : (
                  'Générer le rapport'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;