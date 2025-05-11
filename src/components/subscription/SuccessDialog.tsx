
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuccessDialog = ({ open, onOpenChange }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600">
            <Check className="mr-2 h-5 w-5" />
            Subscription Successful
          </DialogTitle>
          <DialogDescription>
            Your subscription has been activated successfully. You can now enjoy all the features of your plan.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Payment Processed</AlertTitle>
            <AlertDescription>
              Thank you for subscribing. Your payment has been processed and your subscription is now active.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
