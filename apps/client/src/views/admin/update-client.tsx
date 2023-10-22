import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryparams } from '@/lib/utils';
import { nanoid } from 'nanoid';
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
import { Icons } from '@/components/icons';
import type { Client, ResponsePayload } from '@/types';

const updateClientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100).optional(),
});

type UpdateClientForm = z.infer<typeof updateClientSchema>;

export const UpdateClient = () => {
  const navigate = useNavigate();
  const params = useQueryparams();

  const form = useForm<UpdateClientForm>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: { email: '' },
  });

  const { data: client, isLoading } = useQuery(
    ['clients', params.get('id')],
    async () => {
      const id = params.get('id');
      if (!id) throw new Error('No client id provided');
      const res = await axios.get<ResponsePayload<Client>>(
        '/api/v1/users/' + id,
      );
      if (res.data.status === 'error') throw new Error(res.data.message);
      return res.data.result;
    },
    {
      onSuccess: (data) => {
        form.setValue('email', data.email);
      },
    },
  );

  const { mutate: updateClient, isLoading: updateClientLoading } = useMutation(
    ['update-client', client?.id],
    async (data: UpdateClientForm) => {
      if (!client) throw new Error('No client provided');
      const res = await axios.put<ResponsePayload<Client>>(
        `/api/v1/users/${client.id}`,
        data,
      );
      if (res.data.status === 'error') throw new Error(res.data.message);
      return res.data.result;
    },
    {
      onSuccess: (data) => {
        toast.success('Client updated successfully');
        navigate(`/admin/client?id=${data.id}`);
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
    navigator.clipboard.writeText(form.getValues('password') ?? '');
    toast.success('Password copied to clipboard');
  };

  return (
    <main className="container p-2 max-w-screen-xl">
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <Icons.spinner className="w-10 h-10 animate-spin" />
        </div>
      ) : client ? (
        <>
          <div className="flex justify-between py-2 my-6">
            <h1 className="text-2xl">Update {client.username}</h1>
          </div>
          <div className="max-w-md">
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={(...args) =>
                  form.handleSubmit((data) => updateClient(data))(...args)
                }
              >
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input value={client.username} readOnly />
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Update Password</FormLabel>
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
                <div className="mt-6">
                  <Button disabled={updateClientLoading}>
                    {updateClientLoading ? 'Loading...' : 'Update Client'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </>
      ) : null}
    </main>
  );
};
