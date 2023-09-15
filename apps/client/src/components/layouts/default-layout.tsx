import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../ui/navbar';
import { Spinner } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../../types';
import { useUserStore } from '../../store/userStore';

type ResponseType = {
  status: string;
  result: User | undefined;
  message: string | undefined;
};

export const DefaultLayout = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { isLoading } = useQuery(
    ['profile'],
    async () => {
      const res = await axios.get<ResponseType>('/api/v1/users/profile');
      return res.data.result;
    },
    {
      onSuccess: (data) => setUser(data),
    },
  );

  if (isLoading)
    return (
      <div className="h-screen grid place-items-center">
        <Spinner size="lg" />
      </div>
    );

  if (!user) return <Navigate to={'/auth/login'} />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
