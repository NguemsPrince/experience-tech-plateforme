import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProductProvider } from './contexts/ProductContext';

// Import i18n configuration
import './utils/i18n';

// Import dark mode styles
import './styles/dark-mode.css';
import './styles/modern-dashboard.css';
import './styles/rtl.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ErrorBoundary from './components/SimpleErrorBoundary';
// TODO: Décommenter après installation de Sentry : npm install @sentry/react @sentry/tracing
// import { SentryErrorBoundary } from './config/sentry';
// import ErrorFallback from './components/ErrorFallback';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import UserRoute from './components/UserRoute';

// Import pages (lazy loading for better performance)
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const Products = React.lazy(() => import('./pages/Products'));
const News = React.lazy(() => import('./pages/News'));
const Training = React.lazy(() => import('./pages/Training'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Client = React.lazy(() => import('./pages/Client'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const ModernAdminDashboard = React.lazy(() => import('./pages/ModernAdminDashboard'));
const UnifiedAdminDashboard = React.lazy(() => import('./pages/UnifiedAdminDashboard'));
const DashboardDemo = React.lazy(() => import('./pages/DashboardDemo'));
const Careers = React.lazy(() => import('./pages/Careers'));
const Forum = React.lazy(() => import('./pages/Forum'));
const ForumDebug = React.lazy(() => import('./pages/ForumDebug'));
const CreatePost = React.lazy(() => import('./pages/CreatePost'));
const TopicPage = React.lazy(() => import('./pages/TopicPage'));
const ForumAdmin = React.lazy(() => import('./pages/ForumAdmin'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Testimonials = React.lazy(() => import('./pages/Testimonials'));
const Login = React.lazy(() => import('./pages/Login'));
const MyTraining = React.lazy(() => import('./pages/MyTraining'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const Orders = React.lazy(() => import('./pages/Orders'));
const AdminInventory = React.lazy(() => import('./pages/AdminInventory'));
const Search = React.lazy(() => import('./pages/Search'));
const Register = React.lazy(() => import('./pages/Register'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const AccessDenied = React.lazy(() => import('./pages/AccessDenied'));
const SecurityTest = React.lazy(() => import('./components/SecurityTest'));

// Admin pages
const AddUser = React.lazy(() => import('./pages/AddUser'));
const AddProject = React.lazy(() => import('./pages/AddProject'));
const AddTraining = React.lazy(() => import('./pages/AddTraining'));
const GenerateReport = React.lazy(() => import('./pages/GenerateReport'));
const SystemSettings = React.lazy(() => import('./pages/SystemSettings'));
const SendNotification = React.lazy(() => import('./pages/SendNotification'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const LocationsPage = React.lazy(() => import('./pages/LocationsPage'));
const GeolocationPage = React.lazy(() => import('./pages/GeolocationPage'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));

// Component to conditionally render Header and Footer
function AppLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col rtl-layout">
      {!isAdminRoute && <Header />}
      
      <main className={`flex-grow ${!isAdminRoute ? 'pt-16' : ''}`}>
        {children}
      </main>
      
      {!isAdminRoute && <Footer />}
      
      {/* Chatbot - hidden on admin routes */}
      {!isAdminRoute && <Chatbot />}
    </div>
  );
}

function App() {
  // App initialization simplified

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProductProvider>
            <NotificationProvider>
              {/* TODO: Utiliser SentryErrorBoundary après installation de Sentry */}
              {/* <SentryErrorBoundary fallback={({ error, resetError }) => <ErrorFallback error={error} resetError={resetError} />}> */}
                <ErrorBoundary>
                  <Router>
                    <AppLayout>
                <Suspense fallback={<LoadingSpinner size="large" text="Chargement de la page..." />}>
                    <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:serviceId" element={<Services />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:articleId" element={<News />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/course/:id" element={<CourseDetail />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/forum-debug" element={<ForumDebug />} />
                    <Route path="/forum/create" element={<CreatePost />} />
                    <Route path="/forum/topic/:topicId" element={<TopicPage />} />
                    <Route path="/forum/admin" element={<ForumAdmin />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/locations" element={<LocationsPage />} />
                    <Route path="/geolocation" element={<GeolocationPage />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    
                    {/* Search Route */}
                    <Route path="/search" element={<Search />} />
                    
                    {/* Dashboard Demo Route */}
                    <Route path="/demo" element={<DashboardDemo />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* Protected Routes - Dashboard Admin Only (Unified) */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute requiredRole="admin">
                          <UnifiedAdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/client" element={
                      <ProtectedRoute>
                          <Client />
                      </ProtectedRoute>
                    } />
                    <Route path="/client/dashboard" element={
                      <ProtectedRoute>
                          <Client />
                      </ProtectedRoute>
                    } />
                    <Route path="/client/projects" element={
                      <ProtectedRoute>
                          <Client />
                      </ProtectedRoute>
                    } />
                    <Route path="/client/invoices" element={
                      <ProtectedRoute>
                          <Client />
                      </ProtectedRoute>
                    } />
                    <Route path="/client/support" element={
                      <ProtectedRoute>
                          <Client />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes - Unified Dashboard */}
                    <Route path="/admin" element={
                      <ProtectedRoute requiredRole="admin">
                          <UnifiedAdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                      <ProtectedRoute requiredRole="admin">
                          <UnifiedAdminDashboard />
                      </ProtectedRoute>
                    } />
                    {/* Legacy dashboards (kept for backward compatibility) */}
                    <Route path="/admin/legacy" element={
                      <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/modern" element={
                      <ProtectedRoute requiredRole="admin">
                          <ModernAdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Management Routes */}
                    <Route path="/admin/users/new" element={
                      <ProtectedRoute requiredRole="admin">
                        <AddUser />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/add-user" element={
                      <ProtectedRoute requiredRole="admin">
                        <AddUser />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/projects/new" element={
                      <ProtectedRoute requiredRole="admin">
                        <AddProject />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/training/new" element={
                      <ProtectedRoute requiredRole="admin">
                        <AddTraining />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/reports" element={
                      <ProtectedRoute requiredRole="admin">
                        <GenerateReport />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <ProtectedRoute requiredRole="admin">
                        <SystemSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/notifications/send" element={
                      <ProtectedRoute requiredRole="admin">
                        <SendNotification />
                      </ProtectedRoute>
                    } />
                    
                    {/* User Protected Routes */}
                    <Route path="/my-courses" element={
                      <UserRoute>
                          <MyTraining />
                      </UserRoute>
                    } />
                    <Route path="/cart" element={
                      <UserRoute>
                          <CartPage />
                      </UserRoute>
                    } />
                    <Route path="/client/orders" element={
                      <ProtectedRoute>
                          <Orders />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes - Inventory */}
                    <Route path="/admin/inventory" element={
                      <ProtectedRoute requiredRole="admin">
                          <AdminInventory />
                      </ProtectedRoute>
                    } />
                    
                    {/* Access Denied Route */}
                    <Route path="/access-denied" element={<AccessDenied />} />
                    
                    {/* Security Test Route (Admin only) */}
                    <Route path="/admin/security-test" element={
                      <ProtectedRoute requiredRole="admin">
                          <SecurityTest />
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
              </Suspense>
                    </AppLayout>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
                  </ErrorBoundary>
              {/* </SentryErrorBoundary> */}
            </NotificationProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
