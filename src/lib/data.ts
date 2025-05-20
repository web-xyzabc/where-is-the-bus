
import type { Bus, Route, Stop } from './types';

// Approximate coordinates for Indian cities
export const sampleStops: Stop[] = [
  { id: 'stop1', name: 'Delhi ISBT Kashmiri Gate', latitude: 28.6679, longitude: 77.2276 },
  { id: 'stop2', name: 'Mathura Junction', latitude: 27.4763, longitude: 77.6728 },
  { id: 'stop3', name: 'Agra ISBT', latitude: 27.1907, longitude: 77.9998 },
  { id: 'stop4', name: 'Jaipur Sindhi Camp', latitude: 26.9221, longitude: 75.7789 },
  { id: 'stop5', name: 'Vrindavan Chhatikara More', latitude: 27.5600, longitude: 77.6580 },
  { id: 'stop6', name: 'Fatehpur Sikri', latitude: 27.0911, longitude: 77.6639 },
  { id: 'stop7', name: 'Alwar Bus Stand', latitude: 27.5570, longitude: 76.6179 },
  { id: 'stop8', name: 'Gurugram Rajiv Chowk', latitude: 28.4595, longitude: 77.0266 },
];

export const sampleRoutes: Route[] = [
  {
    id: 'route1',
    name: 'Route 101: Delhi - Agra Express',
    operatorName: 'Singh Travels',
    busType: 'AC Seater 2+2',
    stops: [sampleStops[0], sampleStops[4], sampleStops[1], sampleStops[2]], // Delhi -> Vrindavan -> Mathura -> Agra
    path: [ /* Path data as before */
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, { lat: 28.1000, lng: 77.4500 },
      { lat: sampleStops[4].latitude, lng: sampleStops[4].longitude }, { lat: 27.5000, lng: 77.6600 },
      { lat: sampleStops[1].latitude, lng: sampleStops[1].longitude }, { lat: 27.3300, lng: 77.8300 },
      { lat: sampleStops[2].latitude, lng: sampleStops[2].longitude },
    ],
    departureTime: '07:00', // 24-hour format for easier parsing
    averageDurationHours: 5.5,
    distanceKm: 230,
  },
  {
    id: 'route2',
    name: 'Route 202: Jaipur - Agra Connector',
    operatorName: 'Rajputana Tours',
    busType: 'Non-AC Seater 2+3',
    stops: [sampleStops[3], sampleStops[5], sampleStops[2]], // Jaipur -> Fatehpur Sikri -> Agra
    path: [ /* Path data as before */
      { lat: sampleStops[3].latitude, lng: sampleStops[3].longitude }, { lat: 27.0000, lng: 76.7000 },
      { lat: sampleStops[5].latitude, lng: sampleStops[5].longitude }, { lat: 27.1500, lng: 77.8000 },
      { lat: sampleStops[2].latitude, lng: sampleStops[2].longitude },
    ],
    departureTime: '09:30',
    averageDurationHours: 5,
    distanceKm: 240,
  },
  {
    id: 'route3',
    name: 'Route 303: Delhi - Jaipur Deluxe',
    operatorName: 'Maharaja Express',
    busType: 'AC Sleeper 2+1',
    stops: [sampleStops[0], sampleStops[7], sampleStops[6], sampleStops[3]], // Delhi -> Gurugram -> Alwar -> Jaipur
    path: [ /* Path data as before */
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, { lat: sampleStops[7].latitude, lng: sampleStops[7].longitude }, 
      { lat: 28.000, lng: 76.8000 }, { lat: sampleStops[6].latitude, lng: sampleStops[6].longitude },
      { lat: 27.2000, lng: 76.0000 }, { lat: sampleStops[3].latitude, lng: sampleStops[3].longitude },
    ],
    departureTime: '22:00',
    averageDurationHours: 6,
    distanceKm: 280,
  },
  {
    id: 'route4',
    name: 'Route 102: Delhi - Agra Morning Star',
    operatorName: 'City Link',
    busType: 'Volvo AC Semi-Sleeper',
    stops: [sampleStops[0], sampleStops[1], sampleStops[2]], // Delhi -> Mathura -> Agra (more direct)
    path: [ 
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, { lat: 27.85, lng: 77.50 },
      { lat: sampleStops[1].latitude, lng: sampleStops[1].longitude }, { lat: 27.30, lng: 77.90 },
      { lat: sampleStops[2].latitude, lng: sampleStops[2].longitude },
    ],
    departureTime: '08:30',
    averageDurationHours: 4.5,
    distanceKm: 220,
  },
   {
    id: 'route5',
    name: 'Route 304: Delhi - Jaipur Shatabdi',
    operatorName: 'Haryana Roadways',
    busType: 'Non-AC Seater',
    stops: [sampleStops[0], sampleStops[3]], // Delhi -> Jaipur Direct
    path: [ 
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, 
      { lat: 27.8000, lng: 76.5000 }, 
      { lat: sampleStops[3].latitude, lng: sampleStops[3].longitude },
    ],
    departureTime: '14:00',
    averageDurationHours: 5.5,
    distanceKm: 270,
  },
   {
    id: 'route6',
    name: 'Route 401: Mathura - Jaipur Pilgrim',
    operatorName: 'Yadav Travels',
    busType: 'AC Seater 2+2',
    stops: [sampleStops[1], sampleStops[6] ,sampleStops[3]], // Mathura -> Alwar -> Jaipur
    path: [ 
      { lat: sampleStops[1].latitude, lng: sampleStops[1].longitude }, 
      { lat: 27.5000, lng: 77.2000 },
      { lat: sampleStops[6].latitude, lng: sampleStops[6].longitude }, 
      { lat: 27.2000, lng: 76.2000 },
      { lat: sampleStops[3].latitude, lng: sampleStops[3].longitude },
    ],
    departureTime: '11:00',
    averageDurationHours: 4,
    distanceKm: 180,
  }
];

