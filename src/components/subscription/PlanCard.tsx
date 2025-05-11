
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubscriptionPlan } from "@/types/subscription";

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  totalPrice: number;
  numberOfBeds: number;
  boostEnabled: boolean;
  boostPrice: number;
  onSubscribe: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const PlanCard = ({
  plan,
  isCurrentPlan,
  totalPrice,
  numberOfBeds,
  boostEnabled,
  boostPrice,
  onSubscribe,
  isSelected,
  onSelect
}: PlanCardProps) => {
  // Determine button label based on current plan and the plan being displayed
  const getButtonLabel = () => {
    if (isCurrentPlan) {
      return 'Current Plan';
    }
    
    if (onSelect) {
      if (plan.id === 'basic') {
        return 'Downgrade';
      }
      if (plan.id === 'pro') {
        return 'Upgrade';
      }
      return 'Select Plan';
    }
    
    if (plan.id === 'pro' && !isCurrentPlan) {
      return 'Upgrade';
    }
    
    if (plan.id === 'basic' && !isCurrentPlan) {
      return 'Downgrade';
    }
    
    return plan.recommended ? 'Upgrade Now' : 'Subscribe';
  };

  return (
    <Card className={`${plan.recommended ? 'border-2 border-care-500 relative' : ''} flex flex-col h-full ${isSelected ? 'ring-2 ring-care-500 ring-offset-2' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {plan.name} {isCurrentPlan && <span className="ml-2 text-sm text-care-600 bg-care-50 px-2 py-1 rounded-md">Current Plan</span>}
          </CardTitle>
        </div>
        <CardDescription>
          {plan.name === 'Starter' ? 'For small care homes just starting out' :
           plan.name === 'Pro' ? 'For established care homes looking to grow' :
           'For multiple locations and advanced needs'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <p className="text-3xl font-bold">
            ${totalPrice}
            <span className="text-lg font-normal text-gray-600">/bed/month</span>
          </p>
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        {!isCurrentPlan && (
          <Button 
            className={`w-full ${plan.recommended ? 'bg-care-600 hover:bg-care-700' : plan.id === 'pro' ? 'bg-care-500 hover:bg-care-600' : ''}`}
            variant={plan.id === 'pro' || plan.recommended ? 'default' : 'outline'}
            onClick={onSelect || onSubscribe}
          >
            {getButtonLabel()}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
