
import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="py-24 bg-marketing-dark text-white dark:bg-gray-950">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Marketing Lot
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/80 dark:text-white/70 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We're a team of digital marketing experts passionate about helping businesses grow through innovative strategies and data-driven results.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
