
import { motion } from "framer-motion";

const BlogHero = () => {
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
            Marketing Insights Blog
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Stay updated with the latest digital marketing trends, strategies, and insights.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
