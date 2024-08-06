import { useQuery } from '@tanstack/react-query';
//import { fetchMeasures } from '@/api/requests';
import { axiosClient } from './requests';
import { z } from 'zod';
import { MeasureSchema } from '@/api/schemas';

export async function fetchMeasures() {
  const res = await axiosClient.get('/measures');
  //return res.data;
  return z.array(MeasureSchema).safeParse(res.data);
}

export function useMeasures() {
  return useQuery({
    queryKey: ['measures'],
    queryFn: fetchMeasures,
    select: (data) => data.data?.map((measure) => ({ ...measure, label: measure.name, value: measure.id }))
  });
}
