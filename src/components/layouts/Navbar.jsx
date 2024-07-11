import { useContracts, useMeasures, useProviderGroups, useProviders, useSrf } from '@/api';
import AutocompleteButton from '@/components/Autocomplete';
import { ThemeContext } from '@/context/ThemeContextProvider';
import { contractFilterState } from '@/state/contractFilterState';
import { measureFilterState } from '@/state/measureFilterState';
import { measuresFilterState } from '@/state/measuresFilterState';

import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';

import { SearchDialog } from '@/components/SearchDialog';
import { Box, ButtonBase, Stack, TextField, StyledCard } from '@/components/ui';
import { InputAdornment } from '@mui/material';
import { useTheme } from '@/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useContext, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { NAVBAR_SELECTORS } from '@/root/e2e/constants/selectors';

const measureStatusOptions = [
  { id: 1, label: 'Stars Measures', value: 'stars' },
  { id: 2, label: 'Display Measures', value: 'display' }
];

export default function Navbar({ filters }) {
  const theme = useTheme();
  const { switchColorMode } = useContext(ThemeContext);
  const { data: measures } = useMeasures();
  const { data: contractsData } = useContracts();
  const { data: providersData } = useProviderGroups();
  const { data: srf } = useSrf();
  const [measureState, setMeasureState] = useRecoilState(measureFilterState);
  const [measuresState, setMeasuresState] = useRecoilState(measuresFilterState);
  const [contractState, setContractState] = useRecoilState(contractFilterState);
  const [providerState, setProviderState] = useRecoilState(providerFilterState);
  const [measureStatusState, setMeasureStatusState] = useRecoilState(measureStatusFilterState);
  const [srfState, setSrfState] = useRecoilState(srfFilterState);
  const [searchOpen, setSearchOpen] = useState(false);

  /*   const measures = useMemo(() => {
    if (!measuresData) return null;
    return measuresData.map((measure) => {
      return {
        ...measure,
        id: measure.measure_id,
        label: measure.measure_name,
        value: measure.measure_id
      };
    });
  }, [measuresData]); */

  const contracts = useMemo(() => {
    if (!contractsData) return null;
    return contractsData.map((contract) => {
      return {
        ...contract,
        value: contract.id
      };
    });
  }, [contractsData]);

  const providers = useMemo(() => {
    if (!providersData) return null;
    return providersData.map((provider) => {
      return {
        ...provider,
        value: provider.id
      };
    });
  }, [providersData]);

  const isDarkMode = theme.palette.mode === 'dark';

  const handleMeasureChange = (value) => {
    setMeasureState(value);
  };

  const handleMeasuresChange = (value) => {
    const newValues = value.map((v) => {
      if (typeof v === 'object') {
        return v.id;
      }
      return v;
    });
    setMeasuresState(newValues);
  };

  if (!measures || !contracts || !providers) return <></>;
  return (
    <>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <StyledCard px={1} mb={2} data-testid={NAVBAR_SELECTORS.navbar}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" height={40}>
          <Stack direction="row" spacing={2} alignItems="center">
            {filters.includes('contract') && (
              <AutocompleteButton
                id="contractFilter"
                defaultLabel="Contracts"
                label={contractState ? (contracts.find((c) => c.id === contractState) || {}).label : 'Contracts'}
                width={90}
                autocompleteProps={{
                  id: 'contractMenuList',
                  options: contracts,
                  getOptionLabel: (option) => (option.label ? option.label : ''),
                  autoHighlight: true,
                  openOnFocus: true,
                  value: contractState,
                  onChange: (event, newValue) => setContractState(newValue.id),
                  isOptionEqualToValue: (option, value) => option.id === value
                }}
              />
            )}
            {filters.includes('providerGroup') && (
              <AutocompleteButton
                id="providerGroupFilter"
                defaultLabel="Provider Groups"
                withAllOption="All Provider Groups"
                label={providerState ? (providers.find((p) => p.id === providerState) || {}).label : 'Provider Groups'}
                autocompleteProps={{
                  id: 'providerGroupMenuList',
                  options: providers,
                  getOptionLabel: (option) => (option.label ? option.label : ''),
                  autoHighlight: true,
                  openOnFocus: true,
                  value: providerState,
                  onChange: (event, newValue) => setProviderState(newValue.id),
                  isOptionEqualToValue: (option, value) => option.id === value
                }}
              />
            )}
            {filters.includes('measure') && (
              <AutocompleteButton
                id="measureFilter"
                defaultLabel="Measure"
                label={measureState ? (measures.find((p) => p.id === measureState) || {}).label : 'Measure'}
                autocompleteProps={{
                  id: 'measureMenuList',
                  options: measures,
                  getOptionLabel: (option) => (option.label ? option.label : ''),
                  autoHighlight: true,
                  openOnFocus: true,
                  value: measureState,
                  onChange: (event, newValue) => setMeasureState(newValue.id),
                  isOptionEqualToValue: (option, value) => option.id === value
                }}
              />
            )}
            {filters.includes('measures') && (
              <AutocompleteButton
                id="measuresFilter"
                defaultLabel="Measures"
                label={'Measures'}
                withAllOption="All Measures"
                autocompleteProps={{
                  id: 'measuresMenuList',
                  options: measures,
                  getOptionLabel: (option) => (option.label ? option.label : ''),
                  autoHighlight: true,
                  openOnFocus: true,
                  value: measuresState,
                  onChange: (event, newValue) => handleMeasuresChange(newValue),
                  isOptionEqualToValue: (option, value) => {
                    return option.id === value;
                  },
                  multiple: true,
                  disableCloseOnSelect: true
                }}
              />
            )}
            {filters.includes('srf') && (
              <AutocompleteButton
                id="srfFilter"
                label={srfState ? (srf.find((s) => s.id === srfState) || {}).label : 'Members'}
                withAllOption={'All Members'}
                autocompleteProps={{
                  id: 'srfMenuList',
                  options: srf,
                  getOptionLabel: (option) => (option.label ? option.label : ''),
                  autoHighlight: true,
                  openOnFocus: true,
                  value: srfState,
                  onChange: (event, newValue) => setSrfState(newValue.id),
                  isOptionEqualToValue: (option, value) => option.id === value
                }}
              />
            )}
            {filters.includes('measureStatus') && (
              <AutocompleteButton
                id="measureStatusFilter"
                label={measureStatusState ? (measureStatusOptions.find((m) => m.id === measureStatusState) || {}).label : 'Measures'}
                withAllOption={'All Measures'}
                autocompleteProps={{
                  id: 'measureStatusMenuList',
                  options: measureStatusOptions,
                  getOptionLabel: (option) => (option.label ? option.label : ''),
                  autoHighlight: true,
                  openOnFocus: true,
                  value: measureStatusState,
                  onChange: (event, newValue) => setMeasureStatusState(newValue.id),
                  isOptionEqualToValue: (option, value) => option.id === value
                }}
              />
            )}
          </Stack>

          <Box>
            <TextField
              variant="outlined"
              component={ButtonBase}
              onClick={() => setSearchOpen(true)}
              placeholder="Search"
              size="small"
              sx={{
                width: '150px',
                height: '40px'
              }}
              inputProps={{ style: { padding: '4px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={14} />
                  </InputAdornment>
                )
              }}
            />

            {/* <IconButton color="neutral">
              <IconUserCircle style={{ strokeWidth: 1.5 }} />
            </IconButton>
            <IconButton color="neutral" onClick={switchColorMode}>
              {isDarkMode ? <IconSun /> : <IconMoon />}
            </IconButton> */}
          </Box>
        </Stack>
      </StyledCard>
    </>
  );
}
