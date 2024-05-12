import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Tags, Trash } from 'lucide-react';
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

import { statuses } from '../data/data';
import { taskSchema } from '../data/schema';
import { useNavigate } from 'react-router-dom';
import request from '../../../../utils/axios.config';
import { toast } from '../../../ui/use-toast';
import { ToastAction } from '../../../ui/toast';
import { useMutation, useQueryClient } from 'react-query';
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { id: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);

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
      navigate('/calender');
    },
    onError: (error) => {
      console.log(error);
      alert(error.message);
    },
  });

  return (
    <>
      {/* Move the dialog in parent/ as this is created for every row */}
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Change Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.mode ?? ''}>
                {statuses
                  .filter((s) => s.isAction)
                  .map((mode) => (
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
