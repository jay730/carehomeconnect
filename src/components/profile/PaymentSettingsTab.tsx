
import { useState, useEffect } from "react";
import { useBankDetails } from "@/hooks/useBankDetails";
import { CardPaymentSection } from "@/components/payment/CardPaymentSection";
import { 
  Card, 
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

interface PaymentSettingsTabProps {
  user: any;
}

export function PaymentSettingsTab({ user }: PaymentSettingsTabProps) {
  const { bankDetails, fetchBankDetails } = useBankDetails(user?.id);
  const [sharedBankAccount, setSharedBankAccount] = useState(false);
  
  // Check if bank details are shared between payment methods
  useEffect(() => {
    if (bankDetails) {
      setSharedBankAccount(bankDetails.use_for_both || false);
    }
  }, [bankDetails]);

  // Fetch bank details when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchBankDetails();
    }
  }, [user?.id, fetchBankDetails]);

  return (
    <div className="space-y-6">
      {/* Subscription Payment Section */}
      <Card>
        <CardContent className="pt-6">
          <CardPaymentSection 
            user={user} 
            sharedBankAccount={sharedBankAccount} 
            bankDetails={bankDetails}
            onBankDetailsChanged={fetchBankDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
}
