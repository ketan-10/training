import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import LogoLoader from '../../../components/Common/LogoLoader';
import request from '../../../utils/axios.config';
import Stepper from './components/Stepper';

export default function TrainingDetails() {
  const { trainingId } = useParams();

  const { data: trainingData, isLoading: isTrainingLoading } = useQuery(
    `/api/training/${trainingId}`,
    () => request(`/api/training/${trainingId}`)
  );

  if (isTrainingLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  return <Stepper {...{ trainingId, trainingData }} />;
}
