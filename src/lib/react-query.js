import { QueryClient, QueryCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: false
  }
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message);
      console.log('error', error);
    }
  })
});
