
import { Spinner } from "@/components/ui/spinner";
import { BoostAddOn } from "@/components/subscription/BoostAddOn";
import { BedsInput } from "@/components/subscription/BedsInput";
import type { Subscription } from "@/types/subscription";

interface SubscriptionPageHeaderProps {
  checkingSubscription: boolean;
  currentSubscription: Subscription | null;
  numberOfBeds: number;
  onBedsChange: (beds: number) => void;
  boostEnabled: boolean;
  onBoostChange: (enabled: boolean) => void;
  boostPrice: number;
}

export const SubscriptionPageHeader = ({
  checkingSubscription,
  currentSubscription,
  numberOfBeds,
  onBedsChange,
  boostEnabled,
  onBoostChange,
  boostPrice
}: SubscriptionPageHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Care Home Connect Subscription Plans</h1>
      <p className="text-gray-600 mb-6">
        Choose the subscription plan that works best for your residential care home business needs.
      </p>
      
      {checkingSubscription ? (
        <div className="flex items-center space-x-2 mb-4">
          <Spinner size="sm" />
          <span className="text-gray-600">Checking subscription status...</span>
        </div>
      ) : null}
      
      {!currentSubscription?.status && (
        <div className="space-y-6">
          <BoostAddOn 
            boostEnabled={boostEnabled}
            onBoostChange={onBoostChange}
            price={boostPrice}
          />

          <BedsInput
            numberOfBeds={numberOfBeds}
            onBedsChange={onBedsChange}
          />
        </div>
      )}
    </div>
  );
};
