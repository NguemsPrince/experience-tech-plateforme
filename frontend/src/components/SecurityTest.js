import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { hasAccess, isAdmin, getAllowedPages } from '../utils/permissions';

const SecurityTest = () => {
  const { user, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState([]);

  const runSecurityTests = () => {
    const results = [];
    const userRole = user?.role || 'guest';
    
    // Test 1: Vérification du rôle admin
    results.push({
      test: 'Vérification du rôle admin',
      expected: userRole === 'admin',
      actual: isAdmin(userRole),
      status: isAdmin(userRole) === (userRole === 'admin') ? 'PASS' : 'FAIL'
    });

    // Test 2: Vérification des pages autorisées
    const allowedPages = getAllowedPages(userRole);
    results.push({
      test: 'Pages autorisées pour le rôle',
      expected: `Pages autorisées pour ${userRole}`,
      actual: allowedPages.length,
      status: 'INFO'
    });

    // Test 3: Vérification d'accès aux pages admin
    const adminPages = ['/admin', '/admin/dashboard', '/admin/users'];
    adminPages.forEach(page => {
      const hasAccessToPage = hasAccess(userRole, page);
      results.push({
        test: `Accès à ${page}`,
        expected: userRole === 'admin' ? 'Autorisé' : 'Refusé',
        actual: hasAccessToPage ? 'Autorisé' : 'Refusé',
        status: (userRole === 'admin' ? hasAccessToPage : !hasAccessToPage) ? 'PASS' : 'FAIL'
      });
    });

    // Test 4: Vérification d'accès aux pages utilisateur
    const userPages = ['/my-courses', '/cart'];
    userPages.forEach(page => {
      const hasAccessToPage = hasAccess(userRole, page);
      results.push({
        test: `Accès à ${page}`,
        expected: isAuthenticated ? 'Autorisé' : 'Refusé',
        actual: hasAccessToPage ? 'Autorisé' : 'Refusé',
        status: (isAuthenticated ? hasAccessToPage : !hasAccessToPage) ? 'PASS' : 'FAIL'
      });
    });

    setTestResults(results);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Test de Sécurité des Routes
        </h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations utilisateur</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Rôle:</span> {user?.role || 'Non connecté'}
            </div>
            <div>
              <span className="font-medium">Authentifié:</span> {isAuthenticated ? 'Oui' : 'Non'}
            </div>
            <div>
              <span className="font-medium">Nom:</span> {user?.firstName} {user?.lastName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={runSecurityTests}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 mb-6"
        >
          Lancer les tests de sécurité
        </button>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Résultats des tests</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Résultat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testResults.map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.test}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.expected}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.actual}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          result.status === 'PASS' 
                            ? 'bg-green-100 text-green-800' 
                            : result.status === 'FAIL'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityTest;
