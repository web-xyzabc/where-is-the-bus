"use client";

import type { Bus, Route, Stop, EtaPrediction } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, Ticket, Users, Loader2, AlertTriangle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { getEtaPredictionAction } from '@/app/actions';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BusRouteDetailsCardProps {
  bus: Bus;
  route: Route;
  selectedStopId?: string;
  onStopSelect: (stopId: string) => void;
  onBookNowClick: () => void;
  onEtaUpdate: (busId: string, stopId: string, eta: EtaPrediction) => void;
}

export function BusRouteDetailsCard({ bus, route, selectedStopId, onStopSelect, onBookNowClick, onEtaUpdate }: BusRouteDetailsCardProps) {
  const [isEtaLoading, startEtaTransition] = useTransition();
  const [loadingStopId, setLoadingStopId] = useState<string | null>(null);
  const { toast } = useToast();

  const availableSeats = bus.totalSeats - bus.bookedSeats;

  const handleGetEta = async (stop: Stop) => {
    setLoadingStopId(stop.id);
    startEtaTransition(async () => {
      const result = await getEtaPredictionAction(
        bus.id,
        stop.id,
        bus.currentLatitude,
        bus.currentLongitude
      );
      if ('error' in result) {
        toast({
          title: "ETA Prediction Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        const eta = { ...result, stopId: stop.id };
        onEtaUpdate(bus.id, stop.id, eta);
        toast({
          title: "ETA Updated",
          description: `ETA for ${stop.name} is ${format(parseISO(result.estimatedArrivalTime), "p")}.`,
        });
      }
      setLoadingStopId(null);
    });
  };

  return (
    <Card className="w-full max-w-md shadow-xl flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
        <CardTitle className="text-xl">{route.name}</CardTitle>
        <CardDescription className="text-primary-foreground/80">Bus ID: {bus.id}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Seats: {availableSeats} / {bus.totalSeats}
          </Badge>
          <Button size="sm" onClick={onBookNowClick} disabled={availableSeats === 0}>
            <Ticket className="w-4 h-4 mr-2" />
            {availableSeats > 0 ? 'Book Tickets' : 'No Seats'}
          </Button>
        </div>
        
        <h4 className="font-semibold mb-2 text-foreground/90">Stops:</h4>
        <ScrollArea className="h-[200px] border rounded-md p-1">
          <ul className="space-y-1">
            {route.stops.map((stop, index) => {
              const etaPrediction = bus.etaPredictions?.get(stop.id);
              const isLoadingThisStop = isEtaLoading && loadingStopId === stop.id;

              return (
                <li key={stop.id}>
                  <Button
                    variant={selectedStopId === stop.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto p-2 text-left"
                    onClick={() => onStopSelect(stop.id)}
                  >
                    <MapPin className="w-4 h-4 mr-2 shrink-0 text-primary" />
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{stop.name}</p>
                      {etaPrediction ? (
                        <p className="text-xs text-muted-foreground">
                          ETA: {format(parseISO(etaPrediction.estimatedArrivalTime), "p")} (Conf: {(etaPrediction.confidence * 100).toFixed(0)}%)
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Click to get ETA</p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-auto h-7 w-7 shrink-0"
                      onClick={(e) => { e.stopPropagation(); handleGetEta(stop); }}
                      disabled={isLoadingThisStop}
                      aria-label={`Get ETA for ${stop.name}`}
                    >
                      {isLoadingThisStop ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4 text-accent" />}
                    </Button>
                  </Button>
                  {etaPrediction?.reasoning && selectedStopId === stop.id && (
                     <p className="text-xs text-muted-foreground p-2 bg-muted rounded-md mt-1">
                       <strong>Reasoning:</strong> {etaPrediction.reasoning}
                     </p>
                  )}
                  {index < route.stops.length -1 && <Separator className="my-1" />}
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
         <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-500" /> ETAs are estimates and subject to change.
        </p>
      </CardFooter>
    </Card>
  );
}
