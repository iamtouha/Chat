import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn, useQueryparams } from '@/lib/utils';
import { ResponsePayload, Client } from '@/types';
import { PasswordInput } from '@/components/password-input';

export const ClientView = () => {
  const [confirmRemove, setConfirmRemove] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const params = useQueryparams();

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
  );

  const { mutate: changeClientRole, isLoading: changeClientRoleLoading } =
    useMutation(
      ['change-role', client?.id, client?.role],
      async () => {
        if (!client) throw new Error('No client provided');
        const res = await axios.put<ResponsePayload<Client>>(
          `/api/v1/users/${client.id}/${
            client?.role === 'ADMIN' ? 'remove-admin' : 'make-admin'
          }`,
        );
        if (res.data.status === 'error') throw new Error(res.data.message);
        return res.data.result;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['clients', client?.id]);
          toast.success('Client role updated successfully');
        },
        onError: () => toast.error('Failed to update client role'),
      },
    );

  const {
    mutate: changeClientActivity,
    isLoading: changeClientActivityLoading,
  } = useMutation(
    ['activity', client?.id, client?.active],
    async () => {
      if (!client) throw new Error('No client provided');
      const res = await axios.put<ResponsePayload<Client>>(
        `/api/v1/users/${client.id}/${
          client.active ? 'deactivate' : 'activate'
        }`,
      );
      if (res.data.status === 'error') throw new Error(res.data.message);
      return res.data.result;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['clients', client?.id]);
        toast.success(
          `Client ${data.active ? 'activated' : 'deactivated'} successfully`,
        );
      },
      onError: () => toast.error('Failed to update client activity'),
    },
  );

  const { mutate: removeClient, isLoading: removeClientLoading } = useMutation(
    ['clients', client?.id],
    async () => {
      if (!client) throw new Error('No client provided');
      const res = await axios.delete<ResponsePayload<Client>>(
        `/api/v1/users/${client.id}`,
      );
      if (res.data.status === 'error') throw new Error(res.data.message);
      return res.data.result;
    },
    {
      onSuccess: () => {
        toast.success('Client removed successfully');
        queryClient.invalidateQueries(['clients']);
        navigate('/');
      },
      onError: (err) => {
        setConfirmRemove(false);
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message ?? err.message);
          return;
        }
        toast.error(
          (err as Error)?.message ?? 'Failed to remove client, try again',
        );
      },
    },
  );
  const copyApiKey = () => {
    navigator.clipboard.writeText(client?.id ?? '');
    toast.success('API key copied to clipboard');
  };

  return (
    <main className="container mx-auto p-2 max-w-screen-xl">
      {isLoading ? (
        <div className="py-10">
          <Icons.spinner className="animate-spin w-10 h-10 mx-auto" />
        </div>
      ) : client ? (
        <div>
          <div className="flex gap-6 flex-col md:flex-row mt-6 pt-2">
            <div className="flex-1">
              <h1 className="text-2xl">{client.username}</h1>
              <h2 className="text-base">{client.email}</h2>
              <p className="mt-3 text-sm">
                Created at:&nbsp;
                {dayjs(client.createdAt).format('DD/MM/YYYY hh:mm a')}
              </p>
              {client.lastLogin ? (
                <p className="text-sm">
                  Last login:&nbsp;
                  {dayjs(client.lastLogin).format('DD/MM/YYYY hh:mm a')}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2 flex-row-reverse md:flex-row justify-end">
              {client.role === 'ADMIN' ? (
                <Button
                  variant={'outline'}
                  size={'icon'}
                  className="cursor-default"
                >
                  <Icons.shieldCheck className="w-5 h-5" />
                </Button>
              ) : null}
              <Button variant={'outline'} className="cursor-default">
                <span
                  className={cn(
                    'w-3 h-3 rounded-full',
                    client.active ? 'bg-success' : 'bg-destructive',
                  )}
                ></span>
                <span className="ml-2">
                  {client.active ? 'Active' : 'Inactive'}
                </span>
              </Button>
              <DropdownMenu
                onOpenChange={(open) => open || setConfirmRemove(false)}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="relative">
                    Actions <Icons.chevronDown className="ml-2 mt-1 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44" align="end" forceMount>
                  <DropdownMenuLabel className="p-0.5">
                    <Link to={`/update-client?id=${params.get('id')}`}>
                      <Button variant={'ghost'} size="sm" className="w-full">
                        Update client
                      </Button>
                    </Link>
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="p-0.5">
                    <Button
                      variant={'ghost'}
                      size="sm"
                      className="w-full"
                      disabled={changeClientRoleLoading}
                      onClick={() => changeClientRole()}
                    >
                      {client.role === 'ADMIN' ? 'Remove admin' : 'Make admin'}
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="p-0.5">
                    <Button
                      variant={'ghost'}
                      size="sm"
                      className="w-full"
                      disabled={changeClientActivityLoading}
                      onClick={() => changeClientActivity()}
                    >
                      {client.active ? 'Deactivate client' : 'Activate client'}
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="p-0.5">
                    {confirmRemove ? (
                      <Button
                        variant={'destructive'}
                        size="sm"
                        className="w-full px-1"
                        disabled={removeClientLoading}
                        onClick={() => removeClient()}
                      >
                        Click again to confirm
                      </Button>
                    ) : (
                      <Button
                        variant={'ghost'}
                        size="sm"
                        className="w-full text-destructive hover:text-destructive"
                        onClick={() => setConfirmRemove(true)}
                      >
                        Remove client
                      </Button>
                    )}
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div>
            <div className="max-w-md w-full mt-6 flex gap-2">
              <div className="flex-1">
                <PasswordInput value={client.id} readOnly className="w-full" />
              </div>
              <Button variant={'outline'} onClick={copyApiKey}>
                Copy API key
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <h1>Client not found</h1>
        </div>
      )}
    </main>
  );
};
