//other libraries
import { Link, useLocation } from 'react-router-dom';

//project import
import { Calendar, Columns, Menu, Ticket, Users2 } from 'lucide-react';
import { useAuth } from '../../../components/Auth/AuthProvider';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import './drawer.css';

const ROUTES = [
  {
    id: 'dashboard',
    name: 'DashBoard',
    url: '/dashboard',
    MuiIconName: <Columns />,
  },
  {
    id: 'calender',
    name: 'Calender',
    url: '/calender',
    MuiIconName: <Calendar />,
  },
  {
    id: 'request_form',
    name: 'Requests',
    url: '/requestForm',
    MuiIconName: <Ticket />,
  },
  {
    id: 'students',
    name: 'Students',
    url: '/students',
    MuiIconName: <Menu />,
  },
  {
    id: 'user_management',
    name: 'User Management',
    url: '/userManagement',
    MuiIconName: <Users2 />,
    isRestricted: true,
  },
];

const DrawerMain = () => {
  const location = useLocation();

  const { user: loggedInUser } = useAuth();
  // console.log(loggedInUser);
  return (
    <div className="z-[1000] fixed shadow flex flex-col w-[9rem] justify-start p-3 min-h-screen">
      <div className="h-10 top-5 left-5 self-center">
        <img className="object-contain h-full" src="/logo.svg" />
      </div>

      <RadioGroup
        value={location.pathname}
        className="flex flex-col gap-2 mt-5 text-center"
      >
        {ROUTES.filter(
          (r) => !(loggedInUser?.userDto?.role == 'MANAGER' && r?.isRestricted)
        ).map((r) => (
          <Link to={r.url} key={r.id}>
            <Label
              htmlFor={r.id}
              className={`${
                location.pathname?.startsWith(r.url)
                  ? 'selected-drawer text-white'
                  : ''
              } cursor-pointer min-h-[4rem] flex flex-col items-center justify-center gap-2 rounded-md border-muted bg-popover p-3 hover:bg-accent`}
            >
              <RadioGroupItem value={r.url} id={r.id} className="sr-only" />
              <div
                className={
                  location.pathname?.startsWith(r.url)
                    ? 'text-white'
                    : 'text-sky-500'
                }
              >
                {r.MuiIconName}
              </div>
              {r.name}
            </Label>
          </Link>
        ))}
      </RadioGroup>
    </div>
  );
};

export default DrawerMain;
