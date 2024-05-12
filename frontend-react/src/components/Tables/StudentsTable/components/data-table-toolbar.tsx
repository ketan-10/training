import React from 'react';
import { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { DataTableViewOptions } from './data-table-view-options';

import { Link } from 'react-router-dom';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
      <Link to="/requestForm/requestTrainingForm">
        <Button size="sm" className="ml-2 hidden h-8 lg:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Student
        </Button>
      </Link>
    </div>
  );
}
