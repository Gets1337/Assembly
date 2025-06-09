import { ORDER_STATUS } from '../types';

const STATUS_TRANSLATIONS: Record<string, string> = {
  'Created': ORDER_STATUS.CREATED,
  'Worked': ORDER_STATUS.WORKED,
  'Ready': ORDER_STATUS.READY,
  'Issued': ORDER_STATUS.ISSUED,
};

export const translateStatus = (status: string): string => {
    return STATUS_TRANSLATIONS[status] || status;
}; 