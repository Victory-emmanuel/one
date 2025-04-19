
import { motion } from "framer-motion";

const ContactMap = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-custom px-4 sm:px-6">
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Location
        </motion.h2>
        
        <motion.div 
          className="h-[300px] sm:h-[350px] md:h-[400px] w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1650000000000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Marketing Lot Office Location"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMap;
