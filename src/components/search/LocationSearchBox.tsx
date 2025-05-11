
import React, { useState, useEffect } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

// Mock city data - in a real app, this would come from an API
const cities = [
  "San Francisco, CA",
  "Los Angeles, CA",
  "San Diego, CA",
  "San Jose, CA",
  "Sacramento, CA",
  "Seattle, WA",
  "Portland, OR",
  "Phoenix, AZ",
  "Las Vegas, NV",
  "Denver, CO"
];

interface LocationSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const LocationSearchBox = ({ value, onChange, onSearch }: LocationSearchBoxProps) => {
  const [open, setOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    if (value.length >= 3) {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setOpen(true);
    } else {
      setFilteredCities([]);
      setOpen(false);
    }
  }, [value]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="City, state, or zip code"
            value={value}
            onValueChange={onChange}
            className="pl-10"
          />
          <CommandList className={open ? "visible" : "hidden"}>
            {filteredCities.length === 0 ? (
              <CommandEmpty>No locations found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredCities.map((city) => (
                  <CommandItem
                    key={city}
                    onSelect={() => {
                      onChange(city);
                      setOpen(false);
                    }}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {city}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default LocationSearchBox;
