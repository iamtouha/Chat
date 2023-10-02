import { Outlet } from 'react-router-dom';
import { Header } from '@/components/chat-header';

export const MainLayout = () => {
  return (
    <>
      <Header />

      <Outlet />
    </>
  );
};
