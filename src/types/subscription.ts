
export interface SubscriptionPlan {
  id: string;
  name: string;
  pricePerBed: number;
  billingCycle: string;
  features: string[];
  recommended?: boolean;
}

export interface Subscription {
  planId: string;
  status: 'active' | 'canceled' | 'expired' | null;
  currentPeriodEnd: string | null;
  hasBoost?: boolean;
  numberOfBeds?: number;
}
