/**
 * Types related to subscription management
 */

export type SubscriptionStatus = 'trial' | 'active' | 'inactive';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[] | { features: string[] } | string;
  is_popular: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  trial_end_date?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
  plan?: PricingPlan;
}

export interface SubscriptionUpdateParams {
  userId: string;
  planName: string;
  status: SubscriptionStatus;
}
