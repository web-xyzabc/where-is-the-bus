
"use client";

import Link from 'next/link';
import { BusIcon, MapIcon, TicketIcon, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Search Buses', icon: <TicketIcon className="w-5 h-5" /> },
    { href: '/tracker', label: 'Bus Tracker', icon: <MapIcon className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <BusIcon className="w-7 h-7" />
            <span>Bus Booking</span>
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-sm font-medium hover:bg-primary/80 hover:text-primary-foreground",
                    pathname === item.href ? 'bg-primary/70' : ''
                  )}
                >
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.icon}</span>
                </Button>
              </Link>
            ))}
             <Button variant="ghost" size="icon" className="hover:bg-primary/80">
                <UserCircle2 className="w-6 h-6" />
                <span className="sr-only">User Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
