import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ResponsePayload, User } from '@/types';
import { useUserStore } from '@/store/userStore';
import { Icons } from '../icons';

export const GuardLayout = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { isLoading, fetchStatus } = useQuery(
    ['profile'],
    async () => {
      const res = await axios.get<ResponsePayload<User>>(
        '/api/v1/users/profile',
      );
      if (res.data.status === 'error') throw new Error(res.data.message);
      return res.data.result;
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => void setUser(data ?? null),
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response && err.response?.status > 400) {
            navigate('/auth/login');
          }
        }
      },
    },
  );

  if (isLoading || fetchStatus === 'fetching') {
    return (
      <div className="h-screen grid place-items-center">
        <Icons.spinner className="animate-spin w-12 h-12" />
      </div>
    );
  }

  if (!user) return <Navigate to={'/auth/login'} />;

  return (
    <>
      <Outlet />
    </>
  );
};
