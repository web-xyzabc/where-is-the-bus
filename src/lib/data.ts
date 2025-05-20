
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
  // Uttar Pradesh Stops
  { id: 'stop9', name: 'Lucknow Charbagh Bus Stand', latitude: 26.8467, longitude: 80.9462 },
  { id: 'stop10', name: 'Kanpur Jhakarkati Bus Stand', latitude: 26.4499, longitude: 80.3319 },
  { id: 'stop11', name: 'Varanasi Cantt Bus Stand', latitude: 25.3176, longitude: 82.9739 },
  { id: 'stop12', name: 'Akbarpur Bus Stand', latitude: 26.4325, longitude: 82.5377 }, // Ambedkar Nagar
  { id: 'stop13', name: 'Sultanpur Bus Stand', latitude: 26.2619, longitude: 82.0730 },
  { id: 'stop14', name: 'Ayodhya Dham Bus Station', latitude: 26.7906, longitude: 82.1983 },
  { id: 'stop15', name: 'Barabanki Bus Stand', latitude: 26.9394, longitude: 81.1932 },
  { id: 'stop16', name: 'Prayagraj Civil Lines Bus Stand', latitude: 25.4448, longitude: 81.8405 },
];

// Helper function for rough distance calculation (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance);
}

const operatorNamesPool = ["Bharat Benz Connect", "Volvo Cruisers", "State Express", "Rapid Transways", "Comfort Journey Ltd.", "Skyline Travels", "UPSRTC Deluxe", "Rajasthan State Roadways"];
const busTypesPool = ["AC Sleeper 2+1", "Volvo AC Semi-Sleeper", "AC Seater 2+2", "Non-AC Deluxe 2+2", "AC Janrath 2+2", "Ordinary Express"];

let routeCounter = 20; // Start route IDs from a higher number to avoid collision with existing
let busCounter = 20;


const newGeneratedRoutes: Route[] = [];
const newGeneratedBuses: Bus[] = [];

const cityPairsToConnect: [Stop, Stop, string][] = [
  // Delhi connections
  [sampleStops[0], sampleStops[9], "07:30"], // Delhi -> Lucknow
  [sampleStops[0], sampleStops[10], "09:00"], // Delhi -> Kanpur
  [sampleStops[0], sampleStops[11], "10:30"], // Delhi -> Varanasi
  [sampleStops[0], sampleStops[13], "06:00"], // Delhi -> Ayodhya
  [sampleStops[0], sampleStops[15], "11:00"], // Delhi -> Prayagraj

  // Lucknow connections
  [sampleStops[8], sampleStops[2], "08:15"],  // Lucknow -> Agra
  [sampleStops[8], sampleStops[3], "10:45"],  // Lucknow -> Jaipur
  [sampleStops[8], sampleStops[10], "12:30"], // Lucknow -> Kanpur
  [sampleStops[8], sampleStops[13], "14:00"], // Lucknow -> Ayodhya (Reverse of Delhi-Ayodhya via Lucknow if needed)

  // Kanpur connections
  [sampleStops[9], sampleStops[2], "07:00"],  // Kanpur -> Agra
  [sampleStops[9], sampleStops[13], "09:30"], // Kanpur -> Ayodhya
  [sampleStops[9], sampleStops[8], "11:30"],  // Kanpur -> Lucknow (Reverse)
  [sampleStops[9], sampleStops[15], "13:15"], // Kanpur -> Prayagraj

  // Varanasi connections
  [sampleStops[10], sampleStops[13], "06:45"], // Varanasi -> Ayodhya
  [sampleStops[10], sampleStops[2], "08:30"],  // Varanasi -> Agra
  [sampleStops[10], sampleStops[8], "10:00"], // Varanasi -> Lucknow (Reverse)
  [sampleStops[10], sampleStops[0], "14:30"], // Varanasi -> Delhi (Reverse)

  // Agra connections
  [sampleStops[2], sampleStops[13], "15:00"], // Agra -> Ayodhya
  [sampleStops[2], sampleStops[8], "13:00"], // Agra -> Lucknow (Reverse)

  // Jaipur connections
  [sampleStops[3], sampleStops[8], "09:15"], // Jaipur -> Lucknow
  [sampleStops[3], sampleStops[9], "11:45"], // Jaipur -> Kanpur
  [sampleStops[3], sampleStops[10], "13:30"], // Jaipur -> Varanasi
  [sampleStops[3], sampleStops[0], "16:00"], // Jaipur -> Delhi (Reverse)
  
  // Ayodhya connections
  [sampleStops[13], sampleStops[12], "07:50"], // Ayodhya -> Sultanpur
  [sampleStops[13], sampleStops[11], "09:20"], // Ayodhya -> Akbarpur
  [sampleStops[13], sampleStops[14], "10:50"], // Ayodhya -> Barabanki

  // Sultanpur, Akbarpur, Barabanki to Lucknow
  [sampleStops[12], sampleStops[8], "14:10"], // Sultanpur -> Lucknow
  [sampleStops[11], sampleStops[8], "15:40"], // Akbarpur -> Lucknow
  [sampleStops[14], sampleStops[8], "17:00"], // Barabanki -> Lucknow
];

