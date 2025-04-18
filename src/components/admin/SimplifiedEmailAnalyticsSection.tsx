import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Mail, Users, FormInput } from 'lucide-react';

/**
 * A simplified version of the EmailAnalyticsSection component that only provides links to ConvertKit
 * without trying to display analytics data directly in the dashboard.
 */
const SimplifiedEmailAnalyticsSection = () => {
  // ConvertKit dashboard URLs
  const convertKitDashboardUrl = 'https://app.convertkit.com/dashboard';
  const convertKitCampaignsUrl = 'https://app.convertkit.com/broadcasts';
  const convertKitSubscribersUrl = 'https://app.convertkit.com/subscribers';
  const convertKitFormsUrl = 'https://app.convertkit.com/forms';

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
            <Button variant="outline" onClick={() => window.open(convertKitDashboardUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open ConvertKit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
              <Button size="lg" onClick={() => window.open(convertKitDashboardUrl, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open ConvertKit Dashboard
              </Button>
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
                  <Button onClick={() => window.open(convertKitCampaignsUrl, '_blank')}>
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
                  <Button onClick={() => window.open(convertKitSubscribersUrl, '_blank')}>
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
                  <Button onClick={() => window.open(convertKitFormsUrl, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Forms in ConvertKit
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            <p>
              ConvertKit analytics are available directly through the ConvertKit dashboard. Click the button above to access your analytics.
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SimplifiedEmailAnalyticsSection;
