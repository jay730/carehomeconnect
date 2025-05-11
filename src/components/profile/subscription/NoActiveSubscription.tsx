
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

interface NoActiveSubscriptionProps {
  onRetry: () => void;
  isProcessing?: boolean;
}

export function NoActiveSubscription({ onRetry, isProcessing }: NoActiveSubscriptionProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="border border-amber-200 bg-amber-50 rounded-md p-4">
        <h3 className="font-medium text-amber-800">No Active Subscription</h3>
        <p className="text-amber-700">
          You don't have an active subscription. Subscribe to list your properties.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          onClick={onRetry}
          size="sm"
          className="flex items-center gap-2"
          disabled={isProcessing}
        >
          {isProcessing ? <Spinner size="sm" className="mr-2" /> : null}
          Retry loading data
        </Button>
        
        <Button onClick={() => navigate("/owner/subscription")}>
          View Subscription Plans
        </Button>
      </div>
    </div>
  );
}
