import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Input,
  Select,
  Switch,
  Tag,
  Space,
  Card,
  Tooltip,
  Spin,
  Empty,
  Badge,
} from 'antd';
import { PaginationCustom } from '@/components/ui/PaginationCustom';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  PictureOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  useProducts,
  useToggleProductActive,
} from '../hooks/useProducts';
import { useCategories } from '@/features/categories/hooks/useCategories';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PRODUCT_STATUS_OPTIONS,
} from '../constant';
import type { Product, ProductParams } from '../type';
import { ProductDrawer } from '../components/ProductDrawer';
import { formatTime } from '@/lib/helper';
import { useIsMobile } from '@/hooks/useIsMobile';
import { appImages } from '@/constants/app-infor';

export const ProductPage = () => {
  const isMobile = useIsMobile(768);

  const [params, setParams] = useState<ProductParams>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    search: undefined,
    categoryId: undefined,
    isActive: undefined,
    sortBy: 'createdAt',
    isDescending: true,
  });

  const navigate = useNavigate();

  const [drawerState, setDrawerState] = useState<{
    open: boolean;
    productId?: number | null;
  }>({
    open: false,
    productId: null,
  });

  const [togglingId, setTogglingId] = useState<number | null>(null);

  const { data: productsData, isLoading } = useProducts(params);
  const { data: categoriesData } = useCategories({ page: 1, pageSize: 100 });
  const toggleMutation = useToggleProductActive();

  const handleSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      search: value ? value.trim() : undefined,
      page: 1,
    }));
  };

  const handleCategoryChange = (value?: number | 'all') => {
    setParams((prev) => ({
      ...prev,
      categoryId: value === 'all' || value === undefined ? undefined : value,
      page: 1,
    }));
  };

  const handleStatusChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      isActive: value === 'all' ? undefined : value === 'true',
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setParams({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: undefined,
      categoryId: undefined,
      isActive: undefined,
      sortBy: 'createdAt',
      isDescending: true,
    });
  };

  const handleToggleActive = async (record: Product, checked: boolean) => {
    try {
      setTogglingId(record.id);
      await toggleMutation.mutateAsync({ id: record.id, data: { isActive: checked } });
    } finally {
      setTogglingId(null);
    }
  };

  const handleTableChange: TableProps<Product>['onChange'] = (
    _pagination,
    _filters,
    sorter,
  ) => {
    const currentSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    if (currentSorter && currentSorter.field && currentSorter.order) {
      setParams((prev) => ({
        ...prev,
        sortBy: currentSorter.field as string,
        isDescending: currentSorter.order === 'descend',
        page: 1,
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        sortBy: undefined,
        isDescending: false,
        page: 1,
      }));
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      // width: 300,
      sorter: true,
      sortOrder: params.sortBy === 'name' ? (params.isDescending ? 'descend' : 'ascend') : null,
      render: (_, record) => {
        const primaryImg = record.images?.find((img) => img.isPrimary) || record.images?.[0];
        const imgUrl = primaryImg?.desktopUrl || primaryImg?.mobileUrl;

        return (
          <div className="w-80 truncate line-clamp-1 flex items-center gap-3">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={record.name}
                className="w-11 h-11 object-cover rounded-lg border border-stone-200 shadow-xs shrink-0"
                onError={(e) => { e.currentTarget.src = appImages.placeholder }}
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                <PictureOutlined className="text-base" />
              </div>
            )}
            <div className="space-y-0.5 truncate line-clamp-1">
              <Tooltip
                title={record.name}
                placement="topLeft"
                styles={{
                  root: {
                    maxWidth: 300,
                  }
                }}
              >
                <div
                  className="font-bold text-stone-900 hover:text-amber-700 transition cursor-pointer truncate"
                  onClick={() => setDrawerState({ open: true, productId: record.id })}
                >
                  {record.name}
                </div>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: true,
      sortOrder: params.sortBy === 'sku' ? (params.isDescending ? 'descend' : 'ascend') : null,
      width: 250,
      render: (sku: string) => (
        <span className="text-xs font-semibold px-2 py-1 ">
          {sku || '—'}
        </span>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'categories',
      key: 'categories',
      width: 200,
      render: (categories: Product['categories']) => (
        <div className="flex flex-wrap gap-1">
          {categories && categories.length > 0 ? (
            categories.map((c) => (
              <Tag key={c.categoryId} color="gold" className="text-xs m-0">
                {c.name}
              </Tag>
            ))
          ) : (
            <span className="text-stone-400 text-xs">Không có</span>
          )}
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      key: 'variants',
      width: 120,
      render: (_, record) => {
        const activeVariants = record.variants?.filter((v) => v.isActive) || [];
        const totalStock = activeVariants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);

        return (
          <div className="space-y-0.5 text-xs">
            <div className="text-stone-500">
              Tồn kho:{' '}
              <strong className={totalStock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {totalStock}
              </strong>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: params.sortBy === 'createdAt' ? (params.isDescending ? 'descend' : 'ascend') : null,
      width: 130,
      render: (date: string) => (
        <span className="text-xs text-stone-500">{formatTime(date)}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (isActive: boolean, record) => (
        <Switch
          size='small'
          checked={isActive}
          loading={togglingId === record.id}
          onChange={(checked) => handleToggleActive(record, checked)}
          unCheckedChildren="Ẩn"
          className="bg-stone-300"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Quản lý sản phẩm
            </h1>
            <Badge
              count={productsData?.totalCount || 0}
              overflowCount={999}
              className=" text-amber-800 font-bold"
            />
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Quản lý danh mục sản phẩm, biến thể giá, kho hàng và phụ kiện đính kèm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/products/create')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md! shadow-xs"
          >
            Thêm sản phẩm mới
          </Button>
        </div>
      </div>
      {/* 
      <Card size="small" className="border-stone-200 shadow-xs rounded-xl">
        
      </Card> */}

      <Card
        size="small"
        className="border-stone-200 shadow-xs rounded-xl overflow-hidden"
        classNames={{
          header: 'p-4!'
        }}
        title={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-4">
              <Input.Search
                placeholder="Tìm kiếm theo Tên bánh hoặc SKU..."
                allowClear
                enterButton
                onSearch={handleSearch}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <Select
                placeholder="Lọc theo Danh mục..."
                className="w-full"
                value={params.categoryId === undefined ? 'all' : params.categoryId}
                onChange={handleCategoryChange}
                options={[
                  { label: 'Tất cả danh mục', value: 'all' },
                  ...(categoriesData?.items?.map((c) => ({
                    label: c.name,
                    value: c.id,
                  })) || []),
                ]}
              />
            </div>

            <div className="md:col-span-2">
              <Select
                placeholder="Trạng thái..."
                className="w-full"
                value={params.isActive === undefined ? 'all' : String(params.isActive)}
                onChange={handleStatusChange}
                options={PRODUCT_STATUS_OPTIONS}
              />
            </div>
            {!isMobile && (
              <div className="flex justify-end md:col-span-4">
                <Button
                  onClick={handleResetFilters}
                  icon={<ReloadOutlined />}
                >
                  Đặt lại
                </Button>
              </div>
            )}
          </div>
        }
      >

        {isLoading ? (
          <div className="py-20 text-center">
            <Spin size="large" description="Đang tải danh sách sản phẩm..." />
          </div>
        ) : !productsData?.items || productsData.items.length === 0 ? (
          <Empty
            description="Không có dữ liệu"
            className="py-12"
          />
        ) : isMobile ? (
          <div className="space-y-3 p-2">
            {productsData.items.map((prod) => {
              const primaryImg = prod.images?.find((i) => i.isPrimary) || prod.images?.[0];
              const imgUrl = primaryImg?.mobileUrl || primaryImg?.desktopUrl;

              return (
                <div
                  onClick={() => setDrawerState({ open: true, productId: prod.id })}
                  key={prod.id}
                  className="bg-white p-3 rounded-lg border border-stone-200 space-y-2"
                >
                  <div className="flex gap-3">
                    <img
                      src={imgUrl || appImages.placeholder}
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-stone-900 text-sm leading-snug">
                        {prod.name}
                      </h4>
                      <div className="text-xs font-mono text-stone-500">{prod.sku}</div>
                      <div className="flex items-center justify-between">
                        <Switch
                          size="small"
                          checked={prod.isActive}
                          onChange={(checked) => handleToggleActive(prod, checked)}
                        />
                        <Space>
                          <Button
                            size="small"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/products/${prod.id}/edit`)}
                          />
                        </Space>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={productsData.items}
            rowKey="id"
            pagination={false}
            size="middle"
            scroll={{ x: 'max-content' }}
            onChange={handleTableChange}
          />
        )}

        {productsData && productsData.totalCount > 0 && (
          <PaginationCustom
            current={params.page}
            pageSize={params.pageSize}
            total={productsData.totalCount}
            currentItemsCount={productsData.items?.length || 0}
            itemLabel="sản phẩm"
            onChange={(page, pageSize) =>
              setParams((prev) => ({ ...prev, page, pageSize }))
            }
          />
        )}
      </Card>

      <ProductDrawer
        open={drawerState.open}
        productId={drawerState.productId}
        onClose={() => setDrawerState({ open: false, productId: null })}
      />
    </div>
  );
};

export default ProductPage;
