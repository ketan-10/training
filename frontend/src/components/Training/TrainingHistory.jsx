import { diff } from 'json-diff-ts';
import {
  BadgeMinus,
  BadgePlus,
  Check,
  ChevronsUpDown,
  Edit,
} from 'lucide-react';
import React from 'react';
import { useQuery } from 'react-query';
import { getAuditLogLabels, removeEmpty, unwantedFields } from '../../utils';
import request from '../../utils/axios.config';
import LogoLoader from '../Common/LogoLoader';
import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

const TrainingHistory = ({ trainingId }) => {
  const { data, isLoading } = useQuery(
    `/api/training/audit-log/${trainingId}`,
    () => request(`/api/training/audit-log/${trainingId}`)
  );

  if (isLoading)
    return (
      <div className="w-full mt-10 flex justify-center align-middle">
        <LogoLoader className="w-40 h-40" />
      </div>
    );

  const diffs = [];
  data.data.reduce((oldValue, newValue) => {
    diffs.push({
      diff: diff(oldValue, removeEmpty(newValue)),
      oldValue: oldValue,
      newValue: removeEmpty(newValue),
    });
    return removeEmpty(newValue);
  }, null);

  return (
    <div className="relative z-10 text-gray-500 before:border-l before:border-gray-200 before:content-[''] before:h-full before:absolute before:left-10 before:-z-10">
      {diffs.map((d) => {
        const wantedDiff = d.diff.filter(
          (k) => unwantedFields.indexOf(k.key) < 0
        );
        const updatedDiff = wantedDiff.filter((k) => k.type == 'UPDATE');
        const addedDiff = wantedDiff.filter((k) => k.type == 'ADD');
        const removedDiff = wantedDiff.filter((k) => k.type == 'REMOVE');

        return (
          <div className="mb-10 ml-6 flex gap-2" key={d.newValue?.timestamp}>
            <span
              className={`flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full ring-4 ring-white ${
                !d.oldValue ? 'bg-green-200' : 'bg-blue-200'
              }`}
            >
              {!d.oldValue ? (
                <BadgePlus className="w-5 h-5 text-green-500" />
              ) : (
                <Check className="w-5 h-5 text-blue-500" />
              )}
            </span>
            <div className="w-full">
              <h3 className="leading-tight">
                {!d.oldValue ? 'Training Created by ' : 'Training Updated by '}{' '}
                <span className="font-medium">{d.newValue.modified_by}</span>
              </h3>
              <p className="text-sm pt-1">
                {new Date(d.newValue?.timestamp).toLocaleString()}
              </p>
              {d.oldValue && (
                <Collapsible className=" space-y-2">
                  <div className="flex items-center justify-between space-x-4 px-4 w-full">
                    <h4 className="text-sm font-semibold">
                      Change :{' '}
                      {updatedDiff.length
                        ? updatedDiff.length + ' Updated, '
                        : ''}
                      {addedDiff.length ? addedDiff.length + ' Added, ' : ''}
                      {removedDiff.length
                        ? removedDiff.length + ' Removed, '
                        : ''}
                    </h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2 px-4">
                    {addedDiff.map((a) => {
                      if (!a.value) return null;
                      const labels = getAuditLogLabels(a.key, a.value);
                      if (!labels) return null;
                      return (
                        <div className="flex gap-2" key={a.key}>
                          <BadgePlus className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <div className="font-mono text-sm">
                            Added {labels.label}: {labels.value}
                          </div>
                        </div>
                      );
                    })}
                    {updatedDiff.map((a) => {
                      if (!a.value || !a.oldValue) return null;
                      const newLabels = getAuditLogLabels(a.key, a.value);
                      const oldLabels = getAuditLogLabels(a.key, a.oldValue);
                      if (!newLabels) return null;
                      return (
                        <div className="flex gap-2" key={a.key}>
                          <Edit className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <div className="font-mono text-sm">
                            Updated{' '}
                            <span className="font-bold">{newLabels.label}</span>
                            : Form{' '}
                            <span className="font-bold">{oldLabels.value}</span>{' '}
                            to{' '}
                            <span className="font-bold">{newLabels.value}</span>
                          </div>
                        </div>
                      );
                    })}
                    {removedDiff.map((a) => {
                      if (!a.value) return null;
                      const labels = getAuditLogLabels(a.key, a.value);
                      if (!labels) return null;
                      return (
                        <div className="flex gap-2" key={a.key}>
                          <BadgeMinus className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <div className="font-mono text-sm">
                            Removed{' '}
                            <span className="font-bold">{labels.label}</span>:{' '}
                            <span className="font-bold">{labels.value}</span>
                          </div>
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainingHistory;
