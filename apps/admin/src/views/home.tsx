import { useMemo } from 'react';
import { ColumnDef, PaginationComponent, Table } from 'unstyled-table';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ResponsePayload, User } from '@/types';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';

export const Home = () => {
  const { data: users, isLoading } = useQuery(['users'], async () => {
    const res = await axios.get<ResponsePayload<User[]>>('/api/v1/users');
    if (res.data.status === 'error') throw new Error(res.data.message);
    return res.data.result;
  });
  console.log(users);
  const columns = useMemo<ColumnDef<User>[]>(
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
      { accessorKey: 'lastLogin', header: 'Last login' },
      { accessorKey: 'createdAt', header: 'Created at' },
    ],
    [],
  );

  return (
    <main className="container mx-auto p-2">
      <Table
        columns={columns}
        state={{ columnVisibility: { id: false } }}
        data={users ?? []}
        renders={{
          table: ({ children }) => <TableComponent>{children}</TableComponent>,
          header: ({ children }) => <TableHeader>{children}</TableHeader>,
          headerCell: ({ children }) => <TableHead>{children}</TableHead>,
          headerRow: ({ children }) => <TableRow>{children}</TableRow>,
          body: ({ children, rowModel }) => (
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={rowModel.rows[0]?.getVisibleCells().length}
                    align="center"
                  >
                    <Icons.spinner className="animate-spin w-8 h-8 m-4" />
                  </TableCell>
                </TableRow>
              ) : (
                children
              )}
            </TableBody>
          ),
          bodyCell: TableCell,
          bodyRow: TableRow,
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
