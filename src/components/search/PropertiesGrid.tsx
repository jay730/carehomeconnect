
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import PropertyCard from "./PropertyCard";

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  amenities: string[];
  rating: number;
  reviews: number;
}

interface PropertiesGridProps {
  properties: Property[];
  loading: boolean;
  onReset: () => void;
}

const PropertiesGrid = ({ properties, loading, onReset }: PropertiesGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex rounded-full bg-primary-100 p-4">
          <Home size={24} className="text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No care homes found</h3>
        <p className="mt-2 text-gray-600">
          Try adjusting your search filters or exploring a different location
        </p>
        <Button className="mt-6" onClick={onReset}>
          Reset All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertiesGrid;
