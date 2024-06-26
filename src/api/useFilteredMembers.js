import { useContracts, useMeasures, useMembers, useProviderGroups, useSrf } from '@/api';
import { contractFilterState } from '@/state/contractFilterState';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

export function useFilteredMembers(filters) {
  const { data: measures, isLoading } = useMeasures();
  const providerId = useRecoilValue(providerFilterState);
  const contractId = useRecoilValue(contractFilterState);
  const srfId = useRecoilValue(srfFilterState);
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const { data: members } = useMembers();
  const { data: providerGroups } = useProviderGroups();
  const { data: contracts } = useContracts();
  const { data: srfData } = useSrf();

  //const [filteredMembers, setFilteredMembers] = useState([]);

  const contract = useMemo(() => {
    if (!contracts) {
      return null;
    }
    return contracts.find((contract) => {
      return contract.id === contractId;
    });
  }, [contracts, contractId]);

  const providerGroup = useMemo(() => {
    if (!providerGroups) {
      return null;
    }
    return providerGroups.find((providerGroup) => {
      return providerGroup.id === providerId;
    });
  }, [providerGroups, providerId]);

  const srf = useMemo(() => {
    if (!srfData) {
      return null;
    }
    return srfData.find((s) => {
      return s.id === srfId;
    });
  }, [srfData, srfId]);

  function filterSrf(members) {
    if (!srf) {
      return members;
    }
    if (srf.label === 'SRF Only') {
      return members.filter((d) => d.isSrf);
    }
    if (srf.label === 'Non-SRF Only') {
      return members.filter((d) => !d.isSrf);
    }
  }

  const filteredMembers = useMemo(() => {
    if (!members || !measures) {
      return [];
    }
    let filtered = [...members];
    if (providerGroup && filters.includes('providerGroup')) {
      filtered = filtered.filter((d) => d.providerGroup && d.providerGroup['Provider Group'] === providerGroup.label);
    }

    if (contract && filters.includes('contract')) {
      filtered = filtered.filter((d) => d['CONTRACT'] === contract.label);
    }

    let filteredMeasures = [...measures];
    if (measureStatus !== 0 && filters.includes('measureStatus')) {
      filteredMeasures = measures.filter((measure) => measure.status === measureStatus).map((d) => d['Measure Name']);
      filtered = filtered.map((d) => {
        return { ...d, filteredNumberOfGaps: d.measuresOpen.filter((m) => filteredMeasures.includes(m)).length };
      });
    }

    if (srf && filters.includes('srf')) {
      filtered = filterSrf(filtered);
    }
    return filtered;
    //setFilteredMembers(filtered);
  }, [providerGroup, contract, members, srf, filters, measures, measureStatus]);

  return { filteredMembers: filteredMembers, isLoading, filterSrf: filterSrf };
}
