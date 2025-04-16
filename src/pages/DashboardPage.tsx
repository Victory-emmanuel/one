import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, CreditCard, Users, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
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
        
        setTrialDaysLeft(daysLeft);
        
        // Simulate subscription data
        setSubscription({
          plan: 'Free Trial',
          status: 'active',
          startDate: createdAt.toISOString().split('T')[0],
          endDate: trialEndDate.toISOString().split('T')[0],
          features: ['Basic Analytics', 'Email Support', 'Limited Access']
        });
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back, {profile?.full_name || 'there'}!</h2>
            <p className="text-muted-foreground">
              Here's what's happening with your account today.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {/* Trial Status Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trial Status
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trialDaysLeft !== null ? `${trialDaysLeft} days left` : 'Loading...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {trialDaysLeft !== null && trialDaysLeft > 0 
                    ? 'Your free trial is active' 
                    : 'Your trial has ended'}
                </p>
                {trialDaysLeft !== null && trialDaysLeft <= 7 && trialDaysLeft > 0 && (
                  <div className="mt-2 text-xs text-red-500 font-medium">
                    Your trial is ending soon! Upgrade now.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Plan Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Plan
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {subscription?.plan || 'Loading...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {subscription?.status === 'active' ? 'Active subscription' : 'Inactive'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Tickets Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Support Tickets
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No active support tickets
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Analytics
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  Analytics available in paid plans
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>
              Information about your current subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-marketing-blue"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Plan</h3>
                    <p className="text-lg font-semibold">{subscription?.plan}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p className="text-lg font-semibold capitalize">{subscription?.status}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                    <p className="text-lg font-semibold">{subscription?.startDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                    <p className="text-lg font-semibold">{subscription?.endDate}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {subscription?.features.map((feature: string, index: number) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
