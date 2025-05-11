
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Heart, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import useFamilyDashboardData from '@/hooks/useFamilyDashboardData';

interface CareHome {
  id: string;
  name: string;
  city: string;
  state: string;
  price: number;
  photo_url?: string;
  amenities: string[];
}

const FeaturedListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentHomes, setRecentHomes] = useState<CareHome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = !!user;
  const { saveProperty, savedProperties } = useFamilyDashboardData();
  
  useEffect(() => {
    const fetchRecentHomes = async () => {
      try {
        setLoading(true);
        
        // Fetch the 3 most recently added care homes
        const { data: homes, error } = await supabase
          .from('care_homes')
          .select('id, name, city, state, price')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        if (!homes || homes.length === 0) {
          setRecentHomes([]);
          setLoading(false);
          return;
        }
        
        // For each home, get amenities and primary image
        const homesWithDetails = await Promise.all(homes.map(async (home) => {
          // Get amenities
          const { data: amenitiesData } = await supabase
            .from('care_home_amenities')
            .select('*')
            .eq('care_home_id', home.id)
            .single();
          
          // Get primary image
          const { data: mediaData } = await supabase
            .from('care_home_media')
            .select('photo_url')
            .eq('care_home_id', home.id)
            .eq('is_primary', true)
            .maybeSingle();
          
          // Convert amenities object to array of strings
          const amenities: string[] = [];
          if (amenitiesData) {
            if (amenitiesData.private_rooms) amenities.push('Private Rooms');
            if (amenitiesData.ensuite_rooms) amenities.push('Ensuite Rooms');
            if (amenitiesData.garden) amenities.push('Garden');
            if (amenitiesData.communal_dining) amenities.push('Communal Dining');
            if (amenitiesData.entertainment_area) amenities.push('Entertainment Area');
            if (amenitiesData.housekeeping) amenities.push('Housekeeping');
            if (amenitiesData.laundry) amenities.push('Laundry');
            if (amenitiesData.transportation) amenities.push('Transportation');
          }
          
          return {
            id: home.id,
            name: home.name,
            city: home.city,
            state: home.state,
            price: home.price,
            photo_url: mediaData?.photo_url || '/placeholder.svg',
            amenities
          };
        }));
        
        setRecentHomes(homesWithDetails);
      } catch (error) {
        console.error('Error fetching recent homes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentHomes();
  }, []);
  
  const isPropertySaved = (id: string) => {
    return savedProperties.some(property => property.id === id);
  };

  const handleSaveProperty = async (e: React.MouseEvent, home: CareHome) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Toast notifications have been removed
      return;
    }
    
    if (isPropertySaved(home.id)) {
      // Toast notifications have been removed
      return;
    }
    
    const propertyData = {
      id: home.id,
      name: home.name,
      location: `${home.city}, ${home.state}`,
      price: home.price,
      image: home.photo_url || '/placeholder.svg'
    };
    
    const success = await saveProperty(propertyData);
    if (success) {
      // Toast notifications have been removed
    }
  };
  
  // If still loading or no homes were found, don't render the section
  if (loading || recentHomes.length === 0) {
    return null;
  }
  
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Newly Listed Care Homes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most recently added care homes with excellent amenities and services for your loved ones.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentHomes.map(home => (
            <Card key={home.id} className="overflow-hidden care-card">
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={home.photo_url} 
                    alt={home.name} 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-white text-care-700">
                    New
                  </Badge>
                  {isAuthenticated && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white"
                      onClick={(e) => handleSaveProperty(e, home)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${isPropertySaved(home.id) ? 'fill-current text-care-700' : ''}`} 
                      />
                      <span className="sr-only">Save property</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-1">{home.name}</h3>
                <p className="text-gray-600 mb-4">{home.city}, {home.state}</p>
                <div className="flex flex-wrap gap-2 mb-4 h-8 overflow-hidden">
                  {home.amenities.length > 0 ? (
                    <span className="amenity-badge">
                      {home.amenities[0]}
                      {home.amenities.length > 1 && ` +${home.amenities.length - 1} more`}
                    </span>
                  ) : (
                    <span className="amenity-badge">No amenities listed</span>
                  )}
                </div>
                {isAuthenticated ? (
                  <p className="font-semibold text-lg">
                    Starting at ${home.price.toLocaleString()}/month
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
                  onClick={() => navigate(`/property/${home.id}`)} 
                  className="w-full"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/search')} 
            variant="outline" 
            className="px-8"
          >
            View All Care Homes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
