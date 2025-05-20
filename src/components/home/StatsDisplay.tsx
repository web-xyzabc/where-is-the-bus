
"use client";

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';

export function StatsDisplay() {
  return (
    <section className="py-12 bg-muted rounded-lg">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-shrink-0">
              <Image 
                src="https://placehold.co/600x400/e0f2fe/0ea5e9?text=Happy+Travellers" 
                alt="Happy travellers illustration" 
                width={250} 
                height={160} 
                className="rounded-lg"
                data-ai-hint="group travel people"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                4,500+ people booked from Greater Noida
              </h2>
              <p className="text-lg text-foreground/80 mb-4">
                on redBus last month
              </p>
              <div className="flex items-center justify-center md:justify-start text-accent">
                <Users className="w-6 h-6 mr-2" />
                <span className="font-semibold">Join thousands of satisfied customers!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
