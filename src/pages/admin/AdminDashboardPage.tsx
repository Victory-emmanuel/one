import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CreditCard, DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import ClientGrowthChart from '@/components/admin/charts/ClientGrowthChart';
import RevenueTrendsChart from '@/components/admin/charts/RevenueTrendsChart';
import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import SimplifiedReportsSection from '@/components/admin/SimplifiedReportsSection';
import { toast } from '@/components/ui/use-toast';

const AdminDashboardPage = () => {
  const { user, profile } = useAuth();
  const { adminFunctions, isAdminLoaded } = useAdminAuth();
  const [clientStats, setClientStats] = useState({
    totalClients: 0,
    newSignups: 0,
    activeSubscriptions: 0,
    trialClients: 0
  });
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    topPlan: '',
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch client stats using adminFunctions
        const usersData = await adminFunctions.listUsers();

        if (!usersData) {
          toast({
            title: 'Error fetching users',
            description: 'Could not load user data. Please try again later.',
            variant: 'destructive',
          });
          return;
        }

        // Get total clients count
        const totalClients = usersData.users.length;

        // Get new signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newSignups = usersData.users.filter(user =>
          new Date(user.created_at) >= thirtyDaysAgo
        ).length;

        // Fetch subscription stats using supabaseAdmin to bypass RLS
        // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
        const { data: subscriptionsData, error: subscriptionsError } = await supabaseAdmin
          .from('user_subscriptions')
          .select('*, plan:pricing_plans(*)');

        if (subscriptionsError) throw subscriptionsError;

        // Get active subscriptions count
        const activeSubscriptions = subscriptionsData.filter(sub =>
          sub.status === 'active'
        ).length;

        // Get trial clients count
        const trialClients = subscriptionsData.filter(sub =>
          sub.status === 'trial'
        ).length;

        setClientStats({
          totalClients,
          newSignups,
          activeSubscriptions,
          trialClients
        });

        // Calculate revenue stats
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthFirstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0);

        // Calculate total revenue
        const totalRevenue = subscriptionsData.reduce((sum, sub) => {
          if (sub.status === 'active' && sub.plan) {
            return sum + (sub.plan.price || 0);
          }
          return sum;
        }, 0);

        // Calculate monthly revenue (current month)
        const monthlyRevenue = subscriptionsData.reduce((sum, sub) => {
          if (sub.status === 'active' && sub.plan &&
              new Date(sub.created_at) <= now &&
              new Date(sub.created_at) >= firstDayOfMonth) {
            return sum + (sub.plan.price || 0);
          }
          return sum;
        }, 0);

        // Calculate last month's revenue for growth rate
        const lastMonthRevenue = subscriptionsData.reduce((sum, sub) => {
          if (sub.status === 'active' && sub.plan &&
              new Date(sub.created_at) >= lastMonthFirstDay &&
              new Date(sub.created_at) <= lastMonthLastDay) {
            return sum + (sub.plan.price || 0);
          }
          return sum;
        }, 0);

        // Calculate growth rate
        const growthRate = lastMonthRevenue > 0 ?
          ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

        // Find top plan
        const planCounts = {};
        subscriptionsData.forEach(sub => {
          if (sub.plan) {
            const planName = sub.plan.name;
            planCounts[planName] = (planCounts[planName] || 0) + 1;
          }
        });

        let topPlan = '';
        let maxCount = 0;

        Object.entries(planCounts).forEach(([plan, count]) => {
          if (count > maxCount) {
            maxCount = count;
            topPlan = plan;
          }
        });

        setRevenueStats({
          totalRevenue,
          monthlyRevenue,
          topPlan,
          growthRate: parseFloat(growthRate.toFixed(1))
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdminLoaded) {
      fetchDashboardData();
    }
  }, [isAdminLoaded, adminFunctions]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome, {profile?.full_name || 'Admin'}!</h2>
            <p className="text-muted-foreground">
              Here's an overview of your business performance.
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
          {/* Total Clients Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? 'Loading...' : clientStats.totalClients}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? '' : `+${clientStats.newSignups} new this month`}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Subscriptions Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscriptions
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? 'Loading...' : clientStats.activeSubscriptions}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? '' : `${clientStats.trialClients} on free trial`}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Revenue Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? 'Loading...' : `$${revenueStats.monthlyRevenue.toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? '' : `$${revenueStats.totalRevenue.toLocaleString()} total revenue`}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Growth Rate Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Growth Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? 'Loading...' : `${revenueStats.growthRate}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? '' : `Top plan: ${revenueStats.topPlan}`}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            <TabsTrigger value="clients">Client Growth</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            <SimplifiedReportsSection />
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <ClientGrowthChart />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <RevenueTrendsChart />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
