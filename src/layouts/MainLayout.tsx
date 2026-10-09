import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BreadCrumb from './BreadCrumb';

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface font-sans text-on-surface">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 bg-surface scrollbar-thin">
          <div className="mx-auto space-y-4">
            <BreadCrumb />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
