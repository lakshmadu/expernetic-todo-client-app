import { format } from 'date-fns';

export function convertToReadableFormat(dateTimeString: string): string {
  const parsedDate = new Date(dateTimeString);
  
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid Date';
  }

  const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');

  return formattedDate;
}
