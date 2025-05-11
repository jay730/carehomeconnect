
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { useBankDetails, BankFormValues } from "@/hooks/useBankDetails";
import { BankDetailsForm } from "@/components/payment/BankDetailsForm";
import { BankDetailsDisplay } from "@/components/payment/BankDetailsDisplay";

interface BankDetailsSectionProps {
  user: any;
  onBankDetailsChanged?: () => void;
}

export function BankDetailsSection({ 
  user,
  onBankDetailsChanged
}: BankDetailsSectionProps) {
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const { 
    bankDetails, 
    isProcessing, 
    useForBoth, 
    setUseForBoth,
    fetchBankDetails,
    saveBankDetails 
  } = useBankDetails(user?.id);

  // Handle bank form submission
  const onSubmitBank = async (data: BankFormValues) => {
    const success = await saveBankDetails(data);
    if (success) {
      setIsAddBankOpen(false);
      // Notify parent component that bank details have changed
      if (onBankDetailsChanged) {
        onBankDetailsChanged();
      }
    }
    return success;
  };

  // Prepare default values for the form when editing
  const getFormDefaultValues = (): BankFormValues => {
    if (bankDetails) {
      return {
        accountName: bankDetails.account_name || "",
        accountNumber: bankDetails.account_number || "",
        routingNumber: bankDetails.routing_number || "",
        bankName: bankDetails.bank_name || ""
      };
    }
    return {
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      bankName: ""
    };
  };

  return (
    <div>
      <p className="text-gray-600 mb-4">
        {bankDetails?.use_for_both 
          ? "Same bank account is being used for both payments and deposits" 
          : "Add your bank details to receive payments from bookings"}
      </p>
      
      {bankDetails ? (
        <BankDetailsDisplay 
          bankDetails={bankDetails} 
          onEdit={() => setIsAddBankOpen(true)}
          isForBothPayments={bankDetails.use_for_both || false}
        />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center mb-4">
          <p className="text-gray-600">No bank details added yet</p>
        </div>
      )}
      
      {!bankDetails && (
        <Button
          variant="outline"
          onClick={() => setIsAddBankOpen(true)}
          className="mt-4 w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Bank Details
        </Button>
      )}

      {/* Add Bank Details Dialog */}
      <Dialog open={isAddBankOpen} onOpenChange={setIsAddBankOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{bankDetails ? "Edit Bank Details" : "Add Bank Details"}</DialogTitle>
          </DialogHeader>
          
          <BankDetailsForm
            defaultValues={getFormDefaultValues()}
            onSubmit={onSubmitBank}
            isProcessing={isProcessing}
            useForBoth={useForBoth}
            onUseForBothChange={setUseForBoth}
            onCancel={() => setIsAddBankOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
