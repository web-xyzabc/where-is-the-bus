
"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { PromoCard } from "@/components/home/PromoCard";
import { StatsDisplay } from "@/components/home/StatsDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Gift, TrainFront } from "lucide-react";
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <section className="grid md:grid-cols-2 gap-6 mb-12">
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

      </main>
    </div>
  );
}
