import { Check, ClipboardCheck, ClipboardList } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Separator } from '../../../components/ui/separator';
import { RequestFormGlobalProvider } from './components/RequestFormGlobalProvider';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';

export const STEP_1 = 0;
export const STEP_2 = 1;
export const STEP_3 = 2;

const RequestTrainingForm = ({ formDefaults, ticketId = 0 }) => {
  const [page, setPage] = useState(STEP_1);

  // or else can enclose setPage function.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  const STEPPER = [
    { step: STEP_1, icon: <Check /> },
    { step: STEP_2, icon: <ClipboardList /> },
    { step: STEP_3, icon: <ClipboardCheck /> },
  ];

  return (
    <>
      <div className="p-5 bg-gray-50 h-full">
        <div className="p-1 flex justify-between align-middle">
          <h2 className="text-2xl font-bold tracking-tight">
            Request Training Form
          </h2>
          <div className="self-end text-gray-400">
            <span className="text-blue-400">Home</span> / Training Request
          </div>
        </div>
        <Separator className="my-3 h-[2.5px]" />

        <div className="p-6 px-48 flex items-center w-full mb-4 sm:mb-5">
          {STEPPER.map((s, i) => (
            <React.Fragment key={s.step}>
              <div
                className={`flex items-center ${
                  page == s.step ? 'text-blue-600' : 'text-gray-600'
                } ${page > s.step ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => page > s.step && setPage(s.step)}
              >
                <div className="p-2 bg-gray-100 rounded-full">{s.icon}</div>
              </div>
              {/* excluding last step */}
              {i < STEPPER.length - 1 ? (
                <div className="flex-grow w-0 h-1 border-b border-gray-100 border-4"></div>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        <RequestFormGlobalProvider formDefaults={formDefaults}>
          {page === STEP_1 && <Step1 {...{ setPage, ticketId }} />}
          {page === STEP_2 && <Step2 {...{ setPage, ticketId }} />}
          {page === STEP_3 && <Step3 {...{ setPage, ticketId }} />}
        </RequestFormGlobalProvider>
      </div>
    </>
  );
};

export default RequestTrainingForm;
