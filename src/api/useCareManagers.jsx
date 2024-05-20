import { useQuery } from '@tanstack/react-query';
import { fetchCareManagers } from '@/api/requests';

export default function useCareManagers() {
  return useQuery({ queryKey: ['careManagers'], queryFn: fetchCareManagers, placeholderData: [] });
}
