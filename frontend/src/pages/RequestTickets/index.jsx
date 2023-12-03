import { useQuery } from 'react-query';
import LogoLoader from '../../components/Common/LogoLoader';
import { columns } from '../../components/Tables/RequestTicketTable/components/columns';
import { DataTable } from '../../components/Tables/RequestTicketTable/components/data-table';
import { Separator } from '../../components/ui/separator';
import request from '../../utils/axios.config';

const index = () => {
  const {
    isLoading,
    error,
    data: trainingList,
  } = useQuery('/api/training/requests', () =>
    request('/api/training/requests')
  );

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  if (error) return 'An error has occurred: ' + error.message;

  const parsedData = trainingList.data.map((d, i) => ({
    ...d,
    requestedBy: d.createdBy.name,
  }));

  parsedData.sort((a, b) => b.id - a.id);

  return (
    <div className="p-5 bg-gray-50 h-full">
      <div className="p-1 flex justify-between align-middle">
        <h2 className="text-2xl font-bold tracking-tight">Requests</h2>
        <div className="self-end text-gray-400">
          <span className="text-blue-400">Home</span> / Requests
        </div>
      </div>
      <Separator className="my-3 h-[2.5px]" />
      <DataTable data={parsedData} columns={columns} />
    </div>
  );
};

export default index;
