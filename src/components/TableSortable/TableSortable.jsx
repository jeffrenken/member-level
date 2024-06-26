import { useTheme } from '@/hooks';
import { useEffect, useState } from 'react';
import { Skeleton, Box, Stack } from '@/components';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

const columnsExample = [{ label: 'Full Name', name: 'full_name', sortable: false }];

export function TableSortable({
  data,
  columns: tableColumns,
  isLoading,
  handleRowClick = null,
  activeRow,
  height = '100%',
}) {
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState(tableColumns);

  /*  useEffect(() => {
    if (tableColumns.length) {
      setColumns(tableColumns);
    }
  }, [tableColumns]); */

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...tableData].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), 'en', {
            numeric: true,
          }) * (sortOrder === 'asc' ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  return (
    <Box height={height} sx={{ overflow: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <TableHead columns={columns} handleSorting={handleSorting} setColumns={setColumns} />
        <TableBody
          columns={columns}
          tableData={tableData}
          isLoading={isLoading}
          handleRowClick={handleRowClick}
          activeRow={activeRow}
          height={height}
        />
      </table>
    </Box>
  );
}

//handleRowClick is treated like a radio button
const TableBody = ({ tableData, columns, isLoading, handleRowClick, activeRow, height }) => {
  const theme = useTheme();

  //active row is based off row having an id
  //could use i, but wasn't working for multiple on same page
  //const [activeRow, setActiveRow] = useState();

  //const [activeTable, setActiveTable] = useState();
  /*  const handleTableRowClick = (e, i, row) => {
    setActiveRow(row?.id);
    handleRowClick(e, i, row);
  }; */

  const border = `1px solid ${theme.palette.border}`;
  const fakeRowsLength = 5;

  if (isLoading) {
    return (
      <tbody>
        {[...Array(fakeRowsLength)].map((_, index) => {
          return (
            <tr key={index}>
              {columns.map((column) => {
                return (
                  <td key={column.name} style={{ padding: '6px 6px', opacity: 1 - index / fakeRowsLength }}>
                    <Skeleton />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }

  return (
    <tbody style={{ overflow: 'auto' }}>
      {tableData &&
        tableData.map((row, i) => {
          return (
            <tr
              key={row.id}
              style={{
                borderBottom: border,
                cursor: handleRowClick ? 'pointer' : 'default',
                backgroundColor: activeRow === row?.id && theme.palette.blue.light,
              }}
              onClick={(e) => handleRowClick && handleRowClick(e, i, row)}
            >
              {columns.map((column) => {
                const cellData = column?.cellRenderer
                  ? column.cellRenderer({ value: row[column.name], params: { data: row }, column })
                  : row[column.name];
                return (
                  <td key={column.name} style={{ padding: '4px 6px', fontSize: '0.875rem' }}>
                    {cellData}
                  </td>
                );
              })}
            </tr>
          );
        })}
    </tbody>
  );
};

const TableHead = ({ columns, setColumns, handleSorting }) => {
  const theme = useTheme();
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSortingChange = (name) => {
    const sortOrder = name === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(name);
    setOrder(sortOrder);
    handleSorting(name, sortOrder);
  };

  const handleColumnsChange = (index, newColumn) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      name: newColumn.name,
      label: newColumn.label,
    };
    setColumns(newColumns);
  };

  return (
    <thead
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: theme.palette.background.semiTransparent,
        zIndex: 1,
        boxShadow: `inset 0 3px 0 ${theme.palette.border}, inset 0 -3px 0 ${theme.palette.border}`,
      }}
    >
      <tr>
        {columns.map((column, i) => {
          const cl = column?.sortable
            ? sortField === column?.name && order === 'asc'
              ? 'up'
              : sortField === column?.name && order === 'desc'
              ? 'down'
              : 'default'
            : '';
          return (
            <th
              key={column?.name}
              //if using headRenderer, it must also handle sorting
              onClick={column?.sortable && !column?.headRenderer ? () => handleSortingChange(column?.name) : null}
              style={{
                cursor: column?.sortable ? 'pointer' : 'default',
                fontSize: '0.875rem',
                fontWidth: 800,
                padding: '6px 20px 6px 8px',
                width: column?.width || 'auto',
              }}
            >
              <Stack direction='row' alignItems='center' justifyContent='center' spacing={0}>
                {cl === 'up' ? <IconArrowDown size={14} /> : cl === 'down' ? <IconArrowUp size={14} /> : ' '}
                {column?.headRenderer
                  ? column?.headRenderer(column, i, () => handleSortingChange(column?.name), handleColumnsChange)
                  : column?.label}
              </Stack>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
