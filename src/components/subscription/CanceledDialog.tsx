
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface CanceledDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CanceledDialog = ({ open, onOpenChange }: CanceledDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-amber-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            Payment Canceled
          </DialogTitle>
          <DialogDescription>
            Your subscription payment was canceled. No charges have been made.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>You can try again whenever you're ready.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
