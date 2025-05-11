
import { PromoCodeBox } from "@/components/subscription/PromoCodeBox";
import { PlanCard } from "@/components/subscription/PlanCard";
import type { Subscription, SubscriptionPlan } from "@/types/subscription";

interface SubscriptionOptionsProps {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  numberOfBeds: number;
  boostEnabled: boolean;
  boostPrice: number;
  onPromoApplied: (code: string) => void;
  onSubscribe: (planId: string) => void;
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
}

export const SubscriptionOptions = ({
  plans,
  currentSubscription,
  numberOfBeds,
  boostEnabled,
  boostPrice,
  onPromoApplied,
  onSubscribe,
  selectedPlanId,
  onSelectPlan
}: SubscriptionOptionsProps) => {
  const calculateTotalPrice = (pricePerBed: number) => {
    let total = pricePerBed * numberOfBeds;
    if (boostEnabled) {
      total += boostPrice;
    }
    return total.toFixed(2);
  };

  return (
    <>
      <PromoCodeBox onApplyPromo={onPromoApplied} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={currentSubscription?.planId === plan.id && currentSubscription?.status === 'active'}
            totalPrice={Number(calculateTotalPrice(plan.pricePerBed))}
            numberOfBeds={numberOfBeds}
            boostEnabled={boostEnabled}
            boostPrice={boostPrice}
            isSelected={selectedPlanId === plan.id}
            onSelect={() => onSelectPlan(plan.id)}
            onSubscribe={() => onSubscribe(plan.id)}
          />
        ))}
      </div>
    </>
  );
};
