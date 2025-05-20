
"use client";

import { useState, useEffect, useCallback } from 'react';
import { MapComponent } from '@/components/map/MapComponent';
import { BusRouteDetailsCard } from '@/components/bus/BusRouteDetailsCard';
import { BookingModal } from '@/components/bus/BookingModal';
import type { Bus, Route, Stop, EtaPrediction } from '@/lib/types';
import { sampleBuses, sampleRoutes } from '@/lib/data'; // Mock data
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TrackerPage() {
  const [buses, setBuses] = useState<Bus[]>(sampleBuses);
  const [routes, setRoutes] = useState<Route[]>(sampleRoutes);
  const [currentBusIndex, setCurrentBusIndex] = useState(0);
  
  const [selectedStopId, setSelectedStopId] = useState<string | undefined>(undefined);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Simulate fetching data
  useEffect(() => {
    setBuses(sampleBuses);
    setRoutes(sampleRoutes);
    if (buses.length > 0 && routes.length > 0) {
      const currentBus = buses[currentBusIndex % buses.length]; // Ensure currentBusIndex is within bounds
      const currentRoute = routes.find(r => r.id === currentBus.routeId);
      if (currentRoute && currentRoute.stops.length > 0) {
        setSelectedStopId(currentRoute.stops[0].id);
      }
    }
  }, [currentBusIndex, buses.length, routes]); // Updated dependencies
  
  const currentBus = buses.length > 0 ? buses[currentBusIndex % buses.length] : null;
  const currentRoute = currentBus ? routes.find(r => r.id === currentBus.routeId) : null;

  const handleStopSelect = (stopId: string) => {
    setSelectedStopId(stopId);
  };

  const handleBookNowClick = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (updatedBus: Bus) => {
    setBuses(prevBuses => 
      prevBuses.map(b => b.id === updatedBus.id ? updatedBus : b)
    );
    setIsBookingModalOpen(false);
  };

  const handleEtaUpdate = useCallback((busId: string, stopId: string, eta: EtaPrediction) => {
    setBuses(prevBuses =>
      prevBuses.map(b => {
        if (b.id === busId) {
          const newEtaPredictions = new Map(b.etaPredictions);
          newEtaPredictions.set(stopId, eta);
          return { ...b, etaPredictions: newEtaPredictions };
        }
        return b;
      })
    );
  }, []);

  // Simulate live bus movement
  useEffect(() => {
    if (!currentBus || !currentRoute) return;

    const interval = setInterval(() => {
      setBuses(prevBuses => prevBuses.map(b => {
        if (b.id === currentBus.id) {
          const newLat = b.currentLatitude + (Math.random() - 0.5) * 0.0005;
          const newLng = b.currentLongitude + (Math.random() - 0.5) * 0.0005;
          return { ...b, currentLatitude: newLat, currentLongitude: newLng };
        }
        return b;
      }));
    }, 5000); 

    return () => clearInterval(interval);
  }, [currentBus, currentRoute]);

  const navigateBus = (direction: 'next' | 'prev') => {
    setCurrentBusIndex(prevIndex => {
      let newIndex = direction === 'next' ? prevIndex + 1 : prevIndex - 1;
      if (newIndex >= buses.length) newIndex = 0;
      if (newIndex < 0) newIndex = buses.length - 1;
      const nextBus = buses[newIndex];
      const nextRoute = routes.find(r => r.id === nextBus.routeId);
      if (nextRoute && nextRoute.stops.length > 0) {
        setSelectedStopId(nextRoute.stops[0].id);
      } else {
        setSelectedStopId(undefined);
      }
      return newIndex;
    });
  };
  
  const refreshData = () => {
     const refreshedBuses = sampleBuses.map(bus => ({
      ...bus,
      bookedSeats: Math.floor(Math.random() * bus.totalSeats),
      etaPredictions: new Map() 
    }));
    setBuses(refreshedBuses);
    setRoutes(sampleRoutes);
     const currentIdx = currentBusIndex % refreshedBuses.length;
    if (refreshedBuses.length > 0 && routes.length > 0) {
      const bus = refreshedBuses[currentIdx];
      const route = routes.find(r => r.id === bus.routeId);
      if (route && route.stops.length > 0) {
        setSelectedStopId(route.stops[0].id);
      } else {
        setSelectedStopId(undefined);
      }
    }
     setCurrentBusIndex(currentIdx); // Ensure index is valid after refresh
  };


  if (!currentBus || !currentRoute) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)] p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold mb-2">No bus data available.</p>
            <p className="text-muted-foreground mb-4">Try refreshing the data.</p>
            <Button onClick={refreshData}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow">
       <div className="container mx-auto p-4 flex justify-end">
           <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
        </div>
      <main className="flex-grow container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MapComponent 
            bus={currentBus} 
            route={currentRoute} 
            selectedStopId={selectedStopId}
            onStopClick={handleStopSelect}
            className="h-[calc(100vh-280px)] min-h-[400px] w-full rounded-lg overflow-hidden shadow-md border"
          />
        </div>
        <div className="md:col-span-1 flex flex-col gap-4">
          {buses.length > 1 && (
            <Card>
              <CardContent className="p-3 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => navigateBus('prev')} aria-label="Previous Bus">
                  <ChevronLeft className="h-4 w-4" /> Prev Bus
                </Button>
                <p className="text-sm font-medium text-muted-foreground">
                  Viewing Bus {currentBusIndex + 1} of {buses.length}
                </p>
                <Button variant="outline" size="sm" onClick={() => navigateBus('next')} aria-label="Next Bus">
                  Next Bus <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
          <BusRouteDetailsCard
            bus={currentBus}
            route={currentRoute}
            selectedStopId={selectedStopId}
            onStopSelect={handleStopSelect}
            onBookNowClick={handleBookNowClick}
            onEtaUpdate={handleEtaUpdate}
          />
        </div>
      </main>

      <BookingModal
        bus={currentBus}
        isOpen={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
