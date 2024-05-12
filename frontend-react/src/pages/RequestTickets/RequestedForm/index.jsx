import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import LogoLoader from '../../../components/Common/LogoLoader';
import request from '../../../utils/axios.config';
import RequestTrainingForm from '../RequestTrainingForm';

const RequestedForm = () => {
  const { ticketId } = useParams();

  const { data: trainingData, isLoading: isTrainingLoading } = useQuery(
    `/api/training/requests/${ticketId}`,
    () => request(`/api/training/requests/${ticketId}`)
  );
  const { data: registrations, isLoading: isParticipantsLoading } = useQuery(
    `/api/register/${ticketId}`,
    () => request(`/api/register/${ticketId}`)
  );

  if (isTrainingLoading || isParticipantsLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );
  // console.log('Training Data: ', trainingData);
  const totalData = {
    ...trainingData.data,
    ...{ participants: registrations.data },
  };
  // console.log('Total Data: ', totalData);

  return <RequestTrainingForm ticketId={ticketId} formDefaults={totalData} />;
};

export default RequestedForm;
