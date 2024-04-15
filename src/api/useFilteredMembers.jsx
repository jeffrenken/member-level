import { fetchContracts } from '@/api/requests';
import useContracts from '@/api/useContracts';
import useMeasures from '@/api/useMeasures';
import useMemberMeasures from '@/api/useMemberMeasures';
import useMembers from '@/api/useMembers';
import useProviderGroups from '@/api/useProvidersGroups';
import { contractFilterState } from '@/state/contractFilterState';
import { measureFilterState } from '@/state/measureFilterState';
import { providertFilterState } from '@/state/providerFilterState';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import providerGroups from '../../data/providerGroups.json';
import { useState, useEffect, useMemo } from 'react';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export default function useFilteredMembers() {
  const params = useParams();
  const id = parseInt(params.id);
  const { data: measures, isLoading } = useMeasures();
  const measureFilterId = useRecoilValue(measureFilterState);
  const providerId = useRecoilValue(providertFilterState);
  const contractId = useRecoilValue(contractFilterState);
  const measureId = measureFilterId || id;
  const { data } = useMembers();
  const { data: providers } = useProviderGroups();
  const { data: contracts } = useContracts();
  const { data: memberMeasures } = useMemberMeasures();
  const [filteredMembers, setFilteredMembers] = useState([]);

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

  useEffect(() => {
    let filtered = providerGroups;

    if (provider) {
      filtered = filtered.filter((d) => d['Provider Group'] === provider.label);
    }

    if (contract) {
      filtered = filtered.filter((d) => d['CONTRACT'] === contract.label);
    }

    let withMember = [];

    if (data) {
      withMember = filtered.map((d) => {
        return data.find((m) => m['MEMBER ID'] === d['MEMBER ID']);
      });
      setFilteredMembers(withMember);
    }
  }, [measure, provider, contract, data]);

  return { filteredMembers: filteredMembers, isLoading };
}
