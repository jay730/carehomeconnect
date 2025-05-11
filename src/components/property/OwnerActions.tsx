
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import DeactivatePropertyDialog from "@/components/property/DeactivatePropertyDialog";

interface OwnerActionsProps {
  propertyId: string;
  propertyName: string;
  active: boolean;
  onDeactivate: () => void;
}

const OwnerActions = ({ 
  propertyId, 
  propertyName, 
  active, 
  onDeactivate 
}: OwnerActionsProps) => {
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  const handleDeactivateProperty = () => {
    setIsDeactivateDialogOpen(true);
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Owner Actions</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {active && (
          <Button 
            variant="destructive" 
            onClick={handleDeactivateProperty}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deactivate Home
          </Button>
        )}
        {!active && (
          <p className="text-gray-600">
            This property has been deactivated and is no longer visible to families.
          </p>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Note: Once added, properties cannot be deleted from the system, only deactivated.
      </p>

      {/* Deactivate dialog */}
      <DeactivatePropertyDialog
        propertyId={propertyId}
        propertyName={propertyName}
        isOpen={isDeactivateDialogOpen}
        onClose={() => setIsDeactivateDialogOpen(false)}
        onDeactivate={onDeactivate}
      />
    </div>
  );
};

export default OwnerActions;
