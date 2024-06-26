import { IconButton, Stack, Tooltip } from '@/components';
import { useTheme } from '@/hooks';
import { IconDeviceFloppy, IconFileTypeCsv } from '@tabler/icons-react';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
//import './ag-grid.css';

export default function AgGrid({ rowData, columnDefs, sideBar2, csvDownload, saveFiltersButton, height = '100%', tableRef, ...props }) {
  //const gridRef = useRef();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [checked, setChecked] = useState(false);
  const [filters, setFilters] = useState([]);
  const [rows, setRows] = useState(rowData);
  const gridRef = tableRef ? tableRef : useRef();
  useEffect(() => {
    let f = localStorage.getItem('filters', JSON.stringify(filters));
    if (f) {
      setFilters(JSON.parse(f));
    }
  }, []);

  useEffect(() => {
    setRows(rowData);
  }, [rowData]);

  function cellStyling(params) {
    if (checked && params.value > 1000000) {
      //mark police cells as red
      return { color: 'green' };
    }
    //have to explicitly reset the value
    return { color: 'black' };
  }

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

  const onGridReady = useCallback((event) => {
    //gridRef.current.autoSizeAllColumns();
    /* fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
          .then((resp) => resp.json())
          .then((data) => setRowData(data)); */
  }, []);

  function processCell(cell) {
    var cellVal = cell.value;
    if (cell?.column?.colDef?.cellRenderer) {
      cellVal = cell.column.colDef.cellRenderer({ value: cell.value });
    }
    return cellVal;
  }

  const exportCsv = useCallback(() => {
    //gridRef.current.api.exportDataAsCsv();
    gridRef.current.api.exportDataAsExcel();
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

  const autoSizeStrategy = {
    type: 'fitCellContents'
  };

  const autoSizeAll = useCallback(() => {
    const allColumnIds = [];
    gridRef.current.api.getColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    gridRef.current.api.autoSizeColumns(allColumnIds, false);
  }, []);

  return (
    <>
      {(csvDownload || saveFiltersButton) && (
        <Stack direction="row" spacing={1} p={0} my={1} justifyContent="flex-end">
          {csvDownload && (
            <IconButton color="primary" onClick={exportCsv} sx={{ padding: 0 }}>
              <Tooltip title="Download CSV" placement="top">
                <IconFileTypeCsv style={{ strokeWidth: 1.5 }} />
              </Tooltip>
            </IconButton>
          )}
          {saveFiltersButton && (
            <IconButton color="primary" onClick={exportCsv} sx={{ padding: 0 }}>
              <Tooltip title="Save Filters" placement="top">
                <IconDeviceFloppy style={{ strokeWidth: 1.5 }} />
              </Tooltip>
            </IconButton>
          )}
        </Stack>
      )}

      <div
        className={darkMode ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'}
        style={{ height: height, width: '100%' }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          //key={rows}
          ref={gridRef}
          rowData={rows}
          onRowDataUpdated={columnDefs.length > 6 && autoSizeAll}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          rowSelection="multiple"
          rowMultiSelectWithClick={true}
          //onGridReady={onGridReady}
          autoSizeStrategy={columnDefs.length > 6 && autoSizeStrategy}
          enableCharts
          domLayout={!rows.length || rows.length > 10 ? 'normal' : 'autoHeight'}
          defaultCsvExportParams={{
            fileName: 'member-level-export',
            processCellCallback: (cell) => {
              console.log('cell', cell);
              //if value is an  object
              if (typeof cell.value === 'object') {
                return '';
              }
              return cell.value;
              var cellVal = cell.value;
              if (cell?.column?.colDef?.cellRenderer) {
                cellVal = cell.column.colDef.cellRenderer({ value: cell.value });
              }
              return cellVal;
            }
          }}
          getContextMenuItems={getContextMenuItems}
          //suppressContextMenu
          sideBar={sideBar}
          {...props}
        />
      </div>
    </>
  );
}
