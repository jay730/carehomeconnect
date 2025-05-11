
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface DeactivatePropertyDialogProps {
  propertyId: string;
  propertyName: string;
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: () => void;
}

const DeactivatePropertyDialog = ({
  propertyId,
  propertyName,
  isOpen,
  onClose,
  onDeactivate
}: DeactivatePropertyDialogProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    if (confirmText !== "confirm") {
      // Toast notifications have been removed
      return;
    }

    setIsLoading(true);
    try {
      // Update the property to set active = false
      const { error } = await supabase
        .from('care_homes')
        .update({ active: false })
        .eq('id', propertyId);

      if (error) throw error;

      // Toast notifications have been removed
      
      onDeactivate();
      onClose();
      
      // Navigate back to dashboard after successful deactivation
      navigate("/owner/dashboard");
    } catch (error) {
      console.error("Error deactivating property:", error);
      // Toast notifications have been removed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deactivate Property</DialogTitle>
          <DialogDescription>
            You are about to deactivate "{propertyName}". This will hide the property from search results and make it unavailable to new families.
            <br /><br />
            <strong className="text-destructive">This action cannot be undone.</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="confirm-text" className="mb-2 block">
            Type <strong>confirm</strong> to deactivate this property
          </Label>
          <Input
            id="confirm-text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="confirm"
            className="mt-2"
            autoComplete="off"
          />
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="sm:order-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={confirmText !== "confirm" || isLoading}
            onClick={handleDeactivate}
            className="sm:order-2"
          >
            {isLoading ? "Deactivating..." : "Deactivate Property"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivatePropertyDialog;
