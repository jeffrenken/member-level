import { Box, Stack, StyledCard } from '@/components';
import SaveToFavoritesDialog from '@/components/dialogs/SaveToFavoritesDialog';
import ContractsAutocomplete from '@/components/inputs/ContractsAutocomplete';
import StatesAutocomplete from '@/components/inputs/StatesAutocomplete';
import MeasureAutocomplete from './MeasureAutocomplete';
import YearAutocomplete from './YearAutocomplete';

export default function TopFilters() {
  return (
    <StyledCard height={100} p={2}>
      <Box>
        <Stack direction="row" spacing={2} p={1}>
          <StatesAutocomplete />
          <ContractsAutocomplete />
          <MeasureAutocomplete />
          <YearAutocomplete />
          <SaveToFavoritesDialog />
        </Stack>
      </Box>
    </StyledCard>
  );
}
