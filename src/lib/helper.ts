export const DATE_TIME_FORMATS = {
  FULL: 'HH:mm:ss DD/MM/YYYY',
  DATETIME: 'HH:mm DD/MM/YYYY',
  DATE: 'DD/MM/YYYY',
  TIME: 'HH:mm',
} as const;

export type DateTimeFormatPattern =
  | (typeof DATE_TIME_FORMATS)[keyof typeof DATE_TIME_FORMATS]
  | string;

/**
 * Format a date/time input (ISO string, Date object, or timestamp number)
 * into a formatted date/time string.
 *
 * Supported format patterns:
 * - DATE_TIME_FORMATS.FULL -> 'HH:mm:ss DD/MM/YYYY'
 * - DATE_TIME_FORMATS.DATETIME -> 'HH:mm DD/MM/YYYY'
 * - DATE_TIME_FORMATS.DATE -> 'DD/MM/YYYY'
 * - DATE_TIME_FORMATS.TIME -> 'HH:mm'
 *
 * @param dateInput - Date string, Date object, or timestamp number
 * @param formatPattern - Format pattern (default: DATE_TIME_FORMATS.DATETIME)
 * @param fallback - Fallback value if date is invalid or empty (default: '—')
 */
export const formatTime = (
  dateInput?: string | Date | number | null,
  formatPattern: DateTimeFormatPattern = DATE_TIME_FORMATS.DATETIME,
  fallback: string = '—',
): string => {
  if (!dateInput) return fallback;

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (isNaN(date.getTime())) {
    return fallback;
  }

  const pad = (num: number): string => num.toString().padStart(2, '0');

  const year = date.getFullYear().toString();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return formatPattern
    .replace(/YYYY/gi, year)
    .replace(/MM/g, month)
    .replace(/DD/gi, day)
    .replace(/HH/gi, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/gi, seconds);
};
