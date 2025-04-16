import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, CreditCard, Award } from 'lucide-react';

const RevenueSection = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  
  // Sample revenue data
  const revenueData = {
    week: {
      totalRevenue: 2450,
      profit: 1960,
      growthRate: 8.3,
      topPlan: {
        name: 'Pro',
        revenue: 1800,
        clients: 12,
        profitMargin: 82
      },
      planBreakdown: [
        { name: 'Basic', revenue: 350, clients: 7, profitMargin: 75 },
        { name: 'Pro', revenue: 1800, clients: 12, profitMargin: 82 },
        { name: 'Enterprise', revenue: 300, clients: 1, profitMargin: 85 }
      ]
    },
    month: {
      totalRevenue: 9850,
      profit: 7880,
      growthRate: 12.5,
      topPlan: {
        name: 'Pro',
        revenue: 6600,
        clients: 44,
        profitMargin: 82
      },
      planBreakdown: [
        { name: 'Basic', revenue: 1450, clients: 29, profitMargin: 75 },
        { name: 'Pro', revenue: 6600, clients: 44, profitMargin: 82 },
        { name: 'Enterprise', revenue: 1800, clients: 6, profitMargin: 85 }
      ]
    },
    '3months': {
      totalRevenue: 28500,
      profit: 22800,
      growthRate: 15.2,
      topPlan: {
        name: 'Pro',
        revenue: 19200,
        clients: 128,
        profitMargin: 82
      },
      planBreakdown: [
        { name: 'Basic', revenue: 4300, clients: 86, profitMargin: 75 },
        { name: 'Pro', revenue: 19200, clients: 128, profitMargin: 82 },
        { name: 'Enterprise', revenue: 5000, clients: 16, profitMargin: 85 }
      ]
    },
    '6months': {
      totalRevenue: 56200,
      profit: 44960,
      growthRate: 18.7,
      topPlan: {
        name: 'Pro',
        revenue: 37800,
        clients: 252,
        profitMargin: 82
      },
      planBreakdown: [
        { name: 'Basic', revenue: 8400, clients: 168, profitMargin: 75 },
        { name: 'Pro', revenue: 37800, clients: 252, profitMargin: 82 },
        { name: 'Enterprise', revenue: 10000, clients: 32, profitMargin: 85 }
      ]
    },
    year: {
      totalRevenue: 112400,
      profit: 89920,
      growthRate: 22.3,
      topPlan: {
        name: 'Pro',
        revenue: 75600,
        clients: 504,
        profitMargin: 82
      },
      planBreakdown: [
        { name: 'Basic', revenue: 16800, clients: 336, profitMargin: 75 },
        { name: 'Pro', revenue: 75600, clients: 504, profitMargin: 82 },
        { name: 'Enterprise', revenue: 20000, clients: 64, profitMargin: 85 }
      ]
    }
  };
  
  const currentData = revenueData[timeFilter];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
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
              ${currentData.totalRevenue.toLocaleString()}
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
              ${currentData.profit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((currentData.profit / currentData.totalRevenue) * 100)}% profit margin
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
              {currentData.growthRate}%
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
              {currentData.topPlan.name}
            </div>
            <p className="text-xs text-muted-foreground">
              ${currentData.topPlan.revenue.toLocaleString()} revenue
            </p>
          </CardContent>
        </Card>
      </div>
      
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
                          ${(plan.revenue / plan.clients).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Revenue Insights</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>
                    The {currentData.topPlan.name} plan is your top performer, generating 
                    ${currentData.topPlan.revenue.toLocaleString()} in revenue from 
                    {currentData.topPlan.clients} clients.
                  </li>
                  <li>
                    Your overall profit margin is {Math.round((currentData.profit / currentData.totalRevenue) * 100)}%, 
                    with the Enterprise plan having the highest margin at 85%.
                  </li>
                  <li>
                    Growth rate is {currentData.growthRate}% compared to the previous period, 
                    indicating a healthy business trajectory.
                  </li>
                </ul>
              </div>
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
    </motion.div>
  );
};

export default RevenueSection;
