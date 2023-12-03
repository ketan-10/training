import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../../components/Auth/AuthProvider';
import { columns } from '../../../components/Tables/RegistrationRequestTable/components/columns';
import { DataTable } from '../../../components/Tables/RegistrationRequestTable/components/data-table';
import request from '../../../utils/axios.config';
import LogoLoader from '../../../components/Common/LogoLoader';

const RegistrationList = () => {
  const {
    isLoading,
    error,
    data: userList,
  } = useQuery('/api/users', () => request('/api/users'));

  const { user } = useAuth();

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );
  if (error) return 'An error has occurred: ' + error.message;

  // remove current user, and only show active users
  const parsedData = userList.data
    .filter((d) => d.email !== user?.userDto?.email)
    .filter((d) => d.userStatus === 'PENDING');

  parsedData.sort((a, b) => b.id - a.id);

  return (
    <div>
      <DataTable data={parsedData} columns={columns} />
    </div>
  );
};

export default RegistrationList;
