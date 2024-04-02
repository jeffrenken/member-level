import AgGrid from '@/components/tables/AgGrid';
import useMembers from '@/api/useMembers';
import { Rating, Chip, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

const RatingRenderer = (params) => {
  return <Rating value={params.value} readOnly precision={0.5} size="small" />;
};

const SrfRenderer = (params) => {
  return params.value.toString();
  return <Chip color={params.value ? 'success' : 'error'} label={params.value.toString()} />;
};

const LinkRenderer = (params) => {
  return (
    <Link to={`/members/${params.data.id}`} style={{ textDecoration: 'none', color: '#4d9fda' }}>
      {params.value}
    </Link>
  );
};

const MemoizedAgGrid = React.memo(function AgGrid({ columnDefs, rowData }) {
  return <AgGrid columnDefs={columnDefs} rowData={rowData} sidebar={false} />;
});

export default function MembersTable({ rows, csvDownload }) {
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
    { field: 'name', filter: true, chartDataType: 'category', maxWidth: 230, cellRenderer: LinkRenderer },
    {
      field: 'srf',
      headerName: 'SRF',
      type: 'numericColumn',
      maxWidth: 120,
      chartDataType: 'series',
      filter: true,
      cellRenderer: SrfRenderer
    },
    {
      field: 'numberOfGaps',
      headerName: 'Gaps',
      type: 'numericColumn',
      maxWidth: 160,
      chartDataType: 'series',
      filter: true
    },
    {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      maxWidth: 150,
      chartDataType: 'series',
      filter: true,
      cellRenderer: RatingRenderer
    }
  ];

  return (
    <>
      <AgGrid columnDefs={columnDefs} rowData={members} sideBar={false} csvDownload={csvDownload} />
      {/*       <MemoizedAgGrid columnDefs={columnDefs} rowData={members} />
       */}{' '}
    </>
  );
}
