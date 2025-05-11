
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProfileFormValues {
  displayName: string;
  phone?: string;
  email?: string;
}

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useProfileData(userId: string) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch profile data
  const fetchProfileData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Log for debugging
      console.log("Fetching profile for user ID:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single<ProfileData>();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile information. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      console.log("Profile data retrieved:", data);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile information. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile information
  const updateProfile = async (data: ProfileFormValues) => {
    if (!userId) return false;
    
    setIsSubmitting(true);
    
    try {
      // Split display name into first name and last name
      const nameParts = data.displayName.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name,
          last_name,
          phone: data.phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        icon: "check"
      });
      
      // Refresh profile data
      fetchProfileData();
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load profile when component mounts
  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  return {
    profile,
    isLoading,
    isSubmitting,
    fetchProfileData,
    updateProfile
  };
}
