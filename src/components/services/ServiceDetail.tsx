
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ServiceDetail = () => {
   return (
    <section className="py-20 bg-white dark:bg-gray-800" id="service-detail">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
              Comprehensive SEO Strategy
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Our data-driven approach to SEO delivers sustainable results that grow your business. We focus on all aspects of search engine optimization to improve your rankings and drive qualified traffic.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-marketing-blue mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-1 dark:text-white">Technical SEO Audit</h3>
                  <p className="text-gray-700 dark:text-gray-300">Comprehensive analysis of your website's structure, performance, and search visibility.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-marketing-blue mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-1 dark:text-white">Keyword Research & Strategy</h3>
                  <p className="text-gray-700 dark:text-gray-300">Identifying high-value keywords that your target audience is searching for.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-marketing-blue mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-1 dark:text-white">On-Page Optimization</h3>
                  <p className="text-gray-700 dark:text-gray-300">Optimizing content, meta tags, and site structure to improve search relevance.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-marketing-blue mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-1 dark:text-white">Link Building</h3>
                  <p className="text-gray-700 dark:text-gray-300">Acquiring high-quality backlinks from reputable sources to boost authority.</p>
                </div>
              </div>
            </div>
            
            <Button asChild className="btn-primary">
              <Link to="/contact">Request an SEO Audit</Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative bg-white dark:bg-gray-700 p-5 rounded-2xl shadow-xl dark:shadow-gray-900/30">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-marketing-orange/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-marketing-blue/10 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1571956631108-d0457fd33dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNlbyUyMGRhc2hib2FyZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
                alt="SEO Strategy Dashboard" 
                className="w-full h-auto rounded-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-marketing-blue text-white p-4 rounded-xl shadow-lg">
                <p className="font-bold text-xl">+89%</p>
                <p className="text-sm">Organic Traffic Increase</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetail;
