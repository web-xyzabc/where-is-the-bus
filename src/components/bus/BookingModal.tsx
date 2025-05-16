"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { bookTicketAction } from '@/app/actions';
import type { Bus } from '@/lib/types';
import { Loader2, Ticket } from 'lucide-react';

const bookingSchema = z.object({
  numSeats: z.coerce.number().int().min(1, "Must book at least 1 seat.").max(5, "Cannot book more than 5 seats at once."),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  bus: Bus | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingSuccess: (updatedBus: Bus) => void;
}

export function BookingModal({ bus, isOpen, onOpenChange, onBookingSuccess }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { numSeats: 1 },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ numSeats: 1 }); // Reset form when modal opens
    }
  }, [isOpen, reset]);

  if (!bus) return null;

  const availableSeats = bus.totalSeats - bus.bookedSeats;

  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    setIsSubmitting(true);
    const result = await bookTicketAction(bus.id, data.numSeats);
    if (result.success && result.updatedBus) {
      toast({
        title: "Booking Successful!",
        description: result.message,
      });
      onBookingSuccess(result.updatedBus);
      onOpenChange(false);
    } else {
      toast({
        title: "Booking Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" /> Book Tickets
          </DialogTitle>
          <DialogDescription>
            Book seats for Bus {bus.id}. Available seats: {availableSeats}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="numSeats" className="text-right">
              Seats
            </Label>
            <Input
              id="numSeats"
              type="number"
              min="1"
              max={Math.min(5, availableSeats)} // User can book max 5 or available seats
              className="col-span-3"
              {...register("numSeats")}
              disabled={isSubmitting || availableSeats === 0}
            />
          </div>
          {errors.numSeats && <p className="col-span-4 text-sm text-destructive text-center">{errors.numSeats.message}</p>}
           {availableSeats === 0 && <p className="col-span-4 text-sm text-destructive text-center">Sorry, no seats available.</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || availableSeats === 0}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Book Now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
