
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import NewsletterForm from '@/components/newsletter/NewsletterForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-marketing-dark text-white">
      <div className="container-custom py-16">
        {/* Newsletter Section */}
        <div className="mb-12 lg:mb-16 text-center">
          <h2 className="text-3xl mb-6">Join Our Newsletter</h2>
          <p className="max-w-2xl mx-auto mb-8">Stay updated with the latest marketing trends, tips, and insights delivered straight to your inbox.</p>

          {/* Newsletter Form */}
          <div className="max-w-md mx-auto">
            <NewsletterForm darkMode={true} className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl mb-4">NextGenDigi</h3>
            <p className="mb-4 text-white/80">
              A leading automation solutions provider helping businesses transform through AI-powered technologies.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-marketing-blue transition-colors" aria-label="Facebook" title="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-marketing-blue transition-colors" aria-label="Twitter" title="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-marketing-blue transition-colors" aria-label="Instagram" title="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-marketing-blue transition-colors" aria-label="LinkedIn" title="LinkedIn">
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
              <li><Link to="/services#rpa" className="hover:text-marketing-blue transition-colors">RPA Automation</Link></li>
              <li><Link to="/services#ai" className="hover:text-marketing-blue transition-colors">AI Solutions</Link></li>
              <li><Link to="/services#workflow" className="hover:text-marketing-blue transition-colors">Workflow Automation</Link></li>
              <li><Link to="/services#data" className="hover:text-marketing-blue transition-colors">Data Integration</Link></li>
              <li><Link to="/services#chatbots" className="hover:text-marketing-blue transition-colors">Chatbots</Link></li>
              <li><Link to="/services#analytics" className="hover:text-marketing-blue transition-colors">Process Analytics</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2">456 Automation Avenue</p>
              <p className="mb-2">San Francisco, CA 94105</p>
              <p className="mb-2">United States</p>
              <p className="mb-2 flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:info@nextgendigi.com" className="hover:text-marketing-blue transition-colors">
                  info@nextgendigi.com
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
