import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pen, Star, Tags, Trash } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '../../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';

import { useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import request from '../../../../utils/axios.config';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog';
import { modes } from '../data/data';
import { taskSchema } from '../data/schema';
import { useAuth } from '../../../Auth/AuthProvider';
import { ToastAction } from '../../../ui/toast';
import { toast } from '../../../ui/use-toast';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { id: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);
  // console.log('row',row.original.id)

  const queryClient = useQueryClient();

  const { user } = useAuth();

  const approveTraining = useMutation({
    mutationFn: async (trainingId: number) => {
      await request.post(`/api/training/requests/approve/${trainingId}`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries('/api/training/requests');
    },
    onSettled: () => {
      setShowDialog(false);
    },
  });

  const [showDialog, setShowDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDeleteTrainingConfrimation, setShowDeleteTrainingConfrimation] =
    useState(false);
  const [deleteRequestClickedId, setDeleteRequestClickedId] = useState('');
  const navigate = useNavigate();

  const deleteTrainingEntry = useMutation<TData, { message: string }>({
    mutationFn: async () => {
      return request.delete(`/api/training/${deleteRequestClickedId}`);
    },
    onSuccess: () => {
      toast({
        title: 'Your entry deleted successfully',
        description: `If changes doesnt show up, Please Refresh the pages`,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
      });
      // temporary solution for invalidation
      navigate('/requestForm');
    },
    onError: (error) => {
      console.log(error);
      alert(error?.message ?? 'Operation Failed');
    },
  });

  return (
    <>
      {/* Move the dialog in parent/ as this is created for every row */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Training is Approved</DialogTitle>
            <DialogDescription>
              You will be redirected shortly.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              The training will be Approved, And will be pending for schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                approveTraining.mutate(task.id);
                setShowDialog(true);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showDeleteTrainingConfrimation}
        onOpenChange={setShowDeleteTrainingConfrimation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete this request Entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTrainingEntry.mutate()}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <Link to={`/requestForm/${task.id}`}>
            <DropdownMenuItem>
              <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Edit
            </DropdownMenuItem>
          </Link>
          {user?.userDto?.role === 'ADMIN' ? (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setShowAlert(true);
                }}
              >
                <Star className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Mark Approve
              </DropdownMenuItem>
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Modes
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.mode ?? ''}>
                {modes.map((mode) => (
                  <DropdownMenuRadioItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowDeleteTrainingConfrimation(true);
              setDeleteRequestClickedId(row.original.id);
            }}
          >
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
