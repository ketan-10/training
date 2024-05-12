// project import

import { Navigate } from 'react-router';
import MainLayout from '../Layout/MainLayout';
import ErrorPage from '../components/ErrorPage';
import Dashboard from '../pages/Dashboard/Dashboard';
import Students from '../pages/students';
import RequestTickets from '../pages/RequestTickets';
import RequestTrainingForm from '../pages/RequestTickets/RequestTrainingForm';
import RequestedForm from '../pages/RequestTickets/RequestedForm';
import TrainingCalender from '../pages/TrainingCalender';
import TrainingDetails from '../pages/TrainingCalender/TrainingDetails';
import RegistrationList from '../pages/UserManagement/RegistrationList';
import UserList from '../pages/UserManagement/UserList';
import UserManagementHeader from '../pages/UserManagement/UserManagementHeader';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <Navigate to="/requestForm" />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/calender',
      element: <TrainingCalender />,
    },
    {
      path: '/requestForm',
      element: <RequestTickets />,
    },
    {
      path: '/requestForm/requestTrainingForm',
      element: <RequestTrainingForm />,
    },
    {
      path: '/students',
      element: <Students />,
    },
    {
      path: '/requestForm/:ticketId',
      element: <RequestedForm />,
    },
    {
      path: 'calender/trainingDetails/:trainingId',
      element: <TrainingDetails />,
    },
    {
      path: '/userManagement',
      element: <UserManagementHeader />,
      children: [
        {
          index: true,
          element: <Navigate to="users" />,
        },
        {
          path: 'users',
          element: <UserList />,
        },
        {
          path: 'registrations',
          element: <RegistrationList />,
        },
      ],
    },
  ],
};

export default MainRoutes;
