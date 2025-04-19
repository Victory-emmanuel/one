
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="pt-20 pb-24 md:pt-32 md:pb-32 bg-gradient-to-br from-marketing-white via-marketing-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-left animate-fade-in-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 dark:text-white">
            Grow Your Business With <span className="text-marketing-blue dark:text-blue-400">Effective</span> Digital Marketing
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-xl">
            We help businesses <span className="highlight-text dark:text-blue-300">increase visibility</span>, drive more leads, and boost revenue through data-driven marketing strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="btn-primary text-lg">
              <Link to="/contact">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" className="border-marketing-dark text-marketing-dark text-lg dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800">
              <Link to="/services">Our Services</Link>
            </Button>
          </div>
        </div>
        <div className="relative animate-fade-in-right">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-marketing-orange/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-marketing-blue/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="relative bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl dark:shadow-gray-900/50">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" 
              alt="Digital Marketing Strategy" 
              className="w-full h-auto rounded-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-marketing-orange text-white p-4 rounded-xl shadow-lg dark:shadow-gray-900/50">
              <p className="font-bold text-xl">+143%</p>
              <p className="text-sm">Average ROI</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
