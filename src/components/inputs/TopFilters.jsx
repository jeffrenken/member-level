import React from 'react';
import { Paper, Stack, Box } from '@mui/material';
import ContractsAutocomplete from '@/components/inputs/ContractsAutocomplete';
import StatesAutocomplete from '@/components/inputs/StatesAutocomplete';
import SaveToFavoritesDialog from '@/components/dialogs/SaveToFavoritesDialog';
import Card from '../Card';
import MeasureAutocomplete from './MeasureAutocomplete';
import YearAutocomplete from './YearAutocomplete';

export default function TopFilters() {
  return (
    <Card height={100} p={2}>
      <Box>
        <Stack direction="row" spacing={2} p={1}>
          <StatesAutocomplete />
          <ContractsAutocomplete />
          <MeasureAutocomplete />
          <YearAutocomplete />
          <SaveToFavoritesDialog />
        </Stack>
      </Box>
    </Card>
  );
}
