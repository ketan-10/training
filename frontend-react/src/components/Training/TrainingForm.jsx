import { zodResolver } from '@hookform/resolvers/zod';
import { ToastAction } from '@radix-ui/react-toast';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as z from 'zod';
import { sendApprovalRequestMail } from '../../utils';
import request from '../../utils/axios.config';
import { useAuth } from '../Auth/AuthProvider';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../Form/Form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';

const formSchema = z.object({
  moderator: z.string().optional().nullable(),
  trainer: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
});

const TrainingForm = ({ trainingId, totalData, onSentForApproval }) => {
  const { user: loggedInUser } = useAuth();

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: totalData,
  });

  const patchTraining = useMutation({
    mutationFn: async (patchData) => {
      const response = await request.patch(
        `/api/training/${trainingId}`,
        JSON.stringify(patchData, null)
      );
      return response;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries([
        `/api/training/audit-log/${trainingId}`,
        `/api/training/${trainingId}`,
      ]);
      toast({
        title: 'Training Updated Successfully',
        description: `Please refresh the page to view changes`,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
      });
    },
    onError: (err) => {
      console.log(err);
      alert(err);
    },
  });

  const [showDialog, setShowDialog] = useState(false);

  const sendForApproval = useMutation({
    mutationFn: async (patchData) => {
      const resPatch = await request.patch(
        `/api/training/${trainingId}`,
        JSON.stringify(patchData, null)
      );
      const resStatus = await request.put(
        `/api/training/change-training-status/${trainingId}`,
        'PENDING_FOR_APPROVAL'
      );
      return [resPatch, resStatus];
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries([
        `/api/training/audit-log/${trainingId}`,
        `/api/training/${trainingId}`,
      ]);
    },
    onError: (err) => {
      console.log(err);
      alert(err);
    },
    onSettled: () => {
      setShowDialog(false);
      onSentForApproval();
    },
  });

  const handleSubmit = async (values) => {
    patchTraining.mutate(values);
  };

  const handleSendForApproval = (values) => {
    setShowDialog(true);
    sendForApproval.mutate(values);
    window.location.assign(
      sendApprovalRequestMail(loggedInUser, totalData, values)
    );
  };

  return (
    <div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Please Wait...</DialogTitle>
            <DialogDescription>Sending For approval.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form>
          <div id="grid-template-colum-auto-fit" className="grid gap-4">
            <FormField
              control={form.control}
              name="moderator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moderator</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        loggedInUser?.userDto?.role == 'REQUESTER'
                          ? true
                          : false
                      }
                      placeholder="Moderator"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please specify who will be moderating this training.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trainer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainer Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        loggedInUser?.userDto?.role == 'REQUESTER'
                          ? true
                          : false
                      }
                      placeholder="Trainer"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please specify who will be the trainer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Link</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        loggedInUser?.userDto?.role == 'REQUESTER'
                          ? true
                          : false
                      }
                      placeholder="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL for the training if any.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      {loggedInUser?.userDto?.role != 'REQUESTER' ? (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={form.handleSubmit(handleSubmit)}>
            Save
          </Button>

          <Button
            disabled={loggedInUser?.userDto?.role == 'REQUESTER' ? true : false}
            type="input"
            onClick={form.handleSubmit(handleSendForApproval)}
          >
            Send for approval
          </Button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default TrainingForm;
