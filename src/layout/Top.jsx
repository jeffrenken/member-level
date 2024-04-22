import useContracts from '@/api/useContracts';
import useMeasures from '@/api/useMeasures';
import useProviders from '@/api/useProvidersGroups';
import AutocompleteButton from '@/components/Autocomplete';
import Card from '@/components/Card';
import { ThemeContext } from '@/context/ThemeContextProvider';
import { contractFilterState } from '@/state/contractFilterState';
import { measureFilterState } from '@/state/measureFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import useSrf from '@/api/useSrf';

import { Box, IconButton, Stack, useTheme } from '@mui/material';
import { IconMoon, IconSun, IconUserCircle } from '@tabler/icons-react';
import { useContext, useMemo } from 'react';
import { useRecoilState } from 'recoil';

const measureStatusOptions = [
  { id: 'all', label: 'All Measures', value: 'All' },
  { id: 'stars', label: 'Stars Measures', value: 'stars' },
  { id: 'display', label: 'Display Measures', value: 'display' }
];

export default function Top({ filters }) {
  const theme = useTheme();
  const { switchColorMode } = useContext(ThemeContext);
  const { data: measures } = useMeasures();
  const { data: contractsData } = useContracts();
  const { data: providersData } = useProviders();
  const { data: srf } = useSrf();
  const [measureState, setMeasureState] = useRecoilState(measureFilterState);
  const [contractState, setContractState] = useRecoilState(contractFilterState);
  const [providerState, setProviderState] = useRecoilState(providerFilterState);
  const [measureStatusState, setMeasureStatusState] = useRecoilState(measureStatusFilterState);
  const [srfState, setSrfState] = useRecoilState(srfFilterState);

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

  if (!measures || !contracts || !providers) return <></>;
  return (
    <>
      <Card px={1} mb={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          height={40}
          //mb={3}
          //mx={3}
          //pb={2}
          //sx={{ borderBottom: `0.5px solid ${theme.palette.text.primary}` }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {filters.includes('contracts') && (
              <AutocompleteButton
                defaultLabel="Contracts"
                options={contracts}
                value={contractState}
                onChange={setContractState}
                width={90}
              />
            )}
            {filters.includes('providers') && (
              <AutocompleteButton
                defaultLabel="Provider Groups"
                options={providers}
                value={providerState}
                onChange={setProviderState}
                withAllOption="All Provider Groups"
              />
            )}
            {filters.includes('measures') && (
              <AutocompleteButton defaultLabel="Measures" options={measures} value={measureState} onChange={setMeasureState} />
            )}
            {filters.includes('srf') && <AutocompleteButton defaultLabel="SRF" options={srf} value={srfState} onChange={setSrfState} />}
            {filters.includes('measureStatus') && (
              <AutocompleteButton
                defaultLabel="Measure Status"
                options={measureStatusOptions}
                value={measureStatusState}
                onChange={setMeasureStatusState}
              />
            )}
          </Stack>

          <Box>
            {/* <IconButton color="neutral">
              <IconUserCircle style={{ strokeWidth: 1.5 }} />
            </IconButton>
            <IconButton color="neutral" onClick={switchColorMode}>
              {isDarkMode ? <IconSun /> : <IconMoon />}
            </IconButton> */}
          </Box>
        </Stack>
      </Card>
    </>
  );
}
