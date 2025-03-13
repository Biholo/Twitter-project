import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoutes from '@/routes/PrivateRoutes';
import PublicRoutes from '@/routes/PublicRoutes';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import Error from '@/features/Error';
import Loader from '@/components/ui/Loader';
import { useAuthStore } from '@/stores/authStore';
import { useAutoLogin } from '@/api/queries/authQueries';
import { useEffect } from 'react';
import Home from '@/features/feed/Home';
import Profil from '@/features/feed/Profil';
import Signets from '@/features/feed/Signet';
import Explorer from '@/features/feed/Explorer';
import MainLayout from '@/components/layout/MainLayout';
import TweetDetails from '@/features/feed/TweetDetails';
import websocketService from '@/services/websocketService';
import Cookies from 'js-cookie';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { refetch: autoLogin, isPending } = useAutoLogin();

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  // Gestion de la connexion WebSocket
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      const token = Cookies.get('access_token');
      if (token) {
        websocketService.connect(token);

        return () => {
          websocketService.disconnect();
        };
      }
    }
  }, [isAuthenticated, user?._id]);

  if (isPending) return <Loader />

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          {/* Routes publiques */}
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Routes privées */}
          <Route element={<PrivateRoutes />}>
            <Route element={<MainLayout />}>
              <Route path='/home' element={<Home />} />
              <Route path='/profil' element={<Profil />} />
              <Route path='/explore' element={<Explorer />} />
              <Route path='/signets' element={<Signets />} />
              <Route path='/tweet/:id' element={<TweetDetails />} />
            </Route>
          </Route>

          {/* Route par défaut */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;
