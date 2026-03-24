import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetShopsQuery } from '../services/api';
import { Store, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

export function ShopsPage() {
  const { data: shops, isLoading, isError } = useGetShopsQuery();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = (shops?.shops ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-900">All Shops</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {shops ? `${shops.total} shops total` : ''}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-white/40 rounded-lg bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56"
          />
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

      {!isLoading && !isError && pageItems.length > 0 && (
        <>
          <div className="glass-card overflow-hidden mb-4">
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
                {pageItems.map((shop) => (
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/40 bg-white/60 hover:bg-white/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/40 bg-white/60 hover:bg-white/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
