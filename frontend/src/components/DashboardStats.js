import React from 'react';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, change, icon: Icon, color = 'blue', trend = 'up' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  const bgColor = colorClasses[color];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-5`}></div>
      
      {/* Content */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-blue-600'
              }`}>
                <span className="font-medium">{change}</span>
                <span className="ml-1">
                  {trend === 'up' ? '↗' : '↘'}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${bgColor} shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      
      {/* Animated border */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${bgColor} transform scale-x-0 transition-transform duration-500 hover:scale-x-100`}></div>
    </div>
  );
};

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    activeProjects = 0,
    completedProjects = 0,
    totalInvoices = 0,
    pendingInvoices = 0,
    totalRevenue = 0,
    supportTickets = 0
  } = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Projets Actifs"
        value={activeProjects}
        change="+12% ce mois"
        icon={RocketLaunchIcon}
        color="blue"
        trend="up"
      />
      
      <StatCard
        title="Projets Complétés"
        value={completedProjects}
        change="+8% ce mois"
        icon={CheckCircleIcon}
        color="green"
        trend="up"
      />
      
      <StatCard
        title="Revenus Totaux"
        value={`${totalRevenue.toLocaleString()} FCFA`}
        change="+15% ce mois"
        icon={CurrencyDollarIcon}
        color="purple"
        trend="up"
      />
      
      <StatCard
        title="Factures en Attente"
        value={pendingInvoices}
        change={pendingInvoices > 0 ? "Action requise" : "À jour"}
        icon={pendingInvoices > 0 ? ExclamationTriangleIcon : DocumentTextIcon}
        color={pendingInvoices > 0 ? "blue" : "green"}
        trend={pendingInvoices > 0 ? "down" : "up"}
      />
    </div>
  );
};

export default DashboardStats;

