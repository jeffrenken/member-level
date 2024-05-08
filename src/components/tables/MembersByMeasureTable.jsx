import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer, LinkRenderer, SrfRenderer } from '@/components/tables/CellRenderers';

const columnDefs = [
  {
    field: 'name',
    filter: true,
    chartDataType: 'category',
    //maxWidth: 200,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellRenderer: LinkRenderer
  },
  {
    field: 'srf',
    headerName: 'SRF',
    type: 'numericColumn',
    maxWidth: 100,
    chartDataType: 'series',
    filter: true,
    cellRenderer: SrfRenderer
  },
  {
    field: 'date',
    headerName: 'Num Date',
    type: 'numericColumn',
    maxWidth: 160,
    chartDataType: 'series',
    filter: true
    //cellRenderer: SrfRenderer
  },
  {
    field: 'filteredNumberOfGaps',
    headerName: 'Gaps-in-Care',
    type: 'numericColumn',
    //maxWidth: 180,
    chartDataType: 'series',
    filter: true,
    cellRenderer: GapRenderer
  }
];

export default function MembersByMeasureTable({ rows }) {
  return <AgGrid columnDefs={columnDefs} rowData={rows || []} csvDownload saveFiltersButton height={'calc(100vh - 200px)'} />;
}
