import { baseApi } from './baseApi';

export interface ShopResponse {
  id: string;
  name: string;
  slug: string;
  isDeleted: boolean;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopsListResponse {
  shops: ShopResponse[];
  total: number;
}

export interface AuditChange {
  field: string;
  from: unknown;
  to: unknown;
}

export interface AuditEntry {
  id: string;
  shopId: string;
  timestamp: string;
  actorId: string;
  actorEmail?: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  changes?: AuditChange[];
  ipAddress?: string;
  userAgent?: string;
  ttl: number;
}

export interface AuditEntriesResponse {
  entries: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export const api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShops: build.query<ShopsListResponse, void>({
      query: () => '/shops',
      providesTags: ['Shops'],
    }),
    getAuditEntriesByShop: build.query<
      AuditEntriesResponse,
      { shopId: string; page?: number; pageSize?: number }
    >({
      query: ({ shopId, page = 1, pageSize = 20 }) =>
        `/shops/${shopId}/audit?page=${page}&pageSize=${pageSize}`,
      providesTags: (_result, _err, { shopId }) => [{ type: 'AuditEntries', id: shopId }],
    }),
  }),
});

export const { useGetShopsQuery, useGetAuditEntriesByShopQuery } = api;
