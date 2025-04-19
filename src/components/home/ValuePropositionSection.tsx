import { Link } from 'react-router-dom';
import { Zap, Cpu, Mail, Share2, Search, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ValuePropositionSection = () => {
  return (
    <section className="section-padding bg-white dark:bg-gray-900" id="value-proposition">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">NextGenDigi Value Proposition</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Cutting-edge digital solutions powered by AI to transform your business operations and customer engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card-hover bg-gray-50 dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><Zap className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">AI-Powered Website Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• Fully automated website creation and customization</li>
                  <li>• Automated booking/scheduling and chatbot support</li>
                  <li>• Integration with third-party tools (CRM, analytics)</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gray-50 dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><Cpu className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">Digital Marketing Suite</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• SEO marketing tools for optimization</li>
                  <li>• Email marketing automation</li>
                  <li>• Social media management integrations</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gray-50 dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><BarChart3 className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">End-to-End Digital Presence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• Comprehensive website and marketing solution</li>
                  <li>• Streamlined integration across channels</li>
                  <li>• Complete customer engagement system</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button asChild className="btn-primary">
            <Link to="/services">Explore Our Solutions</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;