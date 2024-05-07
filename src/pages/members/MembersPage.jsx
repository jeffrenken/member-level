import useFilteredMembers from '@/api/useFilteredMembers';
import useMeasures from '@/api/useMeasures';
import AgGrid from '@/components/tables/AgGrid';
import {
  GapRenderer,
  LinkRenderer,
  MeasureRenderer,
  ProviderLinkRenderer,
  SrfRenderer,
  TextRenderer,
  TooltipRenderer,
  getSparklineData
} from '@/components/tables/CellRenderers';
import Top from '@/layout/Top';
import { Box, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import MembersLayout from './MembersLayout';

const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

const memberInfoColumns = [
  'MEMBER ID',
  'CITY',
  'COUNTY',
  'STATE',
  'ZIP CODE',
  'PHONE NUMBER',
  'EMAIL ADDRESS',
  'SEX',
  'RACE',
  'ETHNICITY',
  'PRIMARY LANGUAGE'
];

const srfOptions = ['Low Income Subsidy Copay Level', 'DUAL ELIGIBLE', 'DISABLED'];

export default function MembersPage() {
  const { filteredMembers } = useFilteredMembers();

  return (
    <>
      <MembersLayout title="All Members" members={filteredMembers} />
    </>
  );
}
