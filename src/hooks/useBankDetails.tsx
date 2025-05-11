
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BankDetails } from "@/types/bank";
import { useToast } from "@/hooks/use-toast";

export interface BankFormValues {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
}

export function useBankDetails(userId: string) {
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useForBoth, setUseForBoth] = useState(false);
  const { toast } = useToast();

  // Fetch bank details with improved error handling
  const fetchBankDetails = async () => {
    if (!userId) return;
    
    try {
      console.log("Fetching bank details for user:", userId);
      
      const { data, error } = await supabase
        .from("bank_details")
        .select()
        .eq("user_id", userId)
        .maybeSingle<BankDetails>();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching bank details:", error);
        toast({
          title: "Error loading data",
          description: "Could not load your bank information. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      console.log("Bank details fetched:", data);
      
      if (data) {
        setBankDetails(data);
        setUseForBoth(data.use_for_both || false);
      } else {
        // If no data found, reset the state
        setBankDetails(null);
        setUseForBoth(false);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast({
        title: "Error loading data",
        description: "Could not load your bank information. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Save or update bank details
  const saveBankDetails = async (formData: BankFormValues) => {
    if (!userId) return false;
    
    setIsProcessing(true);
    
    try {
      // Check if bank details already exist
      const { data: existingData, error: checkError } = await supabase
        .from("bank_details")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle<BankDetails>();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError; 
      }
      
      // Setup payload with the useForBoth flag
      const bankPayload = {
        account_name: formData.accountName,
        account_number: formData.accountNumber,
        routing_number: formData.routingNumber,
        bank_name: formData.bankName,
        use_for_both: useForBoth
      };
      
      let updateError;
      
      if (existingData?.id) {
        // Update existing record
        const { error } = await supabase
          .from("bank_details")
          .update(bankPayload)
          .eq("id", existingData.id) // Use the record ID for better security
          .eq("user_id", userId);    // Make sure we're updating the user's own record
          
        updateError = error;
      } else {
        // Create new record
        const { error } = await supabase
          .from("bank_details")
          .insert({
            user_id: userId,
            ...bankPayload
          });
          
        updateError = error;
      }
      
      if (updateError) throw updateError;
      
      toast({
        title: "Banking details updated",
        description: "Your banking information has been saved securely",
        icon: "shield-check"
      });
      
      // Refresh bank details
      fetchBankDetails();
      return true;
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast({
        title: "Error",
        description: "Failed to update banking information. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete bank details
  const deleteBankDetails = async () => {
    if (!userId || !bankDetails?.id) return false;
    
    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from("bank_details")
        .delete()
        .eq("id", bankDetails.id)    // Use the record ID for better security
        .eq("user_id", userId);      // Make sure we're deleting the user's own record
        
      if (error) throw error;
      
      toast({
        title: "Banking details removed",
        description: "Your banking information has been removed successfully",
        icon: "check"
      });
      
      setBankDetails(null);
      setUseForBoth(false);
      return true;
    } catch (error) {
      console.error("Error deleting bank details:", error);
      toast({
        title: "Error",
        description: "Failed to remove banking information. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Load bank details when component mounts
  useEffect(() => {
    if (userId) {
      fetchBankDetails();
    } else {
      // Reset state if no user ID provided
      setBankDetails(null);
      setUseForBoth(false);
    }
  }, [userId]);

  return {
    bankDetails,
    isProcessing,
    useForBoth,
    setUseForBoth,
    fetchBankDetails,
    saveBankDetails,
    deleteBankDetails
  };
}
