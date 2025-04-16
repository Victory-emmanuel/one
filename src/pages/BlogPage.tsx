
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogCta from "@/components/blog/BlogCta";

const BlogPage = () => {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <BlogHero />
        <BlogGrid />
        <BlogCta />
      </motion.div>
    </Layout>
  );
};

export default BlogPage;
