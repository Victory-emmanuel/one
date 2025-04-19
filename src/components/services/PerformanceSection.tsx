import { Link } from 'react-router-dom';
import { Shield, Zap, Cpu, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PerformanceSection = () => {
  return (
    <section className="section-padding bg-white dark:bg-gray-900" id="performance">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Performance & Functional Value</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Our solutions are built for reliability, ease of use, and scalability to grow with your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card-hover bg-gray-50 dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><Shield className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">Reliability & Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• 99.9% uptime with cloud hosting</li>
                  <li>• Swift response times</li>
                  <li>• 60% reduction in manual work</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gray-50 dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><Zap className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">Ease of Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• Native integrations with popular tools</li>
                  <li>• User-friendly dashboards</li>
                  <li>• Real-time analytics</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gray-50 dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><Cpu className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">Customization & Scalability</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• Modular design for flexible growth</li>
                  <li>• Data-driven insights</li>
                  <li>• Continuous experience refinement</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;