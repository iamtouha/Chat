import { z } from 'zod';
import dayjs from 'dayjs';
import axios, { AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/password-input';
import type { ResponsePayload, User } from '@/types';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';

const updateAccountSchema = z.object({
  email: z.string().email(),
});
const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

type UpdateAccountForm = z.infer<typeof updateAccountSchema>;
type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

export const Account = () => {
  const user = useUserStore((state) => state.user);

  const form = useForm<UpdateAccountForm>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: { email: user?.email ?? '' },
  });

  const passwordForm = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { newPassword: '', currentPassword: '' },
  });

  const { data: size, isLoading } = useQuery(
    ['storagesize', user?.id],
    async () => {
      if (!user?.id) throw new Error('No client id provided');
      const res = await axios.get<ResponsePayload<number>>(
        '/api/v1/files/storage?client=' + user.id,
      );
      if (res.data.status === 'error') throw new Error(res.data.message);
      return res.data.result;
    },
  );

  const { mutate: updateAccount, isLoading: updateAccountLoading } =
    useMutation(
      ['update-user', user?.id],
      async (data: UpdateAccountForm) => {
        if (!user) throw new Error('No user provided');
        const res = await axios.put<ResponsePayload<User>>(
          `/api/v1/users/update`,
          data,
        );
        if (res.data.status === 'error') throw new Error(res.data.message);
        return res.data.result;
      },
      {
        onSuccess: () => {
          toast.success('Account updated successfully');
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data.message ?? err.message);
          }
        },
      },
    );
  const { mutate: updatePassword, isLoading: updatePasswordLoading } =
    useMutation(
      ['update-password', user?.id],
      async (data: UpdatePasswordForm) => {
        if (!user) throw new Error('No user provided');
        const res = await axios.put<ResponsePayload<User>>(
          `/api/v1/users/update-password`,
          data,
        );
        if (res.data.status === 'error') throw new Error(res.data.message);
        return res.data.result;
      },
      {
        onSuccess: () => {
          toast.success('Password updated successfully');
          passwordForm.reset();
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data.message ?? err.message);
          }
        },
      },
    );

  if (!user) return null;

  return (
    <main className="container p-2 max-w-screen-xl">
      <div className="my-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl">{user.username}</h1>
            <p>{user.email}</p>
          </div>
          <Button variant={'outline'} className="cursor-default">
            <span
              className={cn(
                'w-3 h-3 rounded-full',
                user.active ? 'bg-success' : 'bg-destructive',
              )}
            ></span>
            <span className="ml-2">{user.active ? 'Active' : 'Inactive'}</span>
          </Button>
        </div>
        <p>
          account created on:{' '}
          {dayjs(user.createdAt).format('hh:mm a, MMM DD, YYYY ')}
        </p>
        <p>
          last logged on:{' '}
          {dayjs(user.lastLogin).format('hh:mm a, MMM DD, YYYY ')}
        </p>
      </div>
      <div className="my-6">
        <p>Storage Usage</p>
        <p className="text-2xl">
          {isLoading
            ? 'loading...'
            : `${((size ?? 0) / (1024 * 1024)).toFixed(2)} MB`}
        </p>
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(...args) =>
              form.handleSubmit((data) => updateAccount(data))(...args)
            }
          >
            <h2 className="text-xl">Update Account</h2>
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input value={user.username} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6">
              <Button disabled={updateAccountLoading}>
                {updateAccountLoading ? 'Loading...' : 'Update Account'}
              </Button>
            </div>
          </form>
        </Form>
        <Form {...passwordForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(...args) =>
              passwordForm.handleSubmit((data) => updatePassword(data))(...args)
            }
          >
            <h2 className="text-xl">Update Password</h2>
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <PasswordInput
                          placeholder="**********"
                          {...field}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <PasswordInput
                          placeholder="**********"
                          {...field}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6">
              <Button disabled={updatePasswordLoading}>
                {updatePasswordLoading ? 'Loading...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div></div>
    </main>
  );
};
