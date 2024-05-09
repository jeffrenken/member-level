import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer, LinkRenderer, SrfRenderer } from './CellRenderers';

export default function MembersTable({ rows, csvDownload, height }) {
  console.log('rows', rows);
  const members = rows.map((member) => {
    return {
      name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
      id: member['MEMBER ID'],
      srf: member.isSrf,
      numberOfGaps: member.numberOfGaps,
      filteredNumberOfGaps: member.filteredNumberOfGaps,
      url: `/members/${member['MEMBER ID']}`
    };
  });
  const columnDefs = [
    { field: 'name', filter: true, chartDataType: 'category', cellRenderer: LinkRenderer },
    {
      field: 'srf',
      headerName: 'SRF',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      cellRenderer: SrfRenderer,
      maxWidth: 100
    },
    {
      field: 'filteredNumberOfGaps',
      headerName: 'Gaps-in-Care',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer
    }
    /*  {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      chartDataType: 'series',
      filter: true,
      cellRenderer: RatingRenderer
    } */
  ];

  return <AgGrid columnDefs={columnDefs} rowData={members} sideBar={false} csvDownload={csvDownload} height={height} />;
}
