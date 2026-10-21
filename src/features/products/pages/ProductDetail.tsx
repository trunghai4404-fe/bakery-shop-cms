import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Switch,
    Select,
    Tabs,
    Space,
    Radio,
    Card,
    Spin,
    Upload,
    message,
} from 'antd';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
    PictureOutlined,
} from '@ant-design/icons';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useCategories } from '@/features/categories/hooks/useCategories';
import {
    useCreateProduct,
    useProductDetail,
    useUpdateProduct,
} from '../hooks/useProducts';
import { AccessoryItemCard } from '../components/AccessoryItemCard';
import { CKEditorCustom } from '@/components/common/CKEditorCustom';
import type {
    CreateProductImageDto,
    CreateProductRequest,
    CreateProductVariantDto,
    LocalProductAccessory,
    UpdateProductRequest,
} from '../type';
import { getErrorMessage, slugify } from '@/lib/helper';
import { appImages } from '@/constants/app-infor';

const SECTIONS = [
    { key: '1', id: 'section-info', label: 'Thông tin sản phẩm' },
    { key: '2', id: 'section-images', label: 'Hình ảnh' },
    { key: '3', id: 'section-variants', label: 'Các loại sản phẩm' },
    { key: '4', id: 'section-accessories', label: 'Phụ kiện đính kèm' },
];

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isCreate = !id;
    const productId = id ? Number(id) : null;

    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');
    const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    const { data: detailData, isLoading: isDetailLoading } = useProductDetail(productId);
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useCategories({
        page: 1,
        pageSize: 100,
        isActive: true,
    });
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

    const [images, setImages] = useState<CreateProductImageDto[]>([]);
    const [variants, setVariants] = useState<CreateProductVariantDto[]>([]);
    const [accessories, setAccessories] = useState<LocalProductAccessory[]>([]);

    const { uploadSingleFile, uploadMultipleFiles, isUploading: isBulkUploading } = useUploadFile();
    const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

    const scrollContainerRef = useRef<HTMLElement | null>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        scrollContainerRef.current = document.querySelector('main');
    }, []);

    useEffect(() => {
        const scrollEl = scrollContainerRef.current;
        if (!scrollEl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (isScrolling) return;
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    const id = visible[0].target.getAttribute('data-section');
                    if (id) setActiveTab(id);
                }
            },
            {
                root: scrollEl,
                rootMargin: '-30% 0px -60% 0px',
                threshold: 0,
            },
        );

        SECTIONS.forEach(({ key }) => {
            const el = sectionRefs.current[key];
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [isScrolling, isDetailLoading]);

    const handleTabClick = (key: string) => {
        setActiveTab(key);
        const el = sectionRefs.current[key];
        const scrollEl = scrollContainerRef.current;
        if (!el || !scrollEl) return;

        setIsScrolling(true);
        const elTop = el.getBoundingClientRect().top;
        const containerTop = scrollEl.getBoundingClientRect().top;
        const offset = 96;
        scrollEl.scrollBy({ top: elTop - containerTop - offset, behavior: 'smooth' });
        setTimeout(() => setIsScrolling(false), 600);
    };

    useEffect(() => {
        if (isCreate) {
            form.resetFields();
            form.setFieldsValue({ isActive: true, categoryIds: [] });
            setImages([]);
            setVariants([]);
            setAccessories([]);
            setAutoGenerateSlug(true);
        } else if (detailData) {
            form.setFieldsValue({
                name: detailData.name,
                sku: detailData.sku,
                slug: detailData.slug,
                description: detailData.description,
                isActive: detailData.isActive,
                categoryIds: detailData.categories?.map((c) => c.categoryId) || [],
            });
            setImages(
                detailData.images?.length
                    ? detailData.images.map((img) => ({ id: img.id, desktopUrl: img.desktopUrl, mobileUrl: img.mobileUrl, isPrimary: img.isPrimary, sortOrder: img.sortOrder }))
                    : [],
            );
            setVariants(
                detailData.variants?.length
                    ? detailData.variants.map((v) => ({ id: v.id, name: v.name, sku: v.sku, price: v.price, stockQuantity: v.stockQuantity, isActive: v.isActive ?? true, sortOrder: v.sortOrder ?? 0 }))
                    : [],
            );
            setAccessories(
                detailData.accessories?.length
                    ? detailData.accessories.map((acc: any) => ({
                        accessoryProductId: acc.accessoryProductId,
                        defaultQuantity: acc.defaultQuantity ?? 1,
                        isIncluded: acc.isIncluded ?? true,
                        sortOrder: acc.sortOrder ?? 0,
                        isMultiSelect: acc.isMultiSelect ?? false,
                        maxSelectCount: acc.maxSelectCount ?? 1,
                        isRequired: acc.isRequired ?? false,
                        categoryId: acc.categoryId || acc.categories?.[0]?.categoryId || undefined,
                        selectedProduct: { id: acc.accessoryProductId, name: acc.name, sku: acc.sku, price: acc.price || acc.variants?.[0]?.price || 0 },
                    }))
                    : [],
            );
            setAutoGenerateSlug(false);
        }
    }, [isCreate, detailData, form]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (autoGenerateSlug) form.setFieldsValue({ slug: slugify(e.target.value) });
    };

    const handleUploadDesktop = async (idx: number, file: File) => {
        const key = `desktop-${idx}`;
        setUploadingState((p) => ({ ...p, [key]: true }));
        try {
            const url = await uploadSingleFile(file);
            if (url) {
                handleImageFieldChange(idx, 'desktopUrl', url);
                if (!images[idx]?.mobileUrl) handleImageFieldChange(idx, 'mobileUrl', url);
            }
        } finally { setUploadingState((p) => ({ ...p, [key]: false })); }
    };

    const handleUploadMobile = async (idx: number, file: File) => {
        const key = `mobile-${idx}`;
        setUploadingState((p) => ({ ...p, [key]: true }));
        try {
            const url = await uploadSingleFile(file);
            if (url) handleImageFieldChange(idx, 'mobileUrl', url);
        } finally { setUploadingState((p) => ({ ...p, [key]: false })); }
    };

    const handleBulkUpload = async (fileList: File[]) => {
        if (!fileList?.length) return;
        const urls = await uploadMultipleFiles(fileList);
        if (urls?.length) {
            const newDtos: CreateProductImageDto[] = urls.map((url, i) => ({
                id: 0, desktopUrl: url, mobileUrl: url,
                isPrimary: images.length === 0 && i === 0, sortOrder: images.length + i,
            }));
            setImages((p) => [...p, ...newDtos]);
        }
    };

    const handleAddImage = () => setImages((p) => [...p, { id: 0, desktopUrl: '', mobileUrl: '', isPrimary: p.length === 0, sortOrder: p.length }]);
    const handleRemoveImage = (index: number) => setImages((p) => {
        const next = p.filter((_, i) => i !== index);
        if (next.length && !next.some((img) => img.isPrimary)) next[0].isPrimary = true;
        return next;
    });
    const handleSetPrimaryImage = (index: number) => setImages((p) => p.map((img, i) => ({ ...img, isPrimary: i === index })));
    const handleImageFieldChange = (index: number, field: keyof CreateProductImageDto, value: any) =>
        setImages((p) => p.map((img, i) => (i === index ? { ...img, [field]: value } : img)));

    const handleAddVariant = () => {
        const baseSku = form.getFieldValue('sku') || 'SKU';
        setVariants((p) => [...p, { id: 0, name: `Size ${p.length + 1}`, sku: `${baseSku}-${p.length + 1}`, price: 0, stockQuantity: 10, isActive: true, sortOrder: p.length }]);
    };
    const handleRemoveVariant = (index: number) => setVariants((p) => p.filter((_, i) => i !== index));
    const handleVariantFieldChange = (index: number, field: keyof CreateProductVariantDto, value: any) =>
        setVariants((p) => p.map((v, i) => (i === index ? { ...v, [field]: value } : v)));

    const handleAddAccessory = () => setAccessories((p) => [...p, { accessoryProductId: 0, defaultQuantity: 1, isIncluded: true, sortOrder: p.length, isMultiSelect: false, maxSelectCount: 1, isRequired: false, categoryId: undefined, selectedProduct: undefined }]);
    const handleRemoveAccessory = (index: number) => setAccessories((p) => p.filter((_, i) => i !== index));
    const handleAccessoryFieldChange = (index: number, field: keyof LocalProductAccessory, value: any) =>
        setAccessories((p) => p.map((acc, i) => (i === index ? { ...acc, [field]: value } : acc)));
    const handleAccessoryCategoryChange = (index: number, categoryId: number | undefined) =>
        setAccessories((p) => p.map((acc, i) => i !== index ? acc : { ...acc, categoryId, accessoryProductId: 0, selectedProduct: undefined }));
    const handleAccessoryProductChange = (index: number, pid: number | undefined, selectedProduct?: { id: number; name: string; sku: string; price: number }) =>
        setAccessories((p) => p.map((acc, i) => i !== index ? acc : { ...acc, accessoryProductId: pid || 0, selectedProduct }));

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const incompleteAcc = accessories.find((acc) => !acc.accessoryProductId || acc.accessoryProductId <= 0);
            if (accessories.length > 0 && incompleteAcc) {
                message.warning('Vui lòng chọn sản phẩm phụ kiện cho tất cả các mục, hoặc xóa bỏ phụ kiện chưa chọn!');
                handleTabClick('4');
                return;
            }
            const payload: CreateProductRequest | UpdateProductRequest = {
                name: values.name.trim(), sku: values.sku.trim(),
                slug: values.slug ? values.slug.trim() : undefined,
                description: values.description || '',
                isActive: values.isActive ?? true,
                categoryIds: values.categoryIds || [],
                images: images.map((img, i) => ({
                    id: img.id ?? undefined,
                    desktopUrl: img.desktopUrl?.trim() || '',
                    mobileUrl: img.mobileUrl?.trim() || img.desktopUrl?.trim() || '',
                    isPrimary: img.isPrimary ?? i === 0,
                    sortOrder: img.sortOrder ?? i,
                })),
                variants: variants.map((v, i) => ({
                    id: v.id ?? undefined,
                    name: v.name.trim(),
                    sku: v.sku.trim(),
                    price: v.price ?? 0,
                    stockQuantity: v.stockQuantity ?? 0,
                    isActive: v.isActive ?? true,
                    sortOrder: v.sortOrder ?? i,
                })),
                accessories: accessories.filter((acc) => acc.accessoryProductId > 0).map((acc, i) => ({
                    accessoryProductId: acc.accessoryProductId,
                    defaultQuantity: acc.defaultQuantity ?? 1,
                    isIncluded: acc.isIncluded ?? true,
                    sortOrder: acc.sortOrder ?? i,
                    isMultiSelect: acc.isMultiSelect ?? false,
                    maxSelectCount: acc.isMultiSelect ? (acc.maxSelectCount ?? 5) : 1,
                    isRequired: acc.isRequired ?? false,
                })),
            };
            if (isCreate) {
                await createMutation.mutateAsync(payload as CreateProductRequest);
            } else if (productId) {
                await updateMutation.mutateAsync({ id: productId, data: payload as UpdateProductRequest });
            }
            navigate('/products');
        } catch (errInfo: any) {
            const ErrMsg = getErrorMessage(errInfo)
            message.error(ErrMsg)
            if (errInfo?.errorFields) {
                handleTabClick('1');
            }
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const tabItems = useMemo(() => SECTIONS.map(({ key, label }) => ({
        key,
        label: (
            <span className={`text-sm ${activeTab === key ? 'font-bold text-amber-700' : 'text-stone-600'}`}>
                {key === '2' ? `${label} (${images.length})` : key === '3' ? `${label} (${variants.length})` : key === '4' ? `${label} (${accessories.length})` : label}
            </span>
        ),
    })), [activeTab, images.length, variants.length, accessories.length]);

    if (!isCreate && isDetailLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spin size="large" description="Đang tải..." />
            </div>
        );
    }

    if (!isCreate && !detailData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-stone-500">
                <PictureOutlined className="text-5xl text-stone-300" />
                <p className="text-base font-medium">Không tìm thấy sản phẩm</p>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
                    Quay lại danh sách
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-0 pb-10">
            <div className="sticky -top-4 z-20 bg-white border-x border-b border-stone-200 shadow-sm px-4">
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabClick}
                    type="line"
                    size="small"
                    items={tabItems}
                    className="m-0!"
                    tabBarStyle={{ margin: 0 }}
                />
            </div>

            <div className="border-x border-b border-stone-200 rounded-b-xl bg-white shadow-xs">
                <Form form={form} layout="vertical">

                    <div
                        ref={(el) => { sectionRefs.current['1'] = el; }}
                        data-section="1"
                        className="px-4 pt-5 pb-6 border-b border-stone-100"
                    >
                        <h2 className="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center">1</span>
                            Thông tin sản phẩm
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item
                                    label="Tên sản phẩm"
                                    name="name"
                                    style={{ marginBottom: 0 }}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên sản phẩm' },
                                        { max: 256, message: 'Tên không quá 256 ký tự' },
                                    ]}
                                >
                                    <Input placeholder="Ví dụ: Bánh Mousse Dâu Tây Hoàng Gia" onChange={handleNameChange} />
                                </Form.Item>

                                <Form.Item
                                    label="SKU sản phẩm"
                                    name="sku"
                                    style={{ marginBottom: 0 }}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mã SKU' },
                                        { max: 250, message: 'SKU không quá 250 ký tự' },
                                    ]}
                                >
                                    <Input placeholder="Ví dụ: BMS-DAU-01" className="font-mono" />
                                </Form.Item>
                            </div>
                            <div>

                                <Form.Item
                                    label="Đường dẫn (Slug)"
                                    name="slug"
                                    rules={[{ max: 256, message: 'Slug không quá 256 ký tự' }]}
                                    style={{ marginBottom: 0 }}

                                >
                                    <Input placeholder="banh-mousse-dau-tay" className="text-xs" prefix="/" readOnly />
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item label="Danh mục bánh đính kèm" name="categoryIds" style={{ marginBottom: 0 }}>
                                    <Select
                                        mode="multiple"
                                        placeholder="Chọn danh mục"
                                        loading={isCategoriesLoading}
                                        allowClear
                                        options={categoriesResponse?.items?.map((cat) => ({ label: cat.name, value: cat.id })) || []}
                                    />
                                </Form.Item>

                                <Form.Item label="Trạng thái" name="isActive" valuePropName="checked" style={{ marginBottom: 0 }}>
                                    <Switch
                                        // checkedChildren="Hoạt động"
                                        // unCheckedChildren="Không hoạt động"
                                        className="bg-stone-300"
                                        size="default"
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label="Mô tả chi tiết sản phẩm"
                                name="description"
                                style={{ marginBottom: 0 }}
                            >
                                <CKEditorCustom
                                    placeholder="Nhập mô tả chi tiết bánh, thành phần, hương vị, hướng dẫn bảo quản..."
                                    minHeight={260}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div
                        ref={(el) => { sectionRefs.current['2'] = el; }}
                        data-section="2"
                        className="px-4 pt-5 pb-6 border-b border-stone-100"
                    >
                        <h2 className="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center">2</span>
                            Hình ảnh ({images.length})
                        </h2>
                        <div className="flex flex-col gap-4">
                            {images.map((img, idx) => (
                                <Card
                                    key={idx}
                                    size="small"
                                    className={`border rounded-md! ${img.isPrimary ? 'border-amber-400 bg-amber-50/30' : 'border-stone-200'}`}
                                    title={
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-stone-700">Ảnh #{idx + 1}</span>
                                            <Radio checked={img.isPrimary} onChange={() => handleSetPrimaryImage(idx)}>
                                                <span className="font-medium text-amber-700">
                                                    {img.isPrimary ? 'Ảnh đại diện' : 'Đặt làm ảnh chính'}
                                                </span>
                                            </Radio>
                                        </div>
                                    }
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex gap-3">
                                            {/* Desktop */}
                                            <div className="flex flex-col items-center gap-1.5 p-2 bg-white rounded-lg border border-stone-200">
                                                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">Desktop</span>
                                                <img
                                                    src={img.desktopUrl || appImages.placeholder}
                                                    alt={`Desktop #${idx + 1}`}
                                                    className="w-28 h-24 object-cover rounded-md border border-stone-100 shadow-xs"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = appImages.placeholder; }}
                                                />
                                                <Upload beforeUpload={(file) => { handleUploadDesktop(idx, file); return false; }} showUploadList={false} accept="image/*">
                                                    <Button size="small" icon={<UploadOutlined />} loading={uploadingState[`desktop-${idx}`]} className="text-[11px] h-7 px-2">
                                                        {img.desktopUrl ? 'Đổi ảnh' : 'Tải ảnh'}
                                                    </Button>
                                                </Upload>
                                            </div>
                                            {/* Mobile */}
                                            <div className="flex flex-col items-center gap-1.5 p-2 bg-white rounded-lg border border-stone-200">
                                                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">Mobile</span>
                                                <img
                                                    src={img.mobileUrl || appImages.placeholder}
                                                    alt={`Mobile #${idx + 1}`}
                                                    className="w-20 h-24 object-cover rounded-md border border-stone-100 shadow-xs"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = appImages.placeholder; }}
                                                />
                                                <Upload beforeUpload={(file) => { handleUploadMobile(idx, file); return false; }} showUploadList={false} accept="image/*">
                                                    <Button size="small" icon={<UploadOutlined />} loading={uploadingState[`mobile-${idx}`]} className="text-[11px] h-7 px-2">
                                                        {img.mobileUrl ? 'Đổi ảnh' : 'Tải ảnh'}
                                                    </Button>
                                                </Upload>
                                            </div>
                                        </div>
                                        <div className="flex w-full! md:w-auto! flex-row gap-3 justify-between md:self-end">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-stone-600 font-medium">Thứ tự:</span>
                                                <InputNumber
                                                    min={0} size="small" value={img.sortOrder}
                                                    onChange={(val) => handleImageFieldChange(idx, 'sortOrder', val || 0)}
                                                    className="w-10! text-center!"
                                                />
                                            </div>
                                            <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleRemoveImage(idx)} size="small" className="border!">
                                                Xóa ảnh
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            <div className="flex flex-row gap-2">
                                <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddImage} className="py-2 text-stone-600 flex-1">
                                    Thêm ảnh mới
                                </Button>
                                <Upload
                                    beforeUpload={(file, fileList) => { if (file === fileList[0]) handleBulkUpload(fileList); return false; }}
                                    multiple showUploadList={false} accept="image/*"
                                >
                                    <Button type="primary" icon={<UploadOutlined />} loading={isBulkUploading} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold border-none">
                                        Thêm nhiều ảnh
                                    </Button>
                                </Upload>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={(el) => { sectionRefs.current['3'] = el; }}
                        data-section="3"
                        className="px-4 pt-5 pb-6 border-b border-stone-100"
                    >
                        <h2 className="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center">3</span>
                            Các loại sản phẩm ({variants.length})
                        </h2>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto border border-stone-200 rounded-lg mb-4">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-stone-100 border-b border-stone-200 text-stone-700 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="p-2.5">Tên biến thể (Size/Vị)</th>
                                        <th className="p-2.5">Mã SKU riêng</th>
                                        <th className="p-2.5">Đơn giá (VNĐ)</th>
                                        <th className="p-2.5">Tồn kho</th>
                                        <th className="p-2.5">Bán</th>
                                        <th className="p-2.5 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-200 bg-white">
                                    {variants.map((variant, vIdx) => (
                                        <tr key={vIdx} className="hover:bg-stone-50/60">
                                            <td className="p-2">
                                                <Input size="small" placeholder="Size 16cm (4-6 người)" value={variant.name} onChange={(e) => handleVariantFieldChange(vIdx, 'name', e.target.value)} />
                                            </td>
                                            <td className="p-2">
                                                <Input size="small" placeholder="SKU-VAR-16" value={variant.sku} onChange={(e) => handleVariantFieldChange(vIdx, 'sku', e.target.value)} className="font-mono" />
                                            </td>
                                            <td className="p-2">
                                                <InputNumber
                                                    size="small" min={0} step={5000}
                                                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
                                                    value={variant.price} onChange={(val) => handleVariantFieldChange(vIdx, 'price', val || 0)} className="w-full"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <InputNumber size="small" min={0} value={variant.stockQuantity} onChange={(val) => handleVariantFieldChange(vIdx, 'stockQuantity', val || 0)} className="w-20" />
                                            </td>
                                            <td className="p-2">
                                                <Switch size="small" checked={variant.isActive} onChange={(val) => handleVariantFieldChange(vIdx, 'isActive', val)} />
                                            </td>
                                            <td className="p-2 text-center">
                                                <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveVariant(vIdx)} disabled={variants.length <= 1} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3 mb-4">
                            {variants.map((variant, vIdx) => (
                                <Card
                                    key={vIdx} size="small"
                                    className="border border-stone-200 bg-stone-50/30 rounded-lg"
                                    title={
                                        <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                                            <span>Loại #{vIdx + 1}</span>
                                            <div className="flex items-center gap-1.5 font-normal">
                                                <span className="text-stone-500 text-[11px]">Hoạt động:</span>
                                                <Switch size="small" checked={variant.isActive} onChange={(val) => handleVariantFieldChange(vIdx, 'isActive', val)} />
                                            </div>
                                        </div>
                                    }
                                    extra={
                                        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveVariant(vIdx)} disabled={variants.length <= 1} />
                                    }
                                >
                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <span className="text-stone-600 block mb-1 font-medium">Tên biến thể:</span>
                                            <Input size="small" placeholder="Size 16cm" value={variant.name} onChange={(e) => handleVariantFieldChange(vIdx, 'name', e.target.value)} />
                                        </div>
                                        <div>
                                            <span className="text-stone-600 block mb-1 font-medium">Mã SKU:</span>
                                            <Input size="small" value={variant.sku} onChange={(e) => handleVariantFieldChange(vIdx, 'sku', e.target.value)} className="font-mono" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-stone-600 block mb-1 font-medium">Đơn giá:</span>
                                                <InputNumber
                                                    size="small" min={0} step={5000}
                                                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
                                                    value={variant.price} onChange={(val) => handleVariantFieldChange(vIdx, 'price', val || 0)} className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-stone-600 block mb-1 font-medium">Tồn kho:</span>
                                                <InputNumber size="small" min={0} value={variant.stockQuantity} onChange={(val) => handleVariantFieldChange(vIdx, 'stockQuantity', val || 0)} className="w-full" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddVariant} className="py-2">
                            Thêm biến thể mới
                        </Button>
                    </div>

                    <div
                        ref={(el) => { sectionRefs.current['4'] = el; }}
                        data-section="4"
                        className="px-4 pt-5 pb-6"
                    >
                        <h2 className="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center">4</span>
                            Phụ kiện đính kèm ({accessories.length})
                        </h2>
                        <div className="flex flex-col gap-4">
                            {accessories.map((acc, aIdx) => (
                                <AccessoryItemCard
                                    key={aIdx}
                                    acc={acc}
                                    aIdx={aIdx}
                                    currentProductId={productId || undefined}
                                    isReadOnly={false}
                                    onFieldChange={handleAccessoryFieldChange}
                                    onCategoryChange={handleAccessoryCategoryChange}
                                    onProductChange={handleAccessoryProductChange}
                                    onRemove={handleRemoveAccessory}
                                />
                            ))}
                            <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddAccessory} className="py-2 text-stone-600">
                                Thêm phụ kiện đính kèm
                            </Button>
                        </div>
                    </div>

                </Form>
            </div>

            <div className="fixed bottom-6 right-6 z-30">
                <Space>
                    <Button onClick={() => navigate('/products')}>Hủy</Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold border-none"
                    >
                        {isCreate ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default ProductDetail;