
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyEditButtonProps {
  isOwner: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const PropertyEditButton = ({ 
  isOwner, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}: PropertyEditButtonProps) => {
  const isMobile = useIsMobile();
  
  if (!isOwner) return null;

  return (
    <div className="w-full md:w-auto">
      {isEditing ? (
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <Button variant="outline" onClick={onCancel} size="sm" className="w-full md:w-auto">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={onSave} size="sm" className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={onEdit} size="sm" className="w-full md:w-auto">
          <Edit className="mr-2 h-4 w-4" />
          Edit Property
        </Button>
      )}
    </div>
  );
};

export default PropertyEditButton;
