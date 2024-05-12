import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import FileUpload from '../../../../components/FileUpload';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import request from '../../../../utils/axios.config';
import { PAGE_1, PAGE_3 } from './Stepper';
import { useAuth } from '../../../../components/Auth/AuthProvider';

const Page2 = ({ setActivePage, trainingId, trainingData }) => {
  const { user: loggedInUser } = useAuth();
  const queryClient = useQueryClient();

  const [mailAttachmentFile, setMailAttachmentFile] = useState(
    trainingData?.data?.approvalMailAttachmentFile
  );

  const markApproveWithApprovalMail = useMutation({
    mutationFn: async (patchData) => {
      const resPatch = await request.patch(
        `/api/training/${trainingId}`,
        JSON.stringify(patchData, null)
      );
      const resStatus = await request.put(
        `/api/training/change-training-status/${trainingId}`,
        'APPROVED'
      );
      return [resPatch, resStatus];
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(`/api/training/${trainingId}`);
      setActivePage(PAGE_3);
    },
    onError: (err) => {
      console.log(err);
      alert(err);
    },
  });

  if (loggedInUser?.userDto?.role == 'REQUESTER') {
    return (
      <div className="py-20 w-full flex justify-center items-center font-bold text-4xl text-gray-400">
        Your form has sent for Approval.
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-5 flex-wrap justify-evenly mt-5">
        <div className="space-y-8 w-full max-w-4xl bg-white py-7 px-4 md:px-20">
          <div className="flex w-full gap-10">
            <div className="flex-shrink-0 self-center">
              <Label>Attach Approval Mail :</Label>
            </div>
            <FileUpload
              initialValue={mailAttachmentFile}
              onChange={setMailAttachmentFile}
            />
          </div>
          <div className="flex justify-between gap-3">
            <Button
              variant="secondary"
              className="flex gap-2"
              onClick={() => {
                setActivePage(PAGE_1);
              }}
            >
              <ArrowLeft className="w-4" />
              Previous
            </Button>

            {loggedInUser?.userDto?.role == 'REQUESTER' ? null : (
              <Button
                onClick={() => {
                  markApproveWithApprovalMail.mutate({
                    approvalMailAttachmentFile: mailAttachmentFile,
                  });
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page2;
