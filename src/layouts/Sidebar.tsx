import React from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { toggleSidebar, setMobileDrawerOpen } from '@/stores/slices/UiSlice.reducer';
import { logoutThunk } from '@/stores/auth/auth.action';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { ItemType, MenuItemType } from 'antd/es/menu/interface';
import {
  FiGrid,
  FiShoppingBag,
  FiBox,
  FiFolder,
  FiUsers,
  FiShield,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiPieChart,
  FiLogOut,
} from 'react-icons/fi';
import { appImages } from '@/constants/app-infor';

const { Sider } = Layout;

const menuItems: ItemType<MenuItemType>[] = [
  { key: '/', label: 'Tổng quan', icon: <FiGrid className="w-4 h-4" /> },
  { key: '/orders', label: 'Quản lý đơn hàng', icon: <FiShoppingBag className="w-4 h-4" /> },
  { key: '/products', label: 'Quản lý sản phẩm', icon: <FiBox className="w-4 h-4" /> },
  { key: '/categories', label: 'Danh mục sản phẩm', icon: <FiFolder className="w-4 h-4" /> },
  { key: '/customers', label: 'Quản lý khách hàng', icon: <FiUsers className="w-4 h-4" /> },
  { key: '/analytics', label: 'Thống kê & Báo cáo', icon: <FiPieChart className="w-4 h-4" /> },
  { key: '/roles', label: 'Phân quyền & Vai trò', icon: <FiShield className="w-4 h-4" /> },
  { key: '/settings', label: 'Cài đặt hệ thống', icon: <FiSettings className="w-4 h-4" /> },
];

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const { sidebarCollapsed, mobileDrawerOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

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

  const handleLogout = async () => {
    dispatch(setMobileDrawerOpen(false));
    await dispatch(logoutThunk());
    navigate('/login');
  };

  if (isMobile) {
    return (
      <Drawer
        placement="right"
        size="100%"
        open={mobileDrawerOpen}
        onClose={() => dispatch(setMobileDrawerOpen(false))}
        closable={{
          placement: 'end'
        }}
        styles={{
          body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' },
          header: { padding: 16 }
        }}
        title={
          <div className="flex gap-4 items-center shrink-0">
            <div className="relative shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={adminName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/30"
                />
              ) : (
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-on-primary font-bold text-base ring-2 ring-primary/30">
                  {getInitials(adminName)}
                </div>
              )}

            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-on-surface truncate">{adminName}</span>
              <span className="text-xs text-on-surface-variant font-medium mt-0.5 px-2 py-0.5 rounded bg-surface-container-high w-fit">
                {primaryRole}
              </span>
            </div>
          </div>
        }
      >
        <div className="flex-1 overflow-y-auto py-2">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              navigate(key);
              dispatch(setMobileDrawerOpen(false));
            }}
            items={menuItems}
            className="border-none! bg-transparent! font-medium text-sm text-on-surface-variant"
          />
        </div>

        <div className="p-3 border-t border-outline-variant/40 bg-surface-container-low shrink-0 mt-auto">
          <Button
            danger
            type="text"
            block
            icon={<FiLogOut className="w-4 h-4" />}
            onClick={handleLogout}
            className="flex! items-center justify-start! gap-3! h-10! px-3! text-sm font-medium rounded-md!"
          >
            Đăng xuất
          </Button>
        </div>
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      trigger={null}
      width={256}
      collapsedWidth={80}
      className="bg-surface-container-low! border-r border-outline-variant/40 h-screen select-none font-sans"
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center h-16 px-4 border-b border-outline-variant/40 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0">
                <img src={appImages.logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-bold text-base text-on-surface leading-tight">
                    Ánh Dương Bakery
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    Hệ thống quản lý
                  </span>
                </div>
              )}
            </div>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            items={menuItems}
            className="border-none! bg-transparent! py-3! font-medium text-sm text-on-surface-variant"
          />
        </div>

        <div className="p-3 border-t border-outline-variant/40 bg-surface-container-low">
          <Button
            type="text"
            block
            onClick={() => dispatch(toggleSidebar())}
            className={`flex cursor-pointer items-center justify-center w-full py-2 px-3 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors ${sidebarCollapsed ? 'justify-center' : 'justify-between'
              }`}
            title={sidebarCollapsed ? 'Mở' : 'Đóng'}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-surface-container hover:bg-primary-container transition-colors">
              {sidebarCollapsed ? (
                <FiChevronRight className="w-4 h-4 text-on-surface" />
              ) : (
                <FiChevronLeft className="w-4 h-4 text-on-surface" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
