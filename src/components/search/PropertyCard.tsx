
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import useFamilyDashboardData from "@/hooks/useFamilyDashboardData";

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

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { saveProperty, savedProperties } = useFamilyDashboardData();
  const [saved, setSaved] = useState(false);

  // Check if property is saved
  useEffect(() => {
    if (savedProperties) {
      setSaved(savedProperties.some(p => p.id === property.id));
    }
  }, [savedProperties, property.id]);

  const handleSaveProperty = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when saving
    
    if (!isAuthenticated) {
      return;
    }

    if (saved) {
      return;
    }

    const propertyData = {
      id: property.id,
      name: property.name,
      location: property.location,
      price: property.price,
      image: property.image,
    };
    
    const success = await saveProperty(propertyData);
    if (success) {
      setSaved(true);
    }
  };

  return (
    <Card className="overflow-hidden care-card">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={property.image} 
            alt={property.name} 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className="bg-white text-care-700">
            ★ {property.rating} ({property.reviews})
          </Badge>
          {isAuthenticated && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white"
              onClick={handleSaveProperty}
            >
              <Heart className={`h-4 w-4 ${saved ? 'fill-current text-care-700' : ''}`} />
              <span className="sr-only">Save property</span>
            </Button>
          )}
        </div>
      </div>
      
      <CardContent className="pt-6">
        <h3 className="font-bold text-xl mb-1">{property.name}</h3>
        <p className="text-gray-600 mb-4">{property.location}</p>
        <div className="flex flex-wrap gap-2 mb-4 h-8 overflow-hidden">
          {property.amenities && property.amenities.length > 0 ? (
            <>
              {property.amenities.slice(0, 2).map((amenity, index) => (
                <span key={`${amenity}-${index}`} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 2 && (
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  +{property.amenities.length - 2} More
                </span>
              )}
            </>
          ) : (
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">No amenities listed</span>
          )}
        </div>
        {isAuthenticated ? (
          <p className="font-semibold text-lg">
            Starting at ${property.price.toLocaleString()}/month
          </p>
        ) : (
          <p className="flex items-center text-amber-600 font-medium">
            <Lock className="h-4 w-4 mr-1" />
            <span>Login to view price</span>
          </p>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          onClick={() => navigate(`/property/${property.id}`)} 
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
