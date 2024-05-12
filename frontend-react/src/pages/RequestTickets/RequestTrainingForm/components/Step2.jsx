import { ArrowLeft, Download } from 'lucide-react';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { read, utils } from 'xlsx';
import LogoLoader from '../../../../components/Common/LogoLoader';
import FileUpload from '../../../../components/FileUpload';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/Form/Form';
import ParticipantsList from '../../../../components/Training/ParticipantsList';
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
import request from '../../../../utils/axios.config';
import { STEP_1, STEP_3 } from '../index';
import { useRequestFormGlobal } from './RequestFormGlobalProvider';

const Step2 = ({ setPage, ticketId }) => {
  const [isLoading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [formState, setFormState] = useRequestFormGlobal();
  const form = useForm({
    defaultValues: formState,
  });

  // participants which do not exits in database from given excel file.
  const [notFountList, setNotFoundList] = useState([]);
  // participants enrolled in training
  const {
    fields: participants,
    append: addParticipants,
    replace: setParticipants,
  } = useFieldArray({
    name: 'participants',
    control: form.control,
  });

  const verifyParticipants = useMutation({
    mutationFn: async (data) => {
      return await request.post(
        `/api/students/existing-students`,
        JSON.stringify(data, null)
      );
    },
    onSuccess: (res, reqFileParsed) => {
      const dataFound = res.data;
      const notFound = reqFileParsed.filter(
        (e) => !dataFound.find((f) => f.email === e.email)
      );
      setParticipants(dataFound);
      if (notFound.length) {
        setNotFoundList(notFound);
        setShowDialog(true);
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const insertStudents = useMutation({
    mutationFn: async (data) => {
      return await request.post(
        `/api/students/all`,
        JSON.stringify(data, null)
      );
    },
    onSuccess: (res) => {
      setParticipants([...participants, ...res.data]);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const downloadTemplateFile = useMutation({
    mutationFn: async () => {
      return request.get(`/participants-list-template.csv`, {
        responseType: 'blob',
      });
    },
    onSuccess: (res) => {
      const url = window.URL.createObjectURL(
        new File([res.data], 'participants-list-template.csv')
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'participants-list-template.csv');
      link.click();
    },
  });

  const readFile = (e) => {
    if (e.target.files) {
      const reader = new FileReader();
      setLoading(true);
      reader.onload = (e) => {
        const data = e.target.result;
        const json = parseFile(data);
        // setTimeout to give react time to render above mutation.
        verifyParticipants.mutate(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleSubmit = async (values) => {
    setFormState({ ...formState, ...values });
    setPage(STEP_3);
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
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Following trainee not present in the System.
              </AlertDialogTitle>
              <AlertDialogDescription>
                Would you like to add them?
              </AlertDialogDescription>

              <div className="max-h-60 overflow-auto">
                <ParticipantsList participants={notFountList} />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setLoading(true);
                  insertStudents.mutate(notFountList);
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex gap-5 w-full flex-wrap justify-evenly mt-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 w-full max-w-4xl bg-white py-7 px-4 md:px-20"
            >
              <FormField
                control={form.control}
                name="participantsFilePath"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Participants List</FormLabel>
                    <FileUpload
                      initialValue={field.value}
                      onChange={(fileName) => {
                        field.onChange(fileName);
                      }}
                      onFile={readFile}
                    />
                    <FormDescription>
                      Please Specify who would be attending this training.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <div
                  className="cursor-pointer flex gap-3 bg-blue-100 px-6 py-1.5 text-blue-700 text-sm align-middle justify-center rounded-sm"
                  onClick={() => {
                    downloadTemplateFile.mutate();
                  }}
                >
                  <Download className="w-5 h-5" />
                  <div className="">Click there to download Excel Template</div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {participants?.length ? (
                  <>
                    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3">
                      Participants :
                    </div>
                    <ParticipantsList participants={participants} />
                  </>
                ) : null}
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={() => setPage(STEP_1)}
                >
                  <ArrowLeft className="w-4" /> Back
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

function parseFile(data) {
  const text = new TextDecoder('utf-8').decode(data);
  const rows = text.trim().split('\n');
  return rows.map((r) => ({
    email: r.trim().split(',')[0].trim(),
  }));
}

export default Step2;
