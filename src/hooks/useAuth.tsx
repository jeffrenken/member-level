import { useAuth as useClerkAuth } from '@clerk/clerk-react';

export default function useAuth() {
  return useClerkAuth();
}
