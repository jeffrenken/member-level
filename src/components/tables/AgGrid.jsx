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
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getData } from './data.js';
import { IconDeviceFloppy, IconFileCv, IconFileTypeCsv } from '@tabler/icons-react';

export default function AgGrid({ rowData, columnDefs, sideBar = true, csvDownload, saveFiltersButton }) {
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
    console.log(params);
    var result = [
      ...params.defaultItems
      /* {
        name: 'Alert ' + params.value,
        action: () => {
          window.alert('Alerting about ' + params.value);
        },
        cssClasses: ['red', 'bold']
      },
      {
        name: 'Always Disabled',
        disabled: true,
        tooltip: 'Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!'
      }, */
      /*       {
        name: 'Country',
        subMenu: [
          {
            name: 'Ireland',
            action: () => {
              console.log('Ireland was pressed');
            }
          },
          {
            name: 'UK',
            action: () => {
              console.log('UK was pressed');
            }
          },
          {
            name: 'France',
            action: () => {
              console.log('France was pressed');
            }
          }
        ]
      }, */

      /*  'separator',
      {
        name: 'Windows',
        shortcut: 'Alt + W',
        action: () => {
          console.log('Windows Item Selected');
        },
        icon: '<img src="https://www.ag-grid.com/example-assets/skills/windows.png" />'
      },
      {
        name: 'Mac',
        shortcut: 'Alt + M',
        action: () => {
          console.log('Mac Item Selected');
        },
        icon: '<img src="https://www.ag-grid.com/example-assets/skills/mac.png"/>'
      }  */
    ];

    return result;
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const saveFilters = () => {
    const filters = gridRef.current.api.getFilterModel();
    console.log(filters);
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
    console.log(event.target.value);
    gridRef.current.api.setFilterModel(event.target.value);
  };

  return (
    <>
      {/* <Stack direction="row" spacing={2} p={1} justifyContent="flex-end">
        <FormControlLabel control={<Checkbox checked={checked} onChange={handleChange} />} label="Highlight > 1M" />
        <Button onClick={exportCsv} variant="contained">
          Export CSV (or right click cell)
        </Button>
        <Button onClick={saveFilters} variant="contained">
          Save Filters
        </Button>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Saved" onChange={handleChangeFilter}>
              {filters.map((f, i) => (
                <MenuItem key={i} value={f}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack> */}

      <Stack direction="row" spacing={1} p={0} my={1} justifyContent="flex-end">
        {csvDownload && (
          <Tooltip title="Download CSV" placement="top">
            <IconButton color="primary" onClick={exportCsv} aria-label="upload picture" component="label" sx={{ padding: 0 }}>
              <IconFileTypeCsv />
            </IconButton>
          </Tooltip>
        )}
        {saveFiltersButton && (
          <Tooltip title="Save Filters" placement="top">
            <IconButton color="primary" onClick={exportCsv} aria-label="upload picture" component="label" sx={{ padding: 0 }}>
              <IconDeviceFloppy />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <div
        className={darkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
        style={{ height: 500 }} // the grid will fill the size of the parent container
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
          sideBar={sideBar}
        />
      </div>
    </>
  );
}
