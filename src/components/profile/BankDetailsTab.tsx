
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const bankDetailsSchema = z.object({
  accountName: z.string().min(2, { message: "Account name is required" }),
  accountNumber: z.string().min(5, { message: "Valid account number required" }),
  routingNumber: z.string().min(9, { message: "Valid routing number required" }).max(9),
  bankName: z.string().min(2, { message: "Bank name is required" }),
});

type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;

// Define the bank details type to match what's in the database
type BankDetails = {
  id?: string;
  user_id?: string;
  account_name: string | null;
  account_number: string | null;
  routing_number: string | null;
  bank_name: string | null;
  created_at?: string;
  updated_at?: string;
};

interface BankDetailsTabProps {
  user: any;
}

export function BankDetailsTab({ user }: BankDetailsTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const { toast } = useToast();

  const bankForm = useForm<BankDetailsFormValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
    },
  });

  // Fetch bank details when component mounts
  useState(() => {
    async function fetchBankDetails() {
      if (!user) return;
      
      // Type assertion to allow using the bank_details table
      const { data, error } = await (supabase
        .from("bank_details" as any)
        .select("*")
        .eq("user_id", user.id)
        .single() as any);

      if (!error && data) {
        setBankDetails(data as BankDetails);
        
        bankForm.reset({
          accountName: data.account_name || "",
          accountNumber: data.account_number || "",
          routingNumber: data.routing_number || "",
          bankName: data.bank_name || "",
        });
      }
    }
    
    fetchBankDetails();
  });

  async function onSubmitBankDetails(data: BankDetailsFormValues) {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if bank details already exist - using type assertion for the bank_details table
      const { data: existingData, error: checkError } = await (supabase
        .from("bank_details" as any)
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle() as any);
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError; 
      }
      
      let updateError;
      
      if (existingData?.id) {
        // Update existing record - using type assertion for the bank_details table
        const { error } = await (supabase
          .from("bank_details" as any)
          .update({
            account_name: data.accountName,
            account_number: data.accountNumber,
            routing_number: data.routingNumber,
            bank_name: data.bankName
          })
          .eq("user_id", user.id) as any);
          
        updateError = error;
      } else {
        // Create new record - using type assertion for the bank_details table
        const { error } = await (supabase
          .from("bank_details" as any)
          .insert({
            user_id: user.id,
            account_name: data.accountName,
            account_number: data.accountNumber,
            routing_number: data.routingNumber,
            bank_name: data.bankName
          }) as any);
          
        updateError = error;
      }
      
      if (updateError) throw updateError;
      
      toast({
        title: "Banking details updated",
        description: "Your banking information has been saved securely",
      });
      
      // Refresh bank details
      const { data: refreshedData } = await (supabase
        .from("bank_details" as any)
        .select("*")
        .eq("user_id", user.id)
        .single() as any);
        
      setBankDetails(refreshedData as BankDetails);
      
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast({
        title: "Error",
        description: "Failed to update banking information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Banking Information</h2>
      <p className="text-gray-600 mb-6">
        Add your bank details to receive payments for your properties
      </p>
      
      <Form {...bankForm}>
        <form onSubmit={bankForm.handleSubmit(onSubmitBankDetails)} className="space-y-6">
          <FormField
            control={bankForm.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account holder name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={bankForm.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bank name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={bankForm.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter account number" 
                      type="password" 
                      autoComplete="off"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={bankForm.control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="9 digits" 
                      maxLength={9}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-blue-700 mb-4">
            <p>Your banking information is stored securely and will be used for receiving payments from bookings.</p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Bank Details"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
