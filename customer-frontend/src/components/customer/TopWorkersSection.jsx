import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { sampleWorkers } from '../../data/workersData';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function TopWorkersSection() {
  const { t } = useLanguage();
  const { setSelectedWorker, setActiveTab, setSelectedService } = useApp();

  const handleBookWorker = (worker) => {
    // Open service modal pre-configured for this worker's role
    const mockService = {
      id: worker.role.toLowerCase().includes('electric') ? 'electrician' : 'plumber',
      key: worker.role.toLowerCase().includes('electric') ? 'electrician' : 'plumber',
      title: worker.role,
      category: worker.category,
      price: worker.hourlyRate,
      unit: '/hr',
      rating: worker.rating,
      reviewCount: worker.reviewsCount,
      tasks: worker.skills,
      badge: worker.badge,
      color: 'from-blue-500 to-indigo-500'
    };
    setSelectedService(mockService);
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
          {t('viewAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {sampleWorkers.map((worker) => (
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
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Online" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {worker.name}
                    </h4>
                    {worker.verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" title="Verified Worker" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {worker.role}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold ml-1 text-slate-800 dark:text-slate-200">{worker.rating}</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-[11px] text-slate-500">
                      {worker.completedJobs}+ jobs
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges & Response time */}
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

              {/* Bio / Skills preview */}
              <div className="flex flex-wrap gap-1 mb-4">
                {worker.skills.slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Pricing & CTA */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block -mb-0.5">Rate</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  ₹{worker.hourlyRate}
                  <span className="text-xs font-normal text-slate-500">/hr</span>
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
    </section>
  );
}
