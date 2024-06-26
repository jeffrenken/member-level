import { useQuery } from '@tanstack/react-query';
import { fetchProviderGroups } from '@/api/requests';

export function useProviderGroups() {
  return useQuery({ queryKey: ['providerGroups'], queryFn: fetchProviderGroups, placeholderData: [] });
}
