
"use client";

import type { BusSearchResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, DollarSign, Users, MapPin, Bus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

interface SearchResultCardProps {
  result: BusSearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const departureTimeFormatted = format(parseISO(result.departureDateTime), "p"); // e.g., 07:00 AM
  const arrivalTimeFormatted = format(parseISO(result.estimatedArrivalDateTime), "p"); // e.g., 12:30 PM
  const departureDateFormatted = format(parseISO(result.departureDateTime), "MMM d, yyyy");
  const arrivalDateFormatted = format(parseISO(result.estimatedArrivalDateTime), "MMM d, yyyy");


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <CardTitle className="text-xl text-primary">{result.operatorName}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{result.busType} - {result.routeName}</CardDescription>
          </div>
          <Badge variant="outline" className="mt-2 sm:mt-0 py-1 px-3 text-base">
            ₹{result.price.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center my-4">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-lg font-semibold">{departureTimeFormatted}</p>
            <p className="text-sm text-muted-foreground">{result.departureStopName}</p>
            <p className="text-xs text-muted-foreground">{departureDateFormatted}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
            <Clock className="w-4 h-4 text-muted-foreground inline mr-1" />
            <span className="text-sm text-muted-foreground">{result.averageDurationHours} hrs</span>
             <p className="text-xs text-muted-foreground">({result.distanceKm} km)</p>
          </div>
          <div className="flex flex-col items-center md:items-end text-right">
            <p className="text-lg font-semibold">{arrivalTimeFormatted}</p>
            <p className="text-sm text-muted-foreground">{result.arrivalStopName}</p>
            <p className="text-xs text-muted-foreground">{arrivalDateFormatted}</p>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-green-600" />
            <span className={result.availableSeats > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {result.availableSeats > 0 ? `${result.availableSeats} Seats Available` : 'Sold Out'}
            </span>
            <span className="text-xs text-muted-foreground"> (Total: {result.totalSeats})</span>
          </div>
           <Link href={`/tracker?busId=${result.busId}&routeId=${result.routeId}`} passHref>
            <Button 
              size="sm" 
              variant={result.availableSeats > 0 ? "default" : "secondary"}
              disabled={result.availableSeats === 0}
              className={result.availableSeats > 0 ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
            >
              {result.availableSeats > 0 ? 'View & Book' : 'View Details'} <MapPin className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
