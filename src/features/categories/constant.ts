import { QUERY_KEY } from '@/constants/queryKey';

export const CATEGORIES_QUERY_KEY = QUERY_KEY.CATEGORIES;
export const CATEGORY_DETAIL_QUERY_KEY = QUERY_KEY.CATEGORY_DETAIL;
export const PARENT_CATEGORIES_QUERY_KEY = QUERY_KEY.PARENT_CATEGORIES;


export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const CATEGORY_STATUS_OPTIONS = [
    { label: 'Tất cả trạng thái', value: undefined },
    { label: 'Đang hoạt động', value: true },
    { label: 'Ngưng hoạt động', value: false },
];

export const CATEGORY_TYPE_OPTIONS = [
    { label: 'Tất cả phân loại', value: undefined },
    { label: 'Danh mục gốc', value: true },
    { label: 'Danh mục con', value: false },
];

export const CATEGORY_FEATURED_OPTIONS = [
    { label: 'Tất cả nổi bật', value: undefined },
    { label: 'Nổi bật', value: true },
    { label: 'Không nổi bật', value: false },
];


export const slugifyVietnamese = (str: string): string => {
    if (!str) return '';
    let slug = str.toLowerCase();

    slug = slug.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/g, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y');
    slug = slug.replace(/đ/g, 'd');

    // Remove special characters, replace whitespace with hyphen
    slug = slug
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    return slug;
};
