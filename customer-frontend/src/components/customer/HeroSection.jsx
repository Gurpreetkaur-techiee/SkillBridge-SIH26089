import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Star,
  Flame,
  Home,
  Wrench,
  Car,
  Tv,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { quickCategories } from '../../data/servicesData';

export function HeroSection() {
  const { t } = useLanguage();
  const { selectedCategory, setSelectedCategory } = useApp();

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-rose-500" />;
      case 'Home': return <Home className="w-4 h-4 text-blue-500" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'Car': return <Car className="w-4 h-4 text-indigo-500" />;
      case 'Tv': return <Tv className="w-4 h-4 text-amber-500" />;
      default: return <Wrench className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white p-6 sm:p-10 shadow-xl mb-8">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl">
        {/* Top Mini Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-blue-100 mb-4 shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span>Verified Local Pros Ready in 15 Mins</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none mb-4 text-white">
          {t('heroTitle')}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-blue-100/90 font-normal max-w-2xl leading-relaxed mb-6">
          {t('heroSubtitle')}
        </p>

        {/* Category Quick Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {quickCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 backdrop-blur-md ${
                  isSelected
                    ? 'bg-white text-blue-700 shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{t(cat.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Trust Stats Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-3 gap-4 max-w-xl text-xs sm:text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">100% Background Checked</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="font-medium">Instant Dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 shrink-0" />
            <span className="font-medium">4.9/5 Service Rating</span>
          </div>
        </div>

      </div>
    </div>
  );
}
