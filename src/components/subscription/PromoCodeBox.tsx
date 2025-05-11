
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PromoCodeBoxProps {
  onApplyPromo: (code: string) => void;
}

export const PromoCodeBox = ({ onApplyPromo }: PromoCodeBoxProps) => {
  const [promoCode, setPromoCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      onApplyPromo(promoCode.trim());
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Have a promo code?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="pl-10"
            />
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Button type="submit" variant="outline" disabled={!promoCode.trim()}>
            Apply
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
