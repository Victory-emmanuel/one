import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Info, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ReportsSection = () => {
  const [clarityUrl] = useState('https://clarity.microsoft.com/projects/view/r4fihm96c5/dashboard');
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState({
    pageViews: '--',
    avgTimeOnPage: '--',
    bounceRate: '--',
    change: {
      pageViews: '0%',
      avgTimeOnPage: '0%',
      bounceRate: '0%'
    }
  });

  useEffect(() => {
    // In a real implementation, you would fetch data from Microsoft Clarity API
    // However, Microsoft Clarity doesn't provide a public API for this data
    // So we'll just simulate loading and then show empty data with a message to use the Clarity dashboard
    const simulateLoading = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    };

    simulateLoading();
  }, []);

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
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="heatmaps">Heatmaps</TabsTrigger>
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title="Page Views"
                    value={metricsData.pageViews}
                    change={metricsData.change.pageViews}
                    tooltip="Total number of page views in the last 30 days"
                  />
                  <MetricCard
                    title="Avg. Time on Page"
                    value={metricsData.avgTimeOnPage}
                    change={metricsData.change.avgTimeOnPage}
                    tooltip="Average time users spend on a page"
                  />
                  <MetricCard
                    title="Bounce Rate"
                    value={metricsData.bounceRate}
                    change={metricsData.change.bounceRate}
                    isPositive={true}
                    tooltip="Percentage of visitors who navigate away after viewing only one page"
                  />
                </div>
              )}

              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2">How to use Microsoft Clarity</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Microsoft Clarity provides heatmaps, session recordings, and insights to help you understand how users interact with your website.
                </p>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                  <li>Click the "Open Clarity" button to access your full Microsoft Clarity dashboard</li>
                  <li>View heatmaps to see where users click, scroll, and spend time on your pages</li>
                  <li>Watch session recordings to see actual user interactions</li>
                  <li>Analyze insights to identify usability issues and opportunities for improvement</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="heatmaps" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
                </div>
              ) : (
                <div className="border rounded-lg p-6 bg-gray-50 text-center">
                  <h3 className="text-lg font-medium mb-2">Heatmaps</h3>
                  <p className="text-muted-foreground mb-4">
                    Heatmaps show where users click, move their cursor, and scroll on your pages.
                  </p>
                  <Button onClick={() => window.open(`${clarityUrl}/heatmaps`, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Heatmaps in Clarity
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recordings" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
                </div>
              ) : (
                <div className="border rounded-lg p-6 bg-gray-50 text-center">
                  <h3 className="text-lg font-medium mb-2">Session Recordings</h3>
                  <p className="text-muted-foreground mb-4">
                    Watch recordings of actual user sessions to see how they interact with your website.
                  </p>
                  <Button onClick={() => window.open(`${clarityUrl}/recordings`, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Recordings in Clarity
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Data is pulled from Microsoft Clarity. For more detailed analytics, click the "Open Clarity" button.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  tooltip: string;
}

const MetricCard = ({ title, value, change, isPositive = false, tooltip }: MetricCardProps) => {
  const changeColor = change.startsWith('+')
    ? (isPositive ? 'text-green-600' : 'text-red-600')
    : (isPositive ? 'text-red-600' : 'text-green-600');

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`ml-2 text-sm font-medium ${changeColor}`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default ReportsSection;
