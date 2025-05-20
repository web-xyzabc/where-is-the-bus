
import type { Bus, Route, Stop } from './types';

// Approximate coordinates for Indian cities
export const sampleStops: Stop[] = [
  { id: 'stop1', name: 'Delhi ISBT Kashmiri Gate', latitude: 28.6679, longitude: 77.2276 },
  { id: 'stop2', name: 'Mathura Junction', latitude: 27.4763, longitude: 77.6728 },
  { id: 'stop3', name: 'Agra ISBT', latitude: 27.1907, longitude: 77.9998 },
  { id: 'stop4', name: 'Jaipur Sindhi Camp', latitude: 26.9221, longitude: 75.7789 },
  { id: 'stop5', name: 'Vrindavan Chhatikara More', latitude: 27.5600, longitude: 77.6580 }, // Intermediate stop
  { id: 'stop6', name: 'Fatehpur Sikri', latitude: 27.0911, longitude: 77.6639 }, // Intermediate stop for Jaipur-Agra
];

export const sampleRoutes: Route[] = [
  {
    id: 'route1',
    name: 'Route 101: Delhi - Agra Express',
    stops: [sampleStops[0], sampleStops[4], sampleStops[1], sampleStops[2]], // Delhi -> Vrindavan -> Mathura -> Agra
    path: [
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, // Delhi
      { lat: 28.1000, lng: 77.4500 }, // Intermediate point
      { lat: sampleStops[4].latitude, lng: sampleStops[4].longitude }, // Vrindavan
      { lat: 27.5000, lng: 77.6600 }, // Intermediate point
      { lat: sampleStops[1].latitude, lng: sampleStops[1].longitude }, // Mathura
      { lat: 27.3300, lng: 77.8300 }, // Intermediate point
      { lat: sampleStops[2].latitude, lng: sampleStops[2].longitude }, // Agra
    ],
  },
  {
    id: 'route2',
    name: 'Route 202: Jaipur - Agra Connector',
    stops: [sampleStops[3], sampleStops[5], sampleStops[2]], // Jaipur -> Fatehpur Sikri -> Agra
     path: [
      { lat: sampleStops[3].latitude, lng: sampleStops[3].longitude }, // Jaipur
      { lat: 27.0000, lng: 76.7000 }, // Intermediate point
      { lat: sampleStops[5].latitude, lng: sampleStops[5].longitude }, // Fatehpur Sikri
      { lat: 27.1500, lng: 77.8000 }, // Intermediate point
      { lat: sampleStops[2].latitude, lng: sampleStops[2].longitude }, // Agra
    ],
  },
  {
    id: 'route3',
    name: 'Route 303: Delhi - Jaipur Deluxe',
    stops: [sampleStops[0], sampleStops[3]], // Delhi -> Jaipur (Direct or via a major highway point)
     path: [
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, // Delhi
      { lat: 27.8000, lng: 76.5000 }, // Mid-point on NH48 approx
      { lat: sampleStops[3].latitude, lng: sampleStops[3].longitude }, // Jaipur
    ],
  }
];

export const sampleBuses: Bus[] = [
  {
    id: 'busDL01AG1234', // Delhi-Agra Bus 1
    routeId: 'route1',
    currentLatitude: 27.8500, // Approx between Delhi and Vrindavan
    currentLongitude: 77.5500,
    totalSeats: 45,
    bookedSeats: 20,
    etaPredictions: new Map(),
  },
  {
    id: 'busRJ14AG5678', // Jaipur-Agra Bus 1
    routeId: 'route2',
    currentLatitude: 27.1200, // Approx between Jaipur and Fatehpur Sikri
    currentLongitude: 76.9500,
    totalSeats: 40,
    bookedSeats: 30,
    etaPredictions: new Map(),
  },
  {
    id: 'busDL01JP9012', // Delhi-Jaipur Bus
    routeId: 'route3',
    currentLatitude: 28.2000, // Approx on Delhi-Jaipur highway
    currentLongitude: 77.0000,
    totalSeats: 50,
    bookedSeats: 15,
    etaPredictions: new Map(),
  },
   {
    id: 'busUP85AG2233', // Another Delhi-Agra Bus 2
    routeId: 'route1',
    currentLatitude: 27.2500, // Approx between Mathura and Agra
    currentLongitude: 77.9000,
    totalSeats: 42,
    bookedSeats: 35,
    etaPredictions: new Map(),
  }
];
