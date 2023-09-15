import { Outlet } from 'react-router-dom';
import { Navbar } from '../ui/navbar';

export const DefaultLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
