import AgGrid from '@/components/tables/AgGrid';
import { Box, Container } from '@mui/material';
import { useState } from 'react';
import { getData } from '@/components/tables/data';

export default function Table() {
  const [rowData, setRowData] = useState(getData());

  /* function cellStyling(params) {
      if (checked && params.value > 1000000) {
        //mark police cells as red
        return { color: 'green' };
      }
      //have to explicitly reset the value
      return { color: 'black' };
    } */

  const columnDefs = [
    {
      field: 'symbol',
      filter: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 140
    },
    { field: 'name', filter: true, chartDataType: 'category' },
    {
      field: 'price',
      headerName: 'Price w/ css',
      type: 'numericColumn',
      maxWidth: 140,
      chartDataType: 'series',
      filter: true
      /* cellStyle: (params) => {
          return cellStyling(params);
        } */
    },
    { field: 'change', cellRenderer: 'agSparklineCellRenderer' },
    {
      field: 'change',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          type: 'area',
          fill: 'rgba(216, 204, 235, 0.3)',
          line: {
            stroke: 'rgb(119,77,185)'
          },
          highlightStyle: {
            fill: 'rgb(143,185,77)'
          },
          axis: {
            stroke: 'rgb(204, 204, 235)'
          }
        }
      }
    }
  ];

  return (
    <>
      <Container maxWidth="xl">
        <Box mt={4} sx={{ height: 'calc(100vh - 100px)' }}>
          <AgGrid columnDefs={columnDefs} rowData={rowData} />
        </Box>
      </Container>
    </>
  );
}
