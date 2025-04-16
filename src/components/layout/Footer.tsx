
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-marketing-dark text-white">
      <div className="container-custom py-16">
        {/* Newsletter Section */}
        <div className="mb-12 lg:mb-16 text-center">
          <h2 className="text-3xl mb-6">Join Our Newsletter</h2>
          <p className="max-w-2xl mx-auto mb-8">Stay updated with the latest marketing trends, tips, and insights delivered straight to your inbox.</p>
          
          {/* ConvertKit Embedded Form */}
          <div id="convertkit-newsletter-form" className="max-w-md mx-auto">
            {/* This div will be replaced by the ConvertKit form script */}
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-marketing-orange hover:bg-orange-600 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-xs mt-2 text-white/60">By subscribing, you agree to our Privacy Policy.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl mb-4">Marketing Lot</h3>
            <p className="mb-4 text-white/80">
              A full-service digital marketing agency helping businesses grow through innovative strategies and solutions.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-marketing-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-marketing-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-marketing-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-marketing-blue transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-marketing-blue transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-marketing-blue transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-marketing-blue transition-colors">About Us</Link></li>
              <li><Link to="/pricing" className="hover:text-marketing-blue transition-colors">Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-marketing-blue transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-marketing-blue transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services#seo" className="hover:text-marketing-blue transition-colors">SEO Optimization</Link></li>
              <li><Link to="/services#social-media" className="hover:text-marketing-blue transition-colors">Social Media Management</Link></li>
              <li><Link to="/services#ppc" className="hover:text-marketing-blue transition-colors">PPC Campaigns</Link></li>
              <li><Link to="/services#content" className="hover:text-marketing-blue transition-colors">Content Marketing</Link></li>
              <li><Link to="/services#email" className="hover:text-marketing-blue transition-colors">Email Marketing</Link></li>
              <li><Link to="/services#analytics" className="hover:text-marketing-blue transition-colors">Analytics & Reporting</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2">123 Marketing Street</p>
              <p className="mb-2">New York, NY 10001</p>
              <p className="mb-2">United States</p>
              <p className="mb-2 flex items-center">
                <Mail size={16} className="mr-2" /> 
                <a href="mailto:info@marketinglot.com" className="hover:text-marketing-blue transition-colors">
                  info@marketinglot.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-white/60">
          <p>&copy; {currentYear} Marketing Lot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
