import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../../store/store';

interface PublicRouteProps {
  redirectTo?: string;
}


const PublicRoute: React.FC<PublicRouteProps> = ({ redirectTo = '/dashboard' }) => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated && token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
