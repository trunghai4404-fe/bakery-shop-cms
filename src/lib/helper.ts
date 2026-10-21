import { ERROR_CODES } from "@/constants/errors";

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

export const slugify = (text: string): string => {
  if (!text) return '';
  let str = text.toLowerCase();
  str = str.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a');
  str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e');
  str = str.replace(/i|í|ì|ỉ|ĩ|ị/g, 'i');
  str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o');
  str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u');
  str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/[^a-z0-9 -]/g, '');
  str = str.replace(/\s+/g, '-');
  str = str.replace(/-+/g, '-');
  str = str.replace(/^-+|-+$/g, '');
  return str;
};

export const formatCurrency = (amount?: number | null, fallback: string = '0 ₫'): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return fallback;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const getErrorMessage = (error: any, fallBackMsg: string = "Có lỗi xảy ra") => {
  const errorCode =
    error?.errors?.[0]?.code ||
    error?.response?.data?.errors?.[0]?.code ||
    error?.errorCode ||
    error?.response?.data?.errorCode;

  if (!errorCode) {
    return fallBackMsg;
  }

  switch (errorCode) {
    case ERROR_CODES.VALIDATION_ERROR:
      return 'Dữ liệu không hợp lệ';
    case ERROR_CODES.PRODUCT_NOT_FOUND:
      return 'Không tìm thấy sản phẩm';
    case ERROR_CODES.PRODUCT_SLUG_ALREADY_EXISTS:
      return 'Slug sản phẩm đã tồn tại';
    case ERROR_CODES.PRODUCT_SKU_ALREADY_EXISTS:
      return 'SKU sản phẩm đã tồn tại';
    case ERROR_CODES.UNAUTHORIZED:
      return 'Không có quyền truy cập';
    case ERROR_CODES.FORBIDDEN:
      return 'Không có quyền';
    default:
      return fallBackMsg;
  }
};