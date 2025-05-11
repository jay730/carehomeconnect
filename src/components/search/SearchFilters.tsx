
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface SearchFiltersProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  amenitiesList: string[];
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

const SearchFilters = ({
  priceRange,
  setPriceRange,
  selectedAmenities,
  toggleAmenity,
  amenitiesList,
  filterOpen,
  setFilterOpen
}: SearchFiltersProps) => {
  return (
    <>
      <Button 
        type="button" 
        variant={filterOpen ? "default" : "outline"}
        onClick={() => setFilterOpen(!filterOpen)}
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>

      {filterOpen && (
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Price Range ($/month)</h3>
              <div className="px-2">
                <Slider
                  defaultValue={priceRange}
                  min={5000}
                  max={10000}
                  step={100}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesList.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`amenity-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFilters;
