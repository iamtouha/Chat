import { Navigate, Outlet } from 'react-router-dom';
import { AdminHeader } from '@/components/admin-header';
import { useUserStore } from '@/store/userStore';

export const AdminLayout = () => {
  const user = useUserStore((state) => state.user);

  if (user?.role !== 'ADMIN') return <Navigate to={'/'} />;

  return (
    <>
      <AdminHeader />
      <Outlet />
    </>
  );
};
