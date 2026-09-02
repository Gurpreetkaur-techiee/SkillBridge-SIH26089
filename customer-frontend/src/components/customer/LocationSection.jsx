import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export function LocationSection() {
  const { t } = useLanguage();
  const { 
    userLocation, 
    setUserLocation, 
    isLocating, 
    locationDetected, 
    detectLocation 
  } = useApp();

  const [radius, setRadius] = useState('5 km');

  const popularAreas = [
    "Downtown Central",
    "Westside Hills",
    "North Bay Suburbs",
    "East Tech District"
  ];

  return (
    <section className="mb-10 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900/60 rounded-3xl p-6 sm:p-8 border border-blue-150 dark:border-slate-800 shadow-soft">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Local Hyper-Fast Dispatch</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Find Available Pros Near You
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Get matched instantly with high-ranking workers within your immediate neighborhood for quicker arrivals and zero travel surcharges.
          </p>

          {/* Quick neighborhood tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Popular areas:
            </span>
            {popularAreas.map((area) => (
              <button
                key={area}
                onClick={() => setUserLocation(area)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  userLocation === area
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Right Location Action Card */}
        <div className="w-full lg:w-auto bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center gap-4">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">Current Zone</span>
                {locationDetected && (
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3 mr-0.5" /> GPS Verified
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {userLocation}
              </p>
            </div>
          </div>

          {/* Use My Location Button */}
          <Button
            onClick={detectLocation}
            variant={locationDetected ? "secondary" : "primary"}
            size="md"
            loading={isLocating}
            icon={Navigation}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            {isLocating ? t('detectingLocation') : t('useMyLocation')}
          </Button>

        </div>

      </div>
    </section>
  );
}
