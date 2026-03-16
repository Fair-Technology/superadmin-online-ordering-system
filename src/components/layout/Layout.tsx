import { Outlet } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { LogOut, ShieldCheck } from 'lucide-react';

export function Layout() {
  const { accounts, instance } = useMsal();
  const account = accounts[0];

  const handleSignOut = () => {
    instance.logoutRedirect();
  };

  return (
    <div className="min-h-screen">
      <header className="glass-card rounded-none border-b border-white/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-indigo-900 text-sm">Superadmin</span>
          </div>
          <div className="flex items-center gap-4">
            {account && (
              <span className="text-xs text-gray-500 hidden sm:block">
                {account.username}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
