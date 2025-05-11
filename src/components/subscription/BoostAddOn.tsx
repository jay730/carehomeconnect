
import { Rocket } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface BoostAddOnProps {
  boostEnabled: boolean;
  onBoostChange: (enabled: boolean) => void;
  price: number;
}

export const BoostAddOn = ({ boostEnabled, onBoostChange, price }: BoostAddOnProps) => {
  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Rocket className="h-5 w-5 text-purple-500" />
          <div>
            <h3 className="font-semibold">Boost Your Listing</h3>
            <p className="text-sm text-gray-600">Push your property to the top of search results</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={boostEnabled}
            onCheckedChange={onBoostChange}
            id="boost-mode"
          />
          <Label htmlFor="boost-mode" className="font-medium text-purple-700">
            +${price.toFixed(2)}/mo
          </Label>
        </div>
      </div>
    </Card>
  );
};
