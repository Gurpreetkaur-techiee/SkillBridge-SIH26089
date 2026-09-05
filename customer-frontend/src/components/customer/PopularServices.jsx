import React from 'react';
import { 
  Zap, 
  Wrench, 
  Sparkles, 
  Car, 
  Wind, 
  Hammer, 
  Paintbrush, 
  Tv, 
  Star, 
  ArrowUpRight,
  Clock,
  Users
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { popularServicesData } from '../../data/servicesData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function PopularServices() {
  const { t } = useLanguage();
  const { selectedCategory, setSelectedService, searchQuery } = useApp();

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Wrench': return <Wrench className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Car': return <Car className="w-6 h-6" />;
      case 'Wind': return <Wind className="w-6 h-6" />;
      case 'Hammer': return <Hammer className="w-6 h-6" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6" />;
      case 'Tv': return <Tv className="w-6 h-6" />;
      default: return <Wrench className="w-6 h-6" />;
    }
  };

  // Filter based on selected quick chip or search query
  const filteredServices = popularServicesData.filter((service) => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      service.category === selectedCategory || 
      (selectedCategory === 'Emergency' && (service.id === 'electrician' || service.id === 'plumber' || service.id === 'mechanic'));

    const matchesSearch = 
      !searchQuery.trim() || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(service.key).toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tasks.some(task => task.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('popularServices')}
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              {filteredServices.length} available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('popularSubtitle')}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No services found matching "{searchQuery}". Try searching for another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredServices.map((service) => {
            const localizedTitle = t(service.key) || service.title;
            const localizedDesc = t(`${service.key}Desc`) || service.tasks[0];

            return (
              <Card
                key={service.id}
                hoverEffect
                onClick={() => setSelectedService(service)}
                className="group flex flex-col justify-between overflow-hidden p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400/80 dark:hover:border-blue-600 transition-all duration-300"
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${service.bgLight} ${service.textColor} flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
                      {getServiceIcon(service.iconName)}
                    </div>
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>{localizedTitle}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {localizedDesc}
                  </p>

                  {/* Popular Task Preview */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {service.tasks.slice(0, 2).map((task, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 truncate max-w-[150px]"
                      >
                        {task}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Rating & Pricing */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold ml-1 text-slate-800 dark:text-slate-200">{service.rating}</span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                      ({service.reviewCount})
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block -mb-0.5">
                      {t('startingFrom')}
                    </span>
                    <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                      ₹{service.price}
                      <span className="text-[11px] font-normal text-slate-500">{service.unit}</span>
                    </span>
                  </div>
                </div>

              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
