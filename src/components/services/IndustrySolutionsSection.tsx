import { Link } from 'react-router-dom';
import { Hotel, Plane, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const IndustrySolutionsSection = () => {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900" id="industry-solutions">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Target Industry Solutions</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Specialized digital solutions tailored to your industry's unique needs and challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card-hover bg-white dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><Hotel className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">Hotels & Resorts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• Automated booking & reservations</li>
                  <li>• 24/7 guest engagement with AI chatbots</li>
                  <li>• Digital showcasing with virtual tours</li>
                </ul>
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-marketing-blue p-0 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card className="card-hover bg-white dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><Plane className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">Travel Agencies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• Streamlined tour & itinerary scheduling</li>
                  <li>• Instant customer service with AI chatbots</li>
                  <li>• Social media & content integration</li>
                </ul>
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-marketing-blue p-0 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card className="card-hover bg-white dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
            <CardHeader>
              <div className="mb-4"><Home className="h-10 w-10 text-marketing-blue" /></div>
              <CardTitle className="text-xl dark:text-white">Real Estate</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                <ul className="space-y-2">
                  <li>• Efficient property viewing scheduling</li>
                  <li>• Instant property inquiries with AI chatbots</li>
                  <li>• Enhanced visual & content presentation</li>
                </ul>
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-marketing-blue p-0 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IndustrySolutionsSection;