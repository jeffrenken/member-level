import { useQuery } from '@tanstack/react-query';
//import { fetchMeasures } from '@/api/requests';
import { axiosClient } from './requests';
import { z } from 'zod';

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

export async function fetchMeasures() {
  const res = await axiosClient.get('/measures');
  return z.array(MeasureSchema).parse(res.data);
}

export function useMeasures() {
  return useQuery({ queryKey: ['measures'], queryFn: fetchMeasures });
}
