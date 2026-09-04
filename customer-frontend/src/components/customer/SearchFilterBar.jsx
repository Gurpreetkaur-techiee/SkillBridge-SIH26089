import React from 'react';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { analyzeService } from '../../services/serviceAnalyzer';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export function SearchFilterBar() {
  const { t } = useLanguage();
  const { 
    searchQuery, 
    setSearchQuery, 
    userLocation, 
    setActiveTab, 
    detectLocation, 
    isLocating ,
    setDetectedService,
    setServiceConfidence
  } = useApp();

  const handleSearchSubmit = (e) => {
  e.preventDefault();

  if (searchQuery.trim()) {
    const result = analyzeService(searchQuery);

    setDetectedService(result.service);
    setServiceConfidence(result.confidence);

    console.log('Service Analyzer Result:', result);

    setActiveTab('workers');
  }
};

  return (
    <form 
      onSubmit={handleSearchSubmit}
      className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 sm:p-3 shadow-soft border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center gap-2 mb-8 transition-all"
    >
      {/* Search Input */}
      <div className="relative flex-1 w-full flex items-center">
        <Search className="absolute left-3.5 w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-11 pr-8 py-2.5 text-sm sm:text-base rounded-xl bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800 my-auto" />

      {/* Location Chip / Selector */}
      <div 
        onClick={detectLocation}
        className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border border-slate-200/60 dark:border-slate-700/50 transition-colors"
        title="Click to detect or change current location"
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className={`w-4 h-4 shrink-0 ${isLocating ? 'text-blue-600 animate-bounce' : 'text-rose-500'}`} />
          <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
            {isLocating ? t('detectingLocation') : userLocation}
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60">
          Auto
        </span>
      </div>

      {/* Search Action Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full md:w-auto px-6 font-semibold shrink-0"
        icon={Search}
      >
        Find Pros
      </Button>
    </form>
  );
}
