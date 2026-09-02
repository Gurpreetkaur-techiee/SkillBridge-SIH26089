import React from 'react';
import { HeroSection } from '../components/customer/HeroSection';
import { SearchFilterBar } from '../components/customer/SearchFilterBar';
import { RecentBookingsPreview } from '../components/customer/RecentBookingsPreview';
import { PopularServices } from '../components/customer/PopularServices';
import { LocationSection } from '../components/customer/LocationSection';
import { TopWorkersSection } from '../components/customer/TopWorkersSection';

export function CustomerHome() {
  return (
    <div className="animate-fade-in space-y-2">
      {/* 1. Large Hero Section */}
      <HeroSection />

      {/* 2. Global Search Bar with Location Filter */}
      <SearchFilterBar />

      {/* 3. Live Recent Bookings Preview (if any active) */}
      <RecentBookingsPreview />

      {/* 4. Popular Services Grid (Electrician, Plumber, Cleaner, Mechanic, etc.) */}
      <PopularServices />

      {/* 5. Location Section with "Use my location" button */}
      <LocationSection />

      {/* 6. Top Verified Workers Near You */}
      <TopWorkersSection />
    </div>
  );
}
