
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Bus, Users, MapPin, ArrowRightLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { sampleStops } from "@/lib/data"; // Import sampleStops

const searchSchema = z.object({
  from: z.string().min(1, "Source is required"),
  to: z.string().min(1, "Destination is required"),
  dateOfJourney: z.date({ required_error: "Date of journey is required." }),
  bookingForWomen: z.boolean().default(false),
});

export type SearchFormData = z.infer<typeof searchSchema>;

interface BusSearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isSearching?: boolean;
}

export function BusSearchForm({ onSearch, isSearching }: BusSearchFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { control, register, handleSubmit, setValue, formState: { errors }, watch } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      from: "",
      to: "",
      dateOfJourney: new Date(),
      bookingForWomen: false,
    },
  });
  
  const fromValue = watch("from");
  const toValue = watch("to");

  const handleSwapLocations = () => {
    setValue("from", toValue);
    setValue("to", fromValue);
  };


  const onSubmit = (data: SearchFormData) => {
    onSearch(data);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setValue("dateOfJourney", selectedDate, { shouldValidate: true });
    }
  };
  
  const setJourneyDate = (offset: number) => {
    const newDate = new Date(); // Base today
    const journeyDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()); // only date part
    journeyDate.setDate(journeyDate.getDate() + offset);
    handleDateSelect(journeyDate);
  };


  return (
    <Card className="max-w-4xl mx-auto shadow-2xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
            {/* From Input */}
            <div className="md:col-span-3 relative">
              <Label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="from"
                  placeholder="Source"
                  className="pl-10"
                  {...register("from")}
                  disabled={isSearching}
                  list="source-stations"
                />
                <datalist id="source-stations">
                  {sampleStops.map(stop => (
                    <option key={`from-${stop.id}`} value={stop.name} />
                  ))}
                </datalist>
              </div>
              {errors.from && <p className="text-xs text-red-500 mt-1">{errors.from.message}</p>}
            </div>
            
            {/* Swap Button */}
            <div className="flex md:col-span-1 items-center justify-center pt-6 md:pt-0">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button" 
                    onClick={handleSwapLocations} 
                    aria-label="Swap locations"
                    disabled={isSearching}
                    className="mt-0 md:mt-5" // Adjust margin for mobile vs desktop alignment
                >
                    <ArrowRightLeft className="h-5 w-5 text-gray-500" />
                </Button>
            </div>

            {/* To Input */}
            <div className="md:col-span-3 relative">
              <Label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</Label>
               <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="to"
                  placeholder="Destination"
                  className="pl-10"
                  {...register("to")}
                  disabled={isSearching}
                  list="destination-stations"
                />
                <datalist id="destination-stations">
                  {sampleStops.map(stop => (
                    <option key={`to-${stop.id}`} value={stop.name} />
                  ))}
                </datalist>
              </div>
              {errors.to && <p className="text-xs text-red-500 mt-1">{errors.to.message}</p>}
            </div>

            {/* Date of Journey */}
            <div className="md:col-span-4">
              <Label htmlFor="dateOfJourney" className="block text-sm font-medium text-gray-700 mb-1">Date of Journey</Label>
              <Controller
                name="dateOfJourney"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isSearching}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(newDate) => {
                          field.onChange(newDate);
                          handleDateSelect(newDate);
                        }}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                      />
                       <div className="p-2 border-t flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setJourneyDate(0)}>Today</Button>
                        <Button variant="outline" size="sm" onClick={() => setJourneyDate(1)}>Tomorrow</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dateOfJourney && <p className="text-xs text-red-500 mt-1">{errors.dateOfJourney.message}</p>}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="bookingForWomen"
                control={control}
                render={({ field }) => (
                   <div className="flex items-center space-x-2 p-2 border rounded-md bg-rose-50">
                    <Users className="h-5 w-5 text-rose-500" />
                    <Label htmlFor="bookingForWomen" className="text-sm font-medium text-rose-700">
                      Booking for women
                    </Label>
                    <Switch
                      id="bookingForWomen"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-rose-500 data-[state=unchecked]:bg-gray-200"
                      disabled={isSearching}
                    />
                  </div>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3" disabled={isSearching}>
              <Search className="mr-2 h-5 w-5" /> {isSearching ? "Searching..." : "Search Buses"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

