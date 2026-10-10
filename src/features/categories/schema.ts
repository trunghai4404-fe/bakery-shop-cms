import { z } from 'zod';

export const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Tên danh mục không được để trống.')
        .max(128, 'Tên danh mục không được vượt quá 128 ký tự.'),
    slug: z
        .string()
        .trim()
        .max(128, 'Đường dẫn slug không được vượt quá 128 ký tự.')
        .refine(
            (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
            'Đường dẫn slug phải đúng định dạng (VD: banh-sinh-nhat).'
        )
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .trim()
        .max(256, 'Mô tả không được vượt quá 256 ký tự.')
        .optional()
        .or(z.literal('')),
    imageUrl: z
        .string()
        .trim()
        .max(1000, 'Đường dẫn hình ảnh không được vượt quá 1000 ký tự.')
        .optional()
        .or(z.literal('')),
    parentId: z
        .number()
        .nullable()
        .optional()
        .refine((val) => val === null || val === undefined || val > 0, {
            message: 'Danh mục cha phải có ID lớn hơn 0.',
        }),
    sortOrder: z
        .number({ message: 'Thứ tự hiển thị phải là số.' })
        .min(0, 'Thứ tự hiển thị phải lớn hơn hoặc bằng 0.'),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const defaultCategoryValues: CategoryFormData = {
    name: '',
    slug: '',
    description: '',
    parentId: null,
    imageUrl: '',
    sortOrder: 0,
    isFeatured: false,
    isActive: true,
};
