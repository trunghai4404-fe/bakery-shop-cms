import React from 'react';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Tổng quan hệ thống</h1>
        <p className="text-sm text-on-surface-variant">Thống kê hoạt động kinh doanh cửa hàng bánh hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-on-surface-variant">Doanh thu hôm nay</p>
            <p className="text-xl font-bold text-on-surface mt-1">4.850.000 ₫</p>
            <span className="inline-flex items-center gap-1 text-xs text-success font-medium mt-1">
              <FiTrendingUp className="w-3 h-3" /> +12.5% so với hôm qua
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
            <FiDollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-on-surface-variant">Đơn hàng mới</p>
            <p className="text-xl font-bold text-on-surface mt-1">32 đơn</p>
            <span className="inline-flex items-center gap-1 text-xs text-success font-medium mt-1">
              <FiTrendingUp className="w-3 h-3" /> +8 đơn chờ xử lý
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
            <FiShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-on-surface-variant">Khách hàng mới</p>
            <p className="text-xl font-bold text-on-surface mt-1">15 khách</p>
            <span className="inline-flex items-center gap-1 text-xs text-success font-medium mt-1">
              <FiTrendingUp className="w-3 h-3" /> +5% tuần này
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold">
            <FiUsers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-on-surface-variant">Bánh bán chạy</p>
            <p className="text-xl font-bold text-on-surface mt-1">Bánh Tiramisu</p>
            <span className="text-xs text-on-surface-variant mt-1 block">45 phần đã bán</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center text-xl">
            🍰
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">Đơn hàng gần đây</h2>
          <button className="text-xs font-semibold text-primary hover:underline">Xem tất cả</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant bg-surface-container-low">
                <th className="py-2.5 px-3">Mã đơn</th>
                <th className="py-2.5 px-3">Khách hàng</th>
                <th className="py-2.5 px-3">Sản phẩm</th>
                <th className="py-2.5 px-3">Tổng tiền</th>
                <th className="py-2.5 px-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {[
                { id: '#BK-1092', name: 'Nguyễn Văn A', item: 'Bánh Kem Dâu Tây (Size M)', total: '350.000 ₫', status: 'Hoàn thành', color: 'bg-success-container text-on-success-container' },
                { id: '#BK-1091', name: 'Trần Thị B', item: 'Bánh Mì Sừng Bò Croissant x4', total: '120.000 ₫', status: 'Đang giao', color: 'bg-warning-container text-on-warning-container' },
                { id: '#BK-1090', name: 'Lê Văn C', item: 'Bánh Tiramisu Ca Cao', total: '280.000 ₫', status: 'Chờ xử lý', color: 'bg-primary-container text-on-primary-container' },
                { id: '#BK-1089', name: 'Phạm Minh D', item: 'Bánh Bông Lan Trứng Muối', total: '220.000 ₫', status: 'Hoàn thành', color: 'bg-success-container text-on-success-container' },
                { id: '#BK-1088', name: 'Hoàng Anh E', item: 'Bánh Macaron Hộp 6 Cái', total: '180.000 ₫', status: 'Hoàn thành', color: 'bg-success-container text-on-success-container' },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-on-surface">{row.id}</td>
                  <td className="py-3 px-3">{row.name}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{row.item}</td>
                  <td className="py-3 px-3 font-medium">{row.total}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md ${row.color}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
