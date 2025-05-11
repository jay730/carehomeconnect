
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
import { Spinner } from "@/components/ui/spinner";
import { ShieldCheck } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

// Secure schema with improved validation
const cardSchema = z.object({
  cardholderName: z.string().min(2, { message: "Name is required" }),
  cardNumber: z.string()
    .min(13, { message: "Valid card number required" })
    .max(19)
    .refine((val) => /^[0-9\s]+$/.test(val), { 
      message: "Card number must contain only digits" 
    }),
  expiryDate: z.string()
    .min(5, { message: "Valid expiry date required" })
    .max(5)
    .refine((val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
      message: "Expiry date must be in MM/YY format"
    }),
  cvv: z.string()
    .min(3, { message: "Valid CVV required" })
    .max(4)
    .refine((val) => /^\d{3,4}$/.test(val), {
      message: "CVV must be 3 or 4 digits"
    }),
});

export type CardFormValues = z.infer<typeof cardSchema>;

export interface AddCardFormProps {
  onSubmit: (data: CardFormValues) => void;
  isProcessing: boolean;
  onCancel: () => void;
}

export function AddCardForm({ onSubmit, isProcessing, onCancel }: AddCardFormProps) {
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter cardholder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="1234 5678 9012 3456" 
                  {...field} 
                  onChange={(e) => {
                    // Format card number with spaces
                    let value = e.target.value.replace(/\s/g, "");
                    if (value.length > 16) value = value.slice(0, 16);
                    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM/YY" 
                    {...field} 
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 4) value = value.slice(0, 4);
                      if (value.length > 2) {
                        value = `${value.slice(0, 2)}/${value.slice(2)}`;
                      }
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123" 
                    type="password" 
                    autoComplete="off"
                    {...field} 
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 4) value = value.slice(0, 4);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-blue-700 mb-4 flex items-start gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p>Your card details are encrypted during transmission and securely tokenized. We never store your full card number.</p>
        </div>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Adding...
              </>
            ) : (
              "Add Card"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
