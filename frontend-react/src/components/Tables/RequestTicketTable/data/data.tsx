import {
  ArrowDownToLine,
  ArrowRightToLine,
  ArrowUpCircle,
  ArrowUpToLine,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
} from 'lucide-react';

export const modes = [
  {
    value: 'PHYSICAL',
    label: 'Physical',
  },
  {
    value: 'VIRTUAL',
    label: 'Virtual',
  },
];

export const statuses = [
  {
    value: 'REQUESTED',
    label: 'Requested',
    icon: HelpCircle,
  },
  {
    value: 'PENDING_FOR_APPROVAL',
    label: 'Pending For Approval',
    icon: Circle,
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    icon: ArrowUpCircle,
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
    icon: CheckCircle2,
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
    icon: XCircle,
  },
];

export const urgencies = [
  {
    value: 'P3',
    label: 'low',
    icon: ArrowDownToLine,
  },
  {
    value: 'P2',
    label: 'medium',
    icon: ArrowRightToLine,
  },
  {
    value: 'P1',
    label: 'high',
    icon: ArrowUpToLine,
  },
];
