import { format } from 'date-fns';
import { Download } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { utils, writeFile } from 'xlsx';
import LogoLoader from '../../../../components/Common/LogoLoader';
import FileUpload from '../../../../components/FileUpload';
import { Label } from '../../../../components/ui/label';
import { ToastAction } from '../../../../components/ui/toast';
import { toast } from '../../../../components/ui/use-toast';
import request from '../../../../utils/axios.config';

const TrainingEventWrapper = ({ setActivePage, trainingId, trainingData }) => {
  const { data, isLoading } = useQuery(
    `/api/training-event/all-event-by-training-id/${trainingId}`,
    () => request(`/api/training-event/all-event-by-training-id/${trainingId}`)
  );

  const { data: registrations, isLoading: isParticipantsLoading } = useQuery(
    `/api/register/${trainingId}`,
    () => request(`/api/register/${trainingId}`)
  );

  if (isLoading || isParticipantsLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  const trainingEvents = data?.data;
  return (
    <Page4 {...{ trainingId, trainingData, trainingEvents, registrations }} />
  );
};

const Page4 = ({ trainingId, trainingData, trainingEvents, registrations }) => {
  const [isLoading, setLoading] = useState();

  const [attendanceFileName, setAttendanceFileName] = useState(
    trainingData?.data?.attendancePath
  );

  const queryClient = useQueryClient();

  const updateAttendanceFile = useMutation({
    mutationFn: async (patchData) => {
      const response = await request.patch(
        `/api/training/${trainingId}`,
        JSON.stringify(patchData, null)
      );
      return response;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(`/api/training/${trainingId}`);
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: 'Something went wrong',
        description: ``,
        action: <ToastAction altText="alt Text">Dismiss</ToastAction>,
      });
    },
  });

  const generateExcel = () => {
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet([]);

    utils.book_append_sheet(workbook, worksheet);

    utils.sheet_add_aoa(
      worksheet,
      [
        [
          'PID',
          'Email',
          ...trainingEvents.map((t) => format(new Date(t.from), 'dd-MM-yyyy')),
        ],
      ],
      { origin: 'A1' }
    );
    utils.sheet_add_aoa(
      worksheet,
      registrations?.data?.map((t) => [t.uuid, t.email]),
      { origin: 'A2' }
    );

    writeFile(
      workbook,
      `${trainingId}-${
        trainingData?.data?.trainingName?.replaceAll(' ', '-') ?? ''
      }.xlsx`
    );
  };

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  return (
    <div className="flex gap-5 flex-wrap justify-evenly mt-5">
      <div className="space-y-8 w-full max-w-4xl bg-white py-7 px-4 md:px-20">
        <div className="flex w-full gap-10">
          <div className="flex-shrink-0 self-center">
            <Label>Please Upload attendance :</Label>
          </div>

          <FileUpload
            initialValue={attendanceFileName}
            onChange={(fileName) => {
              setAttendanceFileName(fileName);
              updateAttendanceFile.mutate({
                attendancePath: fileName,
              });
            }}
          />
        </div>
        <div className="flex">
          <div
            className="cursor-pointer flex gap-3 bg-blue-100 px-6 py-1.5 text-blue-700 text-sm align-middle justify-center rounded-sm"
            onClick={() => {
              // downloadTemplateFile.mutate();
              generateExcel();
            }}
          >
            <Download className="w-5 h-5" />
            <div className="">Click there to download Excel Template</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingEventWrapper;
