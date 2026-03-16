import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Navigate } from 'react-router-dom';
import { useGetMeQuery } from '../services/api';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';

interface Props {
  children: React.ReactNode;
}

export function RequireAuth({ children }: Props) {
  const { accounts, inProgress } = useMsal();

  const isAuthenticated = accounts.length > 0;

  // Skip the /users/me call until MSAL is settled and the user is authenticated
  const { data: profile, isLoading: profileLoading } = useGetMeQuery(undefined, {
    skip: inProgress !== InteractionStatus.None || !isAuthenticated,
  });

  // MSAL is still processing the redirect — don't make a routing decision yet
  if (inProgress !== InteractionStatus.None) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Waiting for profile to load
  if (profileLoading || !profile) {
    return null;
  }

  if (profile.systemRole !== 'superadmin') {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
}
