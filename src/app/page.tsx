
"use client";

import { useState } from 'react';
import { HeroSection } from "@/components/home/HeroSection";
import { PromoCard } from "@/components/home/PromoCard";
import { StatsDisplay } from "@/components/home/StatsDisplay";
import { BusSearchForm, type SearchFormData } from "@/components/home/BusSearchForm";
import { SearchResultsList } from '@/components/search/SearchResultsList';
import type { BusSearchResult, Route as RouteType, Bus as BusType } from '@/lib/types';
import { sampleRoutes, sampleBuses } from '@/lib/data';
import { TrainFront, Gift } from "lucide-react";
import { addHours, format as formatDateFns, parse, set } from 'date-fns';
import { useToast } from "@/hooks/use-toast";


export default function HomePage() {
  const [searchResults, setSearchResults] = useState<BusSearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const { toast } = useToast();

  const TICKET_PRICE_PER_KM = 15;

  const handleSearch = (data: SearchFormData) => {
    setIsSearching(true);
    setSearchResults(null); // Clear previous results
    setNoResultsFound(false);

    // Simulate API delay
    setTimeout(() => {
      const { from, to, dateOfJourney } = data;

      const matchingRoutes = sampleRoutes.filter(route => {
        const originStop = route.stops[0];
        const destinationStop = route.stops[route.stops.length - 1];
        return originStop.name.toLowerCase() === from.toLowerCase() &&
               destinationStop.name.toLowerCase() === to.toLowerCase();
      });

      if (matchingRoutes.length === 0) {
        setNoResultsFound(true);
        setIsSearching(false);
        toast({
          title: "No Routes Found",
          description: `We couldn't find any bus routes from ${from} to ${to}. Try a different search.`,
          variant: "destructive",
        });
        return;
      }

      const results: BusSearchResult[] = [];
      matchingRoutes.forEach(route => {
        const busesOnRoute = sampleBuses.filter(bus => bus.routeId === route.id);
        
        busesOnRoute.forEach(bus => {
          const availableSeats = bus.totalSeats - bus.bookedSeats;
          const price = route.distanceKm * TICKET_PRICE_PER_KM;

          // Combine dateOfJourney with route.departureTime
          const [hours, minutes] = route.departureTime.split(':').map(Number);
          let departureDateTime = set(dateOfJourney, { hours, minutes, seconds: 0, milliseconds: 0 });
          
          const estimatedArrivalDateTime = addHours(departureDateTime, route.averageDurationHours);

          results.push({
            busId: bus.id,
            routeId: route.id,
            operatorName: route.operatorName,
            busType: route.busType,
            routeName: route.name,
            departureStopName: route.stops[0].name,
            arrivalStopName: route.stops[route.stops.length - 1].name,
            departureDateTime: departureDateTime.toISOString(),
            estimatedArrivalDateTime: estimatedArrivalDateTime.toISOString(),
            price,
            availableSeats,
            totalSeats: bus.totalSeats,
            distanceKm: route.distanceKm,
            averageDurationHours: route.averageDurationHours,
          });
        });
      });
      
      if (results.length === 0) {
         setNoResultsFound(true);
         toast({
          title: "No Buses Found",
          description: `While routes exist from ${from} to ${to}, no buses are currently available for the selected criteria.`,
          variant: "destructive",
        });
      } else {
        // Sort results by departure time
        results.sort((a,b) => new Date(a.departureDateTime).getTime() - new Date(b.departureDateTime).getTime());
        setSearchResults(results);
      }
      setIsSearching(false);
    }, 1000); // Simulate 1 second delay
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection onSearch={handleSearch} isSearching={isSearching} />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {isSearching && (
          <div className="text-center py-10">
            <p className="text-lg font-semibold animate-pulse">Searching for buses...</p>
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <SearchResultsList results={searchResults} />
        )}
        
        {noResultsFound && !isSearching && (
          <div className="text-center py-10 bg-muted p-6 rounded-lg shadow">
            <p className="text-xl font-semibold text-destructive">No Buses Found</p>
            <p className="text-muted-foreground">Sorry, we couldn't find any buses matching your criteria. Please try a different search or check back later.</p>
          </div>
        )}

        {!isSearching && !searchResults && !noResultsFound && (
          <>
            <section className="grid md:grid-cols-2 gap-6 mb-12 mt-8">
              <PromoCard
                title="Book trains on redBus"
                description="Book now to get confirmed ticket"
                ctaText="Book trains now"
                ctaHref="#"
                icon={<TrainFront className="w-10 h-10 text-red-500" />}
                imageSrc="https://placehold.co/300x150/d1fae5/10b981?text=Train+Booking"
                imageAlt="Train booking promo"
                data-ai-hint="train travel"
              />
              <PromoCard
                title="Get ₹100 off using code FESTIVE"
                description="Limited time offer!"
                ctaText="Explore Offers"
                ctaHref="#"
                icon={<Gift className="w-10 h-10 text-yellow-500" />}
                imageSrc="https://placehold.co/300x150/fffbeb/f59e0b?text=Festive+Offer"
                imageAlt="Festive offer"
                data-ai-hint="discount sale"
              />
            </section>
            <StatsDisplay />
          </>
        )}
      </main>
    </div>
  );
}
