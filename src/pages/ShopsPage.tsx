import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetShopsQuery } from '../services/api';
import { Store, ArrowRight, Search, ChevronRight } from 'lucide-react';

export function ShopsPage() {
  const { data: shops, isLoading, isError } = useGetShopsQuery();
  const [search, setSearch] = useState('');

  const filtered = (shops?.shops ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-900">All Shops</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {shops ? `${shops.total} shops total` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/plans"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Plans
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-white/40 rounded-lg bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="glass-card p-12 text-center text-sm text-gray-500">
          Loading shops...
        </div>
      )}

      {isError && (
        <div className="glass-card p-12 text-center text-sm text-red-500">
          Failed to load shops. Please try again.
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="glass-card p-12 text-center text-sm text-gray-500">
          {search ? 'No shops match your search.' : 'No shops found.'}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Slug
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Currency
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Created
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filtered.map((shop) => (
                <tr key={shop.id} className="hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="font-medium text-indigo-900">{shop.name}</span>
                      {shop.isDeleted && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                          deleted
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{shop.slug}</td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                    {shop.currency ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">
                    {new Date(shop.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        to={`/shops/${shop.id}/subscription`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-colors"
                      >
                        Subscription
                      </Link>
                      <Link
                        to={`/shops/${shop.id}/usage`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-colors"
                      >
                        Usage
                      </Link>
                      <Link
                        to={`/shops/${shop.id}/activity`}
                        state={{ shopName: shop.name }}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-colors"
                      >
                        Activity
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
