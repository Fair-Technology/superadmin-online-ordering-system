import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export function RequireAuth({ children }: Props) {
  const { accounts, inProgress } = useMsal();

  // MSAL is still processing the redirect — don't make a routing decision yet
  if (inProgress !== InteractionStatus.None) {
    return null;
  }

  if (accounts.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
