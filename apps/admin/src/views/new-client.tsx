import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { nanoid } from 'nanoid';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
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
import type { Client, ResponsePayload } from '@/types';
import { Icons } from '@/components/icons';

const registerClientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  username: z.string().min(2).max(100),
});

type RegisterClientForm = z.infer<typeof registerClientSchema>;

export const NewClient = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(registerClientSchema),
    defaultValues: { email: '', password: '', username: '' },
  });

  const { mutate: register, isLoading } = useMutation(
    ['register'],
    async (data: RegisterClientForm) => {
      const res = await axios.post<ResponsePayload<Client>>(
        '/api/v1/auth/register',
        data,
      );
      if (res.data.status === 'error') throw new Error(res.data.message);
      return res.data.result;
    },
    {
      onSuccess: (data) => {
        toast.success('client added successfully');
        navigate('/client?id=' + data.id);
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message ?? err.message);
        }
      },
    },
  );
  const generatePassword = () => {
    form.setValue('password', nanoid(10));
  };
  const copyGeneratedPassword = () => {
    navigator.clipboard.writeText(form.getValues('password'));
    toast.success('Password copied to clipboard');
  };

  return (
    <main className="container p-2 max-w-screen-xl">
      <div className="flex justify-between py-2 my-6">
        <h1 className="text-2xl">Register New Client</h1>
      </div>
      <div className="max-w-md">
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(...args) =>
              form.handleSubmit((data) => register(data))(...args)
            }
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <PasswordInput
                          placeholder="**********"
                          {...field}
                          readOnly
                          className="w-full"
                        />
                      </div>

                      <Button
                        variant={'outline'}
                        type="button"
                        onClick={generatePassword}
                      >
                        Generate
                      </Button>
                      <Button
                        variant={'outline'}
                        size={'icon'}
                        type="button"
                        onClick={copyGeneratedPassword}
                      >
                        <Icons.clipboard className="w-5 h-5" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Register Client'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};
