import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import React from 'react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { DataTableViewOptions } from './data-table-view-options';

import RegistrationRequest from '../../../UserManagement/RegistrationRequest';
import { roles } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import CreateUserPopup from '../../../UserManagement/CreateUserPopup';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')}
            title="Role"
            options={roles}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      <CreateUserPopup />
    </div>
  );
}
