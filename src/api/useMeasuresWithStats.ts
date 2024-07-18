import { useQuery } from '@tanstack/react-query';
//import { fetchMeasures } from '@/api/requests';
import { MeasureWithStatsSchema } from '@/api/schemas';
import { contractFilterState } from '@/state/contractFilterState';
import { useRecoilValue } from 'recoil';
import { axiosClient } from './requests';
import { z } from 'zod';

export async function fetchMeasuresFiltered(body, params) {
  const res = await axiosClient.post('/measures-filtered', { body, params });
  return z.array(MeasureWithStatsSchema).parse(res.data);
}

//not sure on how to handle the type
export function useMeasuresWithStats(params) {
  const selectedContract = useRecoilValue(contractFilterState);
  return useQuery({
    queryKey: ['measuresWithStats', selectedContract, params],
    queryFn: () => fetchMeasuresFiltered({ contractId: selectedContract }, params)
    //select: (data) => data.data
  });
}
