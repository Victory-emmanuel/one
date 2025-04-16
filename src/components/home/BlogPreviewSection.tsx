
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  date: string;
  author: string;
  categories: string[];
}

// These are the sample posts from the provided RSS feed
const samplePosts: BlogPost[] = [
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
  // We'll add a third mock post since the feed only had two
  {
    id: 'mock3',
    title: '10 Essential Digital Marketing Strategies for 2025',
    description: 'Stay ahead of the competition with these cutting-edge digital marketing strategies that will dominate in 2025...',
    link: 'https://marketinglot-blog.medium.com/',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    date: 'April 15, 2025',
    author: 'Marketing Lot',
    categories: ['digital-marketing', 'marketing-strategy', 'future-trends'],
  }
];

const BlogPreviewSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>(samplePosts);
  
  return (
    <section className="section-padding bg-white" id="blog-preview">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Insights</h2>
          <p className="text-lg text-gray-700">
            Stay up-to-date with the latest marketing trends, tips, and strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="card-hover overflow-hidden border-none shadow-md">
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
              <CardContent>
                <CardDescription className="text-gray-600 line-clamp-3">
                  {post.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="link" className="text-marketing-blue p-0 hover:text-blue-700">
                    Read More
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="btn-primary group">
            <Link to="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