cityPairsToConnect.forEach(([originStop, destinationStop, departureTime]) => {
  const distanceKm = calculateDistance(originStop.latitude, originStop.longitude, destinationStop.latitude, destinationStop.longitude);
  const averageDurationHours = parseFloat((distanceKm / 45).toFixed(1)); // Approx 45km/hr avg speed

  const routeId = `routeGen${routeCounter++}`;
  newGeneratedRoutes.push({
    id: routeId,
    name: `Route ${originStop.name.split(" ")[0]} - ${destinationStop.name.split(" ")[0]}`,
    operatorName: operatorNamesPool[routeCounter % operatorNamesPool.length],
    busType: busTypesPool[routeCounter % busTypesPool.length],
    stops: [originStop, destinationStop],
    path: [
      { lat: originStop.latitude, lng: originStop.longitude },
      { lat: destinationStop.latitude, lng: destinationStop.longitude },
    ],
    departureTime: departureTime,
    averageDurationHours: averageDurationHours,
    distanceKm: distanceKm,
  });

  const busId = `busGen${busCounter++}`;
  newGeneratedBuses.push({
    id: busId,
    routeId: routeId,
    currentLatitude: originStop.latitude,
    currentLongitude: originStop.longitude,
    totalSeats: Math.floor(Math.random() * 26) + 30, // 30-55 seats
    bookedSeats: Math.floor(Math.random() * 15),     // 0-14 booked seats
    etaPredictions: new Map(),
  });
});


