import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Separator } from '../../components/ui/separator';
import { cn } from '../../utils';

const ROUTES = [
  {
    name: 'User List',
    href: '/userManagement/users',
  },
  {
    name: 'Registration Requests',
    href: '/userManagement/registrations',
  },
];

const UserManagementHeader = () => {
  const location = useLocation();
  return (
    <div className="p-5 bg-gray-50 h-full">
      <div className="p-1 flex justify-between align-middle">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <div className="self-end text-gray-400">
          <span className="text-blue-400">Home</span> / User Management
        </div>
      </div>
      <Separator className="my-3 h-[2.5px]" />
      <div className="mb-4 flex items-center">
        {ROUTES.map((r) => (
          <Link
            to={r.href}
            key={r.href}
            className={cn(
              'flex items-center px-4',
              location.pathname?.startsWith(r.href)
                ? 'font-bold text-primary'
                : 'font-medium text-muted-foreground'
            )}
          >
            {r.name}
          </Link>
        ))}
      </div>
      <Separator className="my-3 h-[2px]" />
      <Outlet />
    </div>
  );
};

export default UserManagementHeader;
