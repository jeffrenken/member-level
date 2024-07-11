import { IconButton, Stack, Tooltip } from '@/components/ui';
import { useTheme } from '@/hooks';
import { IconDeviceFloppy, IconFileTypeCsv } from '@tabler/icons-react';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
//import './ag-grid.css';

export default function AgGrid({ rowData, columnDefs, csvDownload, saveFiltersButton, height = '100%', tableRef, ...props }) {
  //const gridRef = useRef();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [filters, setFilters] = useState([]);
  const [rows, setRows] = useState(rowData);
  let gridRef = useRef();
  if (tableRef) {
    gridRef = tableRef;
  }

  useEffect(() => {
    let f = localStorage.getItem('filters', JSON.stringify(filters));
    if (f) {
      setFilters(JSON.parse(f));
    }
  }, []);

  useEffect(() => {
    setRows(rowData);
  }, [rowData]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100
    };
  }, []);

  const exportCsv = useCallback(() => {
    //gridRef.current.api.exportDataAsCsv();
    gridRef.current.api.exportDataAsExcel();
  }, []);

  function getContextMenuItems(params) {
    var result = [...params.defaultItems];

    return result;
  }

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
          domLayout={!rows.length || rows.length > 5 ? 'normal' : 'autoHeight'}
          defaultCsvExportParams={{
            fileName: 'member-level-export',
            processCellCallback: (cell) => {
              //if value is an  object
              if (typeof cell.value === 'object') {
                return '';
              }
              return cell.value;
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
