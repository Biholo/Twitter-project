import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoutes from '@/routes/PrivateRoutes';
import PublicRoutes from '@/routes/PublicRoutes';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import Error from '@/features/Error';
import { useAuthStore } from '@/stores/authStore';
import Loader from '@/components/ui/Loader';
import { useAutoLogin } from '@/api/queries/authQueries';
import { useEffect } from 'react';
import NewsFeed from '@/features/feed/Profile';
import Home from '@/features/feed/Home';

const AppRoutes = () => {

  const { refetch: autoLogin, isPending } = useAutoLogin();

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

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
           
          </Route>

          {/* Route par défaut */}
          <Route path='/home' element={<Home />} />
          <Route path='/accueil' element={<NewsFeed />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;
