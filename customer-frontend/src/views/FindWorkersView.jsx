import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { sampleWorkers } from '../data/workersData';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function FindWorkersView() {
  const { searchQuery, setSearchQuery, setSelectedService, setSelectedWorker } = useApp();
  const { t } = useLanguage();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [maxPrice, setMaxPrice] = useState(60);

  const categories = ['All', 'Home Repair', 'Cleaning', 'Automotive', 'Appliances'];

  const filteredWorkers = sampleWorkers.filter((worker) => {
    const matchesSearch = 
      !searchQuery.trim() || 
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategoryFilter === 'All' || 
      worker.category === selectedCategoryFilter;

    const matchesOnline = !onlyOnline || worker.isOnline;
    const matchesPrice = worker.hourlyRate <= maxPrice;

    return matchesSearch && matchesCategory && matchesOnline && matchesPrice;
  });

  const handleBook = (worker) => {
    const mockService = {
      id: worker.role.toLowerCase().includes('electric') ? 'electrician' : 'plumber',
      title: worker.role,
      category: worker.category,
      price: worker.hourlyRate,
      unit: '/hr',
      rating: worker.rating,
      reviewCount: worker.reviewsCount,
      tasks: worker.skills
    };
    setSelectedService(mockService);
    setSelectedWorker(worker);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Find Verified Professionals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse skilled workers ready for immediate dispatch in your area.
        </p>

        {/* Filters and search input */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name, specialty or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-full justify-center">
              <input
                type="checkbox"
                checked={onlyOnline}
                onChange={(e) => setOnlyOnline(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Available Now Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredWorkers.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-slate-500 dark:text-slate-400">No professionals found matching your filters.</p>
          </div>
        ) : (
          filteredWorkers.map((worker) => (
            <Card
              key={worker.id}
              className="p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col justify-between"
            >
              <div>
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
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                          {worker.name}
                        </h3>
                        {worker.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                        ${worker.hourlyRate}/hr
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {worker.role}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        {worker.rating}
                      </span>
                      <span className="text-slate-400">({worker.reviewsCount} reviews)</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{worker.completedJobs} completed</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {worker.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {worker.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{worker.distanceText}</span>
                </div>

                <Button
                  size="md"
                  variant="primary"
                  onClick={() => handleBook(worker)}
                  className="px-5"
                >
                  Book Pro
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
