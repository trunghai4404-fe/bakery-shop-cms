import React from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { logoutThunk } from '@/stores/auth/auth.action';
import { toggleMobileDrawer } from '@/stores/slices/UiSlice.reducer';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiChevronDown, FiMenu } from 'react-icons/fi';
import { appImages } from '@/constants/app-infor';
import { useIsMobile } from '@/hooks/useIsMobile';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };

  const adminName = user?.fullName || 'Admin';
  const primaryRole = user?.roles?.[0] || 'Admin';
  const getInitials = (name: string) => {
    if (!name) return 'A';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <FiLogOut className="w-4 h-4" />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (isMobile) {
    return (
      <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-surface-bright/80 backdrop-blur-md border-b border-outline-variant/40 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0">
            <img src={appImages.logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-sm text-on-surface truncate">
            Ánh Dương Bakery
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            title="Thông báo"
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-bright" />
          </button>

          <button
            onClick={() => dispatch(toggleMobileDrawer())}
            className="flex items-center justify-center p-2 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            title="Mở menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-end h-16 px-6 bg-surface-bright/80 backdrop-blur-md border-b border-outline-variant/40 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          title="Thông báo"
        >
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-bright" />
        </button>

        <div className="h-6 w-px bg-outline-variant/40" />

        <Dropdown menu={{ items }} placement="bottomRight" trigger={['hover']}>
          <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={adminName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30"
                />
              ) : (
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-on-primary font-bold text-sm ring-2 ring-primary/30">
                  {getInitials(adminName)}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-surface-bright" />
            </div>

            <div className="flex flex-col items-start text-left leading-tight">
              <span className="text-sm font-semibold text-on-surface line-clamp-1">
                {adminName}
              </span>
              <span className="text-[11px] font-medium text-on-surface-variant px-1.5 py-0.2 rounded bg-surface-container-high mt-0.5">
                {primaryRole}
              </span>
            </div>

            <FiChevronDown className="w-4 h-4 text-on-surface-variant" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
