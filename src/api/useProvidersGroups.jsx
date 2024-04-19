import { useQuery } from '@tanstack/react-query';
import { fetchProviderGroups } from '@/api/requests';

export default function useProviderGroups() {
  return useQuery({ queryKey: ['providerGroups'], queryFn: fetchProviderGroups, placeholderData: [] });
}
