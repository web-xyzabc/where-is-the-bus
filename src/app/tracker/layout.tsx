
import { MapProvider } from '@/components/map/MapProvider';
import type { ReactNode } from 'react';

export default function TrackerLayout({ children }: { children: ReactNode }) {
  return (
    <MapProvider>
      {children}
    </MapProvider>
  );
}
