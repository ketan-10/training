import { format } from 'date-fns';
import { PlusCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../../../components/Auth/AuthProvider';
import LogoLoader from '../../../../components/Common/LogoLoader';
import ScheduleTrainingPopup from '../../../../components/Training/ScheduleTrainingPopup';
import { Button } from '../../../../components/ui/button';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import { ToastAction } from '../../../../components/ui/toast';
import { toast } from '../../../../components/ui/use-toast';
import request from '../../../../utils/axios.config';
import { PAGE_4 } from './Stepper';

const TrainingEventWrapper = ({ setActivePage, trainingId, trainingData }) => {
  const { data, isLoading } = useQuery(
    `/api/training-event/all-event-by-training-id/${trainingId}`,
    () => request(`/api/training-event/all-event-by-training-id/${trainingId}`)
  );

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  const trainingEvents = data?.data;
  return (
    <Page3 {...{ setActivePage, trainingId, trainingData, trainingEvents }} />
  );
};

const Page3 = ({ setActivePage, trainingId, trainingData, trainingEvents }) => {
  const queryClient = useQueryClient();

  const [showSchedule, setShowSchedule] = useState(false);

  const [events, setEvents] = useState(
    trainingEvents.map((t) => ({
      key: uuidv4(),
      from: t.from,
      to: t.to,
    }))
  );

  const { user: loggedInUser } = useAuth();

  const [isLoading, setLoading] = useState();

  const handlePopupSubmit = (values) => {
    // add events.
    setEvents([
      ...events,
      ...values.map((v) => ({
        key: uuidv4(),
        from: v.start.toISOString(),
        to: v.end.toISOString(),
      })),
    ]);
    // hide popup.
    setShowSchedule(false);
  };

  const updateEvents = useMutation({
    mutationFn: async (putData) => {
      const resPatch = await request.put(
        `/api/training-event/replace/${trainingId}`,
        JSON.stringify(putData, null)
      );
      return resPatch;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(
        `/api/training-event/all-event-by-training-id/${trainingId}`
      );
      toast({
        title: 'Training Updated Successfully',
        description: `You might have to refresh the page!`,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
      });
    },
    onError: (err) => {
      console.log(err);
      alert(err);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const addEventsAndSetStatusScheduled = useMutation({
    mutationFn: async (putData) => {
      const resPatch = await request.put(
        `/api/training-event/replace/${trainingId}`,
        JSON.stringify(putData, null)
      );
      const resStatus = await request.put(
        `/api/training/change-training-status/${trainingId}`,
        'SCHEDULED'
      );
      return [resPatch, resStatus];
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries([
        `/api/training/${trainingId}`,
        `/api/training-event/all-event-by-training-id/${trainingId}`,
      ]);
      toast({
        title: 'Training Updated Successfully',
        description: `You might have to refresh the page!`,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
      });
      setActivePage(PAGE_4);
    },
    onError: (err) => {
      console.log(err);
      alert(err);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  return (
    <div className="flex gap-5 flex-wrap justify-evenly mt-5">
      <div className="space-y-8 w-full max-w-4xl bg-white py-7 px-4 md:px-20">
        {!showSchedule ? (
          <div className="flex justify-end">
            {loggedInUser?.userDto?.role == 'REQUESTER' ? null : (
              <Button
                onClick={() => {
                  setShowSchedule(true);
                }}
                variant="secondary"
                className="flex gap-2"
              >
                Add Event
                <PlusCircle />
              </Button>
            )}
          </div>
        ) : (
          <div className="border-gray-300 border-solid border-2 py-5 px-10">
            <ScheduleTrainingPopup
              setShowSchedule={setShowSchedule}
              handlePopupSubmit={handlePopupSubmit}
            />
          </div>
        )}

        {events.length ? (
          <div className="flex flex-col gap-10">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Remove</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((env, i) => (
                    <TableRow key={env.key}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {format(new Date(env.from), 'LLL dd, y (EEE) hh:mm bb')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(env.to), 'LLL dd, y (EEE) hh:mm bb')}
                      </TableCell>
                      <TableCell>
                        {loggedInUser?.userDto?.role == 'REQUESTER' ? null : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 p-0"
                            onClick={() => {
                              setEvents(events.filter((e) => e.key != env.key));
                            }}
                            disabled={
                              loggedInUser?.userDto?.role == 'REQUESTER'
                            }
                          >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex justify-end gap-3">
              {loggedInUser?.userDto?.role == 'REQUESTER' ? null : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    updateEvents.mutate(events);
                  }}
                >
                  Save
                </Button>
              )}

              <Button
                disabled={loggedInUser?.userDto?.role == 'REQUESTER'}
                onClick={() => {
                  setLoading(true);
                  addEventsAndSetStatusScheduled.mutate(events);
                }}
              >
                Save and schedule
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TrainingEventWrapper;
