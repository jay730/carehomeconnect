
import { useState, useEffect } from "react";
import { Booking } from "@/components/dashboard/CurrentBookings";
import { SavedProperty } from "@/components/dashboard/SavedProperties";
import { Payment } from "@/components/dashboard/PaymentHistory";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// This hook centralizes all data fetching and state management for the family dashboard
const useFamilyDashboardData = () => {
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize with empty arrays
    setCurrentBookings([]);
    setRecentPayments([]);
    
    // Load saved properties from localStorage if user is logged in
    if (user) {
      const savedPropertiesKey = `saved_properties_${user.id}`;
      const savedPropertiesJson = localStorage.getItem(savedPropertiesKey);
      
      if (savedPropertiesJson) {
        try {
          const parsedProperties = JSON.parse(savedPropertiesJson);
          if (Array.isArray(parsedProperties)) {
            setSavedProperties(parsedProperties);
          }
        } catch (error) {
          console.error("Error parsing saved properties:", error);
          setSavedProperties([]);
        }
      }
    }
    
    setLoading(false);
  }, [user]);

  // Save properties to localStorage whenever savedProperties changes
  useEffect(() => {
    if (user && savedProperties.length > 0) {
      const savedPropertiesKey = `saved_properties_${user.id}`;
      localStorage.setItem(savedPropertiesKey, JSON.stringify(savedProperties));
    }
  }, [savedProperties, user]);

  // Function to save a property
  const saveProperty = async (property: {
    id: string;
    name: string;
    location: string;
    price: number;
    image: string;
  }) => {
    try {
      // Check if property is already saved
      if (savedProperties.some(p => p.id === property.id)) {
        // Toast notifications have been removed
        return true; // Already saved is still a success
      }
      
      // Add to saved properties
      setSavedProperties(prev => [...prev, property]);
      
      return true;
    } catch (error) {
      console.error("Error saving property:", error);
      // Toast notifications have been removed
      return false;
    }
  };

  // Function to remove a property from saved properties
  const removeSavedProperty = (id: string) => {
    setSavedProperties(savedProperties.filter(property => property.id !== id));
    
    // Also update localStorage
    if (user) {
      const savedPropertiesKey = `saved_properties_${user.id}`;
      const updatedProperties = savedProperties.filter(property => property.id !== id);
      localStorage.setItem(savedPropertiesKey, JSON.stringify(updatedProperties));
    }
  };

  return {
    currentBookings,
    savedProperties,
    recentPayments,
    loading,
    saveProperty,
    removeSavedProperty,
    hasCurrentBookings: currentBookings.length > 0
  };
};

export default useFamilyDashboardData;
