
import { PaymentMethodManager } from "@/components/payment/PaymentMethodManager";
import { BankDetails } from "@/types/bank";

interface CardPaymentSectionProps {
  user: any;
  sharedBankAccount?: boolean;
  bankDetails?: BankDetails | null;
  onBankDetailsChanged?: () => void;
}

export function CardPaymentSection({ 
  user, 
  sharedBankAccount = false,
  bankDetails = null,
  onBankDetailsChanged
}: CardPaymentSectionProps) {
  return (
    <PaymentMethodManager 
      user={user}
      sharedBankAccount={sharedBankAccount}
      bankDetails={bankDetails}
      onBankDetailsChanged={onBankDetailsChanged}
    />
  );
}
