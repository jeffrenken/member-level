import useAuth from '@/hooks/useAuth';
import SignInPage from '@/pages/sign-in/SignInPage';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return children;
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return 'Loading...';
  if (!isSignedIn) return <SignInPage />;
  return children;
};
