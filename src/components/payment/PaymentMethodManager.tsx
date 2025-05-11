import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentMethodsList } from "@/components/payment/PaymentMethodsList";
import { AddCardForm } from "@/components/payment/AddCardForm";
import { PaymentMethodSelect } from "@/components/payment/PaymentMethodSelect";
import { BankDetails } from "@/types/bank";
import { AddBankForm } from "@/components/payment/AddBankForm";

// Define the PaymentMethod interface to match what's expected
interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  name: string;
  last4?: string;
  bank_name?: string;
  exp_month?: number;
  exp_year?: number;
  isDefault?: boolean;
}
interface PaymentMethodManagerProps {
  user: any;
  sharedBankAccount?: boolean;
  bankDetails?: BankDetails | null;
  onBankDetailsChanged?: () => void;
}
export function PaymentMethodManager({
  user,
  sharedBankAccount = false,
  bankDetails = null,
  onBankDetailsChanged
}: PaymentMethodManagerProps) {
  // State
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [defaultPaymentId, setDefaultPaymentId] = useState<string | null>(null);
  const [selectedRentBankId, setSelectedRentBankId] = useState<string | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [bankMethods, setBankMethods] = useState<PaymentMethod[]>([]);
  const [useForBoth, setUseForBoth] = useState(false);
  const [onEdit, setOnEdit] = useState<((id: string) => void) | undefined>(undefined);

  // Mock data for demo purposes
  useEffect(() => {
    // This would normally be fetched from an API
    const mockMethods: PaymentMethod[] = [{
      id: "card_1",
      type: "card",
      name: "Visa",
      last4: "4242",
      exp_month: 12,
      exp_year: 2025,
      isDefault: true
    }, {
      id: "card_2",
      type: "card",
      name: "Mastercard",
      last4: "5555",
      exp_month: 10,
      exp_year: 2026,
      isDefault: false
    }];

    // If we have bank details, add them to the mock payment methods
    if (bankDetails) {
      const bankMethod: PaymentMethod = {
        id: "bank_1",
        type: "bank",
        name: bankDetails.account_name,
        last4: bankDetails.account_number?.slice(-4),
        bank_name: bankDetails.bank_name,
        isDefault: false,
        // Add dummy values for exp_month and exp_year to satisfy the type
        exp_month: undefined,
        exp_year: undefined
      };
      mockMethods.push(bankMethod);
      setBankMethods([bankMethod]);
      if (sharedBankAccount) {
        setSelectedRentBankId("bank_1");
      }
    }
    setPaymentMethods(mockMethods);
    const defaultMethod = mockMethods.find(m => m.isDefault);
    setDefaultPaymentId(defaultMethod?.id || null);
    setSelectedSubscriptionId(defaultMethod?.id || null);
  }, [bankDetails, sharedBankAccount]);

  // Handle setting default payment method
  const handleSetDefault = (id: string) => {
    // This would normally be an API call
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    setDefaultPaymentId(id);
  };

  // Handle adding new payment method (mock)
  const handleAddPaymentMethod = (data: any) => {
    // This would normally be an API call
    console.log("Adding payment method:", data);
    // Close the dialog
    setIsAddPaymentOpen(false);
  };

  // Handle cancel action for the add payment form
  const handleCancel = () => {
    setIsAddPaymentOpen(false);
    setIsAddBankOpen(false);
  };

  // Select bank account for rent payment
  const handleSelectRentBank = (id: string) => {
    setSelectedRentBankId(id);
    // This would normally update a setting in the backend
    console.log("Selected bank account for rent payments:", id);
  };

  // Select payment method for subscription
  const handleSelectSubscription = (id: string) => {
    setSelectedSubscriptionId(id);
    // This would normally update a setting in the backend
    console.log("Selected payment method for subscription:", id);
  };

  // Open add card dialog
  const handleAddCardClick = () => {
    setIsAddPaymentOpen(true);
  };

  // Open add bank dialog
  const handleAddBankClick = () => {
    setIsAddBankOpen(true);
  };

  // Handle adding new bank account
  const handleAddBankAccount = (data: any) => {
    console.log("Adding bank account:", data);
    setIsAddBankOpen(false);

    // This would normally be an API call
    // For now, we'll just mock it
    if (onBankDetailsChanged) {
      onBankDetailsChanged();
    }
  };
  return <div className="space-y-6">
      {/* Subscription Payment Methods Section */}
      <div>
        
        
        <PaymentMethodsList methods={paymentMethods} onSetDefault={handleSetDefault} onAddCard={handleAddCardClick} onAddBank={handleAddBankClick} onEdit={onEdit} />
        
        {/* Add Payment Method Dialog */}
        <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            
            <AddCardForm onSubmit={handleAddPaymentMethod} isProcessing={isProcessing} onCancel={handleCancel} />
          </DialogContent>
        </Dialog>

        {/* Add Bank Account Dialog */}
        <Dialog open={isAddBankOpen} onOpenChange={setIsAddBankOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
            </DialogHeader>
            
            <AddBankForm onSubmit={handleAddBankAccount} isProcessing={isProcessing} defaultValues={{
            accountName: "",
            accountNumber: "",
            routingNumber: "",
            bankName: ""
          }} useForBoth={useForBoth} onUseForBothChange={setUseForBoth} onCancel={handleCancel} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Pay for Subscription Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4">Pay for Subscription</h3>
        <p className="text-gray-600 mb-4">
          Select payment method for subscription
        </p>
        
        {paymentMethods.length > 0 ? <PaymentMethodSelect methods={paymentMethods} selectedId={selectedSubscriptionId} onSelect={handleSelectSubscription} label="" /> : <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center mb-4">
            <p className="text-gray-600">No payment methods added yet</p>
          </div>}
      </div>
      
      {/* Separator for visual distinction */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4">Receive Rent Payment</h3>
        <p className="text-gray-600 mb-4">
          Select which bank account should receive rent payments
        </p>
        
        {bankMethods.length > 0 ? <PaymentMethodSelect methods={bankMethods} selectedId={selectedRentBankId} onSelect={handleSelectRentBank} label="" /> : <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center mb-4">
            <p className="text-gray-600">No bank accounts added yet</p>
          </div>}
        
        {bankDetails?.use_for_both && <p className="text-sm text-blue-600 mt-2">
            Using the same bank account for subscription payments and rent deposits
          </p>}
      </div>
    </div>;
}