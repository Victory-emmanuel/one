
import { motion } from "framer-motion";
import { Search, BarChart3, Share2, Mail, Edit3, PieChart, Zap, Award, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: 'seo',
    title: 'SEO Optimization',
    description: 'Improve your search engine rankings and drive organic traffic to your website through keyword research, on-page optimization, and link building strategies.',
    icon: <Search className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    description: 'Gain insights into your marketing performance with comprehensive analytics dashboards, custom reports, and data-driven recommendations.',
    icon: <BarChart3 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'social-media',
    title: 'Social Media Marketing',
    description: 'Engage your audience and build brand awareness through strategic social media campaigns, content creation, and community management.',
    icon: <Share2 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'email',
    title: 'Email Marketing',
    description: 'Nurture leads and drive conversions with targeted email campaigns, automated workflows, and personalized messaging strategies.',
    icon: <Mail className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'content',
    title: 'Content Marketing',
    description: 'Create valuable content that attracts and retains your target audience through blog posts, videos, infographics, and other formats.',
    icon: <Edit3 className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'ppc',
    title: 'PPC Campaigns',
    description: 'Drive immediate traffic and conversions with paid advertising campaigns across Google, social media platforms, and display networks.',
    icon: <PieChart className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'conversion',
    title: 'Conversion Rate Optimization',
    description: "Improve your website's conversion rates through A/B testing, user experience enhancements, and strategic call-to-action placement.",
    icon: <Zap className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'branding',
    title: 'Brand Strategy',
    description: 'Develop a compelling brand identity and messaging that resonates with your target audience and differentiates you from competitors.',
    icon: <Award className="h-10 w-10 text-marketing-blue" />,
  },
  {
    id: 'digital-strategy',
    title: 'Digital Strategy',
    description: 'Create comprehensive digital marketing strategies tailored to your business goals, target audience, and competitive landscape.',
    icon: <Target className="h-10 w-10 text-marketing-blue" />,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ServicesGrid = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900" id="services-grid">
      <div className="container-custom">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={item}>
              <Card className="h-full card-hover bg-white dark:bg-gray-800 border-none shadow-md dark:shadow-gray-900/30">
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
                  <Button variant="link" className="text-marketing-blue p-0 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrid;
