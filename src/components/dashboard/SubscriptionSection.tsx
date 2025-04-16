import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
        // In a real app, you would fetch this from your database
        // For now, we'll simulate a subscription with trial period
        
        // Simulate fetching subscription data
        const createdAt = new Date(user.created_at || new Date());
        const trialEndDate = new Date(createdAt);
        trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial
        
        const today = new Date();
        const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        const totalTrialDays = 30;
        const daysUsed = totalTrialDays - daysLeft;
        const percentLeft = Math.max(0, Math.min(100, (daysLeft / totalTrialDays) * 100));
        
        setTrialDaysLeft(daysLeft);
        setTrialPercentLeft(percentLeft);
        
        // Simulate subscription data
        setSubscription({
          plan: 'Free Trial',
          status: 'active',
          startDate: createdAt.toISOString().split('T')[0],
          endDate: trialEndDate.toISOString().split('T')[0],
          features: [
            'Basic Analytics',
            'Email Support',
            'Limited Access to Tools',
            'Up to 3 Projects',
            'Basic Reporting'
          ]
        });
      } catch (error) {
        console.error('Error fetching subscription data:', error);
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
      {/* Trial Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Free Trial Status</CardTitle>
          <CardDescription>
            Track your remaining trial period
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-marketing-blue"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                  <p className="text-3xl font-bold">
                    {trialDaysLeft !== null ? trialDaysLeft : '--'}
                  </p>
                </div>
                
                {trialDaysLeft !== null && (
                  <div className={`p-3 rounded-full ${trialDaysLeft > 7 ? 'bg-green-100' : trialDaysLeft > 3 ? 'bg-orange-100' : 'bg-red-100'}`}>
                    {trialDaysLeft > 7 ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertCircle className={`h-6 w-6 ${trialDaysLeft > 3 ? 'text-orange-500' : 'text-red-500'}`} />
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Trial Progress</span>
                  <span>{Math.round(100 - trialPercentLeft)}%</span>
                </div>
                <Progress value={100 - trialPercentLeft} className="h-2" />
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Start Date: {subscription?.startDate}</span>
                <span>End Date: {subscription?.endDate}</span>
              </div>
              
              {trialDaysLeft !== null && trialDaysLeft <= 7 && (
                <div className={`p-4 rounded-md ${trialDaysLeft <= 3 ? 'bg-red-50 text-red-800' : 'bg-orange-50 text-orange-800'}`}>
                  <p className="font-medium">
                    {trialDaysLeft <= 3 ? 'Your trial is ending very soon!' : 'Your trial is ending soon!'}
                  </p>
                  <p className="text-sm mt-1">
                    Upgrade now to continue enjoying our services without interruption.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full">Upgrade to Pro</Button>
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
