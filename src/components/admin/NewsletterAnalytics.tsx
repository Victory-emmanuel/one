import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Mail, 
  Users, 
  Download, 
  TrendingUp, 
  BarChart, 
  Calendar,
  Loader2
} from 'lucide-react';
import { 
  getNewsletterStats, 
  downloadSubscribersCSV, 
  getAllSubscribers,
  type NewsletterSubscriber,
  type SubscriptionStats
} from '@/services/newsletterService';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const NewsletterAnalytics = () => {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  
  // ConvertKit dashboard URL
  const convertKitDashboardUrl = 'https://app.convertkit.com/dashboard';
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await getNewsletterStats();
        const subscribersData = await getAllSubscribers();
        
        setStats(statsData);
        setSubscribers(subscribersData);
      } catch (error) {
        console.error('Error fetching newsletter data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load newsletter analytics.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const success = await downloadSubscribersCSV();
      if (success) {
        toast({
          title: 'Success',
          description: 'Subscribers exported to CSV successfully.',
        });
      } else {
        throw new Error('Failed to export subscribers');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export subscribers to CSV.',
        variant: 'destructive',
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
        <span className="ml-2">Loading newsletter analytics...</span>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Newsletter Analytics</CardTitle>
              <CardDescription>
                Track your newsletter performance and subscriber growth
              </CardDescription>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <Button variant="outline" onClick={handleExportCSV} disabled={exportLoading}>
                {exportLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => window.open(convertKitDashboardUrl, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                ConvertKit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-4">
              {/* Total Subscribers */}
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-marketing-blue" />
                    Total Subscribers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.lastMonthSubscribers || 0} new this month
                  </p>
                </CardContent>
              </Card>
              
              {/* Growth Rate */}
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-marketing-blue" />
                    Growth Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{stats?.growthRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    Compared to last month
                  </p>
                </CardContent>
              </Card>
              
              {/* Conversion Rate */}
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <BarChart className="h-4 w-4 mr-2 text-marketing-blue" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    Of visitors subscribe
                  </p>
                </CardContent>
              </Card>
              
              {/* Top Source */}
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-marketing-blue" />
                    Top Source
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold truncate">
                    {stats?.topSources && stats.topSources.length > 0 
                      ? stats.topSources[0].source 
                      : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.topSources && stats.topSources.length > 0 
                      ? `${stats.topSources[0].count} subscribers` 
                      : 'No data available'}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabs for detailed analytics */}
            <Tabs defaultValue="growth" className="space-y-4">
              <TabsList>
                <TabsTrigger value="growth">Subscriber Growth</TabsTrigger>
                <TabsTrigger value="sources">Top Sources</TabsTrigger>
                <TabsTrigger value="subscribers">Recent Subscribers</TabsTrigger>
              </TabsList>
              
              {/* Subscriber Growth Tab */}
              <TabsContent value="growth" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscriber Growth</CardTitle>
                    <CardDescription>
                      New subscribers over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {stats?.subscribersByDate && stats.subscribersByDate.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={stats.subscribersByDate}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => {
                                const d = new Date(date);
                                return `${d.getMonth() + 1}/${d.getDate()}`;
                              }}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${value} subscribers`, 'Count']}
                              labelFormatter={(date) => {
                                const d = new Date(date);
                                return d.toLocaleDateString();
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="count" 
                              stroke="#3b82f6" 
                              activeDot={{ r: 8 }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No subscriber data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Top Sources Tab */}
              <TabsContent value="sources" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Sources</CardTitle>
                    <CardDescription>
                      Where your subscribers are coming from
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Bar Chart */}
                      <div className="h-80">
                        {stats?.topSources && stats.topSources.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                              data={stats.topSources}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="source" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#3b82f6" />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No source data available</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Pie Chart */}
                      <div className="h-80">
                        {stats?.topSources && stats.topSources.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.topSources}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {stats.topSources.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name, props) => [`${value} subscribers`, props.payload.source]} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No source data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Recent Subscribers Tab */}
              <TabsContent value="subscribers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Subscribers</CardTitle>
                    <CardDescription>
                      Latest subscribers to your newsletter
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption>A list of your recent newsletter subscribers.</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Source</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribers && subscribers.length > 0 ? (
                            subscribers.slice(0, 10).map((subscriber) => (
                              <TableRow key={subscriber.id}>
                                <TableCell className="font-medium">{subscriber.email}</TableCell>
                                <TableCell>{subscriber.name || 'N/A'}</TableCell>
                                <TableCell>
                                  {new Date(subscriber.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{subscriber.source_page}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No subscribers found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={handleExportCSV} disabled={exportLoading}>
                      {exportLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export All to CSV
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            <p>
              For more detailed analytics, export the data to CSV for manual import to ConvertKit or click the ConvertKit button above.
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NewsletterAnalytics;
