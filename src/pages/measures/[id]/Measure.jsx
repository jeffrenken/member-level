import useMeasures from '@/api/useMeasures';
import { Container, Typography, Rating, Box, Stack, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import AgGrid from '@/components/tables/AgGrid';
import useMembers from '@/api/useMembers';
import { Link } from 'react-router-dom';
import Top from '@/layout/Top';
import { IconStar } from '@tabler/icons-react';
import { StarRenderer, RatingRenderer, SrfRenderer, LinkRenderer, GapRenderer } from '@/components/tables/CellRenderers';
import { useRecoilValue } from 'recoil';
import { measureFilterState } from '@/state/measureFilterState';
import { useMemo } from 'react';
import { providertFilterState } from '@/state/providerFilterState';
import { contractFilterState } from '@/state/contractFilterState';
import useProviders from '@/api/useProviders';
import useContracts from '@/api/useContracts';
import CardGlow from '@/components/cards/card-glow/CardGlow';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function Measure() {
  const theme = useTheme();
  const params = useParams();
  const id = parseInt(params.id);
  const { data: measures, isLoading } = useMeasures();
  const measureFilterId = useRecoilValue(measureFilterState);
  const providerId = useRecoilValue(providertFilterState);
  const contractId = useRecoilValue(contractFilterState);
  const measureId = measureFilterId || id;
  const { data } = useMembers();
  const { data: providers } = useProviders();
  const { data: contracts } = useContracts();
  const background = theme.palette.background.paper;

  const contract = useMemo(() => {
    if (!contracts) {
      return null;
    }
    return contracts.find((contract) => {
      return contract.id === contractId;
    });
  }, [contracts, contractId]);

  const provider = useMemo(() => {
    if (!providers) {
      return null;
    }
    return providers.find((provider) => {
      return provider.id === providerId;
    });
  }, [providers, providerId]);

  const measure = useMemo(() => {
    if (!measures) {
      return null;
    }
    return measures.find((measure) => {
      return measure.id === measureId;
    });
  }, [measures, measureId]);

  const members = useMemo(() => {
    if (!data.length) {
      return null;
    }

    let m = data.map((member) => {
      return {
        ...member,
        name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
        id: member['MEMBER ID'],
        srf: randomBoolean(),
        numberOfGaps: randomIntegerBetween(0, 50),
        starRating: randomHalfNumberBetween(0, 10)
      };
    });

    if (provider) {
      m = m.filter((member) => member['Contract Entity Name'] === provider.label);
    }

    /* if (contract) {
      don't have a way to associate a contract with a member now
      return m.filter((member) => member['Contract Name'] === contract.label);
    } */
    let splitMembers = {};

    splitMembers.numerator = m.filter((member) => member[measure?.measure_name] === 'TRUE');
    splitMembers.denominator = m.filter((member) => member[measure?.measure_name] === 'FALSE');

    return splitMembers;
  }, [data, measure, provider, contract]);

  const measureWithData = useMemo(() => {
    if (!measure || !members) {
      return null;
    }
    let measureCopy = { ...measure };

    measureCopy.numerator = members.numerator.length;
    measureCopy.denominator = members.denominator.length;
    measureCopy.forecast = 'N/A';
    return measureCopy;
  }, [measure, measureId, members]);

  const columnDefs = [
    {
      field: 'name',
      filter: true,
      chartDataType: 'category',
      //maxWidth: 200,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: LinkRenderer
    },
    {
      field: 'srf',
      headerName: 'SRF',
      type: 'numericColumn',
      //maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: SrfRenderer
    },
    {
      field: 'numberOfGaps',
      headerName: 'Gaps',
      type: 'numericColumn',
      //maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: GapRenderer
    },
    {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      //maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: RatingRenderer
    }
  ];

  if (isLoading || !members) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Top filters={['providers', 'contracts', 'measures']} />
      <Stack direction="row" justifyContent="space-around" alignItems={'center'}>
        <Box>
          <Typography variant="h1">{measure?.label}</Typography>
          <Typography>{provider?.label}</Typography>
          <Typography>Members in the denominator</Typography>
        </Box>
        <Box>{measureWithData && <CardGlow measure={measureWithData} colors={[background]} disabled />}</Box>
      </Stack>
      <AgGrid columnDefs={columnDefs} rowData={members?.denominator} csvDownload saveFiltersButton height={'calc(100vh - 350px)'} />
    </Container>
  );
}
