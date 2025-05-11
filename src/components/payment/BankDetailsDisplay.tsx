
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BankDetails } from "@/types/bank";

interface BankDetailsDisplayProps {
  bankDetails: BankDetails;
  onEdit: () => void;
  isForBothPayments?: boolean;
}

export function BankDetailsDisplay({ 
  bankDetails, 
  onEdit, 
  isForBothPayments = false 
}: BankDetailsDisplayProps) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center">
        <div className="bg-green-50 p-2 rounded mr-4">
          <Banknote className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{bankDetails.bank_name}</p>
          <p className="text-sm text-gray-500">
            {bankDetails.account_name} • Account ending in {bankDetails.account_number?.slice(-4)}
          </p>
          {isForBothPayments && (
            <div className="mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
              Used for both subscription and rent deposits
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEdit}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
