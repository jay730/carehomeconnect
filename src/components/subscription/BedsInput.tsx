
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface BedsInputProps {
  numberOfBeds: number;
  onBedsChange: (beds: number) => void;
}

export const BedsInput = ({ numberOfBeds, onBedsChange }: BedsInputProps) => {
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="beds" className="font-medium">Number of Beds:</Label>
        <input
          type="number"
          id="beds"
          min="1"
          value={numberOfBeds}
          onChange={(e) => onBedsChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 px-3 py-2 border rounded-md"
        />
      </div>
    </Card>
  );
};
