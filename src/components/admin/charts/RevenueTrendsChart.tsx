import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const RevenueTrendsChart = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [chartType, setChartType] = useState('line');
  const [isLoading, setIsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [planDistribution, setPlanDistribution] = useState<any[]>([]);

  const COLORS = ['#0066ff', '#FF6B35', '#4BC0C0', '#9966FF', '#FF8042'];

  useEffect(() => {
    fetchRevenueData();
  }, [timeFilter]);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    try {
      // Step 1: Fetch subscription data
      const { data: subscriptionsData, error: subscriptionsError } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*, plan:pricing_plans(*)');

      if (subscriptionsError) throw subscriptionsError;

      // Step 2: Fetch profiles data separately
      const { data: profilesData, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Step 3: Manually join the data
      const subscriptionsWithProfiles = subscriptionsData.map(subscription => {
        const userProfile = profilesData.find(profile => profile.id === subscription.user_id);
        return {
          ...subscription,
          user: userProfile || null
        };
      });

      // Process data for charts
      const { timeSeriesData, planData } = processRevenueData(subscriptionsWithProfiles, timeFilter);
      setRevenueData(timeSeriesData);
      setPlanDistribution(planData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processRevenueData = (subscriptions, timeFilter) => {
    // Get current date
    const now = new Date();
    let startDate;
    let dateFormat;
    let groupBy;

    // Determine start date and format based on time filter
    switch (timeFilter) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = 'day';
        groupBy = 'day';
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        dateFormat = 'day';
        groupBy = 'day';
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        dateFormat = 'week';
        groupBy = 'week';
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        dateFormat = 'month';
        groupBy = 'month';
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        dateFormat = 'month';
        groupBy = 'month';
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        dateFormat = 'day';
        groupBy = 'day';
    }

    // Filter subscriptions by created_at date
    const filteredSubscriptions = subscriptions.filter(subscription => 
      new Date(subscription.created_at) >= startDate
    );

    // Group subscriptions by date
    const groupedData = {};
    
    // Initialize data points for all dates in the range
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      let key;
      
      if (groupBy === 'day') {
        key = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (groupBy === 'week') {
        // Get the week number
        const weekNumber = getWeekNumber(currentDate);
        key = `Week ${weekNumber}`;
      } else if (groupBy === 'month') {
        key = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          revenue: 0,
          subscriptions: 0,
          plans: {}
        };
      }
      
      // Move to next day/week/month
      if (groupBy === 'day') {
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      } else if (groupBy === 'week') {
        currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else if (groupBy === 'month') {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
      }
    }

    // Calculate revenue by date
    filteredSubscriptions.forEach(subscription => {
      const createdAt = new Date(subscription.created_at);
      let key;
      
      if (groupBy === 'day') {
        key = createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (groupBy === 'week') {
        const weekNumber = getWeekNumber(createdAt);
        key = `Week ${weekNumber}`;
      } else if (groupBy === 'month') {
        key = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      if (groupedData[key]) {
        const price = subscription.plan?.price || 0;
        const planName = subscription.plan?.name || 'Unknown';
        
        groupedData[key].revenue += price;
        groupedData[key].subscriptions += 1;
        
        // Track revenue by plan
        if (!groupedData[key].plans[planName]) {
          groupedData[key].plans[planName] = {
            count: 0,
            revenue: 0
          };
        }
        
        groupedData[key].plans[planName].count += 1;
        groupedData[key].plans[planName].revenue += price;
      }
    });

    // Calculate cumulative revenue
    let cumulativeRevenue = 0;
    const sortedKeys = Object.keys(groupedData).sort();
    
    sortedKeys.forEach(key => {
      cumulativeRevenue += groupedData[key].revenue;
      groupedData[key].cumulativeRevenue = cumulativeRevenue;
    });

    // Convert to array and format dates for display
    const timeSeriesData = sortedKeys.map(key => {
      const item = groupedData[key];
      
      // Format the date for display
      let displayDate = key;
      if (groupBy === 'day') {
        const dateParts = key.split('-');
        displayDate = `${dateParts[1]}/${dateParts[2]}`;
      } else if (groupBy === 'month') {
        const dateParts = key.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = parseInt(dateParts[1]) - 1;
        displayDate = `${monthNames[monthIndex]} ${dateParts[0]}`;
      }
      
      return {
        ...item,
        displayDate
      };
    });

    // Calculate plan distribution
    const planTotals = {};
    
    filteredSubscriptions.forEach(subscription => {
      const planName = subscription.plan?.name || 'Unknown';
      const price = subscription.plan?.price || 0;
      
      if (!planTotals[planName]) {
        planTotals[planName] = {
          name: planName,
          revenue: 0,
          count: 0
        };
      }
      
      planTotals[planName].revenue += price;
      planTotals[planName].count += 1;
    });
    
    const planData = Object.values(planTotals);

    return { timeSeriesData, planData };
  };

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const renderTimeSeriesChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-marketing-blue" />
        </div>
      );
    }

    if (revenueData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No revenue data available for the selected period</p>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0066ff" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="cumulativeRevenue" name="Cumulative Revenue" stroke="#FF6B35" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0066ff" fill="#0066ff" fillOpacity={0.3} />
              <Area type="monotone" dataKey="cumulativeRevenue" name="Cumulative Revenue" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#0066ff" />
              <Bar dataKey="subscriptions" name="Subscriptions" fill="#FF6B35" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-center font-medium mb-4">Revenue by Plan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-center font-medium mb-4">Subscriptions by Plan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              Track revenue performance over time
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderTimeSeriesChart()}
      </CardContent>
    </Card>
  );
};

export default RevenueTrendsChart;
