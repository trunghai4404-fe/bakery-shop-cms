import type { RouteObject } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ForgotPasswordPage from '@/features/login/ForgotPasswordPage';
import ProtectedRoute from '@/app/router/ProtectedRoutes';
import { lazy } from 'react';
import CategoryPage from '@/features/categories/pages/CategoryPage';
import ProductPage from '@/features/products/pages/ProductPage';
import ProductDetail from '@/features/products/pages/ProductDetail';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const LoginPage = lazy(() => import('@/features/login/LoginPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'orders',
        element: (
          <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
            <h1 className="text-xl font-bold">Quản lý đơn hàng</h1>
            <p className="text-sm text-on-surface-variant mt-1">Danh sách tất cả đơn hàng trong hệ thống.</p>
          </div>
        ),
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductPage />,
          },
          {
            path: 'create',
            element: <ProductDetail />,
          },
          {
            path: ':id/edit',
            element: <ProductDetail />,
          },
        ],
      },
      {
        path: 'categories',
        element: <CategoryPage />,
      },
      {
        path: 'customers',
        element: (
          <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
            <h1 className="text-xl font-bold">Quản lý khách hàng</h1>
            <p className="text-sm text-on-surface-variant mt-1">Thông tin tài khoản khách hàng.</p>
          </div>
        ),
      },
      {
        path: 'roles',
        element: (
          <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
            <h1 className="text-xl font-bold">Phân quyền & Vai trò</h1>
            <p className="text-sm text-on-surface-variant mt-1">Cấu hình vai trò nhân viên & quyền truy cập.</p>
          </div>
        ),
      },
      {
        path: 'settings',
        element: (
          <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
            <h1 className="text-xl font-bold">Cài đặt hệ thống</h1>
            <p className="text-sm text-on-surface-variant mt-1">Thiết lập cấu hình cửa hàng & cổng thanh toán.</p>
          </div>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
];