
import { Link } from 'react-router-dom';
import { Search, BarChart3, Share2, Mail, Edit3, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 'seo',
    title: 'SEO Optimization',
    description: 'Improve your search engine rankings and drive organic traffic to your website.',
    icon: <Search className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    description: 'Gain insights into your marketing performance with comprehensive analytics.',
    icon: <BarChart3 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description: 'Engage your audience and build brand awareness through social media marketing.',
    icon: <Share2 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'email',
    title: 'Email Marketing',
    description: 'Nurture leads and drive conversions with targeted email campaigns.',
    icon: <Mail className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'content',
    title: 'Content Marketing',
    description: 'Create valuable content that attracts and retains your target audience.',
    icon: <Edit3 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'ppc',
    title: 'PPC Campaigns',
    description: 'Drive immediate traffic and conversions with paid advertising campaigns.',
    icon: <PieChart className="h-10 w-10 text-marketing-blue" />,
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900" id="services">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Our Services</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            We offer a comprehensive range of digital marketing services to help your business grow and succeed online.
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
