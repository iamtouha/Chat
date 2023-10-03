import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header';
import { AuthGuard } from '@/components/auth-guard';

export const MainLayout = () => {
  return (
    <AuthGuard>
      <Header />
      <Outlet />
    </AuthGuard>
  );
};
