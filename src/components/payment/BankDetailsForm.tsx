
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const bankSchema = z.object({
  accountName: z.string().min(2, { message: "Account name is required" }),
  accountNumber: z.string().min(5, { message: "Valid account number required" }),
  routingNumber: z.string().min(9, { message: "Valid routing number required" }).max(9),
  bankName: z.string().min(2, { message: "Bank name is required" }),
});

export type BankFormValues = z.infer<typeof bankSchema>;

interface BankDetailsFormProps {
  defaultValues?: BankFormValues;
  onSubmit: (data: BankFormValues) => Promise<boolean>;
  isProcessing: boolean;
  useForBoth: boolean;
  onUseForBothChange: (checked: boolean) => void;
  onCancel: () => void;
}

export function BankDetailsForm({
  defaultValues = {
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: ""
  },
  onSubmit,
  isProcessing,
  useForBoth,
  onUseForBothChange,
  onCancel
}: BankDetailsFormProps) {
  const bankForm = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues
  });

  const handleSubmit = async (data: BankFormValues) => {
    const success = await onSubmit(data);
    if (success) {
      bankForm.reset();
    }
  };

  return (
    <Form {...bankForm}>
      <form onSubmit={bankForm.handleSubmit(handleSubmit)} className="space-y-4">
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

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="useForBoth" 
            checked={useForBoth} 
            onCheckedChange={(checked) => {
              onUseForBothChange(checked as boolean);
            }}
          />
          <label
            htmlFor="useForBoth"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use this account for both subscription payments and rent deposits
          </label>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-blue-700 mb-4 flex items-start gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p>Your banking information is stored securely with encryption and is only accessible by you.</p>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              defaultValues.accountName ? "Update Bank Details" : "Save Bank Details"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
