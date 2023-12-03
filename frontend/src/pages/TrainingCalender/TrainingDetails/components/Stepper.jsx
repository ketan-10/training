import { Check } from 'lucide-react';
import { useState } from 'react';
import { Separator } from '../../../../components/ui/separator';
import { Page1 } from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';

export const PAGE_1 = 0;
export const PAGE_2 = 1;
export const PAGE_3 = 2;
export const PAGE_4 = 3;

const getPageByState = (state) => {
  switch (state) {
    case 'REQUESTED':
    case 'IN_PROGRESS':
      return PAGE_1;
    case 'PENDING_FOR_APPROVAL':
      return PAGE_2;
    case 'APPROVED':
      return PAGE_3;
    case 'SCHEDULED':
    case 'RESCHEDULED':
      return PAGE_4;
    default:
      return PAGE_1;
  }
};
const PAGES = [
  { page: PAGE_1, icon: <Check />, title: 'InProgress' },
  { page: PAGE_2, icon: <Check />, title: 'Sent For Approval' },
  { page: PAGE_3, icon: <Check />, title: 'Schedule Event' },
  { page: PAGE_4, icon: <Check />, title: 'Scheduled' },
];

export default function Stepper({ trainingId, trainingData }) {
  const pageByStatus = getPageByState(trainingData.data.status);
  const [activePage, setActivePage] = useState(pageByStatus);

  return (
    <div className="p-5 bg-gray-50 h-full">
      <div className="p-1 flex justify-between align-middle">
        <h2 className="text-2xl font-bold tracking-tight">Training Details</h2>
        <div className="self-end text-gray-400">
          <span className="text-blue-400">Calender</span> / Details
        </div>
      </div>
      <Separator className="my-3 h-[2.5px]" />
      <ol className="flex items-center w-full">
        {PAGES.map((p, i) => (
          <div
            key={p.page}
            className={`w-full text-center
            ${
              p.page <= pageByStatus ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
            onClick={() => {
              if (p.page > pageByStatus) return;
              setActivePage(p.page);
            }}
          >
            <li
              className={`flex items-center before:w-full after:w-full 
              ${i != 0 ? 'before:border-4 before:border-b' : ''} 
              ${i != PAGES.length - 1 ? 'after:border-4 after:border-b' : ''} 
              ${
                p.page <= pageByStatus
                  ? 'text-blue-600 after:border-blue-100 before:border-blue-100'
                  : ''
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 text-sm
                ${
                  p.page <= pageByStatus
                    ? p.page == activePage
                      ? 'bg-blue-300'
                      : 'bg-blue-100'
                    : 'bg-gray-100'
                }`}
              >
                {p.page <= pageByStatus ? p.icon : p.page + 1}
              </span>
            </li>
            <div
              className={`text-sm pt-2 ${
                p.page == activePage ? 'font-medium' : ''
              }`}
            >
              {p.title}
            </div>
          </div>
        ))}
      </ol>
      <div>
        {activePage === PAGE_1 && (
          <Page1 {...{ setActivePage, trainingId, trainingData }} />
        )}
        {activePage === PAGE_2 && (
          <Page2 {...{ setActivePage, trainingId, trainingData }} />
        )}
        {activePage === PAGE_3 && (
          <Page3 {...{ setActivePage, trainingId, trainingData }} />
        )}
        {activePage === PAGE_4 && (
          <Page4 {...{ setActivePage, trainingId, trainingData }} />
        )}
      </div>
    </div>
  );
}
