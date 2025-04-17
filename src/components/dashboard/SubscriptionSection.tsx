import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, CreditCard, CalendarDays, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const SubscriptionSection = () => {
  const { user } = useAuth();
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [trialPercentLeft, setTrialPercentLeft] = useState<number>(100);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) return;

      try {
        // Check if user has a subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .select('*, plan:pricing_plans(*)')
          .eq('user_id', user.id)
          .single();

        if (subscriptionError) {
          if (subscriptionError.code === 'PGRST116') { // No subscription found
            // Create a trial subscription for new users
            // First, get the basic plan
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
                  user_id: user.id,
                  plan_id: newPlan.id,
                  status: 'trial',
                  trial_end_date: trialEndDate.toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select('*, plan:pricing_plans(*)')
                .single();

              if (createSubError) throw createSubError;

              setSubscription(newSubscription);

              // Calculate days left in trial
              const today = new Date();
              const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
              setTrialDaysLeft(daysLeft);
              setTrialPercentLeft((daysLeft / 14) * 100);
            } else {
              // Create trial subscription with the existing Basic plan
              const trialEndDate = new Date();
              trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

              const { data: newSubscription, error: createSubError } = await supabase
                .from('user_subscriptions')
                .insert({
                  user_id: user.id,
                  plan_id: basicPlan.id,
                  status: 'trial',
                  trial_end_date: trialEndDate.toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select('*, plan:pricing_plans(*)')
                .single();

              if (createSubError) throw createSubError;

              setSubscription(newSubscription);

              // Calculate days left in trial
              const today = new Date();
              const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
              setTrialDaysLeft(daysLeft);
              setTrialPercentLeft((daysLeft / 14) * 100);
            }
          } else {
            throw subscriptionError;
          }
        } else {
          // User has an existing subscription
          setSubscription(subscriptionData);

          // Calculate days left in trial if applicable
          if (subscriptionData.status === 'trial' && subscriptionData.trial_end_date) {
            const trialEndDate = new Date(subscriptionData.trial_end_date);
            const today = new Date();
            const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
            setTrialDaysLeft(daysLeft);
            setTrialPercentLeft((daysLeft / 14) * 100);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        toast({
          title: 'Error loading subscription',
          description: 'Could not load your subscription details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  // Get color based on days left
  const getProgressColor = () => {
    if (trialDaysLeft === null) return 'bg-gray-200';
    if (trialDaysLeft <= 3) return 'bg-red-500';
    if (trialDaysLeft <= 7) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Subscription Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </div>
            {loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
            ) : (
              <Badge className={`${subscription?.status === 'active' ? 'bg-green-500' : subscription?.status === 'trial' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                {subscription?.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : 'Loading'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
            </div>
          ) : (
            <>
              {/* Current Plan */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Current Plan</h3>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">{subscription?.plan?.name || 'Basic'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subscription?.status === 'active' && subscription?.current_period_end ? (
                        <>Your subscription renews on {new Date(subscription.current_period_end).toLocaleDateString()}</>
                      ) : subscription?.status === 'trial' && subscription?.trial_end_date ? (
                        <>Your trial ends on {new Date(subscription.trial_end_date).toLocaleDateString()}</>
                      ) : (
                        <>Your subscription is {subscription?.status}</>
                      )}
                    </p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
              </div>

              {/* Trial Status */}
              {subscription?.status === 'trial' && trialDaysLeft !== null && trialDaysLeft > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Trial Status</h3>
                    <span className="text-sm text-muted-foreground">{trialDaysLeft} days left</span>
                  </div>
                  <Progress value={100 - trialPercentLeft} className="h-2" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                      <p className="text-xl font-bold">
                        {trialDaysLeft}
                      </p>
                    </div>

                    <div className={`p-3 rounded-full ${trialDaysLeft > 7 ? 'bg-green-100' : trialDaysLeft > 3 ? 'bg-orange-100' : 'bg-red-100'}`}>
                      {trialDaysLeft > 7 ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <AlertCircle className={`h-6 w-6 ${trialDaysLeft > 3 ? 'text-orange-500' : 'text-red-500'}`} />
                      )}
                    </div>
                  </div>

                  {trialDaysLeft <= 7 && (
                    <div className={`p-4 rounded-md ${trialDaysLeft <= 3 ? 'bg-red-50 text-red-800' : 'bg-orange-50 text-orange-800'}`}>
                      <p className="font-medium">
                        {trialDaysLeft <= 3 ? 'Your trial is ending very soon!' : 'Your trial is ending soon!'}
                      </p>
                      <p className="text-sm mt-1">
                        Upgrade now to continue enjoying our services without interruption.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Features */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Included Features</h3>
                <ul className="space-y-2">
                  {subscription?.plan?.features ? (
                    typeof subscription.plan.features === 'string' ? (
                      // Handle JSON string format
                      JSON.parse(subscription.plan.features).features?.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : Array.isArray(subscription.plan.features) ? (
                      // Handle array format
                      subscription.plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      // Handle object format with features property
                      subscription.plan.features.features?.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))
                    )
                  ) : (
                    <li className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span>No features listed</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Payment Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Payment Information</h3>
                {subscription?.status === 'trial' ? (
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span>No payment method required during trial</span>
                    <Button variant="link" className="ml-auto">Add Payment Method</Button>
                  </div>
                ) : (
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>Visa ending in 4242</span>
                    <Button variant="link" className="ml-auto">Update</Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            You can cancel your subscription at any time. If you cancel, you'll still have access until the end of your current billing period.
          </p>
          {subscription?.status === 'trial' ? (
            <Button className="w-full">Upgrade to Pro</Button>
          ) : (
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              disabled={loading}
            >
              Cancel Subscription
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Choose the plan that works best for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Basic</CardTitle>
                <CardDescription>For individuals just getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Basic Analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Email Support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Up to 5 Projects
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Select Plan</Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-marketing-blue">
              <CardHeader className="bg-marketing-blue/5">
                <div className="bg-marketing-blue text-white text-xs font-medium px-2 py-1 rounded-full w-fit mb-2">
                  POPULAR
                </div>
                <CardTitle className="text-lg">Pro</CardTitle>
                <CardDescription>For professionals and small teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$29.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Advanced Analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Priority Support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Unlimited Projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Advanced Reporting
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Select Plan</Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$99.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    All Pro Features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    24/7 Dedicated Support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Custom Integrations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Advanced Security
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubscriptionSection;
