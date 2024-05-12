import { ArrowLeft, Check } from 'lucide-react';
import React, { Fragment, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import { STEP_2 } from '..';
import LogoLoader from '../../../../components/Common/LogoLoader';
import ParticipantsList from '../../../../components/Training/ParticipantsList';
import TrainingDetailsGrid from '../../../../components/Training/TrainingDetailsGrid';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import request from '../../../../utils/axios.config';
import { useRequestFormGlobal } from './RequestFormGlobalProvider';
import { ToastAction } from '../../../../components/ui/toast';
import { toast } from '../../../../components/ui/use-toast';
import { useAuth } from '../../../../components/Auth/AuthProvider';

const Step3 = ({ setPage, ticketId }) => {
  const [formState, _] = useRequestFormGlobal();
  const [showCreateTrainingConfrimation, setShowCreateTrainingConfrimation] =
    useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRedirectDialog, setShowRedirectDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();

  const createTraining = useMutation({
    mutationFn: async (trainingRequestFormData) => {
      const newTraining = await request.post(
        `/api/training/requests`,
        JSON.stringify(trainingRequestFormData, null)
      );
      const newTrainingId = newTraining?.data?.id;
      const response = await request.post(
        `/api/register/${newTrainingId}`,
        JSON.stringify(
          trainingRequestFormData?.participants?.map((p) => p.id),
          null
        )
      );
      return response;
    },
    onSuccess: (res) => {
      setShowRedirectDialog(true);
      setTimeout(() => {
        setShowRedirectDialog(false);
        return navigate('/requestForm');
      }, 2000);
    },
    onError: (error) => {
      console.log(error);
      alert(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  // this updateTraining will move the ticket to Calender
  const updateTraining = useMutation({
    mutationFn: async (trainingRequestFormData) => {
      const response = await Promise.all([
        request.put(
          `/api/training/requests/${ticketId}`,
          JSON.stringify(trainingRequestFormData, null)
        ),
        request.post(
          `/api/register/${ticketId}`,
          JSON.stringify(
            trainingRequestFormData?.participants?.map((p) => p.id),
            null
          )
        ),
        // request.post(`/api/training/requests/approve/${ticketId}`),
      ]);
      return response;
    },
    onSuccess: (res) => {
      toast({
        title: 'Your Training has been updated Successfully',
        description: ``,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
      });

      // setShowRedirectDialog(true);
      // setTimeout(() => {
      //   setShowRedirectDialog(false);
      //   // return navigate('/requestTickets');
      // }, 4000);
    },
    onError: (error) => {
      console.log(error);
      alert(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const approveTraining = useMutation({
    mutationFn: async () => {
      request.post(`/api/training/requests/approve/${ticketId}`);
    },
    onSuccess: (res) => {
      setShowRedirectDialog(true);
      setTimeout(() => {
        setShowRedirectDialog(false);
        return navigate('/calender');
      }, 4000);
    },
    onError: (error) => {
      console.log(error);
      alert(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const submitTraining = () => {
    setLoading(true);
    ticketId
      ? updateTraining.mutate(formState)
      : createTraining.mutate(formState);
  };

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  return (
    <>
      <div className="flex gap-5 flex-wrap justify-evenly mt-5">
        <Dialog open={showRedirectDialog} onOpenChange={setShowRedirectDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Training Created/Updated Successfully</DialogTitle>
              <DialogDescription>
                You will be redirected to Training Table Page shortly.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={showCreateTrainingConfrimation}
          onOpenChange={setShowCreateTrainingConfrimation}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to{' '}
                {ticketId ? 'update' : 'send the request to create'} the
                Training {ticketId ? 'details' : ''}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={submitTraining}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={showApproveDialog}
          onOpenChange={setShowApproveDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to move the request to Calender Table.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => approveTraining.mutate()}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-8 w-full max-w-4xl bg-white py-7 px-4 md:px-20">
          <TrainingDetailsGrid formState={formState} />

          <div className="flex flex-col gap-1">
            {formState?.participants?.length ? (
              <>
                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3">
                  Participants :
                </div>
                <ParticipantsList participants={formState?.participants} />
              </>
            ) : null}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={() => setPage(STEP_2)}
            >
              <ArrowLeft className="w-4" /> Back
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={setShowCreateTrainingConfrimation.bind(null, true)}
              >
                {ticketId ? 'Save' : 'Create'} {ticketId ? '' : 'Training'}
              </Button>
              {/* {(ticketId && loggedInUser?.userDto?.role == 'REQUESTER') ? null : ( */}
              {ticketId &&
              loggedInUser?.userDto?.role != 'REQUESTER' &&
              formState.status == 'REQUESTED' ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowApproveDialog(true)}
                  >
                    Approve
                    <Check className="w-5 h-5" />
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step3;
