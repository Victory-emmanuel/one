/**
 * Service for revenue-related operations
 */
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { toast } from '@/components/ui/use-toast';

export interface PlanRevenue {
  name: string;
  revenue: number;
  clients: number;
  profitMargin: number;
}

export interface RevenuePeriodData {
  totalRevenue: number;
  profit: number;
  growthRate: number;
  topPlan: PlanRevenue;
  planBreakdown: PlanRevenue[];
}

export interface RevenueData {
  week: RevenuePeriodData;
  month: RevenuePeriodData;
  '3months': RevenuePeriodData;
  '6months': RevenuePeriodData;
  year: RevenuePeriodData;
}

/**
 * Fetch subscription data with user profiles
 * @returns Array of subscriptions with user profiles
 */
export const fetchSubscriptionsWithProfiles = async () => {
  try {
    // Fetch subscription data from the database using supabaseAdmin to bypass RLS
    const { data: subscriptionsData, error: subscriptionsError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*, plan:pricing_plans(*)');

    if (subscriptionsError) throw subscriptionsError;

    // Fetch profiles data separately
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    // Join the profiles data with subscriptions data manually
    const subscriptionsWithProfiles = subscriptionsData.map(subscription => {
      const userProfile = profilesData.find(profile => profile.id === subscription.user_id);
      return {
        ...subscription,
        user: userProfile || null
      };
    });

    return subscriptionsWithProfiles;
  } catch (error) {
    console.error('Error fetching subscriptions with profiles:', error);
    toast({
      title: 'Error fetching data',
      description: 'Could not load subscription data. Please try again later.',
      variant: 'destructive',
    });
    return [];
  }
};

/**
 * Filter subscriptions by time period
 * @param subscriptions Array of subscriptions
 * @param period Time period ('week', 'month', '3months', '6months', 'year')
 * @returns Filtered subscriptions
 */
export const filterSubscriptionsByPeriod = (subscriptions, period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case '3months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case '6months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default:
      startDate = new Date(0); // Beginning of time
  }

  return subscriptions.filter(sub => new Date(sub.created_at) >= startDate);
};

/**
 * Calculate revenue data for all time periods
 * @param subscriptions Array of subscriptions with profiles
 * @returns Revenue data for all time periods
 */
export const calculateRevenueData = (subscriptions): RevenueData => {
  // Initialize revenue data
  const revenueData: RevenueData = {
    week: createEmptyPeriodData(),
    month: createEmptyPeriodData(),
    '3months': createEmptyPeriodData(),
    '6months': createEmptyPeriodData(),
    year: createEmptyPeriodData()
  };

  if (!subscriptions || subscriptions.length === 0) {
    return revenueData;
  }

  // Get all unique plan names
  const planNames = [...new Set(subscriptions.map(sub => sub.plan?.name || 'Unknown'))];

  // Calculate revenue for each time period
  Object.keys(revenueData).forEach(period => {
    // Filter subscriptions based on time period
    const periodSubscriptions = filterSubscriptionsByPeriod(subscriptions, period);

    // Calculate total revenue
    const totalRevenue = periodSubscriptions.reduce((sum, sub) => sum + (sub.plan?.price || 0), 0);

    // Calculate profit (assuming 80% profit margin)
    const profit = totalRevenue * 0.8;

    // Calculate revenue by plan
    const planBreakdown = planNames.map(planName => {
      const planSubs = periodSubscriptions.filter(sub => sub.plan?.name === planName);
      const planRevenue = planSubs.reduce((sum, sub) => sum + (sub.plan?.price || 0), 0);
      const planClients = planSubs.length;
      const planProfitMargin = 80; // Assuming 80% profit margin for all plans

      return {
        name: planName,
        revenue: planRevenue,
        clients: planClients,
        profitMargin: planProfitMargin
      };
    }).filter(plan => plan.revenue > 0);

    // Find top plan
    const topPlan = planBreakdown.length > 0 ?
      planBreakdown.reduce((max, plan) => plan.revenue > max.revenue ? plan : max, planBreakdown[0]) :
      { name: '', revenue: 0, clients: 0, profitMargin: 0 };

    // Calculate growth rate (random for now)
    const growthRate = Math.round(Math.random() * 20 * 10) / 10;

    // Update revenue data for this period
    revenueData[period] = {
      totalRevenue,
      profit,
      growthRate,
      topPlan,
      planBreakdown
    };
  });

  return revenueData;
};

/**
 * Create empty period data
 * @returns Empty period data
 */
const createEmptyPeriodData = (): RevenuePeriodData => ({
  totalRevenue: 0,
  profit: 0,
  growthRate: 0,
  topPlan: {
    name: '',
    revenue: 0,
    clients: 0,
    profitMargin: 0
  },
  planBreakdown: []
});
