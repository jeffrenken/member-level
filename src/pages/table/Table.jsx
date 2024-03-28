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
        <div>
          #### Feature Overview <br /> **Functionality:** A dynamic table view that allows users to interact with the data in a flexible and
          intuitive manner, similar to Excel. This includes sorting, filtering, and rearranging columns, as well as performing basic
          calculations and visualizations.
        </div>
        <br />
        <div>
          #### Key Capabilities <br /> **Data Sorting and Filtering:** Users can sort data alphabetically, numerically, or based on custom
          criteria. Filtering allows users to display only the rows that meet specific conditions. <br />
          **Column and Row Manipulation:** Ability to hide, show, and rearrange columns and rows to customize the view according to user
          preferences. <br /> **Custom Views and Saves:** Users can create custom views by applying specific filters, sorts, and column
          arrangements, and save these views for future use. <br /> **Data Analysis Tools:** Incorporate basic data analysis tools, such as
          sum, average, count, and conditional formatting to highlight key data points. <br /> **Export and Import Options:** Allow users to
          export the table view to Excel or CSV formats and import data from external sources for analysis within the app. <br /> **Search
          Functionality:** A search bar enables users to quickly find specific entries within the table, enhancing usability for large
          datasets. <br /> **Conditional Formatting:** Users can set rules for conditional formatting to automatically highlight cells,
          rows, or columns based on specific criteria, such as members close to meeting or falling behind on their health measures. <br />{' '}
          **Integration with Dashboard and Reports:** Ensure the table view is seamlessly integrated with the rest of the app, allowing
          users to drill down from the dashboard into detailed data or generate reports based on the table's current view.{' '}
        </div>
        <Box mt={4}>
          <AgGrid columnDefs={columnDefs} rowData={rowData} />
        </Box>
      </Container>
    </>
  );
}
