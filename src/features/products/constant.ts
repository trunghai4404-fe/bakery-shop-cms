export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const PRODUCT_STATUS_OPTIONS = [
  { label: 'Trạng thái', value: 'all' },
  { label: 'Đang kinh doanh', value: 'true' },
  { label: 'Ngừng kinh doanh', value: 'false' },
];

export const PRODUCT_SORT_BY_OPTIONS = [
  { label: 'Mới nhất', value: 'createdAt' },
  { label: 'Tên sản phẩm', value: 'name' },
  { label: 'Mã SKU', value: 'sku' },
  { label: 'Giá tiền', value: 'price' },
];

export const PRODUCT_SORT_DIRECTION_OPTIONS = [
  { label: 'Giảm dần (DESC)', value: true },
  { label: 'Tăng dần (ASC)', value: false },
];