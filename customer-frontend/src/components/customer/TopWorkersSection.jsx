import React, { useEffect, useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../firebase';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function TopWorkersSection() {
  const { t } = useLanguage();
  const {
    setSelectedWorker,
    setActiveTab,
    setSelectedService,
  } = useApp();

  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setLoadingWorkers(true);

        const workersSnapshot = await getDocs(
          collection(db, 'workers')
        );

        const workersData = workersSnapshot.docs.map((workerDoc) => {
          const data = workerDoc.data();

          const secondarySkills = Array.isArray(data.secondarySkills)
            ? data.secondarySkills
            : [];

          const skills = Array.isArray(data.skills)
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

          const workerCategory =
            data.category ||
            (workerRole.toLowerCase().includes('clean')
              ? 'Cleaning'
              : workerRole.toLowerCase().includes('mechanic') ||
                  workerRole.toLowerCase().includes('automotive')
                ? 'Automotive'
                : 'Home Repair');

          const isAvailable =
            typeof data.isAvailable === 'boolean'
              ? data.isAvailable
              : true;

          return {
            id: workerDoc.id,
            name: workerName,
            role: workerRole,
            category: workerCategory,
            rating: Number(data.rating) || 0,
            reviewsCount: Number(
              data.reviewsCount ?? data.reviews ?? 0
            ),
            hourlyRate:
              Number.isFinite(hourlyRate) && hourlyRate > 0
                ? hourlyRate
                : 300,
            distanceKm: Number(data.distanceKm) || 0,
            distanceText:
              data.distanceText ||
              (data.distanceKm
                ? `${data.distanceKm} km away`
                : data.serviceArea || 'Location available'),
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
              (isAvailable ? 'Available' : 'Unavailable'),
            isOnline:
              typeof data.isOnline === 'boolean'
                ? data.isOnline
                : isAvailable,
            verified: Boolean(data.verified),
            bio:
              data.bio ||
              'Verified professional available through SkillBridge.',
          };
        });

        setWorkers(workersData.slice(0, 4));
      } catch (error) {
        console.error(
          'Error loading workers for customer home:',
          error
        );
        setWorkers([]);
      } finally {
        setLoadingWorkers(false);
      }
    };

    loadWorkers();
  }, []);

  const handleBookWorker = (worker) => {
    const role = worker.role.toLowerCase();

    let serviceId = 'general-service';

    if (role.includes('electric')) {
      serviceId = 'electrician';
    } else if (role.includes('plumb')) {
      serviceId = 'plumber';
    } else if (role.includes('clean')) {
      serviceId = 'cleaner';
    } else if (
      role.includes('mechanic') ||
      role.includes('automotive')
    ) {
      serviceId = 'mechanic';
    } else if (role.includes('carpenter')) {
      serviceId = 'carpenter';
    } else if (role.includes('painter')) {
      serviceId = 'painter';
    }

    const service = {
      id: serviceId,
      title: worker.role,
      category: worker.category,
      price: worker.hourlyRate,
      unit: '/hr',
      rating: worker.rating,
      reviewCount: worker.reviewsCount,
      tasks: worker.skills,
    };

    setSelectedService(service);
    setSelectedWorker(worker);
  };

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('nearYou')}
            </h2>

            <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live Available
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('nearYouSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('workers')}
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group"
        >
          {t('viewAll')}

          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {loadingWorkers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="p-5 border border-slate-200/80 dark:border-slate-800/80 animate-pulse"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>

              <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 mb-3" />
              <div className="h-6 w-32 rounded bg-slate-100 dark:bg-slate-800 mb-4" />
              <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {workers.map((worker) => (
            <Card
              key={worker.id}
              hoverEffect
              className="flex flex-col justify-between p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 transition-all duration-300"
            >
              <div>
                {/* Worker Top Profile Info */}
                <div className="flex items-start gap-3 mb-3.5">
                  <div className="relative">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />

                    {worker.isOnline && (
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
                        title="Online"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {worker.name}
                      </h4>

                      {worker.verified && (
                        <CheckCircle2
                          className="w-4 h-4 text-blue-500 shrink-0"
                          title="Verified Worker"
                        />
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {worker.role}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

                        <span className="font-bold ml-1 text-slate-800 dark:text-slate-200">
                          {worker.rating}
                        </span>
                      </div>

                      <span className="text-slate-300 dark:text-slate-700">
                        •
                      </span>

                      <span className="text-[11px] text-slate-500">
                        {worker.completedJobs}+ jobs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location & Response Time */}
                <div className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl mb-3">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {worker.distanceText}
                  </span>

                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {worker.responseTime}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {worker.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block -mb-0.5">
                    Rate
                  </span>

                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₹{worker.hourlyRate}

                    <span className="text-xs font-normal text-slate-500">
                      /hr
                    </span>
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleBookWorker(worker)}
                  className="px-3.5"
                >
                  {t('bookNow')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}