/**
 * Service for managing subscriptions
 */
import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { Subscription, PricingPlan, SubscriptionStatus, SubscriptionUpdateParams } from '@/types/subscription';
import { toast } from '@/components/ui/use-toast';

/**
 * Get a user's subscription
 * @param userId The user ID
 * @returns The subscription data or null if not found
 */
export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*, plan:pricing_plans(*)')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No subscription found
        return null;
      }
      throw error;
    }

    return data as Subscription;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
};

/**
 * Create a trial subscription for a user
 * @param userId The user ID
 * @returns The created subscription or null if failed
 */
export const createTrialSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    // Get the basic plan
    const { data: basicPlan, error: planError } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('name', 'Basic')
      .single();

    if (planError) {
      // If no Basic plan exists, create one
      const { data: newPlan, error: createPlanError } = await supabase
        .from('pricing_plans')
        .insert({
          name: 'Basic',
          description: 'For individuals just getting started',
          price: 9.99,
          duration: 30,
          features: ['Basic Analytics', 'Email Support', 'Up to 5 Projects'],
          is_popular: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createPlanError) throw createPlanError;

      // Create trial subscription with the new plan
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      const { data: newSubscription, error: createSubError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: newPlan.id,
          status: 'trial',
          trial_end_date: trialEndDate.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*, plan:pricing_plans(*)')
        .single();

      if (createSubError) throw createSubError;

      return newSubscription as Subscription;
    } else {
      // Create trial subscription with the existing Basic plan
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      const { data: newSubscription, error: createSubError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: basicPlan.id,
          status: 'trial',
          trial_end_date: trialEndDate.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*, plan:pricing_plans(*)')
        .single();

      if (createSubError) throw createSubError;

      return newSubscription as Subscription;
    }
  } catch (error) {
    console.error('Error creating trial subscription:', error);
    return null;
  }
};

/**
 * Calculate days left in a trial
 * @param trialEndDate The trial end date
 * @returns The days left and percentage left
 */
export const calculateTrialDaysLeft = (trialEndDate: string): { daysLeft: number; percentLeft: number } => {
  const endDate = new Date(trialEndDate);
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const percentLeft = (daysLeft / 14) * 100; // Assuming 14-day trial

  return { daysLeft, percentLeft };
};

/**
 * Update a user's subscription (admin only)
 * @param params The subscription update parameters
 * @returns True if successful, false otherwise
 */
export const updateUserSubscription = async (params: SubscriptionUpdateParams): Promise<boolean> => {
  const { userId, planName, status } = params;
  
  try {
    console.log(`Updating subscription for user ${userId} to plan ${planName} with status ${status}`);

    // First, get the subscription data
    const { data: subscriptionData, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      throw subError;
    }

    // Get the plan ID
    const { data: planData, error: planError } = await supabaseAdmin
      .from('pricing_plans')
      .select('id')
      .eq('name', planName)
      .single();

    if (planError) {
      console.error('Error fetching plan:', planError);
      throw planError;
    }

    if (!planData) {
      throw new Error(`Plan ${planName} not found`);
    }

    // If subscription exists, update it
    if (subscriptionData) {
      console.log(`Updating existing subscription ${subscriptionData.id}`);
      const { error: updateError } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          plan_id: planData.id,
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionData.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }
    } else {
      // If no subscription exists, create one
      console.log(`Creating new subscription for user ${userId}`);
      const { error: createError } = await supabaseAdmin
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planData.id,
          status: status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (createError) {
        console.error('Error creating subscription:', createError);
        throw createError;
      }
    }

    return true;
  } catch (error: any) {
    console.error('Error updating user subscription:', error);
    toast({
      title: 'Error updating subscription',
      description: error.message || 'An error occurred while updating the subscription.',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Get all pricing plans
 * @returns Array of pricing plans
 */
export const getAllPricingPlans = async (): Promise<PricingPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
    return data as PricingPlan[];
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return [];
  }
};
