import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CreditCard, DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ReportsSection from '@/components/admin/ReportsSection';

const AdminDashboardPage = () => {
  const { user, profile } = useAuth();
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
        // In a real app, you would fetch this from your database
        // For now, we'll simulate dashboard data
        
        // Simulate client stats
        setClientStats({
          totalClients: 156,
          newSignups: 24,
          activeSubscriptions: 132,
          trialClients: 48
        });
        
        // Simulate revenue stats
        setRevenueStats({
          totalRevenue: 12580,
          monthlyRevenue: 3450,
          topPlan: 'Pro',
          growthRate: 12.5
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
            <ReportsSection />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
                <CardDescription>
                  Track client acquisition and growth over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Client growth chart will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Track revenue performance over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
