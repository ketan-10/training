//----------------project import---------------//
import LoginLayout from '../Layout/LoginLayout/LoginLayout';
import ErrorPage from '../components/ErrorPage';
import RegistrationRequest from '../components/UserManagement/RegistrationRequest';
import LoginPage from '../pages/Login/LoginPage';
import ForgotPassword from '../pages/forgotPassword/ForgotPassword';

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <LoginLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'forgotPassword',
      element: <ForgotPassword />,
    },
    {
      path: 'registration',
      element: <RegistrationRequest />,
    },
  ],
};

export default LoginRoutes;
