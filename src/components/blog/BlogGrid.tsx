
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Mock blog posts data (in a real app, this would come from an API or RSS feed)
const allPosts = [
  {
    id: '2b154c038ff3',
    title: 'What Is Affiliate Marketing and How to Make Money with It',
    description: 'Affiliate marketing is one way to ensure the money is coming in even while you\'re away from your computer...',
    link: 'https://marketinglot-blog.medium.com/what-is-affiliate-marketing-and-how-to-make-money-with-it-2b154c038ff3',
    image: 'https://cdn-images-1.medium.com/max/1024/1*pvKwTqQLSqjeYq9ECXDVmg.png',
    date: 'June 23, 2022',
    author: 'Marketing Lot',
    categories: ['affiliate-marketing', 'digital-marketing', 'email-marketing-lists'],
  },
  {
    id: '4cd8790959a',
    title: 'The Ultimate Guide to CPA Marketing: Step by Step on Getting Started',
    description: 'How to make money with CPA Marketing? If you\'re wondering how to become successful at CPA marketing, you\'ve come to the right place...',
    link: 'https://marketinglot-blog.medium.com/the-ultimate-guide-to-cpa-marketing-how-to-make-money-and-get-more-leads-4cd8790959a',
    image: 'https://cdn-images-1.medium.com/max/1024/0*a1s7e3HL1IQmWgSX',
    date: 'June 11, 2022',
    author: 'Marketing Lot',
    categories: ['cpa-marketing', 'marketing', 'marketing-tips'],
  },
  // Additional mock posts to fill out the blog grid
  {
    id: 'mock3',
    title: '10 Essential Digital Marketing Strategies for 2025',
    description: 'Stay ahead of the competition with these cutting-edge digital marketing strategies that will dominate in 2025...',
    link: 'https://marketinglot-blog.medium.com/',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    date: 'April 15, 2025',
    author: 'Marketing Lot',
    categories: ['digital-marketing', 'marketing-strategy', 'future-trends'],
  },
  {
    id: 'mock4',
    title: 'How to Build a Successful Social Media Marketing Strategy',
    description: 'Learn how to create a social media marketing strategy that boosts engagement, drives traffic, and increases conversions...',
    link: 'https://marketinglot-blog.medium.com/',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80',
    date: 'April 10, 2025',
    author: 'Marketing Lot',
    categories: ['social-media', 'marketing-strategy', 'engagement'],
  },
  {
    id: 'mock5',
    title: 'Email Marketing Best Practices That Drive Results',
    description: 'Discover the proven email marketing techniques that will help you improve open rates, click-through rates, and conversions...',
    link: 'https://marketinglot-blog.medium.com/',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80',
    date: 'April 5, 2025',
    author: 'Marketing Lot',
    categories: ['email-marketing', 'conversions', 'marketing-automation'],
  },
  {
    id: 'mock6',
    title: 'Content Marketing ROI: How to Measure and Maximize Your Results',
    description: 'Learn how to track and improve the ROI of your content marketing efforts with these proven strategies and metrics...',
    link: 'https://marketinglot-blog.medium.com/',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80',
    date: 'March 30, 2025',
    author: 'Marketing Lot',
    categories: ['content-marketing', 'roi', 'analytics'],
  }
];

// Extract unique categories from all posts
const allCategories = [...new Set(allPosts.flatMap(post => post.categories))];

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(allPosts);

  // Filter posts when search term or category changes
  useEffect(() => {
    const filtered = allPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || post.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-marketing-blue"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <div className="w-full md:w-auto">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-marketing-blue"
              >
                <option value="">All Categories</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category.replace(/-/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredPosts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={item}>
                <Card className="card-hover overflow-hidden border-none shadow-md h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                      <span>{post.date}</span>
                      <span>{post.author}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-gray-600 line-clamp-3 mb-4">
                      {post.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.categories.map(category => (
                        <span 
                          key={category} 
                          className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full cursor-pointer hover:bg-marketing-blue hover:text-white transition-colors"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="link" className="text-marketing-blue p-0 hover:text-blue-700">
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
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
