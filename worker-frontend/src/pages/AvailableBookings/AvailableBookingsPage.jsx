import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Briefcase,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import BookingCard from '../../components/BookingCard/BookingCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingState from '../../components/LoadingState/LoadingState';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { useApp } from '../../context/AppContext';
import { bookingsGateway } from '../../services/integrations';

export default function AvailableBookingsPage() {
  const { t, showToast } = useApp();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [allBookings, setAllBookings] = useState([]);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Confirmation Modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingsGateway.getAvailableBookings();
      setAllBookings(data);
    } catch (err) {
      console.error('Failed to fetch available bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const categoryOptions = [
    { value: 'all', label: t('availableBookings.allCategories') },
    { value: 'electrician', label: t('services.electrician') },
    { value: 'plumber', label: t('services.plumber') },
    { value: 'cleaner', label: t('services.cleaner') },
    { value: 'carpenter', label: t('services.carpenter') },
    { value: 'mechanic', label: t('services.mechanic') },
    { value: 'painter', label: t('services.painter') },
    { value: 'appliance_repair', label: t('services.appliance_repair') },
    { value: 'gardener', label: t('services.gardener') },
    { value: 'hvac', label: t('services.hvac') },
    { value: 'pest_control', label: t('services.pest_control') },
  ];

  const distanceOptions = [
    { value: 'all', label: t('availableBookings.allDistances') },
    { value: '5', label: t('availableBookings.within5km') },
    { value: '10', label: t('availableBookings.within10km') },
    { value: '25', label: t('availableBookings.within25km') },
  ];

  const dateOptions = [
    { value: 'all', label: t('availableBookings.allDates') },
    { value: 'today', label: t('availableBookings.today') },
    { value: 'tomorrow', label: t('availableBookings.tomorrow') },
    { value: 'thisWeek', label: t('availableBookings.thisWeek') },
  ];

  const sortOptions = [
    { value: 'newest', label: t('availableBookings.sortNewest') },
    { value: 'distance', label: t('availableBookings.sortDistance') },
    { value: 'priceHigh', label: t('availableBookings.sortPriceHigh') },
    { value: 'priceLow', label: t('availableBookings.sortPriceLow') },
  ];

  const filteredBookings = useMemo(() => {
    let list = [...allBookings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.serviceCategory?.toLowerCase().includes(q) ||
          b.locationAddress?.toLowerCase().includes(q) ||
          b.problemDescription?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((b) => b.serviceCategory === selectedCategory);
    }

    if (selectedDistance !== 'all') {
      const maxKm = Number(selectedDistance);
      list = list.filter((b) => (b.distanceKm || 0) <= maxKm);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'distance') return (a.distanceKm || 0) - (b.distanceKm || 0);
      if (sortBy === 'priceHigh') return (b.estimatedPayout || 0) - (a.estimatedPayout || 0);
      if (sortBy === 'priceLow') return (a.estimatedPayout || 0) - (b.estimatedPayout || 0);
      return (b.id || '').localeCompare(a.id || '');
    });

    return list;
  }, [allBookings, searchQuery, selectedCategory, selectedDistance, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDistance('all');
    setSelectedDateFilter('all');
    setSortBy('newest');
  };

  const handleOpenConfirm = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
  };

  const handleCloseConfirm = () => {
    if (isProcessingAction) return;
    setSelectedBooking(null);
    setActionType(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking || !actionType) return;
    try {
      setIsProcessingAction(true);
      if (actionType === 'accept') {
        await bookingsGateway.acceptBooking(selectedBooking.id);
        showToast(t('availableBookings.acceptedSuccess'), 'success');
      } else {
        await bookingsGateway.rejectBooking(selectedBooking.id);
        showToast(t('availableBookings.rejectedSuccess'), 'info');
      }
      handleCloseConfirm();
      fetchBookings();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const isFiltered =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedDistance !== 'all' ||
    selectedDateFilter !== 'all' ||
    sortBy !== 'newest';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('availableBookings.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('availableBookings.subtitle')}
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <Card className="p-4 sm:p-5 shadow-xs border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col gap-4">
          {/* Top Row: Search */}
          <div className="flex-1">
            <Input
              placeholder={t('availableBookings.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              rightElement={
                searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )
              }
            />
          </div>

          {/* Bottom Row: Category, Distance, Date & Sort dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              placeholder=""
            />
            <Select
              options={distanceOptions}
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              placeholder=""
            />
            <Select
              options={dateOptions}
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              placeholder=""
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              placeholder=""
            />
          </div>

          {/* Results Count & Reset Filter button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              {t('availableBookings.resultsCount', { count: filteredBookings.length })}
            </span>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('availableBookings.resetFilters')}</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Bookings Content */}
      {isLoading ? (
        <LoadingState message="Loading available booking requests..." />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title={t('availableBookings.emptyTitle')}
          description={t('availableBookings.emptyDesc')}
          icon={Briefcase}
          actionText={isFiltered ? t('availableBookings.resetFilters') : undefined}
          onAction={isFiltered ? handleResetFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={(id) => navigate(`/booking/${id}`)}
              onAccept={(b) => handleOpenConfirm(b, 'accept')}
              onReject={(b) => handleOpenConfirm(b, 'reject')}
            />
          ))}
        </div>
      )}

      {/* Action Dialog */}
      <ConfirmDialog
        isOpen={!!selectedBooking}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmAction}
        isLoading={isProcessingAction}
        title={
          actionType === 'accept'
            ? t('bookingDetails.acceptJobPrompt')
            : t('bookingDetails.rejectJobPrompt')
        }
        message={
          actionType === 'accept'
            ? t('bookingDetails.acceptJobDesc')
            : t('bookingDetails.rejectJobDesc')
        }
        confirmText={
          actionType === 'accept'
            ? t('bookingDetails.confirmAccept')
            : t('bookingDetails.confirmReject')
        }
        cancelText={t('common.cancel')}
        type={actionType === 'accept' ? 'info' : 'danger'}
      />
    </div>
  );
}
