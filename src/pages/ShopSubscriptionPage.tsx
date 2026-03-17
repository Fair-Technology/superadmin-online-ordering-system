import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetShopSubscriptionQuery, useOverrideShopSubscriptionMutation, useGetPlansQuery } from '../services/api';

const STATUS_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  past_due: 'bg-yellow-100 text-yellow-700',
  canceled: 'bg-orange-100 text-orange-700',
  expired: 'bg-red-100 text-red-600',
};

export function ShopSubscriptionPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetShopSubscriptionQuery({ shopId: shopId! });
  const { data: plansData } = useGetPlansQuery();
  const [override, { isLoading: isOverriding }] = useOverrideShopSubscriptionMutation();

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [reason, setReason] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [overrideError, setOverrideError] = useState<string | null>(null);
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  async function handleOverride() {
    setOverrideError(null);
    setOverrideSuccess(false);
    if (!selectedPlanId) {
      setOverrideError('Please select a plan');
      return;
    }
    if (!reason.trim()) {
      setOverrideError('Override reason is required');
      return;
    }
    try {
      await override({
        shopId: shopId!,
        overrideRequest: {
          planId: selectedPlanId,
          overrideReason: reason.trim(),
          overrideExpiresAt: expiresAt || null,
        },
      }).unwrap();
      setOverrideSuccess(true);
      setReason('');
      setExpiresAt('');
    } catch (err: any) {
      setOverrideError(err?.data?.error ?? 'Failed to apply override');
    }
  }

  if (isLoading) return (
    <div className="glass-card p-12 text-center text-sm text-gray-500">Loading subscription...</div>
  );
  if (isError || !data) return (
    <div className="glass-card p-12 text-center text-sm text-red-500">Failed to load subscription.</div>
  );

  const { subscription, plan } = data;
  const plans = plansData?.plans ?? [];

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-indigo-600 mb-2 inline-block transition-colors"
        >
          ← All Shops
        </button>
        <h1 className="text-2xl font-semibold text-indigo-900">Subscription — Shop {shopId}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current subscription */}
        <div className="glass-card p-5 space-y-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Subscription</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Plan</span>
              <span className="text-indigo-900 font-medium">{plan?.name ?? subscription.planId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[subscription.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {subscription.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Source</span>
              <span className="text-gray-700 text-sm">{subscription.planSource}</span>
            </div>
            {subscription.billingInterval && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Billing Interval</span>
                <span className="text-gray-700 text-sm">{subscription.billingInterval}</span>
              </div>
            )}
            {subscription.currentPeriodEnd && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Period End</span>
                <span className="text-gray-700 text-sm">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
              </div>
            )}
            {subscription.billingCustomerId && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Billing Customer</span>
                <span className="text-gray-500 font-mono text-xs">{subscription.billingCustomerId.slice(0, 12)}…</span>
              </div>
            )}
            {subscription.planSource === 'superadmin_override' && (
              <div className="pt-2 border-t border-white/30 space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Override Info</p>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">By</span>
                  <span className="text-gray-500 font-mono text-xs">{subscription.overriddenBy}</span>
                </div>
                {subscription.overrideReason && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Reason</span>
                    <span className="text-gray-700 text-sm max-w-48 text-right">{subscription.overrideReason}</span>
                  </div>
                )}
                {subscription.overrideExpiresAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Expires</span>
                    <span className="text-gray-700 text-sm">{new Date(subscription.overrideExpiresAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Override form */}
        <div className="glass-card p-5 space-y-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manual Override</p>

          {subscription.status === 'active' && (
            <p className="text-yellow-700 text-xs bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              Warning: this shop has an active paid subscription. Overriding will change its plan.
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plan</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Select a plan…</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.internalKey})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reason (required)</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Trial extension for partner"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expires At (optional)</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {overrideError && <p className="text-red-500 text-sm">{overrideError}</p>}
          {overrideSuccess && <p className="text-green-600 text-sm">Override applied successfully.</p>}

          <button
            onClick={handleOverride}
            disabled={isOverriding}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isOverriding ? 'Applying…' : 'Apply Override'}
          </button>
        </div>
      </div>
    </div>
  );
}
