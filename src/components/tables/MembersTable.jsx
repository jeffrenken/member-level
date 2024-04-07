import AgGrid from '@/components/tables/AgGrid';
import useMembers from '@/api/useMembers';
import { Rating, Chip, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import { GapRenderer, LinkRenderer, RatingRenderer, SrfRenderer, StarRenderer } from './CellRenderers';

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
      starRating: randomHalfNumberBetween(0, 10)
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
      cellRenderer: SrfRenderer
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

  return (
    <div style={{ height: '200px' }}>
      <AgGrid columnDefs={columnDefs} rowData={members} sideBar={false} csvDownload={csvDownload} height={height} />
      {/*       <MemoizedAgGrid columnDefs={columnDefs} rowData={members} />
       */}{' '}
    </div>
  );
}
