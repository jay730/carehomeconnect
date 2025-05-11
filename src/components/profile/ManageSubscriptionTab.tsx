
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { useProfileData } from "@/hooks/useProfileData";
import { NoActiveSubscription } from "./subscription/NoActiveSubscription";
import { SubscriptionDetails } from "./subscription/SubscriptionDetails";

interface ManageSubscriptionTabProps {
  user: any;
}

export function ManageSubscriptionTab({ user }: ManageSubscriptionTabProps) {
  const navigate = useNavigate();
  const { 
    subscription, 
    isLoading, 
    isProcessing, 
    fetchSubscription, 
    createPortalSession 
  } = useSubscriptionData(user?.id);
  const { profile } = useProfileData(user?.id);

  // Handle retry to reload subscription data
  const handleRetry = () => {
    fetchSubscription();
  };

  // Handle managing the subscription through Stripe portal
  const handleManageSubscription = async () => {
    const portalUrl = await createPortalSession();
    if (portalUrl) {
      window.location.href = portalUrl;
    } else {
      // Fallback to subscription page
      setTimeout(() => navigate("/owner/subscription"), 1500);
    }
  };

  // Show a loading state while initializing
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  // Determine whether the user is subscribed
  const isSubscribed = subscription?.status === "active";

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      {!isSubscribed ? (
        <NoActiveSubscription 
          onRetry={handleRetry} 
          isProcessing={isProcessing}
        />
      ) : (
        <div className="space-y-6">
          <SubscriptionDetails
            subscription={subscription}
            profile={profile}
            isProcessing={isProcessing}
            onManageSubscription={handleManageSubscription}
          />
        </div>
      )}
    </div>
  );
}
