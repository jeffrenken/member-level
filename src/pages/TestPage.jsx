import { useMembers, useProviders } from '@/api';
import { useMembersPaginated } from '@/api/useMembersPaginated';
import { axiosClient } from '@/api/requests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the Data Grid
import { useRef, useState, useCallback } from 'react';
import { Container } from '@/components/ui';

export default function TestPage() {
  const gridRef = useRef();
  const { data: members } = useMembersPaginated();

  const datasource = {
    getRows(params) {
      console.log(JSON.stringify(params.request, null, 1));
      axiosClient
        .post('/members-paginated')
        .then((response) => {
          console.log('response', response);
        })
        .then((httpResponse) => httpResponse.json())
        .then((response) => {
          params.successCallback(response.rows, response.lastRow);
        })
        .catch((error) => {
          console.error(error);
          params.failCallback();
        });

      /* fetch('./olympicWinners/', {
        method: 'post',
        body: JSON.stringify(params.request),
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      })
        .then((httpResponse) => httpResponse.json())
        .then((response) => {
          params.successCallback(response.rows, response.lastRow);
        })
        .catch((error) => {
          console.error(error);
          params.failCallback();
        }); */
    }
  };

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: 'FIRST NAME' },
    { field: 'LAST NAME' },
    { field: 'CITY', enableRowGroup: true },
    { field: 'COUNTY', enableRowGroup: true },
    { field: 'STATE', enableRowGroup: true },
    { field: 'ZIP CODE', enableRowGroup: true },
    { field: 'PHONE NUMBER' },
    { field: 'EMAIL ADDRESS' },
    { field: 'SEX' },
    { field: 'RACE' },
    { field: 'ETHNICITY' },
    { field: 'PRIMARY LANGUAGE' }
  ]);

  const getData = () => {
    return {
      getRows(params) {
        console.log(JSON.stringify(params.request, null, 1));
        axiosClient
          .post('/members-paginated', params.request)
          .then((response) => {
            console.log('response', response);
            let data = response.data;
            params.success({
              rowData: data.rows,
              rowCount: data.lastRow
            });
          })
          .catch((error) => {
            console.error(error);
            params.failCallback();
          });
      }
    };
  };

  const onGridReady = useCallback((params) => {
    // create datasource with a reference to the fake server
    var datasource = getData();
    console.log('datasource', datasource);
    // register the datasource with the grid
    params.api.setGridOption('serverSideDatasource', datasource);
  }, []);
  return (
    // wrapping container with theme & size
    <Container maxWidth="lg">
      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500, marginTop: 20 }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={colDefs}
          rowModelType={'serverSide'}
          onGridReady={onGridReady}
          rowGroupPanelShow="always"
          groupDisplayType="groupRows"
        />
      </div>
    </Container>
  );
}
