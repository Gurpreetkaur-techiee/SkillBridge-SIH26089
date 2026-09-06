import React, { useEffect, useState } from 'react';
import {
  Search,
  Star,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const DUMMY_WORKERS = [
  {
    id: 'demo-electrician',
    name: 'Amit Sharma',
    role: 'Electrician',
    category: 'Home Repair',
    rating: 4.9,
    reviewsCount: 128,
    hourlyRate: 499,
    distanceKm: 2.4,
    distanceText: '2.4 km away',
    responseTime: 'Usually responds in 10 min',
    completedJobs: 186,
    badge: 'Top Rated',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    skills: [
      'Wiring',
      'Switch Repair',
      'Lighting',
      'Fan Installation',
    ],
    availability: 'Available',
    isOnline: true,
    verified: true,
    bio:
      'Experienced electrician specializing in home electrical repairs, installations, and troubleshooting.',
  },
  {
    id: 'demo-plumber',
    name: 'Rahul Verma',
    role: 'Plumber',
    category: 'Home Repair',
    rating: 4.8,
    reviewsCount: 94,
    hourlyRate: 449,
    distanceKm: 3.1,
    distanceText: '3.1 km away',
    responseTime: 'Usually responds in 15 min',
    completedJobs: 143,
    badge: 'Reliable Pro',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    skills: [
      'Pipe Repair',
      'Leak Fixing',
      'Tap Installation',
      'Bathroom Repair',
    ],
    availability: 'Available',
    isOnline: true,
    verified: true,
    bio:
      'Skilled plumber handling emergency leaks, bathroom repairs, pipe work, and fixture installation.',
  },
  {
    id: 'demo-cleaner',
    name: 'Neha Singh',
    role: 'Cleaner',
    category: 'Cleaning',
    rating: 4.7,
    reviewsCount: 76,
    hourlyRate: 299,
    distanceKm: 1.8,
    distanceText: '1.8 km away',
    responseTime: 'Usually responds in 20 min',
    completedJobs: 112,
    badge: 'Highly Rated',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    skills: [
      'Home Cleaning',
      'Deep Cleaning',
      'Kitchen Cleaning',
      'Bathroom Cleaning',
    ],
    availability: 'Available',
    isOnline: true,
    verified: true,
    bio:
      'Professional home cleaner offering detailed cleaning services for kitchens, bathrooms, and living spaces.',
  },
  {
    id: 'demo-mechanic',
    name: 'Vikram Patel',
    role: 'Mechanic',
    category: 'Automotive',
    rating: 4.9,
    reviewsCount: 141,
    hourlyRate: 599,
    distanceKm: 4.6,
    distanceText: '4.6 km away',
    responseTime: 'Usually responds in 12 min',
    completedJobs: 219,
    badge: 'Top Rated',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    skills: [
      'Car Repair',
      'Bike Repair',
      'Oil Change',
      'Brake Service',
    ],
    availability: 'Available',
    isOnline: false,
    verified: true,
    bio:
      'Experienced automotive mechanic providing vehicle diagnostics, maintenance, and repair services.',
  },
  {
    id: 'demo-carpenter',
    name: 'Suresh Kumar',
    role: 'Carpenter',
    category: 'Home Repair',
    rating: 4.8,
    reviewsCount: 88,
    hourlyRate: 449,
    distanceKm: 5.2,
    distanceText: '5.2 km away',
    responseTime: 'Usually responds in 18 min',
    completedJobs: 126,
    badge: 'SkillBridge Pro',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    skills: [
      'Furniture Repair',
      'Woodwork',
      'Door Repair',
      'Shelf Installation',
    ],
    availability: 'Available',
    isOnline: true,
    verified: true,
    bio:
      'Professional carpenter specializing in furniture repair, custom woodwork, and home installations.',
  },
  {
    id: 'demo-painter',
    name: 'Arjun Mehta',
    role: 'Painter',
    category: 'Home Repair',
    rating: 4.6,
    reviewsCount: 63,
    hourlyRate: 399,
    distanceKm: 6.3,
    distanceText: '6.3 km away',
    responseTime: 'Usually responds in 25 min',
    completedJobs: 97,
    badge: 'Verified Pro',
    avatar:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&q=80&w=250',
    skills: [
      'Wall Painting',
      'Interior Painting',
      'Exterior Painting',
      'Touch Ups',
    ],
    availability: 'Available',
    isOnline: false,
    verified: true,
    bio:
      'Experienced painter helping customers with interior, exterior, and touch-up painting projects.',
  },
];

const SERVICE_FILTERS = [
  {
    id: 'electrician',
    label: 'Electrician',
  },
  {
    id: 'plumber',
    label: 'Plumber',
  },
  {
    id: 'cleaner',
    label: 'Cleaner',
  },
  {
    id: 'mechanic',
    label: 'Mechanic',
  },
  {
    id: 'carpenter',
    label: 'Carpenter',
  },
  {
    id: 'painter',
    label: 'Painter',
  },
  {
    id: 'appliance_repair',
    label: 'Appliance Repair',
  },
  {
    id: 'gardener',
    label: 'Gardener & Landscaper',
  },
  {
    id: 'hvac',
    label: 'AC & HVAC Technician',
  },
  {
    id: 'pest_control',
    label: 'Pest Control',
  },
];

/*
 * These keywords map worker information to the service
 * filters used across Customer Home and Find Workers.
 */
const SERVICE_KEYWORDS = {
  electrician: [
    'electrician',
    'electric',
    'electrical',
    'wiring',
  ],

  plumber: [
    'plumber',
    'plumbing',
    'pipe',
    'pipes',
    'leak',
  ],

  cleaner: [
    'cleaner',
    'cleaning',
    'house cleaning',
    'deep cleaning',
  ],

  mechanic: [
    'mechanic',
    'automotive',
    'auto',
    'car repair',
    'bike repair',
  ],

  carpenter: [
    'carpenter',
    'carpentry',
    'woodwork',
    'furniture repair',
  ],

  painter: [
    'painter',
    'painting',
    'wall painting',
    'interior painting',
    'exterior painting',
  ],

  appliance_repair: [
    'appliance',
    'appliances',
    'appliance repair',
    'refrigerator',
    'fridge',
    'washing machine',
    'microwave',
    'oven',
    'dishwasher',
    'geyser',
    'chimney',
    'mixer',
    'grinder',
    'television',
    'tv',
  ],

  gardener: [
    'gardener',
    'gardening',
    'landscaper',
    'landscaping',
    'garden',
  ],

  hvac: [
    'hvac',
    'ac technician',
    'air conditioner',
    'air conditioning',
    'ac repair',
    'cooling',
  ],

  pest_control: [
    'pest',
    'pest control',
    'termite',
    'mosquito',
    'cockroach',
  ],
};

export function FindWorkersView() {
  const {
    searchQuery,
    setSearchQuery,
    setSelectedService,
    setSelectedWorker,

    /*
     * These now come directly from AppContext.
     *
     * Popular Services writes to this state.
     * Find Workers reads and updates the same state.
     */
    selectedServiceFilters,
    setSelectedServiceFilters,
  } = useApp();

  const { t } = useLanguage();

  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [workersError, setWorkersError] = useState('');

  const [onlyOnline, setOnlyOnline] = useState(false);

  /*
   * Load workers from Firestore.
   *
   * Demo workers are only used when the workers collection
   * has no records.
   */
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setLoadingWorkers(true);
        setWorkersError('');

        const workersSnapshot = await getDocs(
          collection(db, 'workers')
        );

        const workersData =
          workersSnapshot.docs.map((workerDoc) => {
            const data = workerDoc.data();

            const secondarySkills =
              Array.isArray(data.secondarySkills)
                ? data.secondarySkills
                : [];

            const skills =
              Array.isArray(data.skills)
                ? data.skills
                : [
                    ...(data.primaryService
                      ? [data.primaryService]
                      : []),
                    ...secondarySkills,
                  ];

            const hourlyRate = Number(
              data.hourlyRate ?? data.price
            );

            const completedJobs = Number(
              data.completedJobs ??
                data.completedJobsCount ??
                0
            );

            const workerName =
              data.name ||
              data.fullName ||
              'SkillBridge Professional';

            const workerRole =
              data.role ||
              data.specialization ||
              data.primaryService ||
              'Professional';

            /*
             * Keep workers without a known category as Other
             * instead of putting them into Home Repair.
             */
            const roleLower =
              workerRole.toLowerCase();

            const workerCategory =
              data.category ||
              (roleLower.includes('clean')
                ? 'Cleaning'
                : roleLower.includes('mechanic') ||
                    roleLower.includes('automotive')
                  ? 'Automotive'
                  : roleLower.includes('electric') ||
                      roleLower.includes('plumb') ||
                      roleLower.includes('carpenter') ||
                      roleLower.includes('painter')
                    ? 'Home Repair'
                    : 'Other');

            const isAvailable =
              typeof data.isAvailable === 'boolean'
                ? data.isAvailable
                : true;

            return {
              id: workerDoc.id,

              name: workerName,

              role: workerRole,

              category: workerCategory,

              rating:
                Number(data.rating) || 0,

              reviewsCount:
                Number(
                  data.reviewsCount ??
                    data.reviews ??
                    0
                ),

              hourlyRate:
                Number.isFinite(hourlyRate) &&
                hourlyRate > 0
                  ? hourlyRate
                  : 300,

              distanceKm:
                Number(data.distanceKm) || 0,

              distanceText:
                data.distanceText ||
                (data.distanceKm
                  ? `${data.distanceKm} km away`
                  : data.serviceArea ||
                    'Location available'),

              responseTime:
                data.responseTime ||
                'Contact for availability',

              completedJobs,

              badge:
                data.badge ||
                (data.verified
                  ? 'Verified Pro'
                  : 'SkillBridge Professional'),

              avatar:
                data.avatar ||
                data.avatarUrl ||
                data.photoURL ||
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',

              skills,

              availability:
                data.availability ||
                (isAvailable
                  ? 'Available'
                  : 'Unavailable'),

              isOnline:
                typeof data.isOnline === 'boolean'
                  ? data.isOnline
                  : isAvailable,

              verified:
                Boolean(data.verified),

              bio:
                data.bio ||
                'Verified professional available through SkillBridge.',
            };
          });

        /*
         * Use Firestore workers when available.
         * Otherwise keep the existing prototype demo workers.
         */
        setWorkers(
          workersData.length > 0
            ? workersData
            : DUMMY_WORKERS
        );

      } catch (error) {
        console.error(
          'Error loading workers from Firestore:',
          error
        );

        setWorkersError(
          'Unable to load professionals from Firebase.'
        );
      } finally {
        setLoadingWorkers(false);
      }
    };

    loadWorkers();
  }, []);

  /*
   * Toggle a service filter.
   *
   * Multiple filters can be selected simultaneously.
   *
   * Electrician + Plumber
   * means:
   *
   * Electrician OR Plumber
   */
  const toggleServiceFilter = (serviceId) => {
    setSelectedServiceFilters((previous) => {
      if (previous.includes(serviceId)) {
        return previous.filter(
          (id) => id !== serviceId
        );
      }

      return [
        ...previous,
        serviceId,
      ];
    });
  };

  /*
   * Clear all service filters.
   */
  const clearServiceFilters = () => {
    setSelectedServiceFilters([]);
  };

  /*
   * Filter workers.
   *
   * Search:
   * searches names, roles, categories and skills.
   *
   * Service filters:
   * multiple selections use OR logic.
   *
   * Available Now:
   * is an additional AND condition.
   */
  const filteredWorkers =
    workers.filter((worker) => {
      const search =
        searchQuery.trim().toLowerCase();

      const workerSkills =
        Array.isArray(worker.skills)
          ? worker.skills
          : [];

      const workerName =
        String(worker.name || '');

      const workerRole =
        String(worker.role || '');

      const workerCategory =
        String(worker.category || '');

      const workerText = `
        ${workerName}
        ${workerRole}
        ${workerCategory}
        ${workerSkills.join(' ')}
      `.toLowerCase();

      /*
       * A worker who explicitly offers Everything
       * can match every service filter.
       */
      const offersEverything =
        workerSkills.some(
          (skill) =>
            String(skill)
              .trim()
              .toLowerCase() ===
            'everything'
        );

      /*
       * Normal text search.
       */
      const matchesSearch =
        !search ||
        workerName
          .toLowerCase()
          .includes(search) ||
        workerRole
          .toLowerCase()
          .includes(search) ||
        workerCategory
          .toLowerCase()
          .includes(search) ||
        workerSkills.some((skill) =>
          String(skill)
            .toLowerCase()
            .includes(search)
        );

      /*
       * Service filter.
       *
       * If there are no selected services,
       * all workers pass.
       *
       * If there are multiple selected services,
       * matching ANY one of them is enough.
       */
      const matchesServiceFilters =
        selectedServiceFilters.length === 0 ||
        offersEverything ||
        selectedServiceFilters.some(
          (serviceId) => {
            const keywords =
              SERVICE_KEYWORDS[serviceId] ||
              [];

            return keywords.some(
              (keyword) =>
                workerText.includes(
                  String(
                    keyword
                  ).toLowerCase()
                )
            );
          }
        );

      /*
       * Available Now is an independent filter.
       */
      const matchesOnline =
        !onlyOnline ||
        worker.isOnline;

      return (
        matchesSearch &&
        matchesServiceFilters &&
        matchesOnline
      );
    });

  /*
   * Open booking modal for the selected worker.
   */
  const handleBook = (worker) => {
    const role =
      worker.role.toLowerCase();

    const workerText = `
      ${worker.role}
      ${worker.category}
      ${worker.skills.join(' ')}
    `.toLowerCase();

    let serviceId =
      'general-service';

    /*
     * Appliance services first.
     */
    if (
      workerText.includes('appliance') ||
      workerText.includes('refrigerator') ||
      workerText.includes('fridge') ||
      workerText.includes('washing machine') ||
      workerText.includes('microwave') ||
      workerText.includes('oven') ||
      workerText.includes('dishwasher') ||
      workerText.includes('geyser') ||
      workerText.includes('chimney')
    ) {
      serviceId =
        'appliance_repair';

    } else if (
      workerText.includes('hvac') ||
      workerText.includes('ac technician') ||
      workerText.includes('air conditioner') ||
      workerText.includes('air conditioning')
    ) {
      serviceId = 'hvac';

    } else if (
      role.includes('electric')
    ) {
      serviceId =
        'electrician';

    } else if (
      role.includes('plumb')
    ) {
      serviceId =
        'plumber';

    } else if (
      role.includes('clean')
    ) {
      serviceId =
        'cleaner';

    } else if (
      role.includes('mechanic') ||
      role.includes('automotive')
    ) {
      serviceId =
        'mechanic';

    } else if (
      role.includes('carpenter')
    ) {
      serviceId =
        'carpenter';

    } else if (
      role.includes('painter')
    ) {
      serviceId =
        'painter';

    } else if (
      role.includes('gardener') ||
      role.includes('landscap')
    ) {
      serviceId =
        'gardener';

    } else if (
      role.includes('pest')
    ) {
      serviceId =
        'pest_control';
    }

    const service = {
      id: serviceId,

      title:
        worker.role,

      category:
        worker.category,

      price:
        worker.hourlyRate,

      unit:
        '/hr',

      rating:
        worker.rating,

      reviewCount:
        worker.reviewsCount,

      tasks:
        worker.skills,
    };

    setSelectedService(service);
    setSelectedWorker(worker);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Find Verified Professionals
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse skilled workers ready for immediate dispatch in your area.
        </p>

        {/* =================================================
            SEARCH + AVAILABLE FILTER
        ================================================= */}

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">

          <div className="relative md:col-span-2">

            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search by worker name, specialty or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />

          </div>

          <div className="flex items-center gap-2">

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-full justify-center">

              <input
                type="checkbox"
                checked={onlyOnline}
                onChange={(e) =>
                  setOnlyOnline(
                    e.target.checked
                  )
                }
                className="rounded text-blue-600 focus:ring-blue-500"
              />

              <span>
                Available Now Only
              </span>

            </label>

          </div>

        </div>

        {/* =================================================
            MULTI SERVICE FILTERS
        ================================================= */}

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">

          <span className="text-xs font-semibold text-slate-400">
            Service:
          </span>

          {/* All */}
          <button
            type="button"
            onClick={
              clearServiceFilters
            }
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
              selectedServiceFilters.length === 0
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All
          </button>

          {SERVICE_FILTERS.map(
            (service) => {
              const isSelected =
                selectedServiceFilters.includes(
                  service.id
                );

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() =>
                    toggleServiceFilter(
                      service.id
                    )
                  }
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {service.label}

                  {isSelected &&
                    ' ✓'}
                </button>
              );
            }
          )}

        </div>

        {/* =================================================
            SELECTED FILTER SUMMARY
        ================================================= */}

        {selectedServiceFilters.length >
          0 && (
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">

            Showing:

            <span className="font-semibold text-slate-700 dark:text-slate-200 ml-1">

              {selectedServiceFilters
                .map(
                  (serviceId) =>
                    SERVICE_FILTERS.find(
                      (service) =>
                        service.id ===
                        serviceId
                    )?.label
                )
                .filter(Boolean)
                .join(', ')}

            </span>

          </div>
        )}

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loadingWorkers && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">

          <p className="text-slate-500 dark:text-slate-400">
            Loading professionals...
          </p>

        </div>
      )}

      {/* =================================================
          FIREBASE ERROR
      ================================================= */}

      {!loadingWorkers &&
        workersError && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900 p-8">

            <p className="text-red-600 dark:text-red-400 font-medium">
              {workersError}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              Check the browser console for the Firebase error.
            </p>

          </div>
        )}

      {/* =================================================
          NO RESULTS
      ================================================= */}

      {!loadingWorkers &&
        !workersError &&
        filteredWorkers.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">

            <p className="text-slate-500 dark:text-slate-400">
              No professionals found matching your filters.
            </p>

          </div>
        )}

      {/* =================================================
          WORKERS
      ================================================= */}

      {!loadingWorkers &&
        !workersError &&
        filteredWorkers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {filteredWorkers.map(
              (worker) => (
                <Card
                  key={worker.id}
                  className="p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col justify-between"
                >

                  <div>

                    {/* Worker Header */}
                    <div className="flex items-start gap-4 mb-4">

                      <div className="relative">

                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20"
                        />

                        {worker.isOnline && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                        )}

                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-1.5 min-w-0">

                            <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                              {worker.name}
                            </h3>

                            {worker.verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                            )}

                          </div>

                          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 shrink-0 ml-3">
                            ₹{worker.hourlyRate}/hr
                          </span>

                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {worker.role}
                        </p>

                        <div className="flex items-center gap-3 mt-1.5 text-xs flex-wrap">

                          <span className="flex items-center text-amber-500 font-bold">

                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />

                            {worker.rating}

                          </span>

                          <span className="text-slate-400">
                            ({worker.reviewsCount} reviews)
                          </span>

                          <span className="text-slate-400">
                            •
                          </span>

                          <span className="text-slate-500">
                            {worker.completedJobs} completed
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {worker.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">

                      {worker.skills.map(
                        (skill, index) => (
                          <span
                            key={`${worker.id}-skill-${index}`}
                            className="text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">

                      <MapPin className="w-3.5 h-3.5 text-rose-500" />

                      <span>
                        {worker.distanceText}
                      </span>

                    </div>

                    <Button
                      size="md"
                      variant="primary"
                      onClick={() =>
                        handleBook(
                          worker
                        )
                      }
                      className="px-5"
                    >
                      Book Pro
                    </Button>

                  </div>

                </Card>
              )
            )}

          </div>
        )}

    </div>
  );
}