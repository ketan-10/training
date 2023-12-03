import { clsx } from 'clsx';
import jwt_decode from 'jwt-decode';
import mailtoLink from 'mailto-link';
import { twMerge } from 'tailwind-merge';

export const removeEmpty = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};

export const isValidArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};

export const isTokenValid = (token) => {
  try {
    var decoded = jwt_decode(token);
    return Date.now() < decoded.exp * 1000;
  } catch (error) {
    return false;
  }
};

export const shortFileName = (fullName) => {
  const shortName = fullName.split('_');
  shortName.shift();
  shortName.shift();
  return shortName.join('_');
};

export const sendApprovalRequestMail = (loggedInUser, totalData, values) => {
  return mailtoLink({
    to: 'ketan.chaudhari1998@gmail.com',
    cc: 'admin@gmail.com',
    subject: 'Request for training approval',
    body: `
    Hi ${totalData?.createdBy?.name},
      Seaking approval for training: 
      Training Details:
        •	Training Title: ${totalData?.trainingName}
        •	Moderator: ${values?.moderator}
    `,
  });
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const snakeToCamel = (input) => {
  return input
    .toLowerCase()
    .split('_')
    .map((x) => x[0].toUpperCase() + x.slice(1))
    .join(' ');
};

export const displayRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'Admin';
    case 'REQUESTER':
      return 'Manager';
    default:
      return snakeToCamel(role);
  }
};

export const getUrgencyLabel = (urgency) => {
  switch (urgency) {
    case 'P1':
      return 'High';
    case 'P2':
      return 'Medium';
    case 'P3':
      return 'Low';
  }
};

export const unwantedFields = [
  'rev',
  'revtype',
  'timestamp',
  'attendance_path',
  'end_date',
  'is_registration_required',
  'participants_file_path',
  'schedule',
  'tags',
  'modified_by',
  'updated_at',
];

export const getAuditLogLabels = (key, value) => {
  switch (key) {
    case 'approval_mail_attachment_file':
      return { label: 'Approval Mail', value: shortFileName(value) };
    case 'category':
      return { label: 'Category', value };
    case 'category_sub':
      return { label: 'Category Sub Type', value };
    case 'description':
      return { label: 'Description', value };
    case 'level':
      return { label: 'Level', value: snakeToCamel(value) };
    case 'link':
      return { label: 'Link', value };
    case 'mode':
      return { label: 'Mode', value: snakeToCamel(value) };
    case 'moderator':
      return { label: 'Moderator', value };
    case 'no_of_hours':
      return { label: 'Total Hours', value };
    case 'other_training_event':
      return { label: 'Other Training Type', value };
    case 'participants_count':
      return { label: 'Participants Count', value };
    case 'remarks':
      return { label: 'Remarks', value };
    case 'status':
      return { label: 'Status', value: snakeToCamel(value) };
    case 'syllabus_file_path':
      return {
        label: 'Upload Training Content',
        value: shortFileName(value),
      };
    case 'start_date':
      return {
        label: 'Start Date',
        value: new Date(value).toLocaleString(),
      };
    case 'trainer':
      return { label: 'Trainer', value };
    case 'training_name':
      return { label: 'Training Name', value };
    case 'training_scope':
      return { label: 'Training Scope', value: snakeToCamel(value) };
    case 'type':
      return { label: 'Type', value: snakeToCamel(value) };
    case 'urgency':
      return { label: 'Urgency', value: getUrgencyLabel(value) };
    default:
      return null;
  }
};

export const convertToGrid = (formData) => {
  const grid = [];
  formData?.trainingName &&
    grid.push({ key: 'Training Name', value: formData?.trainingName });
  formData?.description &&
    grid.push({ key: 'Description', value: formData?.description });
  formData?.participantsCount &&
    grid.push({
      key: 'No. Of Participants',
      value: formData?.participantsCount,
    });
  formData?.urgency &&
    grid.push({ key: 'Urgency', value: getUrgencyLabel(formData?.urgency) });
  formData?.mode &&
    grid.push({ key: 'Mode', value: snakeToCamel(formData?.mode) });
  formData?.type &&
    grid.push({ key: 'Training Type', value: snakeToCamel(formData?.type) });
  formData?.otherTrainingEvent &&
    grid.push({
      key: 'Other Training Type',
      value: formData?.otherTrainingEvent,
    });
  formData?.category &&
    grid.push({ key: 'Category', value: formData?.category });
  formData?.CategorySub &&
    grid.push({
      key: 'Category Sub Type',
      value: formData?.categorySub,
    });
  formData?.trainingScope &&
    grid.push({
      key: 'Training Scope',
      value: snakeToCamel(formData?.trainingScope),
    });
  formData?.level &&
    grid.push({ key: 'Level', value: snakeToCamel(formData?.level) });
  formData?.startDate &&
    grid.push({
      key: 'Start Date',
      // value: new Date(formData?.startDate).toLocaleString(),
      value: new Date(formData?.startDate).toLocaleDateString(),
    });
  formData?.syllabusFilePath &&
    grid.push({
      key: 'Upload Training Content',
      value: shortFileName(formData?.syllabusFilePath),
    });

  return grid;
};
