
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface PromoCardProps {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  'data-ai-hint'?: string;
}

export function PromoCard({ 
  title, 
  description, 
  ctaText, 
  ctaHref, 
  icon, 
  imageSrc, 
  imageAlt, 
  className,
  ['data-ai-hint']: aiHint
}: PromoCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col", className)}>
      {imageSrc && imageAlt && (
        <div className="relative h-40 w-full">
          <Image 
            src={imageSrc} 
            alt={imageAlt} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={aiHint}
          />
        </div>
      )}
      <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
        {icon && <div className="mt-1">{icon}</div>}
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Additional content can go here if needed */}
      </CardContent>
      <CardFooter>
        <Link href={ctaHref} passHref legacyBehavior>
          <Button variant="link" className="p-0 text-primary">
            {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
