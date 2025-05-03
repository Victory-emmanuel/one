import AdminLayout from '@/components/admin/AdminLayout';
import NewsletterAnalytics from '@/components/admin/NewsletterAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmailAnalyticsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email & Campaign Analytics</h2>
          <p className="text-muted-foreground">
            Track your email marketing performance
          </p>
        </div>

        <Tabs defaultValue="newsletter" className="space-y-4">
          <TabsList>
            <TabsTrigger value="newsletter">Newsletter Analytics</TabsTrigger>
            <TabsTrigger value="convertkit">ConvertKit</TabsTrigger>
          </TabsList>

          <TabsContent value="newsletter" className="space-y-4">
            <NewsletterAnalytics />
          </TabsContent>

          <TabsContent value="convertkit" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-4">ConvertKit Integration</h3>
              <p className="mb-4">For more advanced email marketing features and in-depth analytics, you can use ConvertKit.</p>
              <p className="mb-4">Export your subscribers from the Newsletter Analytics tab and import them into ConvertKit.</p>
              <a
                href="https://app.convertkit.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-marketing-blue text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Open ConvertKit Dashboard
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default EmailAnalyticsPage;
