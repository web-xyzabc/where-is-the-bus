
"use client";

import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import type { Bus, Route } from '@/lib/types';
import { BusMarkerIcon } from '@/components/icons/BusMarkerIcon';
import { StopMarkerIcon } from '@/components/icons/StopMarkerIcon';
import React, { useEffect, useRef } from 'react';

interface CustomPolylineProps {
  path?: google.maps.LatLngLiteral[];
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
}

const CustomPolylineComponent: React.FC<CustomPolylineProps> = ({
  path,
  strokeColor = '#3F51B5', // Default from theme's primary color (Deep Indigo)
  strokeOpacity = 0.8,
  strokeWeight = 5,
}) => {
  const map = useMap();
  const polylineInstanceRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) {
      if (polylineInstanceRef.current) {
        polylineInstanceRef.current.setMap(null);
        // Do not nullify polylineInstanceRef.current here, let cleanup do it
      }
      return;
    }

    if (!path || path.length === 0) {
      if (polylineInstanceRef.current) {
        polylineInstanceRef.current.setMap(null);
      }
      return;
    }

    if (!polylineInstanceRef.current) {
      polylineInstanceRef.current = new google.maps.Polyline();
    }

    polylineInstanceRef.current.setOptions({
      path,
      strokeColor,
      strokeOpacity,
      strokeWeight,
    });
    
    polylineInstanceRef.current.setMap(map);

  }, [map, path, strokeColor, strokeOpacity, strokeWeight]);

  useEffect(() => {
    // Cleanup effect: remove polyline from map when component unmounts
    return () => {
      if (polylineInstanceRef.current) {
        polylineInstanceRef.current.setMap(null);
        polylineInstanceRef.current = null; 
      }
    };
  }, []);

  return null; 
};


interface MapComponentProps {
  bus: Bus | null;
  route: Route | null;
  selectedStopId?: string;
  onStopClick?: (stopId: string) => void;
  className?: string;
}

export function MapComponent({ bus, route, selectedStopId, onStopClick, className }: MapComponentProps) {
  const map = useMap();

  const defaultCenter = route?.stops[0] 
    ? { lat: route.stops[0].latitude, lng: route.stops[0].longitude }
    : { lat: 34.0522, lng: -118.2437 }; // Default to LA if no route

  useEffect(() => {
    if (map && route?.path && route.path.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      route.path.forEach(point => bounds.extend(point));
      if (bus) {
        bounds.extend({ lat: bus.currentLatitude, lng: bus.currentLongitude });
      }
      map.fitBounds(bounds, 50); // 50px padding
    } else if (map && bus) {
       map.panTo({ lat: bus.currentLatitude, lng: bus.currentLongitude });
       map.setZoom(14);
    }
  }, [map, route, bus]);


  return (
    <div className={className ?? "h-[400px] w-full rounded-lg overflow-hidden shadow-md border"}>
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={12}
        mapId="where-is-the-bus-map"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {route?.path && (
          <CustomPolylineComponent
            path={route.path}
            strokeColor="hsl(var(--primary))" // This will be overridden by the default in CustomPolylineComponent for now.
                                              // To use theme color, CustomPolylineComponent would need to compute it.
                                              // For simplicity, using the hardcoded default #3F51B5.
                                              // Or, pass the resolved color string directly if available here.
            strokeOpacity={0.8}
            strokeWeight={5}
          />
        )}

        {route?.stops.map((stop) => (
          <AdvancedMarker
            key={stop.id}
            position={{ lat: stop.latitude, lng: stop.longitude }}
            title={stop.name}
            onClick={() => onStopClick?.(stop.id)}
          >
            <Pin
              background={selectedStopId === stop.id ? "hsl(var(--accent))" : "hsl(var(--primary))"}
              borderColor={selectedStopId === stop.id ? "hsl(var(--accent-foreground))" : "hsl(var(--primary-foreground))"}
              glyphColor={selectedStopId === stop.id ? "hsl(var(--accent-foreground))" : "hsl(var(--primary-foreground))"}
            >
              <StopMarkerIcon className="w-5 h-5" />
            </Pin>
          </AdvancedMarker>
        ))}

        {bus && (
          <AdvancedMarker
            position={{ lat: bus.currentLatitude, lng: bus.currentLongitude }}
            title={`Bus ${bus.id}`}
          >
             <BusMarkerIcon className="w-8 h-8 text-accent drop-shadow-lg" />
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
}
