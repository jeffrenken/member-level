import { useQuery } from '@tanstack/react-query';
//import { fetchMeasures } from '@/api/requests';
import { MeasureWithStatsSchema } from '@/api/schemas';
import { queryClient } from '@/lib';
import { contractFilterState } from '@/state/contractFilterState';
import { useRecoilValue } from 'recoil';
import { z } from 'zod';
import { axiosClient } from './requests';

export async function fetchMeasuresFiltered(body, params) {
  const res = await axiosClient.post('/measures-filtered', { body, params });

  return z.array(MeasureWithStatsSchema).safeParse(res.data);
  return res.data;
}

export const loader = async ({ params, request }) => {
  //does not work
  return queryClient.ensureQueryData({
    queryKey: ['measuresWithStats', params.contractId, params],
    queryFn: () => fetchMeasuresFiltered({ contractId: params.contractId }, params)
  });
};

export function useMeasuresWithStats(params) {
  const selectedContract = useRecoilValue(contractFilterState);
  return useQuery({
    queryKey: ['measuresWithStats', selectedContract, params],
    queryFn: () => fetchMeasuresFiltered({ contractId: selectedContract }, params),
    select: (data) => data.data
  });
}
