import { useQuery } from '@tanstack/react-query';
import { fetchSrfScores, fetchOtherContractSrfScores } from '@/api/requests';

export function useSrfScores({ measure, limit, year = 2022 }) {
  //const selectedMeasure = useRecoilValue(measureState);
  return useQuery({
    queryKey: ['srfScores', measure, limit],
    queryFn: () => fetchSrfScores({ measure, limit, year }),
    enabled: !!measure,
    placeholderData: []
  });
}

export function useOtherContractSrfScores({ contract, year, measure }) {
  //const selectedMeasure = useRecoilValue(measureState);

  return useQuery({
    queryKey: ['otherContractSrfScores', contract, year, measure],
    queryFn: () => fetchOtherContractSrfScores({ contract, year, measure }),
    enabled: !!contract && !!year,
    placeholderData: []
  });
}
