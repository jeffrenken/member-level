import { fetchContracts } from '@/api/requests';
import useContracts from '@/api/useContracts';
import useMeasures from '@/api/useMeasures';
import useMemberMeasures from '@/api/useMemberMeasures';
import useMembers from '@/api/useMembers';
import useProviderGroups from '@/api/useProvidersGroups';
import { contractFilterState } from '@/state/contractFilterState';
import { measureFilterState } from '@/state/measureFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { measureStatusFilterState } from '@/state/measureStatusFilterState';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import providerGroups from '../../data/providerGroups.json';
import { useState, useEffect, useMemo } from 'react';
import useSrf from './useSrf';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

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
  const { data: memberMeasures } = useMemberMeasures();
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

  const measure = useMemo(() => {
    if (!measures) {
      return null;
    }
    return measures.find((measure) => {
      return measure.id === measureId;
    });
  }, [measures, measureId]);

  const srf = useMemo(() => {
    if (!srfData) {
      return null;
    }
    return srfData.find((s) => {
      return s.id === srfId;
    });
  }, [srfData, srfId]);

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

    if (contract && filters.includes('contract')) {
      filtered = filtered.filter((d) => d['CONTRACT'] === contract.label);
    }

    let filteredMeasures = [...measures];
    if (measureStatus !== 'all') {
      filteredMeasures = measures.filter((measure) => measure.status === measureStatus).map((d) => d['Measure Name']);
      filtered = filtered.map((d) => {
        return { ...d, filteredNumberOfGaps: d.measuresOpen.filter((m) => filteredMeasures.includes(m)).length };
      });
    }
    //let withMember = [];

    /* filtered = filtered.map((d) => {
        return data.find((m) => m['MEMBER ID'] === d['MEMBER ID']);
      }); */

    if (srf && filters.includes('srf')) {
      if (srf.label === 'SRF Only') {
        //shitty way to know if they have an srf category
        filtered = filtered.filter((d) => d.isSrf);
      }
      if (srf.label === 'Non-SRF Only') {
        //shitty way to know if they have an srf category
        filtered = filtered.filter((d) => !d.isSrf);
      }
      //filtered = filtered.filter((d) => d['SRF Score'] === srf.label);
    }
    setFilteredMembers(filtered);
  }, [providerGroup, contract, members, srf, filters, measureStatus]);

  return { filteredMembers: filteredMembers, isLoading };
}
