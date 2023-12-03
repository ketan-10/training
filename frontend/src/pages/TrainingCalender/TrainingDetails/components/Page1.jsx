import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import LogoLoader from '../../../../components/Common/LogoLoader';
import ParticipantsList from '../../../../components/Training/ParticipantsList';
import TrainingDetailsGrid from '../../../../components/Training/TrainingDetailsGrid';
import TrainingForm from '../../../../components/Training/TrainingForm';
import TrainingHistory from '../../../../components/Training/TrainingHistory';
import { Button } from '../../../../components/ui/button';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/tabs';
import request from '../../../../utils/axios.config';
import { PAGE_2 } from './Stepper';
import { useAuth } from '../../../../components/Auth/AuthProvider';

export const Page1 = ({ trainingId, trainingData, setActivePage }) => {
  const { user: loggedInUser } = useAuth();
  const { data: registrations, isLoading: isParticipantsLoading } = useQuery(
    `/api/register/${trainingId}`,
    () => request(`/api/register/${trainingId}`)
  );

  const onSentForApproval = (values) => {
    // console.log('Values: ', values);
    setActivePage(PAGE_2);
  };

  if (isParticipantsLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  const totalData = {
    ...trainingData.data,
    ...{ participants: registrations.data },
    ...{ category: undefined },
  };

  return (
    <div className="flex gap-5 flex-wrap justify-evenly mt-5">
      <div className="space-y-8 w-full max-w-4xl bg-white py-7 px-4 md:px-20">
        <div className="flex justify-end">
          <Link to={`/requestTickets/${trainingId}`}>
            {loggedInUser?.userDto?.role == 'REQUESTER' ? null : (
              <Button variant="secondary">Edit Form</Button>
            )}
          </Link>
        </div>
        <TrainingDetailsGrid formState={totalData} />
        <div className="flex justify-center">
          <Tabs
            defaultValue="history"
            className="w-[500px] flex flex-col gap-10"
          >
            <TabsList className="self-center">
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <TabsContent value="participants">
                <div className="flex flex-col gap-1">
                  {totalData?.participants?.length ? (
                    <ParticipantsList participants={totalData?.participants} />
                  ) : null}
                </div>
              </TabsContent>
              <TabsContent value="history">
                <TrainingHistory trainingId={trainingId} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        <TrainingForm {...{ onSentForApproval, trainingId, totalData }} />
      </div>
    </div>
  );
};
