import React from 'react';
import { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { DataTableViewOptions } from './data-table-view-options';

import { urgencies, statuses } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { Link } from 'react-router-dom';

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
          placeholder="Filter tasks..."
          value={
            (table.getColumn('trainingName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('trainingName')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('urgency') && (
          <DataTableFacetedFilter
            column={table.getColumn('urgency')}
            title="Urgency"
            options={urgencies}
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
      <Link to="/requestForm/requestTrainingForm">
        <Button size="sm" className="ml-2 hidden h-8 lg:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </Link>
    </div>
  );
}
