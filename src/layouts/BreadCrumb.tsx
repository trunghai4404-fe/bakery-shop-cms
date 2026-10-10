import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';

const pathNameMap: Record<string, string> = {
  orders: 'Đơn hàng',
  products: 'Sản phẩm',
  categories: 'Danh mục sản phẩm',
  customers: 'Khách hàng',
  analytics: 'Thống kê',
  roles: 'Phân quyền',
  permissions: 'Quyền hạn',
  settings: 'Cài đặt',
  profile: 'Cá nhân',
  create: 'Tạo mới',
  add: 'Thêm mới',
  new: 'Tạo mới',
  edit: 'Chỉnh sửa',
  detail: 'Chi tiết',
  view: 'Xem chi tiết',
  logs: 'Nhật ký',
  history: 'Lịch sử',
  inventory: 'Kho hàng',
  users: 'Nhân viên',
  banners: 'Banner quảng cáo',
};

const isIdSegment = (segment: string) => {
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(segment);
  const isNumeric = /^\d+$/.test(segment);
  return isUuid || isNumeric;
};

export const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const state = location.state as { breadcrumbName?: string } | null;

  if (pathnames.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant mb-4 select-none">
        <FiHome className="w-3.5 h-3.5" />
        <span>Trang chủ</span>
        <FiChevronRight className="w-3 h-3 text-outline" />
        <span className="text-on-surface font-bold">Tổng quan</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center flex-wrap gap-2 text-xs font-medium text-on-surface-variant mb-4 select-none">
      <Link
        to="/"
        className="flex items-center gap-2 hover:text-primary transition-colors shrink-0"
      >
        <FiHome className="w-3.5 h-3.5" />
        <span>Trang chủ</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        let displayName = pathNameMap[value.toLowerCase()];

        if (!displayName) {
          if (isIdSegment(value)) {
            displayName = isLast && state?.breadcrumbName ? state.breadcrumbName : 'Chi tiết';
          } else {
            displayName = decodeURIComponent(value);
          }
        }

        return (
          <React.Fragment key={to}>
            <FiChevronRight className="w-3 h-3 text-outline shrink-0" />
            {isLast ? (
              <span className="font-bold text-on-surface capitalize truncate max-w-50">
                {displayName}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-primary transition-colors capitalize shrink-0"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default BreadCrumb;
