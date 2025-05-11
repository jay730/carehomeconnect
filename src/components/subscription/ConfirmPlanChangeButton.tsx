
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ConfirmPlanChangeButtonProps {
  isProcessing: boolean;
  onConfirm: () => void;
}

export const ConfirmPlanChangeButton = ({ 
  isProcessing, 
  onConfirm 
}: ConfirmPlanChangeButtonProps) => {
  return (
    <div className="flex justify-center mt-6">
      <Button 
        onClick={onConfirm}
        size="lg"
        className="px-8"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          'Confirm Plan Change'
        )}
      </Button>
    </div>
  );
};
