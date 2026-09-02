import React, { useState, useEffect, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  Download,
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

  /*
   * Generate the current month and previous 5 months.
   *
   * Example:
   * September 2026
   *
   * Apr | May | Jun | Jul | Aug | Sep
   */
  const currentSixMonths = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );

      return {
        month: date.toLocaleString('en-US', {
          month: 'short',
        }),
        monthNumber: date.getMonth(),
        year: date.getFullYear(),
      };
    });
  }, []);

  /*
   * Build chart data.
   *
   * IMPORTANT:
   * The current month's value comes directly from
   * earnings.thisMonth.
   *
   * This means if the worker earns ₹1200 in September,
   * September will show ₹1200.
   */
  const monthlyEarnings = useMemo(() => {
    const source = earnings?.monthlyBreakdown || [];

    return currentSixMonths.map((month, index) => {
      const isCurrentMonth = index === currentSixMonths.length - 1;

      if (isCurrentMonth) {
        return {
          ...month,
          amount: Number(earnings?.thisMonth || 0),
        };
      }

      const existing = source[index];

      return {
        ...month,
        amount: Number(existing?.amount || 0),
      };
    });
  }, [earnings, currentSixMonths]);

  /*
   * Find the highest monthly value.
   *
   * This controls the height of the chart bars.
   */
  const maxMonthlyEarning = useMemo(() => {
    const amounts = monthlyEarnings.map((item) => item.amount);

    return Math.max(...amounts, 100);
  }, [monthlyEarnings]);

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
    return (
      <LoadingState message="Loading your financial overview..." />
    );
  }

  const hasEarnings =
    (earnings?.totalEarnings || 0) > 0 ||
    transactions.length > 0;

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
            onClick={() =>
              showToast(
                'Statement download simulated (PDF).',
                'info'
              )
            }
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
          subtitle="Lifetime total earned"
          icon={Wallet}
          color="blue"
        />

        <StatCard
          title={t('earnings.summary.thisMonth')}
          value={`${t('common.currencySymbol')}${earnings?.thisMonth || 0}`}
          subtitle="Earned this month"
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
          subtitle="Completed paid jobs"
          icon={CheckCircle2}
          color="purple"
        />

      </div>

      {/* Earnings Overview */}
      <Card className="p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Earnings Overview
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly earnings breakdown
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Last 6 Months
          </span>
        </div>

        {/* Monthly Earnings Chart */}
        <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">

          {monthlyEarnings.map((item, index) => {

            const isCurrentMonth =
              index === monthlyEarnings.length - 1;

            const heightPercent =
              item.amount > 0
                ? Math.max(
                    (item.amount / maxMonthlyEarning) * 100,
                    10
                  )
                : 8;

            return (
              <div
                key={`${item.month}-${item.year}`}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >

                {/* Amount */}
                <div
                  className={`text-[10px] font-bold transition-opacity ${
                    isCurrentMonth
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  } text-slate-600 dark:text-slate-300`}
                >
                  {t('common.currencySymbol')}
                  {item.amount}
                </div>

                {/* Earnings Bar */}
                <div
                  style={{
                    height: `${heightPercent}%`,
                  }}
                  className={`w-full max-w-[56px] rounded-t-xl transition-all duration-500 ${
                    item.amount > 0
                      ? 'bg-blue-600 dark:bg-blue-500 group-hover:bg-blue-700 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                />

                {/* Month */}
                <span
                  className={`text-xs font-semibold ${
                    isCurrentMonth
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.month}
                </span>

              </div>
            );
          })}

        </div>
      </Card>

      {/* Recent Job Payouts */}
      <div className="space-y-4">

        <div className="flex items-end justify-between gap-4">

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Job Payouts
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your latest completed jobs and payouts
            </p>
          </div>

          {transactions.length > 0 && (
            <span className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-bold">
              {transactions.length}{' '}
              {transactions.length === 1
                ? 'transaction'
                : 'transactions'}
            </span>
          )}

        </div>

        {transactions.length === 0 ? (
          <EmptyState
            title={t('earnings.emptyTransactionsTitle')}
            description={t('earnings.emptyTransactionsDesc')}
            icon={Wallet}
          />
        ) : (
          <Card
            padding="none"
            className="overflow-hidden border-slate-200/80 dark:border-slate-800"
          >
            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs uppercase text-slate-400 font-bold">
                  <tr>

                    <th className="px-6 py-3.5">
                      Service & Customer
                    </th>

                    <th className="px-6 py-3.5">
                      Completed
                    </th>

                    <th className="px-6 py-3.5">
                      Payout Status
                    </th>

                    <th className="px-6 py-3.5 text-right">
                      Money Gained
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {transactions.map((tx) => (

                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >

                      {/* Service & Customer */}
                      <td className="px-6 py-4">

                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {tx.serviceTitle || 'Completed Service'}
                        </div>

                        <div className="text-xs text-slate-400">
                          {tx.customerName || 'Customer'} • #
                          {tx.bookingId}
                        </div>

                      </td>

                      {/* Completed */}
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                        {tx.date}
                      </td>

                      {/* Payout Status */}
                      <td className="px-6 py-4">

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">

                          <CheckCircle2 className="w-3 h-3" />

                          {t('earnings.payoutStatus')}

                        </span>

                      </td>

                      {/* Money Gained */}
                      <td className="px-6 py-4 text-right">

                        <div className="font-extrabold text-emerald-500 dark:text-emerald-400">
                          +{t('common.currencySymbol')}
                          {tx.amount}
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Money gained
                        </div>

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