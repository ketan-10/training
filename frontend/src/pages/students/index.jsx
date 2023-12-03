import { useQuery } from 'react-query';
import LogoLoader from '../../components/Common/LogoLoader';
import { columns } from '../../components/Tables/StudentsTable/components/columns';
import { DataTable } from '../../components/Tables/StudentsTable/components/data-table';
import { Separator } from '../../components/ui/separator';
import request from '../../utils/axios.config';

const Students = () => {
  const {
    isLoading,
    error,
    data: irData,
  } = useQuery('/api/students', () => request('/api/students'));

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  const parsedData = irData.data.map((d, i) => ({
    ...d,
    createdBy: d.createdBy.name,
  }));

  return (
    <div className="p-5 bg-gray-50 h-full">
      <div className="p-1 flex justify-between align-middle">
        <h2 className="text-2xl font-bold tracking-tight">Students</h2>
        <div className="self-end text-gray-400">
          <span className="text-blue-400">Home</span> / Students
        </div>
      </div>
      <Separator className="my-3 h-[2.5px]" />
      <DataTable data={parsedData} columns={columns} />
    </div>
  );
};

export default Students;
