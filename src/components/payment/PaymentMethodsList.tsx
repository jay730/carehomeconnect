
import { CreditCard, Banknote, PlusCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onSetDefault: (id: string) => void;
  onEdit?: (id: string) => void;
  onAddCard?: () => void;
  onAddBank?: () => void;
}

export function PaymentMethodsList({
  methods,
  onSetDefault,
  onEdit,
  onAddCard,
  onAddBank
}: PaymentMethodsListProps) {
  // Filter methods by type
  const cardMethods = methods.filter(method => method.type === "card");
  const bankMethods = methods.filter(method => method.type === "bank");
  
  if (methods.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center mb-4">
        <p className="text-gray-600">No payment methods added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      {cardMethods.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Payment Cards</h4>
            {onAddCard && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddCard}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Add Card
              </Button>
            )}
          </div>
          {cardMethods.map((method) => (
            <div key={method.id} className="border rounded-md p-4">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded mr-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{method.name} •••• {method.last4}</p>
                  <p className="text-sm text-gray-500">
                    Expires {method.exp_month}/{method.exp_year}
                  </p>
                  {/* Removed Default indicator */}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit && onEdit(method.id)}
                    className="p-1 h-auto"
                  >
                    <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bank Accounts Section */}
      {bankMethods.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Bank Accounts</h4>
            {onAddBank && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddBank}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Add Bank
              </Button>
            )}
          </div>
          {bankMethods.map((method) => (
            <div key={method.id} className="border rounded-md p-4">
              <div className="flex items-center">
                <div className="bg-green-50 p-2 rounded mr-4">
                  <Banknote className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{method.bank_name}</p>
                  <p className="text-sm text-gray-500">
                    {method.name} • Account ending in {method.last4}
                  </p>
                  {/* Removed Default indicator */}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit && onEdit(method.id)}
                    className="p-1 h-auto"
                  >
                    <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
