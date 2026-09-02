import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import Card from '../../components/Common/Card';
import StatCard from '../../components/Common/StatCard';
import Button from '../../components/Common/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingState from '../../components/LoadingState/LoadingState';
import { useApp } from '../../context/AppContext';
import { earningsGateway } from '../../services/integrations';

export default function EarningsPage() {
  const { t, showToast } = useApp();
  const [earnings, setEarnings] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);
      const [summary, txList] = await Promise.all([
        earningsGateway.getEarningsSummary(),
        earningsGateway.getTransactions(),
      ]);
      setEarnings(summary);
      setTransactions(txList);
    } catch (err) {
      console.error('Failed to load earnings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading your financial overview..." />;
  }

  const hasEarnings = (earnings?.totalEarnings || 0) > 0 || transactions.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('earnings.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('earnings.subtitle')}
          </p>
        </div>

        {hasEarnings && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast('Statement download simulated (PDF).', 'info')}
            icon={Download}
            className="shrink-0 font-semibold"
          >
            Download Statement
          </Button>
        )}
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t('earnings.summary.totalEarnings')}
          value={`${t('common.currencySymbol')}${earnings?.totalEarnings || 0}`}
          subtitle="Lifetime total billed"
          icon={Wallet}
          color="blue"
        />
        <StatCard
          title={t('earnings.summary.thisMonth')}
          value={`${t('common.currencySymbol')}${earnings?.thisMonth || 0}`}
          subtitle="Current calendar cycle"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title={t('earnings.summary.pendingPayouts')}
          value={`${t('common.currencySymbol')}${earnings?.pendingPayouts || 0}`}
          subtitle="Settlement in 24-48 hrs"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title={t('earnings.summary.completedJobsCount')}
          value={earnings?.completedJobsCount || 0}
          subtitle="Paid customer bookings"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Earnings Visualization / Monthly Breakdown */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('earnings.chartTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('earnings.chartSubtitle')}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Last 6 Months
          </span>
        </div>

        {/* Monthly Bar Chart Placeholder / Structure */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
          {(earnings?.monthlyBreakdown || []).map((item, idx) => {
            const maxVal = Math.max(...(earnings?.monthlyBreakdown || []).map((b) => b.amount), 5000);
            const heightPercent = maxVal > 0 && item.amount > 0 ? (item.amount / maxVal) * 100 : 8;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('common.currencySymbol')}{item.amount}
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                    item.amount > 0
                      ? 'bg-blue-600 dark:bg-blue-500 group-hover:bg-blue-700 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Payout Transactions Table / List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('earnings.recentTransactions')}
        </h3>

        {transactions.length === 0 ? (
          <EmptyState
            title={t('earnings.emptyTransactionsTitle')}
            description={t('earnings.emptyTransactionsDesc')}
            icon={Wallet}
          />
        ) : (
          <Card padding="none" className="overflow-hidden border-slate-200/80 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="px-6 py-3.5">Service & Customer</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Payout Status</th>
                    <th className="px-6 py-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {tx.serviceTitle || 'Completed Service'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {tx.customerName || 'Customer'} • #{tx.bookingId}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                        {tx.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('earnings.payoutStatus')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-white">
                        +{t('common.currencySymbol')}{tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
