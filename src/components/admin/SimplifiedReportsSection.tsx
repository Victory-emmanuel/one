import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

/**
 * A simplified version of the ReportsSection component that only provides a link to Microsoft Clarity
 * without trying to display analytics data directly in the dashboard.
 */
const SimplifiedReportsSection = () => {
  // Hardcoded Clarity URL to avoid environment variable issues
  const clarityUrl = 'https://clarity.microsoft.com/projects/view/r4fihm96c5/dashboard';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Microsoft Clarity Analytics</CardTitle>
              <CardDescription>
                View detailed analytics about user behavior on your website
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => window.open(clarityUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Clarity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">How to use Microsoft Clarity</h3>
            <p className="text-muted-foreground mb-6">
              Microsoft Clarity provides heatmaps, session recordings, and insights to help you understand how users interact with your website.
            </p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-4 mb-6">
              <li>Click the "Open Clarity" button to access your full Microsoft Clarity dashboard</li>
              <li>View heatmaps to see where users click, scroll, and spend time on your pages</li>
              <li>Watch session recordings to see actual user interactions</li>
              <li>Analyze insights to identify usability issues and opportunities for improvement</li>
            </ol>
            <div className="flex justify-center">
              <Button onClick={() => window.open(clarityUrl, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Access Microsoft Clarity Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Microsoft Clarity analytics are available directly through the Microsoft Clarity dashboard. Click the button above to access your analytics.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SimplifiedReportsSection;
