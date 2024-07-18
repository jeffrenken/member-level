import AgGrid from '@/components/tables/AgGrid';
import { GapRenderer, LinkRenderer, SrfRenderer } from './CellRenderers';

export default function MembersTable({ rows, csvDownload, height }) {
  const members = rows.map((member) => {
    return {
      name: member.firstName + ' ' + member.lastName,
      id: member.memberId,
      srf: member.isSrf,
      numberOfGaps: member.numberOfGaps,
      filteredNumberOfGaps: member.filteredNumberOfGaps,
      url: `/members/${member.memberId}`
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
