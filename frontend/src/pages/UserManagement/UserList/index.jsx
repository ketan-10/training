import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../../components/Auth/AuthProvider';
import LogoLoader from '../../../components/Common/LogoLoader';
import { columns } from '../../../components/Tables/UserListTable/components/columns';
import { DataTable } from '../../../components/Tables/UserListTable/components/data-table';
import request from '../../../utils/axios.config';

const UserList = () => {
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
    .filter((d) => d.userStatus === 'ACTIVE');

  parsedData.sort((a, b) => b.id - a.id);

  return (
    <div>
      <DataTable data={parsedData} columns={columns} />
    </div>
  );
};

export default UserList;
