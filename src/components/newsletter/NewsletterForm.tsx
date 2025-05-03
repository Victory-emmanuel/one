import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscribeToNewsletter } from '@/services/newsletterService';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  className?: string;
  campaignId?: string;
  darkMode?: boolean;
}

const NewsletterForm = ({ className, campaignId, darkMode = false }: NewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await subscribeToNewsletter(
        email,
        location.pathname,
        name, // Now passing the name
        campaignId
      );

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'You have been subscribed to our newsletter.',
        });
        setEmail('');
        setName('');
      } else {
        toast({
          title: 'Subscription failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-2 w-full">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={`${darkMode ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60' : ''}`}
          disabled={loading}
        />
        <div className="flex flex-col xs:flex-row gap-2">
          <div className="flex-grow">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className={`${darkMode ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60' : ''} w-full`}
              disabled={loading}
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-marketing-orange hover:bg-orange-600 text-white whitespace-nowrap"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </div>
        <p className={`text-xs mt-2 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
          By subscribing, you agree to our Privacy Policy.
        </p>
      </div>
    </form>
  );
};

export default NewsletterForm;
