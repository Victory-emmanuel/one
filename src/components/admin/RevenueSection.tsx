import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, CreditCard, Award, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Import revenue service
import { RevenueData, fetchSubscriptionsWithProfiles, calculateRevenueData } from '@/services/revenue.service';

const RevenueSection = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  const [revenueData, setRevenueData] = useState<RevenueData>({
    week: {
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
    },
    month: {
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
    },
    '3months': {
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
    },
    '6months': {
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
    },
    year: {
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
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    try {
      // Fetch subscriptions with profiles using the revenue service
      const subscriptionsWithProfiles = await fetchSubscriptionsWithProfiles();

      // If no subscriptions, return empty data
      if (!subscriptionsWithProfiles || subscriptionsWithProfiles.length === 0) {
        setIsLoading(false);
        return;
      }

      // Calculate revenue data using the revenue service
      const newRevenueData = calculateRevenueData(subscriptionsWithProfiles);

      setRevenueData(newRevenueData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast({
        title: 'Error fetching revenue data',
        description: 'Could not load revenue data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentData = revenueData[timeFilter];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Revenue & Financial Tracking</h2>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="3months">3 Months</SelectItem>
            <SelectItem value="6months">6 Months</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-marketing-blue" />
        </div>
      ) : (
        <>
          {/* Revenue Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentData.totalRevenue > 0 ?
                    `$${currentData.totalRevenue.toLocaleString()}` :
                    <span className="text-muted-foreground">No data</span>}
                </div>
                <p className="text-xs text-muted-foreground">
                  For the selected period
                </p>
              </CardContent>
            </Card>

            {/* Profit Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Profit
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentData.profit > 0 ?
                    `$${currentData.profit.toLocaleString()}` :
                    <span className="text-muted-foreground">No data</span>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentData.totalRevenue > 0 ?
                    `${Math.round((currentData.profit / currentData.totalRevenue) * 100)}% profit margin` :
                    'No data available'}
                </p>
              </CardContent>
            </Card>

            {/* Growth Rate Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Growth Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentData.growthRate > 0 ?
                    `${currentData.growthRate}%` :
                    <span className="text-muted-foreground">No data</span>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Compared to previous period
                </p>
              </CardContent>
            </Card>

            {/* Top Plan Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Plan
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentData.topPlan.name ?
                    currentData.topPlan.name :
                    <span className="text-muted-foreground">No data</span>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentData.topPlan.revenue > 0 ?
                    `$${currentData.topPlan.revenue.toLocaleString()} revenue` :
                    'No data available'}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Detailed Revenue Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>
            Detailed analysis of revenue by plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {currentData.planBreakdown.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentData.planBreakdown.map((plan) => (
                      <Card key={plan.name}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{plan.name} Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Revenue:</span>
                            <span className="font-medium">${plan.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Clients:</span>
                            <span className="font-medium">{plan.clients}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Profit Margin:</span>
                            <span className="font-medium">{plan.profitMargin}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Avg. Revenue/Client:</span>
                            <span className="font-medium">
                              ${plan.clients > 0 ? (plan.revenue / plan.clients).toFixed(2) : '0.00'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {currentData.topPlan.name && (
                    <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                      <h3 className="text-sm font-medium mb-2">Revenue Insights</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                        <li>
                          The {currentData.topPlan.name} plan is your top performer, generating
                          ${currentData.topPlan.revenue.toLocaleString()} in revenue from
                          {currentData.topPlan.clients} clients.
                        </li>
                        {currentData.totalRevenue > 0 && (
                          <li>
                            Your overall profit margin is {Math.round((currentData.profit / currentData.totalRevenue) * 100)}%.
                          </li>
                        )}
                        {currentData.growthRate > 0 && (
                          <li>
                            Growth rate is {currentData.growthRate}% compared to the previous period.
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border">
                  <DollarSign className="h-12 w-12 mx-auto text-marketing-blue opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Revenue Data</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    There is no revenue data available for the selected time period.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="plans" className="space-y-4">
              <div className="border rounded-lg p-6 bg-gray-50 text-center">
                <h3 className="text-lg font-medium mb-2">Plan Performance</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed breakdown of plan performance will be displayed here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="border rounded-lg p-6 bg-gray-50 text-center">
                <h3 className="text-lg font-medium mb-2">Revenue Trends</h3>
                <p className="text-muted-foreground mb-4">
                  Revenue trend charts will be displayed here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueSection;
