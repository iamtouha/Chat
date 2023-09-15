import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Header } from '@/components/header';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { User } from '@/types';
import { useUserStore } from '@/store/userStore';
import { Icons } from '../icons';

type ResponseType = {
  status: string;
  result: User | undefined;
  message: string | undefined;
};

export const DefaultLayout = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { isLoading } = useQuery(
    ['profile'],
    async () => {
      const res = await axios.get<ResponseType>('/api/v1/users/profile');
      return res.data.result;
    },
    {
      onSuccess: (data) => setUser(data ?? null),
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response && err.response?.status > 400) {
            navigate('/auth/login');
          }
        }
      },
    },
  );

  if (isLoading)
    return (
      <div className="h-screen grid place-items-center">
        <Icons.spinner className="animate-spin w-12 h-12" />
      </div>
    );

  if (!user) return <Navigate to={'/auth/login'} />;

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
