import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg text-white">
        <Loader size="large" label="Verifying session..." />
      </div>
    );
  }

  if (!user) {
    // Redirect to login, storing the attempted path to go back to after auth
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect role-mismatched users to their respective dashboards
    const destination = user.role === 'recruiter' 
      ? '/recruiter/dashboard' 
      : '/candidate/dashboard';
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default ProtectedRoute;
