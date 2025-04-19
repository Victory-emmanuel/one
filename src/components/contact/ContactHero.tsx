
import { motion } from "framer-motion";

const ContactHero = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-marketing-dark dark:bg-gray-950 text-white">
      <div className="container-custom px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-white/80 dark:text-white/70 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have a project in mind or questions about our services? 
            We'd love to hear from you and discuss how we can help your business grow.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
