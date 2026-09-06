import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Briefcase,
  X,
  RotateCcw,
} from 'lucide-react';

import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Card from '../../components/Common/Card';
import BookingCard from '../../components/BookingCard/BookingCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingState from '../../components/LoadingState/LoadingState';
import ConfirmDialog from '../../components/Common/ConfirmDialog';

import { useApp } from '../../context/AppContext';
import {
  bookingsGateway,
  authGateway,
} from '../../services/integrations';

export default function AvailableBookingsPage() {
  const { t, showToast } = useApp();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [allBookings, setAllBookings] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('all');
  const [selectedDistance, setSelectedDistance] =
    useState('all');
  const [selectedDateFilter, setSelectedDateFilter] =
    useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [selectedBooking, setSelectedBooking] =
    useState(null);
  const [actionType, setActionType] = useState(null);
  const [isProcessingAction, setIsProcessingAction] =
    useState(false);

  // =================================================
  // FETCH BOOKINGS
  // =================================================

  const fetchBookings = async () => {
    try {
      setIsLoading(true);

      const data =
        await bookingsGateway.getAvailableBookings();

      const bookings = Array.isArray(data)
        ? data
        : [];

      console.log(
        '[SkillBridge] Worker available bookings:',
        bookings
      );

      setAllBookings(bookings);
    } catch (err) {
      console.error(
        'Failed to fetch available bookings:',
        err
      );

      setAllBookings([]);

      showToast(
        err.message ||
          'Failed to load available service requests.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =================================================
  // WAIT FOR FIREBASE AUTH BEFORE FETCHING
  // =================================================

  useEffect(() => {
    let isMounted = true;

    const unsubscribe =
      authGateway.onAuthStateChanged(
        async (user) => {
          if (!isMounted) return;

          console.log(
            '[SkillBridge] Worker auth state:',
            user
              ? {
                  uid: user.uid,
                  email: user.email,
                }
              : 'SIGNED OUT'
          );

          if (!user) {
            setAllBookings([]);
            setIsLoading(false);
            return;
          }

          await fetchBookings();
        }
      );

    return () => {
      isMounted = false;

      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // =================================================
  // FILTER OPTIONS
  // =================================================

  const categoryOptions = [
    {
      value: 'all',
      label: t(
        'availableBookings.allCategories'
      ),
    },
    {
      value: 'electrician',
      label: t('services.electrician'),
    },
    {
      value: 'plumber',
      label: t('services.plumber'),
    },
    {
      value: 'cleaner',
      label: t('services.cleaner'),
    },
    {
      value: 'carpenter',
      label: t('services.carpenter'),
    },
    {
      value: 'mechanic',
      label: t('services.mechanic'),
    },
    {
      value: 'painter',
      label: t('services.painter'),
    },
    {
      value: 'appliance_repair',
      label: t(
        'services.appliance_repair'
      ),
    },
    {
      value: 'gardener',
      label: t('services.gardener'),
    },
    {
      value: 'hvac',
      label: t('services.hvac'),
    },
    {
      value: 'pest_control',
      label: t('services.pest_control'),
    },
  ];

  const distanceOptions = [
    {
      value: 'all',
      label: t(
        'availableBookings.allDistances'
      ),
    },
    {
      value: '5',
      label: t(
        'availableBookings.within5km'
      ),
    },
    {
      value: '10',
      label: t(
        'availableBookings.within10km'
      ),
    },
    {
      value: '25',
      label: t(
        'availableBookings.within25km'
      ),
    },
  ];

  const dateOptions = [
    {
      value: 'all',
      label: t('availableBookings.allDates'),
    },
    {
      value: 'today',
      label: t('availableBookings.today'),
    },
    {
      value: 'tomorrow',
      label: t(
        'availableBookings.tomorrow'
      ),
    },
    {
      value: 'thisWeek',
      label: t(
        'availableBookings.thisWeek'
      ),
    },
  ];

  const sortOptions = [
    {
      value: 'newest',
      label: t(
        'availableBookings.sortNewest'
      ),
    },
    {
      value: 'distance',
      label: t(
        'availableBookings.sortDistance'
      ),
    },
    {
      value: 'priceHigh',
      label: t(
        'availableBookings.sortPriceHigh'
      ),
    },
    {
      value: 'priceLow',
      label: t(
        'availableBookings.sortPriceLow'
      ),
    },
  ];

  // =================================================
  // FILTER HELPERS
  // =================================================

  const SERVICE_ALIASES = {
    electrician: [
      'electrician',
      'electrical',
      'electric',
    ],
    plumber: [
      'plumber',
      'plumbing',
    ],
    cleaner: [
      'cleaner',
      'cleaning',
      'cleaning services',
    ],
    carpenter: [
      'carpenter',
      'carpentry',
    ],
    mechanic: [
      'mechanic',
      'automotive',
      'car repair',
    ],
    painter: [
      'painter',
      'painting',
    ],
    appliance_repair: [
      'appliance_repair',
      'appliance repair',
      'appliances',
    ],
    gardener: [
      'gardener',
      'gardening',
      'landscaper',
      'landscaping',
    ],
    hvac: [
      'hvac',
      'ac technician',
      'air conditioner',
      'air conditioning',
    ],
    pest_control: [
      'pest control',
      'pest_control',
    ],
  };

  const normalizeText = (value) =>
    String(value || '')
      .trim()
      .toLowerCase();

  /*
   * Find the real service key for a booking.
   *
   * A booking may store its service in:
   * - serviceCategory
   * - serviceName
   * - primaryService
   * - serviceId
   * - title
   * - category
   *
   * This keeps the filter working even when
   * the customer booking uses a different field.
   */
  const getBookingServiceKey = (booking) => {
    const values = [
      booking.serviceCategory,
      booking.serviceName,
      booking.primaryService,
      booking.serviceId,
      booking.title,
      booking.category,
    ]
      .filter(Boolean)
      .map(normalizeText);

    for (const [
      serviceKey,
      aliases,
    ] of Object.entries(
      SERVICE_ALIASES
    )) {
      const matched = values.some(
        (value) =>
          aliases.some(
            (alias) =>
              value === alias ||
              value.includes(alias) ||
              alias.includes(value)
          )
      );

      if (matched) {
        return serviceKey;
      }
    }

    return '';
  };

  /*
   * Get a usable numeric distance.
   *
   * Firestore bookings may contain:
   * - distanceKm
   * - distance
   * - distanceText / distanceLabel
   *
   * "Nearby" is treated as within 5 km so
   * the distance filter remains useful for
   * customer-created bookings that do not
   * contain an exact number.
   */
  const getBookingDistance = (booking) => {
    const distance = Number(
      booking.distanceKm ??
        booking.distance ??
        NaN
    );

    if (Number.isFinite(distance)) {
      return distance;
    }

    const distanceText =
      normalizeText(
        booking.distanceText ||
          booking.distanceLabel
      );

    if (
      distanceText.includes(
        'nearby'
      )
    ) {
      return 5;
    }

    return null;
  };

  /*
   * Convert the booking date into a real Date.
   *
   * Supports:
   * - normal dates such as 2026-09-06
   * - "Scheduled for Today"
   * - "Today"
   * - "Tomorrow"
   */
  const getBookingDate = (booking) => {
    const rawDate =
      booking.date ||
      booking.scheduledDate ||
      booking.bookingDate;

    if (!rawDate) {
      return null;
    }

    const normalized =
      normalizeText(rawDate);

    if (
      normalized.includes(
        'today'
      )
    ) {
      const today =
        new Date();

      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
    }

    if (
      normalized.includes(
        'tomorrow'
      )
    ) {
      const tomorrow =
        new Date();

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      return new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate()
      );
    }

    const parsed =
      new Date(rawDate);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return null;
    }

    return new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate()
    );
  };

  const isSameDay = (
    bookingDate,
    targetDate
  ) => {
    if (
      !bookingDate ||
      !targetDate
    ) {
      return false;
    }

    return (
      bookingDate.getFullYear() ===
        targetDate.getFullYear() &&
      bookingDate.getMonth() ===
        targetDate.getMonth() &&
      bookingDate.getDate() ===
        targetDate.getDate()
    );
  };

  const isWithinThisWeek = (
    bookingDate
  ) => {
    if (!bookingDate) {
      return false;
    }

    const today =
      new Date();

    const startOfToday =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

    const dayOfWeek =
      startOfToday.getDay();

    const mondayOffset =
      dayOfWeek === 0
        ? -6
        : 1 - dayOfWeek;

    const startOfWeek =
      new Date(
        startOfToday
      );

    startOfWeek.setDate(
      startOfToday.getDate() +
        mondayOffset
    );

    const endOfWeek =
      new Date(
        startOfWeek
      );

    endOfWeek.setDate(
      startOfWeek.getDate() + 6
    );

    endOfWeek.setHours(
      23,
      59,
      59,
      999
    );

    return (
      bookingDate >=
        startOfWeek &&
      bookingDate <=
        endOfWeek
    );
  };

  // =================================================
  // FILTER + SORT BOOKINGS
  // =================================================

  const filteredBookings =
    useMemo(() => {
      let list = [
        ...allBookings,
      ];

      // ---------------------------------------------
      // SEARCH
      // ---------------------------------------------

      if (
        searchQuery.trim()
      ) {
        const q =
          searchQuery
            .trim()
            .toLowerCase();

        list = list.filter(
          (booking) => {
            const searchableText =
              [
                booking.title,
                booking.serviceName,
                booking.serviceCategory,
                booking.primaryService,
                booking.serviceId,
                booking.category,
                booking.locationAddress,
                booking.address,
                booking.problemDescription,
                booking.notes,
                booking.customerName,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(
              q
            );
          }
        );
      }

      // ---------------------------------------------
      // SERVICE / CATEGORY
      // ---------------------------------------------

      if (
        selectedCategory !==
        'all'
      ) {
        list =
          list.filter(
            (booking) =>
              getBookingServiceKey(
                booking
              ) ===
              selectedCategory
          );
      }

      // ---------------------------------------------
      // DISTANCE
      // ---------------------------------------------

      if (
        selectedDistance !==
        'all'
      ) {
        const maxKm =
          Number(
            selectedDistance
          );

        list =
          list.filter(
            (booking) => {
              const distance =
                getBookingDistance(
                  booking
                );

              return (
                distance !== null &&
                distance <= maxKm
              );
            }
          );
      }

      // ---------------------------------------------
      // DATE
      // ---------------------------------------------

      if (
        selectedDateFilter !==
        'all'
      ) {
        const today =
          new Date();

        const todayDate =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );

        const tomorrow =
          new Date(
            todayDate
          );

        tomorrow.setDate(
          tomorrow.getDate() + 1
        );

        list =
          list.filter(
            (booking) => {
              const bookingDate =
                getBookingDate(
                  booking
                );

              if (
                !bookingDate
              ) {
                return false;
              }

              if (
                selectedDateFilter ===
                'today'
              ) {
                return isSameDay(
                  bookingDate,
                  todayDate
                );
              }

              if (
                selectedDateFilter ===
                'tomorrow'
              ) {
                return isSameDay(
                  bookingDate,
                  tomorrow
                );
              }

              if (
                selectedDateFilter ===
                'thisWeek'
              ) {
                return isWithinThisWeek(
                  bookingDate
                );
              }

              return true;
            }
          );
      }

      // ---------------------------------------------
      // SORT
      // ---------------------------------------------

      list.sort(
        (a, b) => {
          // Nearest First
          if (
            sortBy ===
            'distance'
          ) {
            const distanceA =
              getBookingDistance(
                a
              );

            const distanceB =
              getBookingDistance(
                b
              );

            if (
              distanceA ===
                null &&
              distanceB ===
                null
            ) {
              return 0;
            }

            if (
              distanceA ===
              null
            ) {
              return 1;
            }

            if (
              distanceB ===
              null
            ) {
              return -1;
            }

            return (
              distanceA -
              distanceB
            );
          }

          // Highest payout
          if (
            sortBy ===
            'priceHigh'
          ) {
            return (
              Number(
                b.estimatedPayout ??
                  b.amount ??
                  0
              ) -
              Number(
                a.estimatedPayout ??
                  a.amount ??
                  0
              )
            );
          }

          // Lowest payout
          if (
            sortBy ===
            'priceLow'
          ) {
            return (
              Number(
                a.estimatedPayout ??
                  a.amount ??
                  0
              ) -
              Number(
                b.estimatedPayout ??
                  b.amount ??
                  0
              )
            );
          }

          // Newest First
          const createdA =
            a.createdAt
              ? new Date(
                  a.createdAt
                ).getTime()
              : 0;

          const createdB =
            b.createdAt
              ? new Date(
                  b.createdAt
                ).getTime()
              : 0;

          if (
            Number.isFinite(
              createdA
            ) &&
            Number.isFinite(
              createdB
            )
          ) {
            return (
              createdB -
              createdA
            );
          }

          return String(
            b.id || ''
          ).localeCompare(
            String(
              a.id || ''
            )
          );
        }
      );

      return list;
    }, [
      allBookings,
      searchQuery,
      selectedCategory,
      selectedDistance,
      selectedDateFilter,
      sortBy,
    ]);

  // =================================================
  // RESET FILTERS
  // =================================================

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDistance('all');
    setSelectedDateFilter('all');
    setSortBy('newest');
  };

  // =================================================
  // CONFIRM ACTION
  // =================================================

  const handleOpenConfirm = (
    booking,
    type
  ) => {
    setSelectedBooking(booking);
    setActionType(type);
  };

  const handleCloseConfirm = () => {
    if (isProcessingAction) return;

    setSelectedBooking(null);
    setActionType(null);
  };

  // =================================================
  // ACCEPT / REJECT
  // =================================================

  const handleConfirmAction =
    async () => {
      if (
        !selectedBooking ||
        !actionType
      ) {
        return;
      }

      try {
        setIsProcessingAction(
          true
        );

        if (
          actionType === 'accept'
        ) {
          await bookingsGateway.acceptBooking(
            selectedBooking.id
          );

          showToast(
            t(
              'availableBookings.acceptedSuccess'
            ),
            'success'
          );
        } else {
          await bookingsGateway.rejectBooking(
            selectedBooking.id
          );

          showToast(
            t(
              'availableBookings.rejectedSuccess'
            ),
            'info'
          );
        }

        setSelectedBooking(null);
        setActionType(null);

        await fetchBookings();
      } catch (err) {
        console.error(
          `Failed to ${actionType} booking:`,
          err
        );

        showToast(
          err.message ||
            'Booking request could not be updated.',
          'error'
        );
      } finally {
        setIsProcessingAction(
          false
        );
      }
    };

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedDistance !== 'all' ||
    selectedDateFilter !==
      'all' ||
    sortBy !== 'newest';

  // =================================================
  // UI
  // =================================================

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t(
            'availableBookings.title'
          )}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t(
            'availableBookings.subtitle'
          )}
        </p>
      </div>

      {/* SEARCH + FILTERS */}
      <Card className="p-4 sm:p-5 shadow-xs border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col gap-4">

          {/* SEARCH */}
          <div className="flex-1">
            <Input
              placeholder={t(
                'availableBookings.searchPlaceholder'
              )}
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              icon={Search}
              rightElement={
                searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery(
                        ''
                      )
                    }
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )
              }
            />
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            <Select
              options={categoryOptions}
              value={
                selectedCategory
              }
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              placeholder=""
            />

            <Select
              options={distanceOptions}
              value={
                selectedDistance
              }
              onChange={(e) =>
                setSelectedDistance(
                  e.target.value
                )
              }
              placeholder=""
            />

            <Select
              options={dateOptions}
              value={
                selectedDateFilter
              }
              onChange={(e) =>
                setSelectedDateFilter(
                  e.target.value
                )
              }
              placeholder=""
            />

            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              placeholder=""
            />

          </div>

          {/* RESULT COUNT */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">

            <span className="font-semibold text-slate-600 dark:text-slate-400">
              {t(
                'availableBookings.resultsCount',
                {
                  count:
                    filteredBookings.length,
                }
              )}
            </span>

            {isFiltered && (
              <button
                type="button"
                onClick={
                  handleResetFilters
                }
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />

                <span>
                  {t(
                    'availableBookings.resetFilters'
                  )}
                </span>
              </button>
            )}

          </div>
        </div>
      </Card>

      {/* BOOKINGS */}
      {isLoading ? (
        <LoadingState
          message="Loading available booking requests..."
        />
      ) : filteredBookings.length ===
        0 ? (
        <EmptyState
          title={t(
            'availableBookings.emptyTitle'
          )}
          description={t(
            'availableBookings.emptyDesc'
          )}
          icon={Briefcase}
          actionText={
            isFiltered
              ? t(
                  'availableBookings.resetFilters'
                )
              : undefined
          }
          onAction={
            isFiltered
              ? handleResetFilters
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {filteredBookings.map(
            (booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}

                onViewDetails={(id) =>
                  navigate(
                    `/booking/${id}`
                  )
                }

                onAccept={(booking) =>
                  handleOpenConfirm(
                    booking,
                    'accept'
                  )
                }

                onReject={(booking) =>
                  handleOpenConfirm(
                    booking,
                    'reject'
                  )
                }
              />
            )
          )}

        </div>
      )}

      {/* CONFIRMATION */}
      <ConfirmDialog
        isOpen={
          !!selectedBooking
        }
        onClose={
          handleCloseConfirm
        }
        onConfirm={
          handleConfirmAction
        }
        isLoading={
          isProcessingAction
        }

        title={
          actionType === 'accept'
            ? t(
                'bookingDetails.acceptJobPrompt'
              )
            : t(
                'bookingDetails.rejectJobPrompt'
              )
        }

        message={
          actionType === 'accept'
            ? t(
                'bookingDetails.acceptJobDesc'
              )
            : t(
                'bookingDetails.rejectJobDesc'
              )
        }

        confirmText={
          actionType === 'accept'
            ? t(
                'bookingDetails.confirmAccept'
              )
            : t(
                'bookingDetails.confirmReject'
              )
        }

        cancelText={t(
          'common.cancel'
        )}

        type={
          actionType === 'accept'
            ? 'info'
            : 'danger'
        }
      />

    </div>
  );
}