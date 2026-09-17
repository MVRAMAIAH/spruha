import { Navigate } from 'react-router-dom';
import { useAuth } from '../../stores/authStore';
import { ROUTES } from '../../config/constants';

export default function ProtectedRoute({ children, requireVerified = false, requireProfile = false }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (requireVerified && !user?.emailVerified) {
    return <Navigate to={ROUTES.AUTH} state={{ step: 'verify' }} replace />;
  }

  if (requireProfile && !user?.profileCompleted) {
    return <Navigate to={ROUTES.PROFILE_SETUP} replace />;
  }

  return children;
}
