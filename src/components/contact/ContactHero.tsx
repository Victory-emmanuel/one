
import { motion } from "framer-motion";

const ContactHero = () => {
  return (
    <section className="py-24 bg-marketing-dark text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/80 mb-8"
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
