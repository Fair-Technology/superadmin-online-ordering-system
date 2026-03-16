import { PublicClientApplication } from '@azure/msal-browser';
import type { Configuration, RedirectRequest } from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_SUPERADMIN_CLIENT_ID,
    authority: import.meta.env.VITE_SUPERADMIN_AUTHORITY + import.meta.env.VITE_SUPERADMIN_TENANT_ID,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'sessionStorage' },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'offline_access'],
};

export const apiRequest = {
  scopes: [import.meta.env.VITE_SUPERADMIN_API_SCOPE as string],
};
