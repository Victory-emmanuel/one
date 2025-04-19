
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Contact Information</h2>
      
      <div className="space-y-5">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-marketing-blue mt-1 flex-shrink-0" />
          <div className="ml-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Address</h4>
            <p className="text-gray-600 dark:text-gray-400">
              123 Marketing Street<br />
              Suite 456<br />
              New York, NY 10001
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-marketing-blue mt-1 flex-shrink-0" />
          <div className="ml-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Phone</h4>
            <p className="text-gray-600 dark:text-gray-400">
              <a href="tel:+1234567890" className="hover:text-marketing-blue dark:hover:text-marketing-blue/80">+1 (234) 567-890</a>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-marketing-blue mt-1 flex-shrink-0" />
          <div className="ml-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Email</h4>
            <p className="text-gray-600 dark:text-gray-400">
              <a href="mailto:hello@marketinglot.com" className="hover:text-marketing-blue dark:hover:text-marketing-blue/80">hello@marketinglot.com</a>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-marketing-blue mt-1 flex-shrink-0" />
          <div className="ml-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Business Hours</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday - Sunday: Closed
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Follow Us</h4>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-marketing-blue dark:hover:text-marketing-blue/80 transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-marketing-blue dark:hover:text-marketing-blue/80 transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-marketing-blue dark:hover:text-marketing-blue/80 transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-marketing-blue dark:hover:text-marketing-blue/80 transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
