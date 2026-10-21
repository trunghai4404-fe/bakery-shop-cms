import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Button, Tabs, Tag, Switch, Spin, Space, Empty, Row, Col, Flex, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useProductDetail } from '../hooks/useProducts';
import { AccessoryItemCard } from './AccessoryItemCard';
import { CardCustom } from '@/components/ui/CardCustom';
import { formatCurrency, formatTime, DATE_TIME_FORMATS } from '@/lib/helper';
import { appImages } from '@/constants/app-infor';

interface ProductDrawerProps {
  open: boolean;
  productId?: number | null;
  onClose: () => void;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({ open, productId, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');

  const { data: product, isLoading } = useProductDetail(productId);

  const images = product?.images || [];
  const variants = product?.variants || [];
  const accessories = product?.accessories || [];

  const primaryImg = images.find((img) => img.isPrimary) || images[0];

  const variantColumns: ColumnsType<(typeof variants)[number]> = [
    {
      title: 'Tên biến thể',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className="font-medium text-stone-800">{name}</span>,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (sku: string) => <span className="text-xs font-bold">{sku}</span>,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span className="font-semibold text-amber-700">{formatCurrency(price)}</span>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
    {
      title: 'Bán',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Switch size="small" checked={isActive} disabled className="bg-stone-300" />
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">Chi tiết sản phẩm</span>
          {product && (
            <Tag color={product.isActive ? 'success' : 'default'} className="m-0">
              {product.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
            </Tag>
          )}
        </div>
      }
      size={900}
      open={open}
      onClose={onClose}
      closable={{ placement: 'end' }}
      destroyOnHidden
      footer={
        productId ? (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => { onClose(); navigate(`/products/${productId}/edit`); }}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold border-none"
            >
              Chỉnh sửa sản phẩm
            </Button>
          </Space>
        ) : null
      }
      classNames={{ body: 'p-0!', header: 'p-4!', footer: 'flex justify-end' }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" description="Đang tải thông tin sản phẩm..." />
        </div>
      ) : !product ? (
        <div className="flex justify-center items-center py-20">
          <Empty description="Không tìm thấy sản phẩm" />
        </div>
      ) : (
        <div className='p-4'>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            // type="line"
            size="small"
            moreIcon={null}
            items={[
              {
                key: '1',
                label: (
                  <span className={`flex items-center gap-1.5 ${activeTab === '1' ? 'font-bold text-on-primary-container' : 'text-stone-600'}`}>
                    Thông tin sản phẩm
                  </span>
                ),
                children: (
                  <div className="space-y-5">
                    <div className="flex items-start gap-4 pb-4 border-b border-outline-variant/80">
                      <img
                        src={primaryImg?.desktopUrl || primaryImg?.mobileUrl || appImages.placeholder}
                        alt={product.name}
                        className="w-24 h-24 rounded-xl object-cover border border-stone-200 shadow-sm shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = appImages.placeholder; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-stone-900 leading-snug">{product.name}</h2>
                        <p className="text-xs font-mono text-stone-400 mt-0.5">/{product.slug}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.categories?.map((c) => (
                            <Tag key={c.categoryId} color="gold" className="text-xs m-0">{c.name}</Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Row
                      gutter={[24, 16]}
                    >
                      <Col span={12}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                            <span>Mã sản phẩm (SKU)</span>
                          </div>
                          <span className="text-sm font-semibold text-stone-800 font-mono mt-0.5">
                            {product.sku || '—'}
                          </span>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                            <span>Trạng thái</span>
                          </div>
                          <div className="mt-0.5">
                            <Tag
                              color={product.isActive ? 'success' : 'default'}
                              className="m-0 font-medium text-xs"
                            >
                              {product.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                            </Tag>
                          </div>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                            <CalendarOutlined className="text-stone-400" />
                            <span>Ngày tạo</span>
                          </div>
                          <span className="text-sm font-medium text-stone-700 mt-0.5">
                            {formatTime(product.createdAt, DATE_TIME_FORMATS.DATETIME)}
                          </span>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                            <ReloadOutlined className="text-stone-400" />
                            <span>Cập nhật lần cuối</span>
                          </div>
                          <span className="text-sm font-medium text-stone-700 mt-0.5">
                            {formatTime(product.lastModifiedAt, DATE_TIME_FORMATS.DATETIME)}
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Flex vertical>
                      <span className='font-medium text-base mb-2'>Mô tả</span>
                      <div
                        className="prose prose-sm max-w-none text-stone-700 text-sm"
                        dangerouslySetInnerHTML={{ __html: product.description || '' }}
                      />
                    </Flex>
                  </div>
                ),
              },
              {
                key: '2',
                label: (
                  <span className={`flex items-center gap-1.5 ${activeTab === '2' ? 'font-bold text-on-primary-container' : 'text-stone-600'}`}>
                    Hình ảnh ({images.length})
                  </span>
                ),
                children: (
                  <div className="">
                    {images.length === 0 ? (
                      <Empty description="Chưa có hình ảnh" className="py-8" />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden border-2 shadow-sm ${img.isPrimary ? 'border-amber-400' : 'border-stone-200'}`}
                          >
                            <img
                              src={img.desktopUrl || img.mobileUrl || appImages.placeholder}
                              alt={`Ảnh ${idx + 1}`}
                              className="w-full aspect-square object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = appImages.placeholder; }}
                            />
                            {img.isPrimary && (
                              <span className="absolute top-1.5 left-1.5 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                Chính
                              </span>
                            )}
                            <div className="px-2 py-1 bg-white text-center">
                              <p className="text-[11px] text-stone-500 font-medium">Ảnh #{idx + 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: '3',
                label: (
                  <span className={`flex items-center gap-1.5 ${activeTab === '3' ? 'font-bold text-on-primary-container' : 'text-stone-600'}`}>
                    Các loại sản phẩm ({variants.length})
                  </span>
                ),
                children: (
                  <div className="">
                    {variants.length === 0 ? (
                      <Empty description="Chưa có biến thể" className="py-8" />
                    ) : (
                      <>
                        <div className="flex flex-col gap-2 sm:hidden">
                          {variants.map((v, idx) => (
                            <CardCustom
                              key={idx}
                              title={<span className="font-semibold text-stone-800 text-sm leading-snug">{v.name}</span>}
                              extra={<Switch size="small" checked={v.isActive} disabled className="bg-stone-300" />}
                              classNames={{ body: 'p-3!' }}
                            >
                              <div className="flex flex-col gap-3 text-xs text-stone-500">
                                <span>
                                  SKU:{' '}
                                  <span className="text-black font-bold">
                                    {v.sku}
                                  </span>
                                </span>
                                <div className="flex gap-4 justify-between">
                                  <span>
                                    Giá:{' '}
                                    <span className="font-bold text-amber-700">{formatCurrency(v.price)}</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    Tồn kho:{' '}
                                    <span className="font-bold text-black">{v.stockQuantity}</span>
                                  </span>
                                </div>
                              </div>
                            </CardCustom>
                          ))}
                        </div>
                        <div className="hidden sm:block">
                          <Table
                            columns={variantColumns}
                            dataSource={variants}
                            rowKey={(v) => v.sku ?? String(v.name)}
                            pagination={false}
                            size="small"
                            className="rounded-xl overflow-hidden border border-stone-200"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ),
              },
              {
                key: '4',
                label: (
                  <span className={`flex items-center gap-1.5 ${activeTab === '4' ? 'font-bold text-on-primary-container' : 'text-stone-600'}`}>
                    Phụ kiện đính kèm ({accessories.length})
                  </span>
                ),
                children: (
                  <div className="flex flex-col gap-4">
                    {accessories.length === 0 ? (
                      <Empty description="Chưa có phụ kiện đính kèm" className="py-8" />
                    ) : (
                      accessories.map((acc: any, aIdx) => (
                        <AccessoryItemCard
                          key={aIdx}
                          acc={{
                            accessoryProductId: acc.accessoryProductId,
                            defaultQuantity: acc.defaultQuantity ?? 1,
                            isIncluded: acc.isIncluded ?? true,
                            sortOrder: acc.sortOrder ?? 0,
                            isMultiSelect: acc.isMultiSelect ?? false,
                            maxSelectCount: acc.maxSelectCount ?? 1,
                            isRequired: acc.isRequired ?? false,
                            categoryId: acc.categoryId || acc.categories?.[0]?.categoryId,
                            selectedProduct: {
                              id: acc.accessoryProductId,
                              name: acc.name,
                              sku: acc.sku,
                              price: acc.price || acc.variants?.[0]?.price || 0,
                            },
                          }}
                          aIdx={aIdx}
                          currentProductId={productId || undefined}
                          isReadOnly
                        />
                      ))
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </Drawer>
  );
};
