import AgGrid from '@/components/tables/AgGrid';
import React from 'react';
import { GapRenderer, LinkRenderer, SrfRenderer } from './CellRenderers';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

const MemoizedAgGrid = React.memo(function AgGrid({ columnDefs, rowData }) {
  return <AgGrid columnDefs={columnDefs} rowData={rowData} sidebar={false} />;
});

export default function MembersTable({ rows, csvDownload, height }) {
  const members = rows.map((member) => {
    return {
      name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
      id: member['MEMBER ID'],
      srf: randomBoolean(),
      numberOfGaps: randomIntegerBetween(0, 50),
      starRating: randomHalfNumberBetween(0, 10),
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
      field: 'numberOfGaps',
      headerName: 'Gaps',
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
