import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CurrentBookings from "@/components/dashboard/CurrentBookings";
import SavedProperties from "@/components/dashboard/SavedProperties";
import PaymentHistory from "@/components/dashboard/PaymentHistory";
import useFamilyDashboardData from "@/hooks/useFamilyDashboardData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

const FamilyDashboard = () => {
  const { user } = useAuth();
  const { 
    currentBookings, 
    savedProperties, 
    recentPayments, 
    removeSavedProperty,
    hasCurrentBookings,
    loading 
  } = useFamilyDashboardData();
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle profile update
  const handleProfileUpdated = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    }
  };
  
  // Get user's display name from metadata or profile
  const getUserDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    
    if (!user) return '';
    
    // Check if user has metadata with first_name
    if (user.user_metadata && 
        (user.user_metadata.first_name || user.user_metadata.last_name)) {
      const firstName = user.user_metadata.first_name || '';
      const lastName = user.user_metadata.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    
    // Fallback to email
    return user.email || 'User';
  };

  // Determine which tab should be default based on booking status
  const defaultTab = hasCurrentBookings ? "current" : "saved";

  return (
    <div className="container py-6 px-3 md:py-8 md:px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Family Dashboard</h1>
          <p className="text-gray-600">Welcome back, {getUserDisplayName()}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 items-center">
          {profile && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil size={16} />
                Edit Profile
              </Button>
              <EditProfileDialog 
                userId={profile.id}
                firstName={profile.first_name || ""}
                lastName={profile.last_name || ""}
                phone={profile.phone || ""}
                onProfileUpdated={handleProfileUpdated}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              />
            </>
          )}
          <Button 
            onClick={() => window.location.href = "/search"} 
            className="w-full md:w-auto"
          >
            Find Care Homes
          </Button>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6 w-full md:w-auto flex">
          <TabsTrigger 
            value="current" 
            className="flex-1 md:flex-none"
          >
            Bookings
          </TabsTrigger>
          <TabsTrigger 
            value="saved"
            className="flex-1 md:flex-none"
          >
            Favorites
          </TabsTrigger>
          <TabsTrigger 
            value="payments"
            className="flex-1 md:flex-none"
          >
            Payments
          </TabsTrigger>
        </TabsList>
        
        {/* Current Bookings Tab */}
        <TabsContent value="current">
          <CurrentBookings bookings={currentBookings} />
        </TabsContent>
        
        {/* Saved Properties Tab */}
        <TabsContent value="saved">
          <SavedProperties 
            properties={savedProperties} 
            onRemoveProperty={removeSavedProperty} 
          />
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <PaymentHistory payments={recentPayments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamilyDashboard;
