import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPlanPricingQuery, useGetPlanQuery, useSetPlanPricingMutation } from '../services/api';
import type { PlanPricingResponse } from '../services/api';

function formatCents(cents: number) {
  return (cents / 100).toFixed(2);
}

export function PlanPricingPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { data: planData } = useGetPlanQuery({ planId: planId! });
  const { data: pricingData, isLoading } = useGetPlanPricingQuery({ planId: planId! });
  const [setPricing, { isLoading: isSaving }] = useSetPlanPricingMutation();

  const [showAdd, setShowAdd] = useState(false);
  const [currency, setCurrency] = useState('');
  const [monthly, setMonthly] = useState('');
  const [yearly, setYearly] = useState('');
  const [monthlyPriceId, setMonthlyPriceId] = useState('');
  const [yearlyPriceId, setYearlyPriceId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setFormError(null);
    setSaved(false);
    if (!currency.trim() || !/^[A-Z]{3}$/.test(currency.trim())) {
      setFormError('Currency must be a 3-letter ISO code (e.g. EUR, USD, AUD)');
      return;
    }
    const monthlyVal = Math.round(Number(monthly) * 100);
    const yearlyVal = Math.round(Number(yearly) * 100);
    if (isNaN(monthlyVal) || monthlyVal < 0) {
      setFormError('Monthly amount must be a non-negative number');
      return;
    }
    if (isNaN(yearlyVal) || yearlyVal < 0) {
      setFormError('Yearly amount must be a non-negative number');
      return;
    }
    try {
      await setPricing({
        planId: planId!,
        setPlanPricingRequest: {
          currency: currency.trim().toUpperCase(),
          monthlyAmountCents: monthlyVal,
          yearlyAmountCents: yearlyVal,
          billingPriceIdMonthly: monthlyPriceId.trim() || null,
          billingPriceIdYearly: yearlyPriceId.trim() || null,
        },
      }).unwrap();
      setSaved(true);
      setShowAdd(false);
      setCurrency(''); setMonthly(''); setYearly(''); setMonthlyPriceId(''); setYearlyPriceId('');
    } catch (err: any) {
      setFormError(err?.data?.error ?? 'Failed to save pricing');
    }
  }

  const pricing: PlanPricingResponse[] = Array.isArray(pricingData) ? pricingData : [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/plans')}
            className="text-sm text-gray-500 hover:text-indigo-600 mb-2 inline-block transition-colors"
          >
            ← Plans
          </button>
          <h1 className="text-2xl font-semibold text-indigo-900">
            Pricing — {planData?.plan?.name ?? planId}
          </h1>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Add / Update Currency
        </button>
      </div>

      {showAdd && (
        <div className="glass-card p-5 mb-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">Set Pricing for Currency</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Currency (ISO 4217)</label>
              <input
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                placeholder="EUR"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Monthly Price</label>
              <input
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                placeholder="0.00"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Yearly Price</label>
              <input
                type="number"
                value={yearly}
                onChange={(e) => setYearly(e.target.value)}
                placeholder="0.00"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Billing Price ID Monthly (optional)</label>
              <input
                value={monthlyPriceId}
                onChange={(e) => setMonthlyPriceId(e.target.value)}
                placeholder="price_xxx"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Billing Price ID Yearly (optional)</label>
              <input
                value={yearlyPriceId}
                onChange={(e) => setYearlyPriceId(e.target.value)}
                placeholder="price_xxx"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          {saved && <p className="text-green-600 text-sm">Saved.</p>}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="glass-card p-12 text-center text-sm text-gray-500">Loading pricing...</div>
      )}

      {!isLoading && pricing.length === 0 && (
        <div className="glass-card p-12 text-center text-sm text-gray-500">No pricing configured yet.</div>
      )}

      {!isLoading && pricing.length > 0 && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Yearly</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Price ID Monthly</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Price ID Yearly</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {pricing.map((p) => (
                <tr key={p.id} className="hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-indigo-900">{p.currency}</td>
                  <td className="px-6 py-4 text-gray-700">{formatCents(p.monthlyAmountCents)}</td>
                  <td className="px-6 py-4 text-gray-700">{formatCents(p.yearlyAmountCents)}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs hidden md:table-cell">{p.billingPriceIdMonthly ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs hidden md:table-cell">{p.billingPriceIdYearly ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
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
