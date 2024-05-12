import * as React from 'react';

import { Bell } from 'lucide-react';
import { useQuery } from 'react-query';
import request from '../../utils/axios.config';
import { Button } from '../ui/button';
import NotificationPopover from './NotificationPopover';

import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Notifications = () => {
  const { data, status } = useQuery(
    'ping-notification',
    () => request('/api/notification/ping'),
    {
      refetchInterval: 3000,
    }
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex">
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full self-center"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  <Bell className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              {status == 'success' && data?.data && data?.data > 0 ? (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {data?.data}
                </span>
              ) : null}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[1000]" align="end" forceMount>
          <NotificationPopover />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Notifications;
