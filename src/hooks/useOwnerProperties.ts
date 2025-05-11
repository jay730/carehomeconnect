
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export interface Property {
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
  photos?: string[];
  newInquiryCount: number;
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export function useOwnerProperties() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Please log in",
            description: "You must be logged in to view your properties",
            variant: "destructive",
            duration: 2000,
          });
          navigate("/login");
          return;
        }

        // Get user profile
        await fetchUserProfile(user.id);

        // Get properties with the current user's ID
        const { data, error } = await supabase
          .from('care_homes')
          .select('*')
          .eq('owner_id', user.id);

        if (error) {
          throw error;
        }

        // Fetch the primary image and inquiry counts for each property
        const propertiesWithData = await Promise.all(data?.map(async (home) => {
          // Get primary image
          const { data: mediaData } = await supabase
            .from('care_home_media')
            .select('photo_url')
            .eq('care_home_id', home.id)
            .eq('is_primary', true)
            .maybeSingle();
          
          // Get count of pending inquiries
          const { count: inquiryCount, error: inquiryError } = await supabase
            .from('inquiries')
            .select('id', { count: 'exact', head: true })
            .eq('care_home_id', home.id)
            .eq('status', 'pending');
          
          if (inquiryError) {
            console.error("Error fetching inquiries count:", inquiryError);
          }
          
          return {
            id: home.id,
            name: home.name,
            location: `${home.city}, ${home.state}`,
            price: home.price,
            description: home.description,
            capacity: home.capacity,
            city: home.city,
            state: home.state,
            active: home.active !== false,
            image: mediaData?.photo_url || "/placeholder.svg",
            newInquiryCount: inquiryCount || 0
          };
        }) || []);

        setProperties(propertiesWithData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to fetch properties",
          variant: "destructive",
          duration: 2000,
        });
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [navigate, toast]);

  // Handle profile update
  const handleProfileUpdated = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  return { properties, profile, isLoading, handleProfileUpdated };
}
