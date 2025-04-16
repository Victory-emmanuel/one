import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Mail, Users, BarChart, Send, Eye, MousePointer, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const EmailAnalyticsSection = () => {
  const [loading, setLoading] = useState(true);
  const [convertKitData, setConvertKitData] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    openRate: 0,
    clickRate: 0,
    campaigns: []
  });
  
  // ConvertKit API keys from README.md
  const convertKitApiKey = 'kit_c9aa47d07566ee1eccecdd2635edadc7'; // V4 API Key
  const convertKitApiSecret = 'jUPLhcwhDM_IL3ZHtFTexXbdJauDd3x62MBCy0EPCG8';
  
  useEffect(() => {
    // In a real app, you would fetch data from the ConvertKit API
    // For now, we'll just simulate fetching data
    const fetchConvertKitData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate ConvertKit data
        setConvertKitData({
          totalSubscribers: 1245,
          activeSubscribers: 1187,
          openRate: 42.8,
          clickRate: 12.3,
          campaigns: [
            {
              id: 'c1',
              name: 'April Newsletter',
              status: 'sent',
              recipients: 1187,
              opens: 512,
              clicks: 143,
              date: '2023-04-10'
            },
            {
              id: 'c2',
              name: 'New Feature Announcement',
              status: 'sent',
              recipients: 1165,
              opens: 498,
              clicks: 187,
              date: '2023-03-25'
            },
            {
              id: 'c3',
              name: 'March Newsletter',
              status: 'sent',
              recipients: 1132,
              opens: 476,
              clicks: 128,
              date: '2023-03-12'
            },
            {
              id: 'c4',
              name: 'Special Promotion',
              status: 'sent',
              recipients: 1098,
              opens: 587,
              clicks: 245,
              date: '2023-02-28'
            },
            {
              id: 'c5',
              name: 'Welcome Sequence - Email 1',
              status: 'automated',
              recipients: 324,
              opens: 298,
              clicks: 156,
              date: 'Automated'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching ConvertKit data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not fetch ConvertKit analytics data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConvertKitData();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500">Sent</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'automated':
        return <Badge className="bg-purple-500">Automated</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
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
              <CardTitle>Email & Campaign Analytics</CardTitle>
              <CardDescription>
                Track your email marketing performance with ConvertKit
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => window.open('https://app.convertkit.com/dashboard', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open ConvertKit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marketing-blue"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Subscribers Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Subscribers
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {convertKitData.totalSubscribers.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {convertKitData.activeSubscribers.toLocaleString()} active subscribers
                    </p>
                  </CardContent>
                </Card>
                
                {/* Open Rate Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Open Rate
                    </CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {convertKitData.openRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Industry average: 37.2%
                    </p>
                  </CardContent>
                </Card>
                
                {/* Click Rate Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Click Rate
                    </CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {convertKitData.clickRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Industry average: 8.7%
                    </p>
                  </CardContent>
                </Card>
                
                {/* Campaigns Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Campaigns
                    </CardTitle>
                    <Send className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {convertKitData.campaigns.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Campaign Data */}
              <Tabs defaultValue="campaigns" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                  <TabsTrigger value="forms">Forms & Landing Pages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="campaigns" className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Campaign</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Recipients</TableHead>
                          <TableHead>Opens</TableHead>
                          <TableHead>Clicks</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {convertKitData.campaigns.map((campaign) => (
                          <TableRow key={campaign.id}>
                            <TableCell>
                              <div className="font-medium">{campaign.name}</div>
                            </TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                            <TableCell>
                              {campaign.opens.toLocaleString()} ({Math.round((campaign.opens / campaign.recipients) * 100)}%)
                            </TableCell>
                            <TableCell>
                              {campaign.clicks.toLocaleString()} ({Math.round((campaign.clicks / campaign.recipients) * 100)}%)
                            </TableCell>
                            <TableCell>{campaign.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="subscribers" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscriber Growth</CardTitle>
                      <CardDescription>
                        Track your subscriber growth over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">Subscriber growth chart will be displayed here</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="forms" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Forms & Landing Pages</CardTitle>
                      <CardDescription>
                        Track the performance of your forms and landing pages
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">Forms and landing pages data will be displayed here</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Data is pulled from ConvertKit. For more detailed analytics, click the "Open ConvertKit" button.
            </p>
            <p className="mt-1">
              API Key: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{convertKitApiKey.substring(0, 8)}...</code>
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EmailAnalyticsSection;
