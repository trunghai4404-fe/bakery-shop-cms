import React, { useEffect, useMemo, useState } from 'react';
import { Card, Select, Switch, InputNumber, Button, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useInfiniteCategories } from '@/features/categories/hooks/useCategories';
import { useProductDetail, useInfiniteProductOptions } from '../hooks/useProducts';
import { useSelectScrollLoad } from '@/hooks/useSelectScrollLoad';
import { formatCurrency } from '@/lib/helper';
import type { LocalProductAccessory } from '../type';

export interface AccessoryItemCardProps {
  acc: LocalProductAccessory;
  aIdx: number;
  currentProductId?: number;
  isReadOnly?: boolean;
  onFieldChange?: (index: number, field: keyof LocalProductAccessory, value: any) => void;
  onCategoryChange?: (index: number, categoryId: number | undefined) => void;
  onProductChange?: (
    index: number,
    productId: number | undefined,
    selectedProduct?: { id: number; name: string; sku: string; price: number }
  ) => void;
  onRemove?: (index: number) => void;
}

export const AccessoryItemCard: React.FC<AccessoryItemCardProps> = ({
  acc,
  aIdx,
  currentProductId,
  isReadOnly = false,
  onFieldChange,
  onCategoryChange,
  onProductChange,
  onRemove,
}) => {
  const [categorySearch, setCategorySearch] = useState('');
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isFetchingNextPage: isCategoriesFetchingNext,
    hasNextPage: hasCategoriesNextPage,
    fetchNextPage: fetchCategoriesNextPage,
  } = useInfiniteCategories({
    search: categorySearch,
    enabled: !isReadOnly,
  });

  const { handlePopupScroll: handleCategoryPopupScroll } = useSelectScrollLoad({
    hasNextPage: hasCategoriesNextPage,
    isFetchingNextPage: isCategoriesFetchingNext,
    fetchNextPage: fetchCategoriesNextPage,
  });

  const categoryOptions = useMemo(() => {
    const list =
      categoriesData?.pages
        .flatMap((page) => page?.items || [])
        .map((cat) => ({
          value: cat.id,
          label: cat.name,
        })) || [];

    if (isCategoriesFetchingNext) {
      list.push({
        value: -999,
        label: 'Đang tải thêm danh mục...',
        disabled: true,
      } as any);
    }
    return list;
  }, [categoriesData, isCategoriesFetchingNext]);

  const { data: accessoryDetail } = useProductDetail(
    !isReadOnly && acc.accessoryProductId > 0 && !acc.categoryId ? acc.accessoryProductId : null
  );

  useEffect(() => {
    if (!isReadOnly && accessoryDetail && !acc.categoryId) {
      const catId = accessoryDetail.categories?.[0]?.categoryId;
      if (catId) {
        onFieldChange?.(aIdx, 'categoryId', catId);
      }
    }
  }, [accessoryDetail, acc.categoryId, aIdx, onFieldChange, isReadOnly]);

  const [productSearch, setProductSearch] = useState('');
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetchingNextPage: isProductsFetchingNext,
    hasNextPage: hasProductsNextPage,
    fetchNextPage: fetchProductsNextPage,
  } = useInfiniteProductOptions({
    search: productSearch,
    categoryId: acc.categoryId,
    excludeId: currentProductId,
    enabled: !isReadOnly && !!acc.categoryId,
  });

  const { handlePopupScroll: handleProductPopupScroll } = useSelectScrollLoad({
    hasNextPage: hasProductsNextPage,
    isFetchingNextPage: isProductsFetchingNext,
    fetchNextPage: fetchProductsNextPage,
  });

  const productOptions = useMemo(() => {
    const map = new Map<number, { value: number; label: string; disabled?: boolean }>();

    const items =
      productsData?.pages
        .flatMap((page) => page?.items || [])
        .filter((item) => item.id !== currentProductId) || [];

    items.forEach((item) => {
      map.set(item.id, {
        value: item.id,
        label: `${item.name} (${item.sku}) - ${formatCurrency(item.variants?.[0]?.price || 0)}`,
      });
    });

    if (acc.accessoryProductId > 0 && acc.selectedProduct && !map.has(acc.accessoryProductId)) {
      map.set(acc.accessoryProductId, {
        value: acc.selectedProduct.id,
        label: `${acc.selectedProduct.name} (${acc.selectedProduct.sku}) - ${formatCurrency(acc.selectedProduct.price || 0)}`,
      });
    }

    const options = Array.from(map.values());

    if (isProductsFetchingNext) {
      options.push({
        value: -999,
        label: 'Đang tải thêm sản phẩm...',
        disabled: true,
      });
    }

    return options;
  }, [productsData, currentProductId, acc.accessoryProductId, acc.selectedProduct, isProductsFetchingNext]);

  if (isReadOnly) {
    const productName = acc.selectedProduct?.name || `Phụ kiện #${acc.accessoryProductId}`;
    const productSku = acc.selectedProduct?.sku;
    const productPrice = acc.selectedProduct?.price ?? 0;

    return (
      <Card
        key={aIdx}
        size="small"
        className="border rounded-xl! border-stone-200 bg-white shadow-xs"
        classNames={{
          title: "py-2!"
        }}
        title={
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-stone-800 text-sm">
              {productName}
            </span>
            {acc.isIncluded ? (
              <Tag color="green" className="m-0">Tặng kèm (Miễn phí)</Tag>
            ) : (
              <Tag color="orange" className="m-0">Mua thêm</Tag>
            )}
            {acc.isRequired && <Tag color="red" className="m-0">Bắt buộc chọn</Tag>}
            {acc.isMultiSelect && <Tag color="blue" className="m-0">Chọn nhiều</Tag>}
          </div>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-stone-500 font-medium">Mã SKU:</span>
            <span className="font-mono font-semibold text-stone-800">
              {productSku || '—'}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-stone-500 font-medium">Đơn giá:</span>
            <span className="font-bold text-amber-700">
              {acc.isIncluded ? '0 ₫ (Miễn phí)' : formatCurrency(productPrice)}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-stone-500 font-medium">Số lượng mặc định:</span>
            <span className="font-semibold text-stone-800">
              {acc.defaultQuantity ?? 1}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-stone-500 font-medium">Giới hạn lựa chọn:</span>
            <span className="font-semibold text-stone-800">
              {acc.isMultiSelect
                ? (acc.maxSelectCount ? `Tối đa ${acc.maxSelectCount}` : 'Không giới hạn')
                : '1 lựa chọn'}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      key={aIdx}
      size="small"
      className="border rounded-md! border-stone-200 bg-stone-50/30"
      title={
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-stone-700">
            Phụ kiện #{aIdx + 1}
          </span>
          {acc.isIncluded ? (
            <Tag color="green">Tặng kèm (Miễn phí)</Tag>
          ) : (
            <Tag color="orange">Mua thêm</Tag>
          )}
          {acc.isRequired && <Tag color="red">Bắt buộc chọn</Tag>}
        </div>
      }
      extra={
        !isReadOnly && (
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => onRemove?.(aIdx)}
          >
            Bỏ đính kèm
          </Button>
        )
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 1. Chọn danh mục trước */}
        <div>
          <label className="text-xs text-stone-600 block mb-1 font-medium">
            1. Chọn danh mục phụ kiện: <span className="text-red-500">*</span>
          </label>
          <Select
            showSearch
            allowClear
            placeholder="Tìm & chọn danh mục..."
            value={acc.categoryId}
            filterOption={false}
            onSearch={(val) => setCategorySearch(val)}
            onPopupScroll={handleCategoryPopupScroll}
            onChange={(val) => {
              if (val === -999) return;
              onCategoryChange?.(aIdx, val);
            }}
            loading={isCategoriesLoading || isCategoriesFetchingNext}
            className="w-full"
            disabled={isReadOnly}
            options={categoryOptions}
          />
        </div>

        {/* 2. Chọn sản phẩm phụ kiện sau khi đã chọn danh mục */}
        <div>
          <label className="text-xs text-stone-600 block mb-1 font-medium">
            2. Chọn sản phẩm phụ kiện: <span className="text-red-500">*</span>
          </label>
          <Select
            showSearch
            placeholder={
              !acc.categoryId
                ? 'Vui lòng chọn danh mục trước'
                : 'Tìm tên hoặc SKU sản phẩm...'
            }
            value={acc.accessoryProductId > 0 ? acc.accessoryProductId : undefined}
            filterOption={false}
            onSearch={(val) => setProductSearch(val)}
            onPopupScroll={handleProductPopupScroll}
            onChange={(val) => {
              if (val === -999) return;
              const allItems = productsData?.pages.flatMap((page) => page?.items || []) || [];
              const selectedItem = allItems.find((p) => p.id === val);
              onProductChange?.(
                aIdx,
                val,
                selectedItem
                  ? {
                    id: selectedItem.id,
                    name: selectedItem.name,
                    sku: selectedItem.sku,
                    price: selectedItem.variants?.[0]?.price || 0,
                  }
                  : undefined
              );
            }}
            loading={isProductsLoading || isProductsFetchingNext}
            className="w-full"
            disabled={isReadOnly || !acc.categoryId}
            options={productOptions}
          />
        </div>

        <div className="flex items-center justify-between p-2 bg-white rounded border border-stone-200">
          <div>
            <div className="text-xs font-medium text-stone-800">
              Tặng kèm miễn phí
            </div>
            <div className="text-[11px] text-stone-500">
              Bao gồm sẵn trong giá bánh
            </div>
          </div>
          <Switch
            size="small"
            checked={acc.isIncluded}
            onChange={(val) => onFieldChange?.(aIdx, 'isIncluded', val)}
            disabled={isReadOnly}
          />
        </div>

        <div className="flex items-center justify-between p-2 bg-white rounded border border-stone-200">
          <div>
            <div className="text-xs font-medium text-stone-800">
              Bắt buộc chọn
            </div>
            <div className="text-[11px] text-stone-500">
              Khách phải chọn trước khi bấm Đặt hàng
            </div>
          </div>
          <Switch
            size="small"
            checked={acc.isRequired}
            onChange={(val) => onFieldChange?.(aIdx, 'isRequired', val)}
            disabled={isReadOnly}
          />
        </div>

        <div className="flex items-center justify-between p-2 bg-white rounded border border-stone-200">
          <div>
            <div className="text-xs font-medium text-stone-800">
              Cho phép chọn nhiều
            </div>
            <div className="text-[11px] text-stone-500">
              Cho chọn nhiều tùy chọn / biến thể
            </div>
          </div>
          <Switch
            size="small"
            checked={acc.isMultiSelect}
            onChange={(val) => onFieldChange?.(aIdx, 'isMultiSelect', val)}
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-stone-600 block mb-1">
              Số lượng mặc định
            </span>
            <InputNumber
              min={1}
              size="small"
              value={acc.defaultQuantity}
              onChange={(val) =>
                onFieldChange?.(aIdx, 'defaultQuantity', val || 1)
              }
              className="w-full"
              disabled={isReadOnly}
            />
          </div>

          <div>
            <span className="text-xs text-stone-600 block mb-1">
              Tối đa được chọn
            </span>
            <InputNumber
              min={1}
              size="small"
              disabled={!acc.isMultiSelect || isReadOnly}
              value={acc.maxSelectCount}
              onChange={(val) => onFieldChange?.(aIdx, 'maxSelectCount', val)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
