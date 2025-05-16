import type { Bus, Route, Stop } from './types';

export const sampleStops: Stop[] = [
  { id: 'stop1', name: 'Central Station', latitude: 34.0522, longitude: -118.2437 },
  { id: 'stop2', name: 'Downtown Mall', latitude: 34.0550, longitude: -118.2500 },
  { id: 'stop3', name: 'City Park', latitude: 34.0600, longitude: -118.2550 },
  { id: 'stop4', name: 'University Campus', latitude: 34.0650, longitude: -118.2600 },
  { id: 'stop5', name: 'Suburbia Junction', latitude: 34.0700, longitude: -118.2650 },
];

export const sampleRoutes: Route[] = [
  {
    id: 'route1',
    name: 'Route 101: Downtown Express',
    stops: [sampleStops[0], sampleStops[1], sampleStops[2], sampleStops[3]],
    path: [
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude },
      { lat: 34.0530, lng: -118.2450 }, // Intermediate point
      { lat: sampleStops[1].latitude, lng: sampleStops[1].longitude },
      { lat: 34.0575, lng: -118.2525 }, // Intermediate point
      { lat: sampleStops[2].latitude, lng: sampleStops[2].longitude },
      { lat: 34.0625, lng: -118.2575 }, // Intermediate point
      { lat: sampleStops[3].latitude, lng: sampleStops[3].longitude },
    ],
  },
  {
    id: 'route2',
    name: 'Route 202: Crosstown Connector',
    stops: [sampleStops[1], sampleStops[3], sampleStops[4]],
     path: [
      { lat: sampleStops[1].latitude, lng: sampleStops[1].longitude },
      { lat: 34.0600, lng: -118.2550 },
      { lat: sampleStops[3].latitude, lng: sampleStops[3].longitude },
      { lat: 34.0675, lng: -118.2625 },
      { lat: sampleStops[4].latitude, lng: sampleStops[4].longitude },
    ],
  }
];

export const sampleBuses: Bus[] = [
  {
    id: 'busA',
    routeId: 'route1',
    currentLatitude: 34.0540, // Somewhere between stop1 and stop2
    currentLongitude: -118.2480,
    totalSeats: 40,
    bookedSeats: 15,
    etaPredictions: new Map(),
  },
  {
    id: 'busB',
    routeId: 'route1',
    currentLatitude: 34.0610, // Somewhere between stop2 and stop3
    currentLongitude: -118.2560,
    totalSeats: 30,
    bookedSeats: 25,
    etaPredictions: new Map(),
  },
    {
    id: 'busC',
    routeId: 'route2',
    currentLatitude: 34.0660, // Somewhere on route 2
    currentLongitude: -118.2610,
    totalSeats: 35,
    bookedSeats: 10,
    etaPredictions: new Map(),
  }
];
