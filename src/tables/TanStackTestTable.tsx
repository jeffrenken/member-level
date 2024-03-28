import React from 'react';

import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { makeData, Person } from './makeData';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function App() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: (info) => info.getValue(),
        enableResizing: false, //disable resizing for just this column
        size: 200 //starting column size
        //footer: (props) => props.column.id
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
        size: 200 //starting column size
      },
      /*       {
        header: 'Name',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'firstName',
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id
          },
          {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            cell: (info) => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: (props) => props.column.id
          }
        ]
      }, */

      {
        accessorKey: 'createdAt',
        header: 'Created At',
        //enableResizing: false, //disable resizing for just this column
        size: 80 //starting column size
      }
    ],
    []
  );

  const [data, setData] = React.useState(() => makeData(100000));
  const refreshData = () => setData(() => makeData(100000));

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                      cursor: header.column.getCanSort() ? 'pointer' : undefined
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <Stack
                        onClick={header.column.getToggleSortingHandler()}
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center"
                        //width="100%"
                      >
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                        <div>
                          {{
                            asc: <IconArrowUp size={18} />,
                            desc: <IconArrowDown size={18} />
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </Stack>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
