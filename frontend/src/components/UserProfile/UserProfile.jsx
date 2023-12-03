import React from 'react';

import { useAuth } from '../Auth/AuthProvider';

import { Edit, LogOut } from 'lucide-react';
import { displayRole } from '../../utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <>
      <div className="text-sm font-medium leading-none align-middle text-center self-center">
        {user?.userDto?.name ?? ''}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex">
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full self-center"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.png" alt="@shadcn" />
                <AvatarFallback>
                  {user?.userDto?.name
                    ?.toUpperCase()
                    .split(' ')
                    .map((x) => x[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-[1000]" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {displayRole(user?.userDto?.role ?? '')}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.userDto?.email ?? ''}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <Edit className="mr-2 h-4 w-4" />
              <span>Change Password</span>
              <DropdownMenuShortcut>🛠</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>🚪</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
