import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './stores/authStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROUTES } from './config/constants';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfileSetup from './pages/ProfileSetup';
import CivicSensePage from './pages/CivicSensePage';
import CivicRankingPage from './pages/CivicRankingPage';
import MLARatingPage from './pages/MLARatingPage';
import MLARankingPage from './pages/MLARankingPage';
import DashboardPage from './pages/DashboardPage';
import MethodologyPage from './pages/MethodologyPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.AUTH} element={<AuthPage />} />
          <Route path={ROUTES.CIVIC_RANKINGS} element={<CivicRankingPage />} />
          <Route path={ROUTES.MLA_RANKINGS} element={<MLARankingPage />} />
          <Route path={ROUTES.METHODOLOGY} element={<MethodologyPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />

          {/* Protected routes */}
          <Route path={ROUTES.PROFILE_SETUP} element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.CIVIC_SENSE} element={<CivicSensePage />} />
          <Route path={ROUTES.MLA_RATING} element={<MLARatingPage />} />
          <Route path={ROUTES.DASHBOARD} element={
            <ProtectedRoute requireProfile>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ADMIN} element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
