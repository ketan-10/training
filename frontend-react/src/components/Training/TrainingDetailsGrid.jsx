import React from 'react';
import { convertToGrid } from '../../utils';

const TrainingDetailsGrid = ({ formState }) => {
  const GRID = convertToGrid(formState);
  return (
    <div id="grid-template-colum-auto-fit" className="grid gap-5">
      {GRID.map((g) => (
        <div className="flex flex-col gap-1" key={g.key}>
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {g.key} :
          </div>
          <div>{g.value}</div>
        </div>
      ))}
    </div>
  );
};

export default TrainingDetailsGrid;
