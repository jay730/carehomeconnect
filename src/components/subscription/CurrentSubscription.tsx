
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subscription, SubscriptionPlan } from "@/types/subscription";

interface CurrentSubscriptionProps {
  subscription: Subscription;
  plans: SubscriptionPlan[];
  onCancel: () => void;
}

export const CurrentSubscription = ({ subscription, plans, onCancel }: CurrentSubscriptionProps) => {
  const currentPlan = plans.find(p => p.id === subscription.planId);
  
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Your subscription details and management options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <Badge className="mb-2">
                {subscription.status === 'active' ? 'Active' : 'Canceled'}
              </Badge>
              <h3 className="text-xl font-bold">
                {currentPlan?.name} Plan
              </h3>
              <p className="text-gray-600">
                {subscription.currentPeriodEnd ? (
                  <>
                    {subscription.status === 'active' ? (
                      <>Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</>
                    ) : (
                      <>Access until: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</>
                    )}
                  </>
                ) : null}
              </p>
              {subscription.hasBoost && (
                <Badge variant="secondary" className="mt-2">
                  Boost Enabled
                </Badge>
              )}
            </div>
            {subscription.status === 'active' && (
              <Button 
                variant="outline"
                className="mt-4 md:mt-0"
                onClick={onCancel}
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
