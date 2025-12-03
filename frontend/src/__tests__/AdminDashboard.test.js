import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import { useAuth } from '../hooks/useAuth';

// Mock du hook useAuth
jest.mock('../hooks/useAuth');
jest.mock('../components/AdminSidebar', () => {
  return function MockAdminSidebar({ activeTab, setActiveTab }) {
    return (
      <div data-testid="admin-sidebar">
        <button 
          data-testid="nav-overview" 
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button 
          data-testid="nav-users" 
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button>
        <button 
          data-testid="nav-projects" 
          onClick={() => setActiveTab('projects')}
        >
          Projets
        </button>
      </div>
    );
  };
});

jest.mock('../components/AdminStatsCards', () => {
  return function MockAdminStatsCards({ stats }) {
    return (
      <div data-testid="stats-cards">
        <div data-testid="total-users">{stats.totalUsers.toLocaleString()}</div>
        <div data-testid="total-revenue">{stats.totalRevenue.toLocaleString()} FCFA</div>
      </div>
    );
  };
});

jest.mock('../components/AdminCharts', () => {
  return function MockAdminCharts() {
    return <div data-testid="admin-charts">Graphiques</div>;
  };
});

jest.mock('../components/AdminNotifications', () => {
  return function MockAdminNotifications() {
    return (
      <div data-testid="notifications-bell">
        <button data-testid="notifications-panel">Notifications</button>
      </div>
    );
  };
});

const mockUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@experiencetech-tchad.com',
  role: 'admin'
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true
    });
  });

  it('renders admin dashboard with user information', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Tableau de bord Administrateur')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@experiencetech-tchad.com')).toBeInTheDocument();
  });

  it('displays statistics cards', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
    expect(screen.getByTestId('total-users')).toHaveTextContent('1,247');
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('45,678,900');
  });

  it('toggles dark mode', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    const darkModeToggle = screen.getByTestId('dark-mode-toggle');
    fireEvent.click(darkModeToggle);

    await waitFor(() => {
      expect(document.body).toHaveClass('dark');
    });
  });

  it('handles search functionality', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'utilisateur' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('utilisateur');
    });
  });

  it('displays loading state', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Chargement du tableau de bord administrateur...')).toBeInTheDocument();
  });
});
