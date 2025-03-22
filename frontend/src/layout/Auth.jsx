import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import Loading from '../componets/Loading/Loading';

const Auth = () => {
  const { auth, loading } = useContext(AuthContext);
  const autenticado = localStorage.getItem('token');
  const userRole = auth?.rol;

  if (loading) {
    return <Loading />;
  }

  if (autenticado && userRole) {
    if (userRole === 'admin') {
      return <Navigate to='/dashboard' />;
    } else if (userRole === 'conductor') {
      return <Navigate to='/dashboardConductor' />;
    }
  }

  return (
    <main className="flex justify-center content-center w-full h-screen">
      <Outlet />
    </main>
  );
};

export default Auth;