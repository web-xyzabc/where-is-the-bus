
// src/app/actions.ts
"use server";

import { predictETA, type PredictETAInput, type PredictETAOutput } from "@/ai/flows/predict-eta";
import type { Bus } from "@/lib/types";
import { sampleBuses } from "@/lib/data"; // For simulating booking

// Mock historical data and traffic conditions for ETA prediction
const mockHistoricalData = JSON.stringify({
  "stop1": [
    { "busId": "busA", "arrivalTime": "2023-10-26T10:05:00Z", "delay_minutes": 2 },
    { "busId": "busA", "arrivalTime": "2023-10-26T10:35:00Z", "delay_minutes": 0 }
  ],
  "stop2": [
     { "busId": "busA", "arrivalTime": "2023-10-26T10:15:00Z", "delay_minutes": 1 }
  ]
});

const mockTrafficConditions = JSON.stringify({
  "segment1": { "status": "moderate", "speed_mph": 20 },
  "segment2": { "status": "light", "speed_mph": 35 }
});

export async function getEtaPredictionAction(
  busId: string,
  stopId: string,
  currentLatitude: number,
  currentLongitude: number
): Promise<PredictETAOutput | { error: string }> {
  try {
    const input: PredictETAInput = {
      busId,
      stopId,
      currentLatitude,
      currentLongitude,
      historicalData: mockHistoricalData, 
      trafficConditions: mockTrafficConditions, 
    };
    const prediction = await predictETA(input);
    return prediction;
  } catch (error) {
    console.error("Error predicting ETA:", error);
    return { error: "Failed to predict ETA. Please try again." };
  }
}

export async function bookTicketAction(
  busId: string,
  numSeats: number,
  passengerName: string, // Added passengerName
  gender: string // Added gender (type can be more specific if needed)
): Promise<{ success: boolean; message: string; updatedBus?: Bus }> {
  // Simulate booking logic
  const busIndex = sampleBuses.findIndex(b => b.id === busId);
  if (busIndex === -1) {
    return { success: false, message: "Bus not found." };
  }

  const bus = sampleBuses[busIndex];
  const availableSeats = bus.totalSeats - bus.bookedSeats;

  if (numSeats <= 0) {
    return { success: false, message: "Number of seats must be positive." };
  }

  if (availableSeats < numSeats) {
    return { success: false, message: `Not enough seats available. Only ${availableSeats} left.` };
  }

  // Simulate successful booking by updating mock data
  sampleBuses[busIndex].bookedSeats += numSeats;
  
  // Simulate some delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, seat numbers would be assigned and stored.
  // Here, we're just confirming the number of seats.
  return { 
    success: true, 
    message: `Ticket confirmation for ${passengerName}. ${numSeats} seat(s) on bus ${busId}.`,
    updatedBus: { ...sampleBuses[busIndex] } 
  };
}
