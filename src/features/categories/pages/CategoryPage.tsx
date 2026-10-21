import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Switch,
  Tag,
  Space,
  Modal,
  Avatar,
  Card,
  Tooltip,
  Spin,
  Empty,
} from 'antd';
import { PaginationCustom } from '@/components/ui/PaginationCustom';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
  PlusOutlined,
  FolderOutlined,
  EyeOutlined,
  DeleteOutlined,
  StarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  useCategories,
  useToggleCategoryActive,
  useDeleteCategory,
} from '../hooks/useCategories';
import {
  CATEGORY_FEATURED_OPTIONS,
  CATEGORY_STATUS_OPTIONS,
  CATEGORY_TYPE_OPTIONS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '../constant';
import type { CategoriesParams, CategoryList } from '../type';
import { CategoryDrawer } from '../components/CategoryDrawer';
import { formatTime, DATE_TIME_FORMATS } from '@/lib/helper';
import { useIsMobile } from '@/hooks/useIsMobile';

export const CategoryPage = () => {
  const isMobile = useIsMobile(768);
  const [params, setParams] = useState<CategoriesParams>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    search: undefined,
    isActive: undefined,
    isFeatured: undefined,
    isRoot: undefined,
    sortBy: undefined,
    isDescending: false,
  });

  const [drawerState, setDrawerState] = useState<{
    open: boolean;
    mode: 'create' | 'detail';
    categoryId?: number | null;
  }>({
    open: false,
    mode: 'create',
    categoryId: null,
  });

  const [togglingId, setTogglingId] = useState<number | null>(null);

  const { data: categoriesData, isLoading, isFetching } = useCategories(params);
  const toggleMutation = useToggleCategoryActive();
  const deleteMutation = useDeleteCategory();

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      search: value ? value.trim() : undefined,
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

  const handleTypeChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      isRoot: value === 'all' ? undefined : value === 'true',
      page: 1,
    }));
  };

  const handleFeaturedChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      isFeatured: value === 'all' ? undefined : value === 'true',
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setParams({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: undefined,
      isActive: undefined,
      isFeatured: undefined,
      isRoot: undefined,
      sortBy: undefined,
      isDescending: false,
    });
  };

  const handleToggleActive = async (
    record: CategoryList,
    checked: boolean,
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    e.stopPropagation();
    try {
      setTogglingId(record.id);
      await toggleMutation.mutateAsync({ id: record.id, isActive: checked });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = (record: CategoryList, e?: React.MouseEvent) => {
    e?.stopPropagation();
    Modal.confirm({
      title: 'Xóa danh mục?',
      icon: null,
      content: (
        <div className="space-y-1 py-1">
          <p className="text-stone-700">
            Bạn có chắc chắn muốn xóa danh mục <strong>"{record.name}"</strong>?
          </p>
        </div>
      ),
      okText: 'Xóa danh mục',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { loading: deleteMutation.isPending },
      onOk: async () => {
        await deleteMutation.mutateAsync(record.id);
      },
    });
  };

  const handleOpenCreate = () => {
    setDrawerState({
      open: true,
      mode: 'create',
      categoryId: null,
    });
  };

  const handleRowClick = (record: CategoryList) => {
    setDrawerState({
      open: true,
      mode: 'detail',
      categoryId: record.id,
    });
  };

  const handleCloseDrawer = () => {
    setDrawerState((prev) => ({ ...prev, open: false }));
  };

  const handleTableChange: TableProps<CategoryList>['onChange'] = (pagination, _, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setParams((prev) => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      sortBy: singleSorter?.order && singleSorter?.field ? String(singleSorter.field) : undefined,
      isDescending: singleSorter?.order === 'descend',
    }));
  };

  const columns: ColumnsType<CategoryList> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: params.sortBy === 'name' ? (params.isDescending ? 'descend' : 'ascend') : null,
      render: (name: string, record: CategoryList) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={40}
            src={record.imageUrl}
            icon={<FolderOutlined className="text-stone-400 text-lg" />}
            className="bg-stone-100 border border-stone-200 rounded-md shrink-0"
          />
          <Tooltip
            title={name}
            className='w-80'
          >
            <div className="flex flex-col">
              <span className="font-semibold text-stone-800 hover:text-pink-600 transition-colors">
                {name}
              </span>
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Danh mục cha',
      dataIndex: 'parentName',
      key: 'parentName',
      render: (parentName: string | null) =>
        parentName ? (
          <Tag color="purple" className="rounded-md font-medium border-purple-200">
            {parentName}
          </Tag>
        ) : (
          <Tag color="orange" className="rounded-md font-medium border-orange-200">
            Danh mục gốc
          </Tag>
        ),
    },
    {
      title: 'Danh mục con',
      dataIndex: 'childrenCount',
      key: 'childrenCount',
      align: 'center',
      render: (count: number) =>
        count > 0 ? (
          <Tag color="cyan" className="rounded-full px-2 font-medium">
            {count}
          </Tag>
        ) : (
          <span className="text-stone-400 text-xs">0</span>
        ),
    },
    {
      title: 'Nổi bật',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      align: 'center',
      render: (isFeatured: boolean) =>
        isFeatured ? (
          <Tooltip title="Danh mục nổi bật">
            <Tag color="gold" icon={<StarOutlined />} className="rounded-md font-medium">
              Nổi bật
            </Tag>
          </Tooltip>
        ) : (
          <span className="text-stone-300 text-xs">—</span>
        ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      align: 'center',
      width: 100,
      sorter: true,
      sortOrder: params.sortBy === 'sortOrder' ? (params.isDescending ? 'descend' : 'ascend') : null,
      render: (order: number) => (
        <span className="font-mono text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
          {order}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: params.sortBy === 'createdAt' ? (params.isDescending ? 'descend' : 'ascend') : null,
      render: (dateStr: string) => (
        <span className="text-xs text-stone-500">
          {formatTime(dateStr, DATE_TIME_FORMATS.DATETIME)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (isActive: boolean, record: CategoryList) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2"
        >
          <Switch
            checked={isActive}
            loading={togglingId === record.id}
            onChange={(checked, e) => handleToggleActive(record, checked, e)}
            size="small"
          />
          <span
            className={`text-xs font-semibold ${isActive ? 'text-emerald-700' : 'text-stone-400'
              }`}
          >
          </span>
        </div>
      ),
    },
  ];

  const hasActiveFilters =
    params.search !== undefined ||
    params.isActive !== undefined ||
    params.isFeatured !== undefined ||
    params.isRoot !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
            Danh mục sản phẩm
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Quản lý danh mục sản phẩm của cửa hàng
          </p>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
          className="font-semibold rounded-lg! shadow-sm w-full md:w-auto"
        >
          Tạo danh mục mới
        </Button>
      </div>

      <Card
        className="shadow-xs border-stone-200 rounded-xl bg-white overflow-hidden p-0"
        classNames={{
          body: "p-4!",
          header: "p-4!"
        }}
        title={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-4">
              <Input.Search
                placeholder="Tìm theo tên danh mục, slug..."
                allowClear
                enterButton
                className="w-full"
                onSearch={(value) => handleSearchChange(value)}
              />
            </div>

            <div className="md:col-span-2">
              <Select
                placeholder="Trạng thái"
                options={CATEGORY_STATUS_OPTIONS}
                value={params.isActive === undefined ? 'all' : String(params.isActive)}
                onChange={handleStatusChange}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <Select
                placeholder="Nổi bật"
                options={CATEGORY_FEATURED_OPTIONS}
                value={params.isFeatured === undefined ? 'all' : String(params.isFeatured)}
                onChange={handleFeaturedChange}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <Select
                placeholder="Phân loại"
                options={CATEGORY_TYPE_OPTIONS}
                value={params.isRoot === undefined ? 'all' : String(params.isRoot)}
                onChange={handleTypeChange}
                className="w-full"
              />
            </div>

            {!isMobile && (
              <div className="flex justify-end md:col-span-2">
                <Button
                  disabled={!hasActiveFilters}
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
        {isMobile ? (
          <div className="space-y-3">
            {isLoading || isFetching ? (
              <div className="flex justify-center items-center py-12">
                <Spin description="Đang tải..." />
              </div>
            ) : !categoriesData?.items || categoriesData.items.length === 0 ? (
              <div className="py-8">
                <Empty description="Không có dữ liệu" />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {categoriesData.items.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => handleRowClick(record)}
                      className="bg-stone-50/50 hover:bg-stone-100/80 rounded-md! border border-stone-200 p-3.5 space-y-3 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar
                            shape="square"
                            size={44}
                            src={record.imageUrl}
                            icon={<FolderOutlined className="text-stone-400 text-xl" />}
                            className="bg-stone-200/60 border border-stone-300 rounded-lg shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-stone-800 text-sm truncate">
                              {record.name}
                            </span>
                            <span className="text-xs text-stone-400 font-mono truncate">
                              /{record.slug}
                            </span>
                          </div>
                        </div>

                        <Space size="small" onClick={(e) => e.stopPropagation()} className="shrink-0">
                          <Tooltip title="Xem chi tiết">
                            <Button
                              type="text"
                              size="small"
                              icon={<EyeOutlined className="text-stone-500" />}
                              onClick={() => handleRowClick(record)}
                              className="border! border-outline!"
                            />
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined className="text-red-500" />}
                              onClick={(e) => handleDeleteConfirm(record, e)}
                              className="border! border-outline!"
                            />
                          </Tooltip>
                        </Space>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/60 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {record.parentName ? (
                            <Tag color="purple" className="rounded-md font-medium border-purple-200 m-0 text-[11px]">
                              {record.parentName}
                            </Tag>
                          ) : (
                            <Tag color="orange" className="rounded-md font-medium border-orange-200 m-0 text-[11px]">
                              Danh mục gốc
                            </Tag>
                          )}

                          {/* {record.childrenCount > 0 && (
                            <Tag color="cyan" className="rounded-full px-2 font-medium m-0 text-[11px]">
                              {record.childrenCount} con
                            </Tag>
                          )} */}

                          {record.isFeatured && (
                            <Tag color="gold" icon={<StarOutlined />} className="rounded-md font-medium m-0 text-[11px]">
                              Nổi bật
                            </Tag>
                          )}
                        </div>

                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5"
                        >
                          <Switch
                            checked={record.isActive}
                            loading={togglingId === record.id}
                            onChange={(checked, e) => handleToggleActive(record, checked, e)}
                            size="small"
                          />
                          <span
                            className={`text-xs font-semibold ${record.isActive ? 'text-emerald-700' : 'text-stone-400'
                              }`}
                          >
                            {record.isActive ? 'Bật' : 'Tắt'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                        <span>Thứ tự: <strong className="font-mono text-stone-600">#{record.sortOrder}</strong></span>
                        <span>{formatTime(record.createdAt, DATE_TIME_FORMATS.DATETIME)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <PaginationCustom
                  current={params.page || 1}
                  pageSize={params.pageSize || 10}
                  total={categoriesData?.totalCount || 0}
                  currentItemsCount={categoriesData?.items?.length || 0}
                  itemLabel="danh mục"
                  onChange={(page, pageSize) => {
                    setParams((prev) => ({
                      ...prev,
                      page,
                      pageSize,
                    }));
                  }}
                  containerClassName="border-t-0 bg-transparent p-0 pt-2"
                />
              </>
            )}
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <Table<CategoryList>
              rowKey="id"
              columns={columns}
              dataSource={categoriesData?.items || []}
              loading={isLoading || isFetching}
              onChange={handleTableChange}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                className: 'cursor-pointer hover:bg-stone-50 transition-colors',
              })}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
            <PaginationCustom
              current={params.page}
              pageSize={params.pageSize}
              total={categoriesData?.totalCount || 0}
              currentItemsCount={categoriesData?.items?.length || 0}
              itemLabel="danh mục"
              onChange={(page, pageSize) =>
                setParams((prev) => ({ ...prev, page, pageSize }))
              }
            />


          </div>
        )}
      </Card>

      <CategoryDrawer
        open={drawerState.open}
        onClose={handleCloseDrawer}
        mode={drawerState.mode}
        categoryId={drawerState.categoryId}
      />
    </div>
  );
};

export default CategoryPage;