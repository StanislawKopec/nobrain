// RouteGuard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Replace with your actual import
import { useAppSelector } from './hooks';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);

  if (!isLoggedIn && sessionStorage.getItem("isLoggedIn")!= "true") {
    return <Navigate to="/Home" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
