
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Subscription, SubscriptionPlan } from "@/types/subscription";

export function useSubscriptionData(userId: string) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Fetch subscription data from Supabase edge function
  const fetchSubscription = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Checking subscription status for user:", userId);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }
      
      console.log("Subscription data received:", data);
      setSubscription(data?.subscription || null);
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Error loading subscription",
        description: "Could not load your subscription information. Please try again later.",
        variant: "destructive",
      });
      
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!userId) return false;
    
    setIsProcessing(true);
    
    try {
      // Call Supabase edge function to cancel subscription
      const { data, error } = await supabase.functions.invoke('cancel-subscription');
      
      if (error) throw error;
      
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully",
        icon: "check"
      });
      
      // Refresh subscription data
      fetchSubscription();
      return true;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Update subscription
  const updateSubscription = async (planId: string, hasBoost: boolean) => {
    if (!userId) return false;
    
    setIsProcessing(true);
    
    try {
      // Call Supabase edge function to update subscription
      const { data, error } = await supabase.functions.invoke('update-subscription', {
        body: { planId, hasBoost }
      });
      
      if (error) throw error;
      
      toast({
        title: "Subscription updated",
        description: "Your subscription has been updated successfully",
        icon: "check"
      });
      
      // Refresh subscription data
      fetchSubscription();
      return true;
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Create customer portal session
  const createPortalSession = async () => {
    if (!userId) return null;
    
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        return data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      toast({
        title: "Portal Access Failed",
        description: "Unable to access subscription management portal.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Load subscription when component mounts
  useEffect(() => {
    fetchSubscription();
  }, [userId]);

  return {
    subscription,
    isLoading,
    isProcessing,
    fetchSubscription,
    cancelSubscription,
    updateSubscription,
    createPortalSession
  };
}
