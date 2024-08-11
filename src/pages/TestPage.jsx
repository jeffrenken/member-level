import { useMembers, useProviders } from '@/api';
import { useMembersPaginated } from '@/api/useMembersPaginated';
import { axiosClient } from '@/api/requests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the Data Grid
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Container } from '@/components/ui';

function TestPage() {
  const gridRef = useRef();
  const { data: members } = useMembersPaginated();
  const [count, setCount] = useState(0);

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
    }
  };

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: 'firstName', filter: 'agTextColumnFilter' },
    { field: 'lastName' },
    { field: 'CITY', enableRowGroup: true },
    { field: 'COUNTY', enableRowGroup: true },
    { field: 'STATE', enableRowGroup: true },
    { field: 'zipCode', enableRowGroup: true },
    { field: 'phoneNumber' },
    { field: 'email' },
    { field: 'SEX' },
    { field: 'RACE' },
    { field: 'ETHNICITY' },
    { field: 'primaryLanguage' }
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

  const sideBar = useMemo(() => {
    return {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: false,
            suppressValues: false
          }
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel'
        }
      ]
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 200,
      suppressHeaderFilterButton: false,
      suppressHeaderMenuButton: false
    };
  }, []);

  const onGridReady = useCallback((params) => {
    // create datasource with a reference to the fake server
    var datasource = getData();
    console.log('datasource', datasource);
    // register the datasource with the grid
    params.api.setGridOption('serverSideDatasource', datasource);
  }, []);

  const handleThrowError = () => {
    throw new Error('This is an error');
  };
  const onClick = () => {
    setCount(count + 1);
  };
  useEffect(() => {
    if (count === 2) {
      throw new Error('I crashed!');
    }
  });

  return (
    // wrapping container with theme & size
    <Container maxWidth="lg">
      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500, marginTop: 20 }} // the Data Grid will fill the size of the parent container
      >
        <Button onClick={handleThrowError}>Throw error</Button>
        <button onClick={onClick}>Click twice to crash</button>
        <AgGridReact
          ref={gridRef}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowModelType={'serverSide'}
          onGridReady={onGridReady}
          rowGroupPanelShow="always"
          groupDisplayType="groupRows"
          sideBar={sideBar}
        />
      </div>
    </Container>
  );
}

export const Component = TestPage;
