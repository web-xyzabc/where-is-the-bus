
"use client";

import Image from "next/image";
import { BusSearchForm, type SearchFormData } from "./BusSearchForm";

interface HeroSectionProps {
  onSearch: (data: SearchFormData) => void;
  isSearching?: boolean;
}

export function HeroSection({ onSearch, isSearching }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-r from-primary/80 to-accent/60 text-white py-16 md:py-24">
      <Image
        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1920&auto=format&fit=crop"
        alt="Scenic bus route"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-30"
        data-ai-hint="scenic road landscape"
        priority // Added priority for LCP
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
            India&apos;s No. 1 online bus ticket booking site
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 drop-shadow-sm">
            Find and book your bus tickets with ease.
          </p>
        </div>
        <BusSearchForm onSearch={onSearch} isSearching={isSearching} />
      </div>
    </section>
  );
}
