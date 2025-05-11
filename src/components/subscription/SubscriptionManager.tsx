
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Subscription, SubscriptionPlan } from "@/types/subscription";
import { SuccessDialog } from "./SuccessDialog";
import { CanceledDialog } from "./CanceledDialog";
import { SubscriptionPageHeader } from "./SubscriptionPageHeader";
import { SubscriptionOptions } from "./SubscriptionOptions";
import { ConfirmPlanChangeButton } from "./ConfirmPlanChangeButton";

const SubscriptionManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [boostEnabled, setBoostEnabled] = useState(false);
  const [numberOfBeds, setNumberOfBeds] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const boostPrice = 49.99;
  
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCanceledDialog, setShowCanceledDialog] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  useEffect(() => {
    const mockPlans: SubscriptionPlan[] = [
      {
        id: 'basic',
        name: 'Starter',
        pricePerBed: 59.99,
        billingCycle: 'monthly',
        features: [
          'Get online.',
          'List your care home',
          'Basic profile (photos, description, pricing)',
          'Inquiries sent to email',
          'Limited to 1 active listing per home'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        pricePerBed: 79.99,
        billingCycle: 'monthly',
        features: [
          'Grow faster, more leads.',
          'Everything in Starter',
          'Priority placement in search results',
          'SMS/Email lead notifications',
          'Online booking inquiry form',
          'Up to 5 homes/properties',
          'Analytics dashboard (views, inquiries)'
        ]
      }
    ];

    setPlans(mockPlans);
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setCheckingSubscription(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      if (data.subscribed && data.subscription) {
        setCurrentSubscription({
          planId: data.subscription.planId,
          status: data.subscription.status,
          currentPeriodEnd: data.subscription.currentPeriodEnd,
          hasBoost: data.subscription.hasBoost
        });
        
        // Set the UI to match the current subscription
        setBoostEnabled(data.subscription.hasBoost);
        setNumberOfBeds(data.subscription.numberOfBeds);
      } else {
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setCheckingSubscription(false);
    }
  };

  const calculateTotalPrice = (pricePerBed: number) => {
    let total = pricePerBed * numberOfBeds;
    if (boostEnabled) {
      total += boostPrice;
    }
    return total.toFixed(2);
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) return;
    
    try {
      setIsProcessing(true);
      
      // Create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId,
          numberOfBeds,
          boostEnabled,
        },
      });
      
      if (error) throw error;
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to manage your subscription",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      toast({
        title: "Error",
        description: "Failed to access subscription management portal",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromoCode = (code: string) => {
    toast({
      title: "Promo Code Applied",
      description: `The promo code "${code}" has been applied to your subscription.`,
    });
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleConfirmPlanChange = async () => {
    if (!selectedPlanId) {
      toast({
        title: "No Plan Selected",
        description: "Please select a plan before confirming",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create a checkout session with the existing payment method
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId: selectedPlanId,
          numberOfBeds,
          boostEnabled,
          useExistingPaymentMethod: true,
        },
      });
      
      if (error) throw error;
      
      // Handle the response - might immediately redirect or confirm the change
      if (data.success) {
        toast({
          title: "Plan Updated",
          description: "Your subscription plan has been updated successfully",
        });
        checkSubscriptionStatus();
      } else if (data.url) {
        // If we still need to redirect to a checkout page
        window.location.href = data.url;
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription plan",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubscriptionPageHeader 
        checkingSubscription={checkingSubscription}
        currentSubscription={currentSubscription}
        numberOfBeds={numberOfBeds}
        onBedsChange={setNumberOfBeds}
        boostEnabled={boostEnabled}
        onBoostChange={setBoostEnabled}
        boostPrice={boostPrice}
      />

      <SubscriptionOptions
        plans={plans}
        currentSubscription={currentSubscription}
        numberOfBeds={numberOfBeds}
        boostEnabled={boostEnabled}
        boostPrice={boostPrice}
        onPromoApplied={handlePromoCode}
        onSubscribe={handleSubscribe}
        selectedPlanId={selectedPlanId}
        onSelectPlan={handleSelectPlan}
      />

      {currentSubscription?.status === 'active' && selectedPlanId && (
        <ConfirmPlanChangeButton 
          isProcessing={isProcessing}
          onConfirm={handleConfirmPlanChange}
        />
      )}

      <SuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog} 
      />
      
      <CanceledDialog 
        open={showCanceledDialog} 
        onOpenChange={setShowCanceledDialog} 
      />
    </>
  );
};

export default SubscriptionManager;
