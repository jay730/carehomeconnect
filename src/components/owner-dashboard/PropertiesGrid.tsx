
import { PropertyCard } from "./PropertyCard";

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  description: string;
  capacity: number;
  city: string;
  state: string;
  active: boolean;
  image?: string;
  newInquiryCount: number;
}

interface PropertiesGridProps {
  properties: Property[];
}

export function PropertiesGrid({ properties }: PropertiesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
