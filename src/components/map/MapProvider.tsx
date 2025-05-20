"use client";

import type { ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log(apiKey);
  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive-foreground">
        <p>
          Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['marker', 'routes']}>
      {children}
    </APIProvider>
  );
}
