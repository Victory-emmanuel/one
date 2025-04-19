
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BLOG_TAGS } from '@/types/blog';


// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const BlogGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Add a key to force re-render of the grid
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blog posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // For public users, we only want to show published posts
        // The RLS policy will handle this, but we'll add the filter here as well for clarity
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error: any) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term and selected tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === null || post.tag === selectedTag;

    return matchesSearch && matchesTag;
  });

  // Clear search and force a re-render of the grid
  const clearSearch = () => {
    setSearchTerm('');
    // Increment key to force a complete re-render of the grid
    setKey(prevKey => prevKey + 1);
  };

  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setKey(prevKey => prevKey + 1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
    setKey(prevKey => prevKey + 1);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold">Blog Articles</h2>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // If the search field is cleared manually, also reset the grid
                  if (e.target.value === '') {
                    setKey(prevKey => prevKey + 1);
                  }
                }}
                onKeyDown={(e) => e.key === 'Escape' && clearSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marketing-blue"
                aria-label="Search articles by title"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tag filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {BLOG_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedTag === tag
                    ? "bg-marketing-blue hover:bg-marketing-blue/90 dark:bg-blue-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
            {(selectedTag || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-sm"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-marketing-blue dark:text-blue-400" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <motion.div
            key={key} // Add key to force complete re-render when search is cleared
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }} // Change to false to allow re-animation
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={item}>
                <Card className="card-hover overflow-hidden border-none shadow-md h-full flex flex-col dark:bg-gray-800">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{post.tag}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 dark:text-white">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {post.excerpt}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <a href={post.medium_link} target="_blank" rel="noopener noreferrer">
                      <Button variant="link" className="text-marketing-blue dark:text-blue-400 p-0 hover:text-blue-700 dark:hover:text-blue-300">
                        Read More
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
