
export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  name: string;
  operatorName: string;
  busType: string; // e.g., "AC Sleeper", "Non-AC Seater"
  stops: Stop[];
  // Path for drawing the route on the map
  path: { lat: number; lng: number }[];
  departureTime: string; // e.g., "08:00 AM" (for the first stop)
  averageDurationHours: number; // Average duration for the whole route
  distanceKm: number; // Total distance of the route in KM
}

export interface Bus {
  id: string;
  routeId: string;
  currentLatitude: number;
  currentLongitude: number;
  totalSeats: number;
  bookedSeats: number;
  // Store ETA predictions, could be updated dynamically
  etaPredictions?: Map<string, EtaPrediction>; // Keyed by stopId
}

export interface EtaPrediction {
  stopId: string;
  estimatedArrivalTime: string; // ISO string
  confidence: number;
  reasoning: string;
}

export interface Booking {
  busId: string;
  routeId: string;
  stopId: string; // Or perhaps origin/destination stops
  numSeats: number;
  bookingTime: string; // ISO string
}

export interface BusSearchResult {
  busId: string;
  routeId: string;
  operatorName: string;
  busType: string;
  routeName: string;
  departureStopName: string;
  arrivalStopName: string;
  departureDateTime: string; // ISO string for full departure date and time
  estimatedArrivalDateTime: string; // ISO string for full arrival date and time
  price: number;
  availableSeats: number;
  totalSeats: number;
  distanceKm: number;
  averageDurationHours: number;
}
