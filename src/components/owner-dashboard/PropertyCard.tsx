
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/hooks/useOwnerProperties";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
}
export const PropertyCard = ({
  property
}: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Format price for display
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(property.price || 0);
  
  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };
  
  return <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleCardClick}>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative">
          <img src={property.image || "/placeholder.svg"} alt={property.name} className="h-48 w-full object-cover rounded-t-lg" />
          
          {!property.active && <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center rounded-t-lg">
              <Badge variant="outline" className="bg-black/75 text-white border-white">
                Inactive
              </Badge>
            </div>}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{property.name}</h3>
          <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
            {property.city}, {property.state}
          </p>
          
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Capacity:</span>
              <span className="text-sm">{property.capacity || 0}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium">Starting at {formattedPrice}/month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
