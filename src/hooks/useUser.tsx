import { useUser as useClerkUser } from '@clerk/clerk-react';

export default function useUser() {
  return useClerkUser();
}
