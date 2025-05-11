import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Owner {
  name: string;
  phone: string;
  email: string;
}

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  reply?: string;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  image: string;
  amenities: string[];
  capacity: number;
  careServices: string[];
  active: boolean;
  owner: Owner;
  reviews: Review[];
  ownerId: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export const usePropertyDetails = (propertyId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isAuthenticated = !!user;

  useEffect(() => {
    // Fetch property details
    const fetchProperty = async () => {
      try {
        if (!propertyId) {
          navigate("/search");
          return;
        }
        
        setLoading(true);
        setError(null);
        
        // Get property details from supabase
        const { data: homeData, error: homeError } = await supabase
          .from('care_homes')
          .select('*')
          .eq('id', propertyId)
          .single();
          
        if (homeError) {
          throw homeError;
        }
        
        if (!homeData) {
          navigate("/search");
          return;
        }
        
        // Get amenities
        const { data: amenitiesData } = await supabase
          .from('care_home_amenities')
          .select('*')
          .eq('care_home_id', propertyId)
          .single();
        
        // Get services
        const { data: servicesData } = await supabase
          .from('care_home_services')
          .select('*')
          .eq('care_home_id', propertyId)
          .single();
        
        // Get media
        const { data: mediaData } = await supabase
          .from('care_home_media')
          .select('*')
          .eq('care_home_id', propertyId);

        // Format amenities as string array
        const amenitiesList: string[] = [];
        if (amenitiesData) {
          if (amenitiesData.private_rooms) amenitiesList.push('Private Rooms');
          if (amenitiesData.ensuite_rooms) amenitiesList.push('Ensuite Bathrooms');
          if (amenitiesData.garden) amenitiesList.push('Beautiful Garden');
          if (amenitiesData.communal_dining) amenitiesList.push('Communal Dining');
          if (amenitiesData.entertainment_area) amenitiesList.push('Entertainment Area');
          if (amenitiesData.housekeeping) amenitiesList.push('Housekeeping');
          if (amenitiesData.laundry) amenitiesList.push('Laundry Service');
          if (amenitiesData.transportation) amenitiesList.push('Transportation');
        }
        
        // Format services as string array
        const servicesList: string[] = [];
        if (servicesData) {
          if (servicesData.twenty_four_hour_staff) servicesList.push('24/7 Staff');
          if (servicesData.medication_management) servicesList.push('Medication Management');
          if (servicesData.personal_care) servicesList.push('Personal Care Assistance');
          if (servicesData.mobility_assistance) servicesList.push('Mobility Assistance');
          if (servicesData.meal_preparation) servicesList.push('Meal Preparation');
          if (servicesData.memory_care) servicesList.push('Memory Care');
          if (servicesData.social_activities) servicesList.push('Social Activities');
        }
        
        // Find primary image
        let primaryImage = "https://images.unsplash.com/photo-1568605114967-8130f3a36994";
        if (mediaData && mediaData.length > 0) {
          const primaryMedia = mediaData.find(m => m.is_primary);
          if (primaryMedia && primaryMedia.photo_url) {
            primaryImage = primaryMedia.photo_url;
          } else if (mediaData[0].photo_url) {
            primaryImage = mediaData[0].photo_url;
          }
        }
        
        // Get owner info from profiles table
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', homeData.owner_id)
          .single();
        
        // Get user email from auth table if needed
        let ownerEmail = "contact@carehomeconnect.com"; // Default fallback
        try {
          // Try to get owner's auth data if we're the owner or an admin
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser?.id === homeData.owner_id) {
            // If we're the owner, we can use our own email
            ownerEmail = currentUser.email || ownerEmail;
          }
        } catch (error) {
          console.error("Error fetching user email:", error);
          // Keep using the default fallback email
        }
        
        // Construct owner info, ensuring we have all necessary fields
        const ownerInfo = {
          name: ownerData?.first_name && ownerData?.last_name 
            ? `${ownerData.first_name} ${ownerData.last_name}` 
            : "Care Home Owner",
          phone: ownerData?.phone || "(555) 123-4567",
          email: ownerEmail // Use the email we determined above
        };

        // Get reviews (mock data for now)
        const reviews = [
          {
            id: "r1",
            author: "Sarah Johnson",
            date: "2023-02-15",
            rating: 5,
            comment: "My mother has been living at this care home for six months now, and I couldn't be happier with the care she receives. The staff is attentive and kind, and the home is always clean and welcoming.",
            reply: "Thank you for your kind words, Sarah! We're so happy that your mother is enjoying her time with us."
          },
          {
            id: "r2",
            author: "Michael Thompson",
            date: "2023-01-20",
            rating: 4,
            comment: "A wonderful place with caring staff. My father enjoys the social activities. Only giving 4 stars because the parking can be limited during visiting hours."
          }
        ];

        // Construct the property object with active status
        const propertyData: Property = {
          id: homeData.id,
          name: homeData.name,
          description: homeData.description,
          location: `${homeData.address}, ${homeData.city}, ${homeData.state} ${homeData.zip_code}`,
          price: homeData.price,
          image: primaryImage,
          amenities: amenitiesList,
          capacity: homeData.capacity,
          careServices: servicesList,
          active: homeData.active !== false, // If null or undefined, treat as active
          owner: ownerInfo,
          reviews,
          ownerId: homeData.owner_id,
          address: homeData.address,
          city: homeData.city,
          state: homeData.state,
          zip_code: homeData.zip_code
        };

        setProperty(propertyData);
        
        // Check if current user is the owner of this property
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setIsOwner(currentUser?.id === homeData.owner_id);
        
      } catch (error) {
        console.error("Error fetching property:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, navigate]);

  const handlePropertyDeactivated = () => {
    if (property) {
      setProperty({
        ...property,
        active: false
      });
    }
  };

  const handlePropertyUpdated = (updatedProperty: Partial<Property>) => {
    if (property) {
      setProperty({
        ...property,
        ...updatedProperty
      });
    }
  };

  const handleImageUpdated = (newImageUrl: string) => {
    if (property) {
      setProperty({
        ...property,
        image: newImageUrl
      });
    }
  };

  const handleMediaUpdated = (urls: { photos: string[], video: string | null }) => {
    if (property && urls.photos.length > 0) {
      // Update the primary image if photos were uploaded
      setProperty({
        ...property,
        image: urls.photos[0] // Use the first photo as primary
      });
    }
  };

  const handleAmenitiesServicesUpdated = (updatedData: { amenities?: string[], careServices?: string[] }) => {
    if (property) {
      setProperty({
        ...property,
        ...(updatedData.amenities && { amenities: updatedData.amenities }),
        ...(updatedData.careServices && { careServices: updatedData.careServices })
      });
    }
  };

  return {
    property,
    loading,
    error,
    isOwner,
    isEditing,
    isAuthenticated,
    setIsEditing,
    handlePropertyDeactivated,
    handlePropertyUpdated,
    handleImageUpdated,
    handleMediaUpdated,
    handleAmenitiesServicesUpdated,
    user
  };
};
