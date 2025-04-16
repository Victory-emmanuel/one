
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogCta = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-gray-50 to-blue-50 p-10 rounded-xl shadow-md"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-700 mb-6">
            Get the latest marketing insights, strategies, and tips delivered directly to your inbox.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-marketing-blue"
              />
              <Button className="bg-marketing-blue hover:bg-blue-700 text-white py-3 px-6">
                Subscribe <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive marketing communications.
            </p>
          </div>
          
          <div id="convertkit-newsletter-form" className="mt-8">
            {/* ConvertKit form will be injected here by the Layout component */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogCta;
