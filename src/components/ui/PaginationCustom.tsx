import React from 'react';
import { Pagination, type PaginationProps } from 'antd';
import { useIsMobile } from '@/hooks/useIsMobile';

export interface PaginationCustomProps extends PaginationProps {
  currentItemsCount?: number;
  itemLabel?: string;
  containerClassName?: string;
  showTotalText?: boolean;
}

export const PaginationCustom: React.FC<PaginationCustomProps> = ({
  currentItemsCount,
  itemLabel = 'mục',
  containerClassName = '',
  showTotalText = true,
  current,
  pageSize,
  total = 0,
  onChange,
  showSizeChanger = true,
  size,
  className = '',
  ...restProps
}) => {
  const isMobile = useIsMobile(768);

  return (
    <div
      className={`flex items-center justify-center sm:justify-between p-4 border-t border-stone-200 bg-stone-50/50 ${containerClassName}`.trim()}
    >
      {showTotalText && !isMobile && (
        <span className="text-xs text-stone-500">
          Hiển thị {currentItemsCount ?? (pageSize && current ? Math.min(pageSize, total) : total)} trên tổng số {total} {itemLabel}
        </span>
      )}
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={!isMobile && showSizeChanger}
        size={isMobile ? 'small' : size}
        className={className}
        {...restProps}
      />
    </div>
  );
};

export default PaginationCustom;
