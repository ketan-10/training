import { Navigate, Outlet } from 'react-router-dom';

// material-ui

// project import
import { useAuth } from '../../components/Auth/AuthProvider';
import { isTokenValid } from '../../utils';
import DrawerMain from './Drawer';
import Header from './Header';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const { user } = useAuth();

  if (!user || !isTokenValid(user.token)) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="flex grow">
        <DrawerMain />
        <div className="pl-[9rem] pt-14 w-full min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
