export const sampleWorkers = [
  {
    id: "w-101",
    name: "Marcus Vance",
    role: "Master Electrician",
    category: "Home Repair",
    rating: 4.95,
    reviewsCount: 142,
    hourlyRate: 38,
    distanceKm: 1.8,
    distanceText: "1.8 km away",
    responseTime: "~15 mins",
    completedJobs: 412,
    badge: "Top Rated Pro",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    skills: ["Circuit Repair", "EV Chargers", "Smart Lighting", "Panel Upgrades"],
    availability: "Available Now",
    isOnline: true,
    verified: true,
    bio: "Licensed master electrician with 9+ years experience in residential and commercial electrical systems."
  },
  {
    id: "w-102",
    name: "David Chen",
    role: "Senior Plumber & Pipe Specialist",
    category: "Home Repair",
    rating: 4.9,
    reviewsCount: 210,
    hourlyRate: 32,
    distanceKm: 2.4,
    distanceText: "2.4 km away",
    responseTime: "~20 mins",
    completedJobs: 560,
    badge: "SkillBridge Verified",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    skills: ["Burst Pipes", "Water Heaters", "Drain Snaking", "Sump Pumps"],
    availability: "Available Today",
    isOnline: true,
    verified: true,
    bio: "Specializing in emergency leak fixing and modern eco-friendly plumbing fixtures."
  },
  {
    id: "w-103",
    name: "Elena Rostova",
    role: "Deep Cleaning & Sanitization Lead",
    category: "Cleaning",
    rating: 4.98,
    reviewsCount: 380,
    hourlyRate: 26,
    distanceKm: 3.1,
    distanceText: "3.1 km away",
    responseTime: "~30 mins",
    completedJobs: 720,
    badge: "Super Pro",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    skills: ["Deep Cleaning", "Move-In Polish", "Steam Sanitization", "Eco Products"],
    availability: "Available Tomorrow",
    isOnline: false,
    verified: true,
    bio: "5-star hotel trained cleaning supervisor bringing professional standards to your home."
  },
  {
    id: "w-104",
    name: "Alex Rivera",
    role: "Mobile Automotive Specialist",
    category: "Automotive",
    rating: 4.87,
    reviewsCount: 95,
    hourlyRate: 48,
    distanceKm: 4.0,
    distanceText: "4.0 km away",
    responseTime: "~25 mins",
    completedJobs: 280,
    badge: "Mobile Equipped",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    skills: ["Mobile Diagnostics", "Brake Pad Change", "Battery Service", "Alternators"],
    availability: "Available Now",
    isOnline: true,
    verified: true,
    bio: "ASE certified technician with a fully outfitted mobile repair van."
  }
];

export const sampleCustomerBookings = [
  {
    id: "BK-8902",
    serviceName: "Emergency Pipe Leak Repair",
    category: "Plumber",
    workerName: "David Chen",
    workerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    date: "Today, 3:30 PM",
    status: "in_progress",
    statusLabel: "Worker En Route",
    amount: "$45.00",
    address: "742 Evergreen Terrace, Apt 4B",
    eta: "12 mins away"
  },
  {
    id: "BK-7841",
    serviceName: "AC Deep Coil Cleaning & Gas Check",
    category: "AC Technician",
    workerName: "Sameer Patel",
    workerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    date: "Yesterday, 11:00 AM",
    status: "completed",
    statusLabel: "Completed",
    amount: "$55.00",
    address: "742 Evergreen Terrace, Apt 4B",
    ratingGiven: 5
  }
];

export const sampleNotifications = [
  {
    id: "notif-1",
    title: "Worker is on the way! 🚗",
    message: "David Chen has started traveling to your address for Pipe Leak Repair. Estimated arrival in 12 mins.",
    time: "5 minutes ago",
    unread: true,
    type: "booking"
  },
  {
    id: "notif-2",
    title: "Summer Discount Available ☀️",
    message: "Enjoy 20% off on all AC Servicing and Deep House Cleaning bookings this week!",
    time: "2 hours ago",
    unread: true,
    type: "promo"
  },
  {
    id: "notif-3",
    title: "Service Completed Successfully",
    message: "Your AC Coil Cleaning by Sameer Patel has been marked completed. Receipt has been emailed.",
    time: "1 day ago",
    unread: false,
    type: "success"
  }
];
