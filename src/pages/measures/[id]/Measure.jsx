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
import { providerFilterState } from '@/state/providerFilterState';
import { contractFilterState } from '@/state/contractFilterState';
import useProviders from '@/api/useProvidersGroups';
import useContracts from '@/api/useContracts';
import CardGlow from '@/components/cards/card-glow/CardGlow';
import PieChart2 from '@/components/charts/TestPie2';
import useMemberMeasures from '@/api/useMemberMeasures';
import useProviderGroups from '@/api/useProvidersGroups';
import useFilteredMembers from '@/api/useFilteredMembers';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function Measure() {
  const theme = useTheme();
  const params = useParams();
  const id = parseInt(params.id);
  const { data: measures, isLoading } = useMeasures();
  const measureFilterId = useRecoilValue(measureFilterState);
  const providerId = useRecoilValue(providerFilterState);
  const contractId = useRecoilValue(contractFilterState);
  const measureId = measureFilterId || id;
  const { data } = useMembers();
  const { data: providers } = useProviders();
  const { data: contracts } = useContracts();
  const { data: memberMeasures } = useMemberMeasures();
  const { data: providerGroups } = useProviderGroups();
  const { filteredMembers } = useFilteredMembers();

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
    if (!filteredMembers.length || !measure) {
      return null;
    }

    let m = filteredMembers.map((member) => {
      return {
        ...member,
        name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
        id: member['MEMBER ID'],
        srf: randomBoolean(),
        numberOfGaps: Object.keys(member.memberMeasures).filter((key) => member.memberMeasures[key] === 0).length,
        starRating: randomHalfNumberBetween(0, 10),
        url: `/members/${member['MEMBER ID']}`
      };
    });

    /* if (contract) {
      don't have a way to associate a contract with a member now
      return m.filter((member) => member['Contract Name'] === contract.label);
    } */
    let splitMembers = {};
    splitMembers.all = m;
    splitMembers.numerator = m.filter((d) => d.memberMeasures[measure['Measure Name']] === 1);
    splitMembers.denominator = m.filter((d) => d.memberMeasures[measure['Measure Name']] === 0);

    return splitMembers;
  }, [data, measure, provider, contract, filteredMembers]);

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
      maxWidth: 100,
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
    }
    /*  {
      field: 'starRating',
      headerName: 'Star Rating',
      type: 'numericColumn',
      //maxWidth: 180,
      chartDataType: 'series',
      filter: true,
      cellRenderer: RatingRenderer
    } */
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
          {/*           <Box sx={{ bgcolor: '#3ed', height: 200, width: 600 }}>Month chart</Box>
           */}{' '}
        </Box>
        <Box>{measureWithData && <PieChart2 measure={measureWithData} disabled />}</Box>
        {/*         <CardGlow measure={measureWithData} colors={[background]} disabled />}</Box>
         */}{' '}
      </Stack>

      <AgGrid columnDefs={columnDefs} rowData={members?.denominator} csvDownload saveFiltersButton height={'calc(100vh - 350px)'} />
    </Container>
  );
}
