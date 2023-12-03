import {
  ArrowDownToLine,
  ArrowRightToLine,
  ArrowUpCircle,
  ArrowUpToLine,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
  CheckCheck,
  CalendarCheck2,
  PauseCircle,
  Ban,
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
    value: 'APPROVED',
    label: 'Approved',
    icon: CheckCheck,
    isAction: false,
  },
  {
    value: 'PENDING_FOR_APPROVAL',
    label: 'Pending For Approval',
    icon: Circle,
    isAction: false,
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    icon: ArrowUpCircle,
    isAction: false,
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
    icon: CheckCircle2,
    isAction: false,
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
    icon: XCircle,
    isAction: true,
  },
  {
    value: 'SCHEDULED',
    label: 'Scheduled',
    icon: CalendarCheck2,
    isAction: false,
  },
  {
    value: 'ON_HOLD',
    label: 'On Hold',
    icon: PauseCircle,
    isAction: true,
  },
  {
    value: 'CANCELLED',
    label: 'Cancelled',
    icon: Ban,
    isAction: true,
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
