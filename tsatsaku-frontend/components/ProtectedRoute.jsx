import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import authService from '../services/authService';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        router.push('/login');
        return;
      }

      // Check role-based access if allowedRoles is specified
      if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
        router.push('/unauthorized');
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
};

export default ProtectedRoute;