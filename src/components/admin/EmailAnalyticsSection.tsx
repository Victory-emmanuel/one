import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Mail, Users, BarChart, Send, Eye, MousePointer, Calendar, Loader2, FormInput } from 'lucide-react';
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

  // ConvertKit API keys from environment variables
  const convertKitApiKey = import.meta.env.VITE_CONVERTKIT_V4_API_KEY;
  const convertKitApiSecret = import.meta.env.VITE_CONVERTKIT_API_SECRET;

  useEffect(() => {
    const fetchConvertKitData = async () => {
      try {
        setLoading(true);

        // Note: In a production environment, API calls should be made from a backend service
        // to protect your API keys. This is just for demonstration purposes.

        // For now, we'll just provide a link to the ConvertKit dashboard
        // since we can't make direct API calls from the frontend without exposing the API key

        // Set empty data with a message to use the dashboard link
        setConvertKitData({
          totalSubscribers: 0,
          activeSubscribers: 0,
          openRate: 0,
          clickRate: 0,
          campaigns: []
        });

        toast({
          title: 'ConvertKit Integration',
          description: 'Please use the "Open ConvertKit" button to view your analytics data.',
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
              <Loader2 className="h-12 w-12 animate-spin text-marketing-blue" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="mb-6">
                  <Mail className="h-16 w-16 mx-auto text-marketing-blue opacity-50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">ConvertKit Analytics</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    For security reasons, we can't display ConvertKit analytics directly in the dashboard.
                    Please use the button below to access your ConvertKit dashboard.
                  </p>
                </div>
                <Button size="lg" onClick={() => window.open('https://app.convertkit.com/dashboard', '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open ConvertKit Dashboard
                </Button>
              </div>

              {/* Empty Stats Cards */}
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
                    <div className="text-2xl font-bold text-muted-foreground">
                      --
                    </div>
                    <p className="text-xs text-muted-foreground">
                      View in ConvertKit
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
                    <div className="text-2xl font-bold text-muted-foreground">
                      --
                    </div>
                    <p className="text-xs text-muted-foreground">
                      View in ConvertKit
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
                    <div className="text-2xl font-bold text-muted-foreground">
                      --
                    </div>
                    <p className="text-xs text-muted-foreground">
                      View in ConvertKit
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
                    <div className="text-2xl font-bold text-muted-foreground">
                      --
                    </div>
                    <p className="text-xs text-muted-foreground">
                      View in ConvertKit
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
                  <div className="text-center py-8 bg-gray-50 rounded-lg border">
                    <Mail className="h-12 w-12 mx-auto text-marketing-blue opacity-50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Campaign Data</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      View your campaign data directly in ConvertKit.
                    </p>
                    <Button onClick={() => window.open('https://app.convertkit.com/broadcasts', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Campaigns in ConvertKit
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="subscribers" className="space-y-4">
                  <div className="text-center py-8 bg-gray-50 rounded-lg border">
                    <Users className="h-12 w-12 mx-auto text-marketing-blue opacity-50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Subscriber Data</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      View your subscriber data directly in ConvertKit.
                    </p>
                    <Button onClick={() => window.open('https://app.convertkit.com/subscribers', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Subscribers in ConvertKit
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="forms" className="space-y-4">
                  <div className="text-center py-8 bg-gray-50 rounded-lg border">
                    <FormInput className="h-12 w-12 mx-auto text-marketing-blue opacity-50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Forms & Landing Pages</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      View your forms and landing pages directly in ConvertKit.
                    </p>
                    <Button onClick={() => window.open('https://app.convertkit.com/forms', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Forms in ConvertKit
                    </Button>
                  </div>
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
