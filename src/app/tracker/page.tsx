
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { MapComponent } from '@/components/map/MapComponent';
import { BusRouteDetailsCard } from '@/components/bus/BusRouteDetailsCard';
import { BookingModal } from '@/components/bus/BookingModal';
import type { Bus, Route, EtaPrediction } from '@/lib/types';
import { sampleBuses, sampleRoutes } from '@/lib/data'; 
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

export default function TrackerPage() {
  const searchParams = useSearchParams();
  const selectedBusIdFromQuery = searchParams.get('busId');

  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [currentBusIndex, setCurrentBusIndex] = useState(0);
  const [selectedStopId, setSelectedStopId] = useState<string | undefined>(undefined);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSpecificBusMode, setIsSpecificBusMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const loadAndSetInitialData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    // Simulate fetching data / re-initializing
    const initialBuses = sampleBuses.map(bus => ({
      ...bus,
      bookedSeats: bus.bookedSeats, // Keep original or re-randomize if desired for demo
      etaPredictions: new Map()
    }));
    const initialRoutes = sampleRoutes;

    setBuses(initialBuses);
    setRoutes(initialRoutes);

    if (initialBuses.length === 0) {
      setError("No bus data available to display.");
      setIsLoading(false);
      return;
    }
    
    let targetBusIndex = 0;
    let specificMode = false;

    if (selectedBusIdFromQuery) {
      const busIdx = initialBuses.findIndex(b => b.id === selectedBusIdFromQuery);
      if (busIdx !== -1) {
        targetBusIndex = busIdx;
        specificMode = true;
      } else {
        setError(`Bus with ID ${selectedBusIdFromQuery} not found. Showing default bus.`);
        // Fallback to first bus, non-specific mode will be set below
      }
    }
    
    setCurrentBusIndex(targetBusIndex);
    setIsSpecificBusMode(specificMode);

    const busToFocus = initialBuses[targetBusIndex];
    if (busToFocus) {
      const routeToFocus = initialRoutes.find(r => r.id === busToFocus.routeId);
      setSelectedStopId(routeToFocus?.stops[0]?.id);
    } else {
      setSelectedStopId(undefined); // Should not happen if initialBuses is not empty
    }
    setIsLoading(false);
  }, [selectedBusIdFromQuery]);


  useEffect(() => {
    loadAndSetInitialData();
  }, [loadAndSetInitialData]); // loadAndSetInitialData depends on selectedBusIdFromQuery

  
  const currentBus = buses.length > 0 && currentBusIndex < buses.length ? buses[currentBusIndex] : null;
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

  useEffect(() => {
    if (!currentBus || !currentRoute || isLoading) return;

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
  }, [currentBus, currentRoute, isLoading]);

  const navigateBus = (direction: 'next' | 'prev') => {
    if (isSpecificBusMode || buses.length <= 1) return; 

    setCurrentBusIndex(prevIndex => {
      let newIndex = direction === 'next' ? prevIndex + 1 : prevIndex - 1;
      if (newIndex >= buses.length) newIndex = 0;
      if (newIndex < 0) newIndex = buses.length - 1;
      
      const nextBus = buses[newIndex];
      const nextRoute = routes.find(r => r.id === nextBus.routeId);
      setSelectedStopId(nextRoute?.stops[0]?.id);
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
    
    let targetIndex = 0;
    let specificMode = false;

    if (selectedBusIdFromQuery) {
      const busIdx = refreshedBuses.findIndex(b => b.id === selectedBusIdFromQuery);
      if (busIdx !== -1) {
        targetIndex = busIdx;
        specificMode = true;
      } else {
         setError(`Bus with ID ${selectedBusIdFromQuery} not found after refresh. Showing default bus.`);
      }
    }
    setCurrentBusIndex(targetIndex);
    setIsSpecificBusMode(specificMode);
    const busToFocus = refreshedBuses[targetIndex];
    if (busToFocus) {
      const routeToFocus = sampleRoutes.find(r => r.id === busToFocus.routeId);
      setSelectedStopId(routeToFocus?.stops[0]?.id);
    } else {
      setSelectedStopId(undefined);
      if (refreshedBuses.length === 0) setError("No bus data available after refresh.");
    }

  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-grow p-4">
        <div className="container mx-auto p-4 flex justify-end">
          <Skeleton className="h-9 w-28" />
        </div>
        <main className="flex-grow container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-[calc(100vh-280px)] min-h-[400px] w-full rounded-lg" />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }
  
  if (error && !currentBus) { // Show error prominently if currentBus couldn't be determined
    return (
       <div className="flex items-center justify-center min-h-[calc(100vh-150px)] p-4">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2 text-destructive">Data Error</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshData}>
              <RefreshCw className="mr-2 h-4 w-4" /> Try Refreshing Data
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }


  if (!currentBus || !currentRoute) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)] p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold mb-2">No bus data available.</p>
            <p className="text-muted-foreground mb-4">Try refreshing the data or check your search.</p>
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
       <div className="container mx-auto p-4 flex justify-end items-center gap-4">
           {error && <p className="text-sm text-destructive animate-pulse">{error}</p>}
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
          { !isSpecificBusMode && buses.length > 1 && (
            <Card>
              <CardContent className="p-3 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => navigateBus('prev')} aria-label="Previous Bus" disabled={buses.length <=1}>
                  <ChevronLeft className="h-4 w-4" /> Prev Bus
                </Button>
                <p className="text-sm font-medium text-muted-foreground">
                  Viewing Bus {currentBusIndex + 1} of {buses.length}
                </p>
                <Button variant="outline" size="sm" onClick={() => navigateBus('next')} aria-label="Next Bus" disabled={buses.length <=1}>
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

