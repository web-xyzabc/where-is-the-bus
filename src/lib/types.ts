export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  // Path for drawing the route on the map
  path: { lat: number; lng: number }[];
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
