
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { bookTicketAction } from '@/app/actions';
import type { Bus } from '@/lib/types';
import { sampleRoutes } from '@/lib/data'; // Import sampleRoutes to find operator name
import { Loader2, Ticket, User, VenetianMask } from 'lucide-react';

const bookingSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required." }),
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
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { 
      name: "",
      // gender: undefined, // Let placeholder show
      numSeats: 1 
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: "", numSeats: 1, gender: undefined }); // Reset form when modal opens
    }
  }, [isOpen, reset]);

  if (!bus) return null;

  const availableSeats = bus.totalSeats - bus.bookedSeats;
  const route = sampleRoutes.find(r => r.id === bus.routeId);
  const operatorName = route?.operatorName || "Unknown Operator";

  // Simulate seat assignment for the toast message
  const getSimulatedSeatNumbers = (num: number) => {
    // This is a very basic simulation. A real app would have a seat map and actual seat numbers.
    const prefix = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let seats = [];
    let currentSeatNum = (bus.bookedSeats % 10) + 1; // Start from a pseudo-random seat
    for (let i = 0; i < num; i++) {
      seats.push(`${prefix[Math.floor(currentSeatNum / 10) % prefix.length]}${currentSeatNum % 10 || 10}`);
      currentSeatNum++;
    }
    return seats.join(', ');
  };


  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    setIsSubmitting(true);
    const result = await bookTicketAction(bus.id, data.numSeats, data.name, data.gender);
    if (result.success && result.updatedBus) {
      const simulatedSeats = getSimulatedSeatNumbers(data.numSeats);
      toast({
        title: "Ticket Booked Successfully!",
        description: (
          <div className="space-y-1">
            <p><strong>Passenger:</strong> {data.name}</p>
            <p><strong>Bus ID:</strong> {bus.id}</p>
            <p><strong>Operator:</strong> {operatorName}</p>
            <p><strong>Seats Booked:</strong> {data.numSeats}</p>
            <p><strong>Seat Numbers:</strong> {simulatedSeats}</p>
            <p className="text-xs text-muted-foreground pt-1">{result.message}</p>
          </div>
        ),
        duration: 8000, // Longer duration for more info
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" /> Book Tickets for {operatorName} (Bus ID: {bus.id})
          </DialogTitle>
          <DialogDescription>
            Available seats: {availableSeats}. Please fill in passenger details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="flex items-center gap-1"><User className="w-4 h-4" /> Full Name</Label>
            <Input
              id="name"
              placeholder="Enter passenger's full name"
              {...register("name")}
              disabled={isSubmitting || availableSeats === 0}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="gender" className="flex items-center gap-1"><VenetianMask className="w-4 h-4" /> Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting || availableSeats === 0}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
          </div>
        
          <div className="space-y-1">
            <Label htmlFor="numSeats">Number of Seats</Label>
            <Input
              id="numSeats"
              type="number"
              min="1"
              max={Math.min(5, availableSeats)} 
              className="w-full"
              {...register("numSeats")}
              disabled={isSubmitting || availableSeats === 0}
            />
          </div>
          {errors.numSeats && <p className="text-sm text-destructive">{errors.numSeats.message}</p>}
          {availableSeats === 0 && <p className="text-sm text-destructive text-center">Sorry, no seats available for this bus.</p>}

          <DialogFooter className="mt-2">
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
