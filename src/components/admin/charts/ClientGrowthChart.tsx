import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';

const ClientGrowthChart = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [chartType, setChartType] = useState('line');
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<any[]>([]);

  useEffect(() => {
    fetchClientData();
  }, [timeFilter]);

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles data
      const { data: profilesData, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Process data for chart
      const processedData = processClientData(profilesData, timeFilter);
      setClientData(processedData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processClientData = (profiles, timeFilter) => {
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

    // Filter profiles by created_at date
    const filteredProfiles = profiles.filter(profile => 
      new Date(profile.created_at) >= startDate
    );

    // Group profiles by date
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
          newClients: 0,
          totalClients: 0
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

    // Count new clients by date
    filteredProfiles.forEach(profile => {
      const createdAt = new Date(profile.created_at);
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
        groupedData[key].newClients += 1;
      }
    });

    // Calculate cumulative total
    let runningTotal = 0;
    const sortedKeys = Object.keys(groupedData).sort();
    
    sortedKeys.forEach(key => {
      runningTotal += groupedData[key].newClients;
      groupedData[key].totalClients = runningTotal;
    });

    // Convert to array and format dates for display
    return sortedKeys.map(key => {
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
  };

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-marketing-blue" />
        </div>
      );
    }

    if (clientData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No client data available for the selected period</p>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={clientData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newClients" name="New Clients" stroke="#0066ff" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="totalClients" name="Total Clients" stroke="#FF6B35" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={clientData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="newClients" name="New Clients" stroke="#0066ff" fill="#0066ff" fillOpacity={0.3} />
              <Area type="monotone" dataKey="totalClients" name="Total Clients" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={clientData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newClients" name="New Clients" fill="#0066ff" />
              <Bar dataKey="totalClients" name="Total Clients" fill="#FF6B35" />
            </BarChart>
          </ResponsiveContainer>
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
            <CardTitle>Client Growth</CardTitle>
            <CardDescription>
              Track client acquisition and growth over time
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ClientGrowthChart;
