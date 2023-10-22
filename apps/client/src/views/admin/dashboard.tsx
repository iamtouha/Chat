import { useMemo } from 'react';
import axios from '@/lib/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef, PaginationComponent, Table } from 'unstyled-table';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import type { Client, ResponsePayload } from '@/types';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: users, isLoading } = useQuery(['users'], async () => {
    const res = await axios.get<ResponsePayload<Client[]>>('/api/v1/users');
    if (res.data.status === 'error') throw new Error(res.data.message);
    return res.data.result;
  });

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        header: '#',
        id: 'index',
        cell: ({ table, row }) => {
          return table?.getSortedRowModel()?.flatRows?.indexOf(row) + 1;
        },
      },
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'username', header: 'Username' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'role', header: 'Role' },
      {
        accessorKey: 'active',
        header: () => <p className="text-center w-full"> Active</p>,
        cell: ({ getValue }) => (
          <p className="text-center"> {getValue<boolean>() ? 'Yes' : 'No'}</p>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last login',
        cell: ({ getValue }) =>
          getValue<string | undefined>()
            ? dayjs(getValue<string>()).format('DD/MM/YYYY hh:mm a')
            : '-',
      },
      {
        accessorKey: 'createdAt',
        header: 'Added at',
        cell: ({ getValue }) =>
          dayjs(getValue<string>()).format('DD/MM/YYYY hh:mm a'),
      },
    ],
    [],
  );

  return (
    <main className="container max-w-screen-xl mx-auto p-2">
      <div className="flex justify-between py-2 my-6">
        <h1 className="text-2xl">Clients</h1>
        <Link to="/admin/new-client">
          <Button>Add New Client</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        state={{ columnVisibility: { id: false } }}
        data={users ?? []}
        renders={{
          table: ({ children }) => <TableComponent>{children}</TableComponent>,
          header: ({ children }) => <TableHeader>{children}</TableHeader>,
          headerCell: ({ children }) => <TableHead>{children}</TableHead>,
          headerRow: ({ children }) => <TableRow>{children}</TableRow>,
          body: ({ children }) => (
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Icons.spinner className="animate-spin w-8 h-8 m-4" />
                  </TableCell>
                </TableRow>
              ) : (
                children
              )}
            </TableBody>
          ),
          bodyCell: TableCell,
          bodyRow: ({ children, row }) => (
            <TableRow
              className="cursor-pointer"
              onClick={() => navigate(`/admin/client?id=${row.original.id}`)}
            >
              {children}
            </TableRow>
          ),
          filterInput: ({ props }) => <Input {...props} className="h-8 my-1" />,
          paginationBar: (props) => (
            <PaginationComponent
              {...props}
              gotoPageInput={({ props }) => (
                <Input {...props} className="w-24 h-8" />
              )}
              perpageSelect={({ props, itemsPerPageOptions }) => (
                <select
                  {...props}
                  className="flex h-18 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            />
          ),
        }}
      ></Table>
    </main>
  );
};
