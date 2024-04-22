import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  useTheme
} from '@mui/material';
import 'ag-grid-charts-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getData } from './data.js';
import { IconDeviceFloppy, IconFileCv, IconFileTypeCsv } from '@tabler/icons-react';
//import './ag-grid.css';

export default function AgGrid({ rowData, columnDefs, sideBar2, csvDownload, saveFiltersButton, height = '100%', ...props }) {
  const gridRef = useRef();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [checked, setChecked] = useState(false);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    let f = localStorage.getItem('filters', JSON.stringify(filters));
    if (f) {
      setFilters(JSON.parse(f));
    }
  }, []);

  function cellStyling(params) {
    if (checked && params.value > 1000000) {
      //mark police cells as red
      return { color: 'green' };
    }
    //have to explicitly reset the value
    return { color: 'black' };
  }

  // Column Definitions: Defines the columns to be displayed.
  /*   const columnDefs = [
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
      filter: true,
      cellStyle: (params) => {
        return cellStyling(params);
      }
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
  ]; */

  const gridOptions = {
    columnDefs: columnDefs,
    rowSelection: 'multiple',
    rowMultiSelectWithClick: true,
    enableRangeSelection: true
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100
    };
  }, []);

  const onGridReady = useCallback((params) => {
    /* fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
          .then((resp) => resp.json())
          .then((data) => setRowData(data)); */
  }, []);

  const exportCsv = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  function getContextMenuItems(params) {
    var result = [...params.defaultItems];

    return result;
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const saveFilters = () => {
    const filters = gridRef.current.api.getFilterModel();
    const current = localStorage.getItem('filters', filters);
    if (!current) {
      setFilters([current]);
      localStorage.setItem('filters', JSON.stringify([filters]));
    } else {
      setFilters([...current, filters]);
      localStorage.setItem('filters', JSON.stringify([...current, filters]));
    }
  };

  const handleChangeFilter = (event) => {
    gridRef.current.api.setFilterModel(event.target.value);
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

  return (
    <>
      {(csvDownload || saveFiltersButton) && (
        <Stack direction="row" spacing={1} p={0} my={1} justifyContent="flex-end">
          {csvDownload && (
            <Tooltip title="Download CSV" placement="top">
              <IconButton color="primary" onClick={exportCsv} aria-label="upload picture" component="label" sx={{ padding: 0 }}>
                <IconFileTypeCsv style={{ strokeWidth: 1.5 }} />
              </IconButton>
            </Tooltip>
          )}
          {saveFiltersButton && (
            <Tooltip title="Save Filters" placement="top">
              <IconButton color="primary" onClick={exportCsv} aria-label="upload picture" component="label" sx={{ padding: 0 }}>
                <IconDeviceFloppy style={{ strokeWidth: 1.5 }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )}

      <div
        className={darkMode ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'}
        style={{ height: height }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          rowSelection="multiple"
          rowMultiSelectWithClick={true}
          onGridReady={onGridReady}
          enableCharts
          defaultCsvExportParams={{ onlySelected: true }}
          getContextMenuItems={getContextMenuItems}
          //suppressContextMenu
          sideBar={sideBar}
          {...props}
        />
      </div>
    </>
  );
}