export const sampleRoutes: Route[] = [
  {
    id: 'route1',
    name: 'Route 101: Delhi - Agra Express',
    operatorName: 'Singh Travels',
    busType: 'AC Seater 2+2',
    stops: [sampleStops[0], sampleStops[4], sampleStops[1], sampleStops[2]], // Delhi -> Vrindavan -> Mathura -> Agra
    path: [ 
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, { lat: 28.1000, lng: 77.4500 },
      { lat: sampleStops[4].latitude, lng: sampleStops[4].longitude }, { lat: 27.5000, lng: 77.6600 },
      { lat: sampleStops[1].latitude, lng: sampleStops[1].longitude }, { lat: 27.3300, lng: 77.8300 },
      { lat: sampleStops[2].latitude, lng: sampleStops[2].longitude },
    ],
    departureTime: '07:00', 
    averageDurationHours: 5.5,
    distanceKm: 230,
  },
  {
    id: 'route2',
    name: 'Route 202: Jaipur - Agra Connector',
    operatorName: 'Rajputana Tours',
    busType: 'Non-AC Seater 2+3',
    stops: [sampleStops[3], sampleStops[5], sampleStops[2]], // Jaipur -> Fatehpur Sikri -> Agra
    path: [ 
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
    path: [ 
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
  },
  // Existing UP Routes
  {
    id: 'routeUP1',
    name: 'Route 501: Delhi - Lucknow Superfast',
    operatorName: 'UPSRTC Gold Line',
    busType: 'AC Janrath 2+2',
    stops: [sampleStops[0], sampleStops[8]], // Delhi -> Lucknow
    path: [
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, // Delhi
      { lat: 27.75, lng: 79.00 }, // Midpoint approx
      { lat: sampleStops[8].latitude, lng: sampleStops[8].longitude }, // Lucknow
    ],
    departureTime: '08:00',
    averageDurationHours: 8,
    distanceKm: 500,
  },
  {
    id: 'routeUP2',
    name: 'Route 601: Kanpur - Varanasi Express',
    operatorName: 'Kashi Vishwanath Express',
    busType: 'Non-AC Seater 2+3',
    stops: [sampleStops[9], sampleStops[15], sampleStops[10]], // Kanpur -> Prayagraj -> Varanasi
    path: [
      { lat: sampleStops[9].latitude, lng: sampleStops[9].longitude }, // Kanpur
      { lat: sampleStops[15].latitude, lng: sampleStops[15].longitude }, // Prayagraj
      { lat: sampleStops[10].latitude, lng: sampleStops[10].longitude }, // Varanasi
    ],
    departureTime: '10:00',
    averageDurationHours: 7,
    distanceKm: 330,
  },
  {
    id: 'routeUP3',
    name: 'Route 701: Delhi - Ayodhya Ram Rath',
    operatorName: 'Ram Rajya Travels',
    busType: 'AC Sleeper 2+1',
    stops: [sampleStops[0], sampleStops[8], sampleStops[14], sampleStops[13]], // Delhi -> Lucknow -> Barabanki -> Ayodhya
    path: [
      { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, // Delhi
      { lat: sampleStops[8].latitude, lng: sampleStops[8].longitude }, // Lucknow
      { lat: sampleStops[14].latitude, lng: sampleStops[14].longitude }, // Barabanki
      { lat: sampleStops[13].latitude, lng: sampleStops[13].longitude }, // Ayodhya
    ],
    departureTime: '20:00',
    averageDurationHours: 10,
    distanceKm: 680,
  },
  {
    id: 'routeUP4',
    name: 'Route 801: Lucknow - Varanasi (via Sultanpur, Akbarpur)',
    operatorName: 'Awadh Express Services',
    busType: 'AC Seater 2+2',
    stops: [sampleStops[8], sampleStops[12], sampleStops[11], sampleStops[10]], // Lucknow -> Sultanpur -> Akbarpur -> Varanasi
    path: [
      { lat: sampleStops[8].latitude, lng: sampleStops[8].longitude }, // Lucknow
      { lat: sampleStops[12].latitude, lng: sampleStops[12].longitude }, // Sultanpur
      { lat: sampleStops[11].latitude, lng: sampleStops[11].longitude }, // Akbarpur
      { lat: sampleStops[10].latitude, lng: sampleStops[10].longitude }, // Varanasi
    ],
    departureTime: '09:00',
    averageDurationHours: 6.5,
    distanceKm: 300,
  },
  {
    id: 'routeUP5',
    name: 'Route 502: Delhi - Lucknow Volvo',
    operatorName: 'Sharma Travels',
    busType: 'Volvo AC Semi-Sleeper',
    stops: [sampleStops[0], sampleStops[8]], // Delhi -> Lucknow
    path: [
        { lat: sampleStops[0].latitude, lng: sampleStops[0].longitude }, 
        { lat: 27.78, lng: 79.03 }, 
        { lat: sampleStops[8].latitude, lng: sampleStops[8].longitude },
    ],
    departureTime: '21:30',
    averageDurationHours: 7.5,
    distanceKm: 500,
  },
  ...newGeneratedRoutes,
];

export let sampleBuses: Bus[] = [ 
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
    routeId: 'route4', 
    currentLatitude: 27.2500, currentLongitude: 77.9000,
    totalSeats: 42, bookedSeats: 35, etaPredictions: new Map(),
  },
  {
    id: 'busHR55JP0001',
    routeId: 'route5',
    currentLatitude: 28.5000, currentLongitude: 77.1000, 
    totalSeats: 55, bookedSeats: 10, etaPredictions: new Map(),
  },
   {
    id: 'busUP80MJ0002',
    routeId: 'route6',
    currentLatitude: 27.5100, currentLongitude: 77.5000, 
    totalSeats: 35, bookedSeats: 5, etaPredictions: new Map(),
  },
   {
    id: 'busDL01AG7777',
    routeId: 'route1', 
    currentLatitude: 28.6000, currentLongitude: 77.2000, 
    totalSeats: 45, bookedSeats: 5, etaPredictions: new Map(),
  },
  // Existing Buses for UP Routes
  {
    id: 'busUP32LK0011',
    routeId: 'routeUP1', // Delhi - Lucknow
    currentLatitude: 28.05, currentLongitude: 78.50, // Somewhere on the way from Delhi
    totalSeats: 40, bookedSeats: 10, etaPredictions: new Map(),
  },
  {
    id: 'busUP78KV0022',
    routeId: 'routeUP2', // Kanpur - Varanasi
    currentLatitude: 25.90, currentLongitude: 81.50, // Somewhere on the way from Kanpur
    totalSeats: 50, bookedSeats: 25, etaPredictions: new Map(),
  },
  {
    id: 'busDL01AY0033',
    routeId: 'routeUP3', // Delhi - Ayodhya
    currentLatitude: 27.00, currentLongitude: 80.00, // Somewhere after Lucknow
    totalSeats: 30, bookedSeats: 12, etaPredictions: new Map(),
  },
  {
    id: 'busUP32VB0044',
    routeId: 'routeUP4', // Lucknow - Varanasi (regional)
    currentLatitude: 26.30, currentLongitude: 82.20, // Near Sultanpur
    totalSeats: 40, bookedSeats: 18, etaPredictions: new Map(),
  },
  {
    id: 'busDL01LK5500',
    routeId: 'routeUP5', // Delhi - Lucknow Volvo
    currentLatitude: 28.55, currentLongitude: 77.35, // Near Delhi/Noida
    totalSeats: 48, bookedSeats: 22, etaPredictions: new Map(),
  },
  ...newGeneratedBuses,
];
