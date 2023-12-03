import { Loader2, Trash, Delete } from 'lucide-react';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/axios.config';
import { Button } from '../ui/button';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

const NotificationPopover = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries('pending-notification');
    queryClient.invalidateQueries('ping-notification');
  };

  const navigate = useNavigate();

  const { data, isLoading } = useQuery('pending-notification', () =>
    request('/api/notification/pending')
  );

  const clearAllMutation = useMutation({
    mutationFn: () => {
      return request.put(`/api/notification/clear-all`);
    },
    onSuccess: invalidate,
  });

  const clearNotificationMutation = useMutation({
    mutationFn: (id) => {
      return request.put(`/api/notification/clear/${id}`);
    },
    onSuccess: invalidate,
  });

  if (isLoading) {
    return <Loader2 className="mr-2 h-6 w-6 animate-spin" />;
  }

  return (
    <>
      <DropdownMenuLabel className="flex font-normal">
        {data?.data?.length ? (
          <>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-md font-medium leading-none">Notifications</p>
            </div>

            <Button
              variant="outline"
              className="h-8 rounded ml-auto"
              onClick={clearAllMutation.mutate}
            >
              <div className="flex gap-1">
                <div className="text-xs self-center">Clear All</div>

                <div>
                  <Delete className="w-4 h-4" />
                </div>
              </div>
            </Button>
          </>
        ) : (
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-md font-medium leading-none">
              No new notifications
            </p>
          </div>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {data.data.map((item) => (
          <DropdownMenuItem
            className="space-y-6 py-3"
            key={item?.id}
            onClick={() => {
              // console.log('Parent clicked');
              return navigate('/requestForm' + item.url);
            }}
          >
            <div className="flex items-center w-full gap-3">
              <div className="ml-4 space-y-1">
                <p className="text-xs font-medium leading-none">
                  {item.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="outline"
                className="h-9 w-9 rounded-full ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotificationMutation.mutate(item.id);
                }}
              >
                <div>
                  <Trash className="w-5 h-5" />
                </div>
              </Button>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
    </>
  );
};

export default NotificationPopover;
