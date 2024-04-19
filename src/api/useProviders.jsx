import { useQuery } from '@tanstack/react-query';
import { fetchProviders } from '@/api/requests';

export default function useProviders() {
  return useQuery({ queryKey: ['providers'], queryFn: fetchProviders, placeholderData: [] });
}
