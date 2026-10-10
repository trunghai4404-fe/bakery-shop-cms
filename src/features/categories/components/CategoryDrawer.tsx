import React, { useEffect, useState } from 'react';
import {
    Drawer,
    Form,
    Input,
    Select,
    Switch,
    InputNumber,
    Button,
    Space,
    Tag,
    Descriptions,
    Spin,
    Avatar,
    Card,
    Tooltip,
    Modal,
} from 'antd';
import {
    FolderOutlined,
    EditOutlined,
    DeleteOutlined,
    StarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
    PlusOutlined,
    CalendarOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    useCategoryDetail,
    useParentCategoryOptions,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '../hooks/useCategories';
import { slugifyVietnamese } from '../constant';
import type { CreateCategory, UpdateCategory } from '../type';
import { categorySchema, type CategoryFormData, defaultCategoryValues } from '../schema';
import { formatTime, DATE_TIME_FORMATS } from '@/lib/helper';
import ImageUpload from '@/components/common/ImageUpload';

export interface CategoryDrawerProps {
    open: boolean;
    onClose: () => void;
    mode: 'create' | 'detail';
    categoryId?: number | null;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
    open,
    onClose,
    mode,
    categoryId,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [autoSlug, setAutoSlug] = useState(true);
    const [parentSearch, setParentSearch] = useState('');

    const { data: detailData, isLoading: isDetailLoading } = useCategoryDetail(categoryId);
    const {
        data: parentPagesData,
        isLoading: isParentsLoading,
        isFetchingNextPage: isParentsFetchingNext,
        hasNextPage: hasParentsNextPage,
        fetchNextPage: fetchParentsNextPage,
    } = useParentCategoryOptions({
        search: parentSearch,
        enabled: open,
    });

    const parentCategories = parentPagesData?.pages.flatMap((page) => page?.items || []) || [];

    const handleParentPopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < 20) {
            if (hasParentsNextPage && !isParentsFetchingNext) {
                fetchParentsNextPage();
            }
        }
    };

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: defaultCategoryValues,
    });

    useEffect(() => {
        if (open) {
            setParentSearch('');
            if (mode === 'create') {
                setIsEditing(false);
                setAutoSlug(true);
                reset(defaultCategoryValues);
            } else {
                setIsEditing(false);
            }
        }
    }, [open, mode, reset]);


    useEffect(() => {
        if (open && mode === 'detail' && detailData) {
            reset({
                name: detailData.name || '',
                slug: detailData.slug || '',
                description: detailData.description || '',
                parentId: detailData.parentId ?? null,
                imageUrl: detailData.imageUrl || '',
                sortOrder: detailData.sortOrder ?? 0,
                isFeatured: detailData.isFeatured ?? false,
                isActive: detailData.isActive ?? true,
            });
        }
    }, [open, mode, detailData, reset]);

    const onSubmit = async (values: CategoryFormData) => {
        const payload = {
            ...values,
            slug: values.slug || undefined,
            description: values.description || null,
            imageUrl: values.imageUrl || null,
            parentId: values.parentId || null,
        };

        if (mode === 'create') {
            await createMutation.mutateAsync(payload as CreateCategory);
            onClose();
        } else if (mode === 'detail' && categoryId) {
            await updateMutation.mutateAsync({ id: categoryId, data: payload as UpdateCategory });
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        if (!categoryId) return;
        Modal.confirm({
            title: 'Xóa danh mục?',
            icon: null,
            zIndex: 2000,
            content: (
                <div className="space-y-1 py-1">
                    <p className="text-stone-700">
                        Bạn có chắc chắn muốn xóa danh mục <strong>"{detailData?.name}"</strong>?
                    </p>
                </div>
            ),
            okText: 'Xóa danh mục',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            okButtonProps: { loading: deleteMutation.isPending },
            onOk: async () => {
                await deleteMutation.mutateAsync(categoryId);
                onClose();
            },
        });
    };

    const availableParentOptions = parentCategories.filter(
        (parent) => !categoryId || parent.id !== categoryId,
    );

    const selectOptionsMap = availableParentOptions.map((parent) => ({
        label: parent.name,
        value: parent.id as number | null,
    }));

    if (
        detailData?.parentId &&
        detailData?.parentName &&
        !selectOptionsMap.some((opt) => opt.value === detailData.parentId)
    ) {
        selectOptionsMap.unshift({
            label: detailData.parentName,
            value: detailData.parentId,
        });
    }

    const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2 text-base font-semibold text-stone-800">
                    {mode === 'create'
                        ? 'Tạo danh mục'
                        : isEditing
                            ? 'Chỉnh sửa'
                            : 'Chi tiết'}
                </div>
            }
            placement="right"
            size={720}
            onClose={onClose}
            open={open}
            destroyOnHidden
            extra={
                mode === 'detail' &&
                detailData && (
                    <Space>
                        {!isEditing ? (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa
                            </Button>
                        ) : (
                            <Button onClick={() => setIsEditing(false)}>Hủy sửa</Button>
                        )}
                    </Space>
                )
            }
            footer={
                mode === 'create' ? (
                    <div className="flex justify-end gap-3 py-2">
                        <Button onClick={onClose} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit(onSubmit)}
                            loading={createMutation.isPending}
                            icon={<PlusOutlined />}
                        >
                            Tạo danh mục
                        </Button>
                    </div>
                ) : isEditing ? (
                    <div className="flex justify-end gap-3 py-2">
                        <Button onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit(onSubmit)}
                            loading={updateMutation.isPending}
                            icon={<CheckCircleOutlined />}
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center py-2">
                        {detailData && (
                            <Button danger onClick={handleDelete}>
                                <DeleteOutlined />
                                Xóa danh mục
                            </Button>
                        )}
                        <Button onClick={onClose}>Đóng</Button>
                    </div>
                )
            }
            classNames={{
                header: "p-4!",
                body: "p-4!"
            }}
        >
            {mode === 'detail' && isDetailLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Spin size="large" description="Đang tải..." />
                </div>
            ) : mode === 'detail' && !isEditing && detailData ? (
                <div className="space-y-6">
                    <Card
                        className="bg-stone-50 border-stone-200 shadow-xs rounded-xl overflow-hidden"
                        classNames={{
                            body: "p-4!"
                        }}
                    >
                        <div className="flex items-start gap-4">
                            <Avatar
                                shape="square"
                                size={72}
                                src={detailData.imageUrl}
                                icon={<FolderOutlined className="text-stone-400 text-3xl" />}
                                className="bg-stone-200 shrink-0 rounded-lg border border-stone-300"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-stone-800 truncate mb-1">
                                    {detailData.name}
                                </h3>
                                <p className="text-xs text-stone-500 font-mono bg-stone-200/60 inline-block px-2 py-0.5 rounded">
                                    /{detailData.slug}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {detailData.isActive ? (
                                        <Tag icon={<CheckCircleOutlined />} color="success">
                                            Đang hoạt động
                                        </Tag>
                                    ) : (
                                        <Tag icon={<CloseCircleOutlined />} color="default">
                                            Ngưng hoạt động
                                        </Tag>
                                    )}

                                    {detailData.isFeatured && (
                                        <Tag icon={<StarOutlined />} color="warning">
                                            Nổi bật
                                        </Tag>
                                    )}

                                    {detailData.parentName ? (
                                        <Tag color="purple">Thuộc: {detailData.parentName}</Tag>
                                    ) : (
                                        <Tag color="orange" className="rounded-md font-medium border-orange-200">
                                            Danh mục gốc
                                        </Tag>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className='mt-4'>
                        <h4 className="text-base font-bold text-black mb-3">
                            Thông tin tổng quan
                        </h4>
                        <Descriptions
                            column={1}
                            bordered
                            size="small"
                            className="bg-white rounded-lg overflow-hidden border-stone-200"
                            labelStyle={{ width: '150px', fontWeight: 600, color: '#57534e' }}
                        >
                            <Descriptions.Item label="Mã danh mục">
                                <span className="font-mono text-stone-700">#{detailData.id}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Danh mục cha">
                                {detailData.parentName ? (
                                    <span className="font-medium text-purple-700">{detailData.parentName}</span>
                                ) : (
                                    <span className="text-stone-400 font-italic">Trống</span>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thứ tự hiển thị">
                                <span className="font-semibold text-stone-700">{detailData.sortOrder}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Danh mục con">
                                {detailData.children && detailData.children.length > 0 && (
                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            {detailData.children.map((child) => (
                                                <Tag
                                                    key={child.id}
                                                    color={child.isActive ? 'blue' : 'default'}
                                                    className="py-1 px-2.5 rounded-md text-xs font-medium"
                                                >
                                                    {child.name} ({child.childrenCount || 0})
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô tả">
                                {detailData.description || (
                                    <span className="text-stone-400 italic">Chưa có mô tả</span>
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <div>
                        <h4 className="text-base font-bold text-black mb-3">
                            Lịch sử khởi tạo & cập nhật
                        </h4>
                        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2 text-xs text-stone-600">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1.5 text-stone-500">
                                    <CalendarOutlined /> Ngày tạo:
                                </span>
                                <span className="font-medium">
                                    {formatTime(detailData.createdAt, DATE_TIME_FORMATS.DATETIME)}
                                </span>
                            </div>
                            {detailData.createdBy && (
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5 text-stone-500">
                                        <UserOutlined /> Người tạo:
                                    </span>
                                    <span className="font-medium text-stone-700">{detailData.createdBy}</span>
                                </div>
                            )}
                            {detailData.lastModifiedAt && (
                                <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                                    <span className="flex items-center gap-1.5 text-stone-500">
                                        <ReloadOutlined /> Cập nhật lần cuối:
                                    </span>
                                    <span className="font-medium">
                                        {formatTime(detailData.lastModifiedAt, DATE_TIME_FORMATS.DATETIME)}
                                    </span>
                                </div>
                            )}
                            {detailData.lastModifiedBy && (
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5 text-stone-500">
                                        <UserOutlined /> Người cập nhật:
                                    </span>
                                    <span className="font-medium text-stone-700">{detailData.lastModifiedBy}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Form.Item
                                label={<span className="font-medium text-stone-700">Tên danh mục</span>}
                                validateStatus={error ? 'error' : ''}
                                help={error?.message}
                                required
                            >
                                <Input
                                    {...field}
                                    placeholder="VD: Bánh sinh nhật, Bánh ngọt, Bánh mì..."
                                    size="large"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        if (autoSlug) {
                                            const generatedSlug = slugifyVietnamese(e.target.value);
                                            setValue('slug', generatedSlug, { shouldValidate: true });
                                        }
                                    }}
                                />
                            </Form.Item>
                        )}
                    />

                    <Controller
                        name="slug"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Form.Item
                                label={
                                    <div className="flex justify-between items-center w-full">
                                        <span className="font-medium text-stone-700">Đường dẫn slug</span>
                                        {mode === 'create' && (
                                            <Tooltip title="Tự động cập nhật slug theo tên danh mục">
                                                <Switch
                                                    size="small"
                                                    checked={autoSlug}
                                                    onChange={(checked) => setAutoSlug(checked)}
                                                />
                                                <span className="text-xs text-stone-500 ml-1">Tự động slug</span>
                                            </Tooltip>
                                        )}
                                    </div>
                                }
                                validateStatus={error ? 'error' : ''}
                                help={error?.message}
                            >
                                <Input {...field} placeholder="VD: banh-sinh-nhat" prefix="/" size="large" />
                            </Form.Item>
                        )}
                    />

                    <Controller
                        name="parentId"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Form.Item
                                label={<span className="font-medium text-stone-700">Danh mục cha</span>}
                                validateStatus={error ? 'error' : ''}
                                help={error?.message}
                            >
                                <Select
                                    {...field}
                                    placeholder="Tìm & chọn danh mục cha (Để trống nếu là Danh mục gốc)"
                                    size="large"
                                    allowClear
                                    showSearch
                                    filterOption={false}
                                    onSearch={(val) => setParentSearch(val)}
                                    onPopupScroll={handleParentPopupScroll}
                                    loading={isParentsLoading || isParentsFetchingNext}
                                    options={[
                                        { label: '— Không có (Danh mục gốc) —', value: null },
                                        ...selectOptionsMap,
                                        ...(isParentsFetchingNext
                                            ? [{ label: 'Đang tải thêm...', value: -999, disabled: true }]
                                            : []),
                                    ]}
                                    onChange={(val) => {
                                        if (val === -999) return;
                                        field.onChange(val ?? null);
                                    }}
                                />
                            </Form.Item>
                        )}
                    />

                    <Controller
                        name="imageUrl"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Form.Item
                                label={<span className="font-medium text-stone-700">Hình ảnh danh mục</span>}
                                validateStatus={error ? 'error' : ''}
                                help={error?.message}
                            >
                                <ImageUpload
                                    value={field.value || ''}
                                    onChange={(url) => field.onChange(url)}
                                    placeholder="Kéo thả hoặc nhấn để chọn tải ảnh lên"
                                />
                            </Form.Item>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="sortOrder"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <Form.Item
                                    label={<span className="font-medium text-stone-700">Thứ tự hiển thị</span>}
                                    validateStatus={error ? 'error' : ''}
                                    help={error?.message}
                                >
                                    <InputNumber
                                        {...field}
                                        min={0}
                                        className="w-full"
                                        size="large"
                                        placeholder="0"
                                        onChange={(val) => field.onChange(val ?? 0)}
                                    />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name="isFeatured"
                            control={control}
                            render={({ field }) => (
                                <Form.Item label={<span className="font-medium text-stone-700">Nổi bật</span>}>
                                    <Switch
                                        checked={field.value}
                                        onChange={field.onChange}
                                        checkedChildren="Có"
                                        unCheckedChildren="Không"
                                    />
                                </Form.Item>
                            )}
                        />
                    </div>

                    {mode === 'create' && (
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Form.Item label={<span className="font-medium text-stone-700">Trạng thái hoạt động</span>}>
                                    <Switch
                                        checked={field.value}
                                        onChange={field.onChange}
                                        checkedChildren="Bật"
                                        unCheckedChildren="Tắt"
                                    />
                                </Form.Item>
                            )}
                        />
                    )}

                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Form.Item
                                label={<span className="font-medium text-stone-700">Mô tả</span>}
                                validateStatus={error ? 'error' : ''}
                                help={error?.message}
                            >
                                <Input.TextArea
                                    {...field}
                                    rows={3}
                                    placeholder="Nhập mô tả ngắn gọn về danh mục sản phẩm này..."
                                />
                            </Form.Item>
                        )}
                    />
                </Form>
            )}
        </Drawer>
    );
};

export default CategoryDrawer;
