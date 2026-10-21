import React from 'react';
import { Card, type CardProps, Tooltip, Button } from 'antd';
import { RightOutlined, EyeOutlined } from '@ant-design/icons';

export interface CardCustomProps extends CardProps {
  clickable?: boolean;
  onViewDetail?: () => void;
  showDetailAction?: boolean;
  detailTooltip?: string;
  detailActionType?: 'eye' | 'arrow';
}

export const CardCustom: React.FC<CardCustomProps> = ({
  children,
  className = '',
  classNames,
  clickable = false,
  onClick,
  onViewDetail,
  showDetailAction = false,
  detailTooltip = 'Xem chi tiết',
  detailActionType = 'eye',
  extra,
  title,
  ...restProps
}) => {
  const isClickable = clickable || Boolean(onClick) || Boolean(onViewDetail);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onViewDetail) {
      onViewDetail();
    }
    onClick?.(e);
  };

  const resolvedExtra = React.useMemo(() => {
    if (extra !== undefined) return extra;

    if (showDetailAction && (onViewDetail || onClick)) {
      return (
        <Tooltip title={detailTooltip}>
          <Button
            type="text"
            size="small"
            className="text-stone-400 hover:text-amber-700 -mr-2"
            icon={
              detailActionType === 'arrow' ? (
                <RightOutlined className="text-xs" />
              ) : (
                <EyeOutlined className="text-sm" />
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetail) {
                onViewDetail();
              } else {
                onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }}
          />
        </Tooltip>
      );
    }

    return null;
  }, [extra, showDetailAction, onViewDetail, onClick, detailTooltip, detailActionType]);

  const cardClasses = [
    'rounded-xl! border border-stone-200 bg-white shadow-xs overflow-hidden transition-all duration-200',
    isClickable
      ? 'cursor-pointer hover:border-amber-300 hover:shadow-sm hover:bg-stone-50/40 active:bg-stone-100/60'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card
      size="small"
      title={title}
      extra={resolvedExtra}
      onClick={isClickable ? handleClick : undefined}
      className={cardClasses}
      classNames={{
        header: 'px-4! py-2! min-h-0! border-b! border-stone-200! text-stone-800 font-semibold',
        title: 'text-sm font-semibold text-stone-800 truncate m-0',
        extra: 'm-0 text-xs flex items-center',
        body: 'p-4! text-stone-600',
        actions: 'border-t! border-stone-200! bg-stone-50/50',
        ...classNames,
      }}
      {...restProps}
    >
      {children}
    </Card>
  );
};

export default CardCustom;
