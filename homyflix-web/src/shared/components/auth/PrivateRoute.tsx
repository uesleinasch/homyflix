import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks/useAuth";
import MainLayout from "../../../Layout/MainLayout/MainLayout";

interface PrivateRouteProps {
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <MainLayout />;
};

export default PrivateRoute;
