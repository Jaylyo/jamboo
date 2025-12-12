import { Attraction, EmergencyContact, SafetyAlert } from './types';

export const ATTRACTIONS: Attraction[] = [
  {
    id: '1',
    name: 'Kawasan Falls',
    category: 'Nature',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/400/300?random=1',
    safetyLevel: 'Caution',
    description: 'Famous multi-tiered waterfalls in Badian. Canyoneering activities require safety gear.'
  },
  {
    id: '2',
    name: "Magellan's Cross",
    category: 'Historical',
    rating: 4.5,
    imageUrl: 'https://picsum.photos/400/300?random=2',
    safetyLevel: 'Safe',
    description: 'Christian cross planted by Portuguese and Spanish explorers as ordered by Ferdinand Magellan.'
  },
  {
    id: '3',
    name: 'Temple of Leah',
    category: 'Urban',
    rating: 4.2,
    imageUrl: 'https://picsum.photos/400/300?random=3',
    safetyLevel: 'Safe',
    description: 'A grand Roman-style temple built as a symbol of undying love.'
  },
  {
    id: '4',
    name: 'Malapascua Island',
    category: 'Beach',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/400/300?random=4',
    safetyLevel: 'Caution',
    description: 'Known for diving with thresher sharks. Boat travel required.'
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Cebu City Police Office', number: '166', type: 'Police', distance: '1.2 km' },
  { id: '2', name: 'Chong Hua Hospital', number: '(032) 255 8000', type: 'Medical', distance: '2.5 km' },
  { id: '3', name: 'Cebu Fire Station', number: '160', type: 'Fire', distance: '3.0 km' },
  { id: '4', name: 'Tourist Police Unit', number: '(032) 253 6666', type: 'Tourism', distance: '1.5 km' }
];

export const ACTIVE_ALERTS: SafetyAlert[] = [
  {
    id: 'a1',
    title: 'Heavy Rain Advisory',
    severity: 'medium',
    timestamp: '10:00 AM',
    details: 'Expect heavy rainfall in Cebu City and Mandaue. localized flooding possible.'
  },
  {
    id: 'a2',
    title: 'Traffic Congestion',
    severity: 'low',
    timestamp: '09:30 AM',
    details: 'Heavy traffic reported at SRP Viaduct due to ongoing maintenance.'
  }
];