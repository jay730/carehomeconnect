
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFamilyDashboardData from "@/hooks/useFamilyDashboardData";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyHeaderProps {
  id: string;
  name: string;
  location: string;
  active: boolean;
  reviews: { rating: number }[];
  capacity: number;
  userRole?: string;
  price?: number;
  image?: string;
}

const PropertyHeader = ({ 
  id, 
  name, 
  location, 
  active, 
  reviews, 
  capacity,
  userRole,
  price,
  image = "/placeholder.svg"
}: PropertyHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveProperty, savedProperties, hasCurrentBookings } = useFamilyDashboardData();
  const [saved, setSaved] = useState(false);
  const isMobile = useIsMobile();

  // Check if property is saved on component mount and when savedProperties changes
  useEffect(() => {
    if (savedProperties) {
      setSaved(savedProperties.some(property => property.id === id));
    }
  }, [savedProperties, id]);

  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const handlePayment = () => {
    navigate(`/payment/${id}`);
  };

  const handleSaveProperty = async () => {
    if (saved) {
      // Removing is handled in SavedProperties component
      toast({
        title: "Cannot remove from here",
        description: "Please remove the property from your saved list page"
      });
    } else {
      // Save property
      const propertyData = {
        id,
        name,
        location,
        price: price || 0,
        image
      };
      
      const success = await saveProperty(propertyData);
      if (success) {
        setSaved(true);
        toast({
          title: "Property saved",
          description: "Added to your saved properties list"
        });
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{name}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{location}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="text-sm">
            ★ {calculateAverageRating().toFixed(1)} ({reviews.length} reviews)
          </Badge>
          <Badge variant="outline" className="text-sm">
            Capacity: {capacity} residents
          </Badge>
          {!active && (
            <Badge variant="destructive" className="text-sm">
              Inactive
            </Badge>
          )}
        </div>
      </div>
      
      {userRole === "family" && (
        <div className="flex flex-col w-full md:w-auto gap-3">
          <Button 
            onClick={handlePayment}
            className="w-full md:w-auto bg-care-600 hover:bg-care-700"
            disabled={true} // Deactivated the button by setting disabled to true
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </Button>
          <Button 
            variant={saved ? "default" : "outline"}
            onClick={handleSaveProperty}
            className="w-full md:w-auto"
          >
            <Heart className={`mr-2 h-4 w-4 ${saved ? 'fill-current' : ''}`} />
            {saved ? "Saved" : "Save Property"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyHeader;
