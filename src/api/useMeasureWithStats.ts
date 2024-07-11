import { useQuery } from '@tanstack/react-query';
//import { fetchMeasures } from '@/api/requests';
import { axiosClient } from './requests';
import { z } from 'zod';
import { useRecoilValue } from 'recoil';
import { contractFilterState } from '@/state/contractFilterState';

const MeasureSchema = z.object({
  Domain: z.string(),
  Acronym: z.string(),

  'Measure Name': z.string(),
  abbreviation: z.string(),
  id: z.number(),
  label: z.string(),
  status: z.number(),
  value: z.string(),
  hl_code: z.string().optional(),
  measure_id: z.string().optional(),
  description: z.string().optional(),
  bottom_third_lower_value: z.number().optional(),
  bottom_third_upper_value: z.number().optional(),
  middle_third_lower_value: z.number().optional(),
  middle_third_upper_value: z.number().optional(),
  top_third_lower_value: z.number().optional(),
  top_third_upper_value: z.number().optional(),
  first_upper: z.number().optional(),
  second_upper: z.number().optional(),
  third_upper: z.number().optional(),
  fourth_upper: z.number().optional()
});

export async function fetchMeasuresFiltered(body, params) {
  const res = await axiosClient.post('/measures-filtered', { body, params });
  return res.data;
}

export function useMeasureWithStats(measureId, params) {
  const selectedContract = useRecoilValue(contractFilterState);
  return useQuery({
    queryKey: ['measuresWithStats', measureId, selectedContract, params],
    queryFn: () => fetchMeasuresFiltered({ contractId: selectedContract }, params),
    select: (data) => data.find((measure) => measure.id === measureId)
  });
}
