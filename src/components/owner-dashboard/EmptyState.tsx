
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export function EmptyState() {
  const navigate = useNavigate();
  
  const handleListProperty = () => {
    navigate("/owner/list-property");
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/40 rounded-lg text-center">
      <Home className="h-16 w-16 text-muted-foreground mb-6" />
      <h2 className="text-2xl font-semibold mb-4">No Properties Listed Yet</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        List your first property on Care Home Connect to start connecting with potential residents and their families.
      </p>
      <Button size="lg" onClick={handleListProperty}>
        List Your First Property
      </Button>
    </div>
  );
}
