
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";

export function UpgradePrompt() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex justify-between items-center">
      <div>
        <h3 className="font-medium text-amber-800">Upgrade Available</h3>
        <p className="text-amber-700">
          Unlock more features with our Pro plan
        </p>
      </div>
      <Button 
        onClick={() => navigate("/owner/subscription", { state: { upgradeIntent: true } })}
        className="bg-amber-600 hover:bg-amber-700"
      >
        <ArrowUp className="mr-2 h-4 w-4" />
        Upgrade to Pro
      </Button>
    </div>
  );
}
