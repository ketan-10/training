import React from 'react';
import { Button } from '../../../ui/button';
import request from '../../../../utils/axios.config';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from '../../../ui/use-toast';
import { ToastAction } from '../../../ui/toast';
import { useNavigate } from 'react-router-dom';

const ActionButtons = ({ cellId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const requestApprovalHandler = useMutation({
    mutationFn: (requestId) => {
      request.put(`/api/users/approve-registration/${requestId}`);
      // console.log('this is main requestID', requestId);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries('/api/users');
      toast({
        title: 'Request has been approved Successfully',
        description: `You will be redirected to User List Page`,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
      });
      navigate('/userManagement');
    },
    onSettled: () => {
      // setShowDialog(false);
      // console.log('this is onSettled');
    },
  });

  const requestRejectHandler = useMutation({
    mutationFn: (requestId) => {
      request.put(`/api/users/approve-registration/${requestId}`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries('/api/users');
      toast({
        title: 'Request has been rejected Successfully',
        description: `If changes doesnt show up, Please Refresh the pages`,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
      });

      // temporary solution for invalidation
      navigate('/userManagement/registrations');
    },
    onSettled: () => {
      // console.log('this is reject onSettled');
    },
  });

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => {
          requestApprovalHandler.mutate(cellId);
        }}
      >
        Approve
      </Button>
      <Button
        variant="outline"
        className="border-destructive text-destructive hover:text-destructive/90"
        onClick={() => {
          requestRejectHandler.mutate(cellId);
        }}
      >
        Reject
      </Button>
    </div>
  );
};

export default ActionButtons;
