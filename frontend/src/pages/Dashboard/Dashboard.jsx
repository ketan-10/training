import { Calendar, Ticket, UserSquare2, Users2 } from 'lucide-react';
import { useQuery } from 'react-query';
import LogoLoader from '../../components/Common/LogoLoader';
import { Separator } from '../../components/ui/separator';
import request from '../../utils/axios.config';

const Dashboard = () => {
  const { data, isLoading } = useQuery(`/api/dashboard/count`, () =>
    request(`/api/dashboard/count`)
  );

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );
  const dashboardInfo = data?.data;

  return (
    <>
      <div className="p-5 bg-gray-50 h-full">
        <div className="p-1 flex justify-between align-middle">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <div className="self-end text-gray-400">
            <span className="text-blue-400">Home</span> / Dashboard
          </div>
        </div>
        <Separator className="my-3 h-[2.5px]" />

        <div className="flex gap-5 flex-wrap justify-evenly mt-5">
          <div className="group px-5 bg-gray-400 overflow-clip w-[15rem] cursor-pointer min-h-[6rem] flex items-center justify-between select-none gap-2 drop-shadow-md rounded-md border-muted bg-popover p-3 hover:bg-accent">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {dashboardInfo?.trainingRequestCount}
              </h2>
              <p className="text-muted-foreground uppercase text-xs">tickets</p>
            </div>
            <div className="relative text-cyan-800">
              <Ticket />
              <div className="bg-gradient-to-br from-cyan-400 to-cyan-50 transition-all group-hover:-translate-x-1/2 w-16 h-16 -z-10 absolute top-1/2 left-1/2 rounded-full -translate-x-6 -translate-y-1/2"></div>
            </div>
          </div>
          <div className="group px-5 overflow-clip w-[15rem] cursor-pointer min-h-[6rem] flex items-center justify-between select-none gap-2 drop-shadow-md rounded-md border-muted bg-popover p-3 hover:bg-accent">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {dashboardInfo?.trainingCount}
              </h2>
              <p className="text-muted-foreground uppercase text-xs">
                Trainings
              </p>
            </div>
            <div className="relative text-orange-800">
              <Calendar />
              <div className="bg-gradient-to-br from-orange-400 to-orange-50 transition-all group-hover:-translate-x-1/2 w-16 h-16 -z-10 absolute top-1/2 left-1/2 rounded-full -translate-x-6 -translate-y-1/2"></div>
            </div>
          </div>

          <div className="group px-5 overflow-clip w-[15rem] cursor-pointer min-h-[6rem] flex items-center justify-between select-none gap-2 drop-shadow-md rounded-md border-muted bg-popover p-3 hover:bg-accent">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {dashboardInfo?.studentCount}
              </h2>
              <p className="text-muted-foreground uppercase text-xs">
                students
              </p>
            </div>
            <div className="relative text-red-800">
              <Users2 />
              <div className="bg-gradient-to-br from-red-400 to-red-50 transition-all group-hover:-translate-x-1/2 w-16 h-16 -z-10 absolute top-1/2 left-1/2 rounded-full -translate-x-6 -translate-y-1/2"></div>
            </div>
          </div>
          <div className="group px-5 overflow-clip w-[15rem] cursor-pointer min-h-[6rem] flex items-center justify-between select-none gap-2 drop-shadow-md rounded-md border-muted bg-popover p-3 hover:bg-accent">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight">0</h2>
              <p className="text-muted-foreground uppercase text-xs">
                trainers
              </p>
            </div>
            <div className="relative text-yellow-800">
              <UserSquare2 />
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-50 transition-all group-hover:-translate-x-1/2 w-16 h-16 -z-10 absolute top-1/2 left-1/2 rounded-full -translate-x-6 -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        <div className="py-20 w-full flex justify-center items-center font-bold text-4xl text-gray-400">
          🚧 UNDER CONSTRUCTION 🚧
        </div>
        {/* <div className="pt-10 w-full grid gap-5 grid-cols-2">
          <div className="drop-shadow-md rounded-xl border-muted bg-popover p-10 flex justify-center">
            <PieChartPlot />
          </div>

          <div className="drop-shadow-md rounded-xl border-muted bg-popover p-10 flex justify-center">
            <BarChartPlot />
          </div>

          <div className="drop-shadow-md rounded-xl border-muted bg-popover p-10 flex justify-center">
            <StackedChartPlot />
          </div>

          <div className="drop-shadow-md rounded-xl border-muted bg-popover p-10 flex justify-center">
            <LineChartPlot />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Dashboard;