export let sampleBuses: Bus[] = [ // Changed to let for seat updates
  {
    id: 'busDL01AG1234',
    routeId: 'route1',
    currentLatitude: 27.8500, currentLongitude: 77.5500,
    totalSeats: 45, bookedSeats: 20, etaPredictions: new Map(),
  },
  {
    id: 'busRJ14AG5678',
    routeId: 'route2',
    currentLatitude: 27.1200, currentLongitude: 76.9500,
    totalSeats: 40, bookedSeats: 30, etaPredictions: new Map(),
  },
  {
    id: 'busDL01JP9012',
    routeId: 'route3',
    currentLatitude: 28.2000, currentLongitude: 77.0000,
    totalSeats: 50, bookedSeats: 15, etaPredictions: new Map(),
  },
  {
    id: 'busUP85AG2233',
    routeId: 'route4', // Was route1, changed to route4
    currentLatitude: 27.2500, currentLongitude: 77.9000,
    totalSeats: 42, bookedSeats: 35, etaPredictions: new Map(),
  },
  {
    id: 'busHR55JP0001',
    routeId: 'route5',
    currentLatitude: 28.5000, currentLongitude: 77.1000, // Near Delhi
    totalSeats: 55, bookedSeats: 10, etaPredictions: new Map(),
  },
   {
    id: 'busUP80MJ0002',
    routeId: 'route6',
    currentLatitude: 27.5100, currentLongitude: 77.5000, // Near Mathura
    totalSeats: 35, bookedSeats: 5, etaPredictions: new Map(),
  },
   {
    id: 'busDL01AG7777',
    routeId: 'route1', // Another bus on route1
    currentLatitude: 28.6000, currentLongitude: 77.2000, // Near Delhi
    totalSeats: 45, bookedSeats: 5, etaPredictions: new Map(),
  }
];
