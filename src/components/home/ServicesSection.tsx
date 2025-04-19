
import { Link } from 'react-router-dom';
import { Search, BarChart3, Share2, Mail, Edit3, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 'rpa',
    title: 'RPA Automation',
    description: 'Automate repetitive tasks with robotic process automation to boost efficiency.',
    icon: <Search className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'ai',
    title: 'AI Solutions',
    description: 'Implement artificial intelligence to transform business processes.',
    icon: <BarChart3 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'workflow',
    title: 'Workflow Automation',
    description: 'Streamline business processes with intelligent workflow automation.',
    icon: <Share2 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'data',
    title: 'Data Integration',
    description: 'Connect disparate systems and automate data flows across your organization.',
    icon: <Mail className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'chatbots',
    title: 'Chatbots',
    description: 'Deploy AI-powered chatbots to enhance customer service and support.',
    icon: <Edit3 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'analytics',
    title: 'Process Analytics',
    description: 'Gain insights into automation performance and identify optimization opportunities.',
    icon: <PieChart className="h-10 w-10 text-marketing-blue" />,
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900" id="services">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Our Automation Solutions</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            NextGenDigi provides cutting-edge automation services to transform your business operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={service.id} className="card-hover bg-white dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
              <CardHeader>
                <div className="mb-4">{service.icon}</div>
                <CardTitle className="text-xl dark:text-white">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link to={`/services#${service.id}`}>
                  <Button variant="link" className="text-marketing-blue p-0 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="btn-primary">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
