import useContracts from '@/api/useContracts';
import useMeasures from '@/api/useMeasures';
import useMembers from '@/api/useMembers';
import useProviderGroups from '@/api/useProvidersGroups';
import { contractFilterState } from '@/state/contractFilterState';
import { measureFilterState } from '@/state/measureFilterState';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useSrf from './useSrf';

export default function useFilteredMembers(filters) {
  const params = useParams();
  const id = parseInt(params.id);
  const { data: measures, isLoading } = useMeasures();
  const measureFilterId = useRecoilValue(measureFilterState);
  const providerId = useRecoilValue(providerFilterState);
  const contractId = useRecoilValue(contractFilterState);
  const srfId = useRecoilValue(srfFilterState);
  const measureStatus = useRecoilValue(measureStatusFilterState);
  const measureId = measureFilterId || id;
  const { data: members } = useMembers();
  const { data: providerGroups } = useProviderGroups();
  const { data: contracts } = useContracts();
  const { data: srfData } = useSrf();

  const [filteredMembers, setFilteredMembers] = useState([]);

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

  /* const measure = useMemo(() => {
    if (!measures) {
      return null;
    }
    return measures.find((measure) => {
      return measure.id === measureId;
    });
  }, [measures, measureId]); */

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

  useEffect(() => {
    if (!members || !measures) {
      return;
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
    setFilteredMembers(filtered);
  }, [providerGroup, contract, members, srf, filters, measures, measureStatus]);

  return { filteredMembers: filteredMembers, isLoading, filterSrf: filterSrf };
}
