import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2, PaperclipIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SupportSection = () => {
  const { user, profile } = useAuth();
  
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments([...attachments, ...fileArray]);
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!subject || !category || !message) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload attachments and create a support ticket
      // For now, we'll just simulate a successful submission
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setSubject('');
      setCategory('');
      setMessage('');
      setAttachments([]);
      
      toast({
        title: 'Support ticket submitted',
        description: 'We\'ve received your request and will get back to you soon.',
      });
    } catch (error: any) {
      toast({
        title: 'Error submitting ticket',
        description: error.message || 'An error occurred while submitting your support ticket.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Support Ticket</CardTitle>
          <CardDescription>
            Submit a support ticket and our team will get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail"
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (Optional)</Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="attachments"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm transition-colors flex items-center"
                >
                  <PaperclipIcon className="h-4 w-4 mr-2" />
                  Add Files
                </Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleAttachmentChange}
                  className="hidden"
                />
                <span className="text-sm text-muted-foreground">
                  {attachments.length} file(s) selected
                </span>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Ticket'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Feedback & Suggestions</CardTitle>
          <CardDescription>
            We value your input! Share your thoughts on how we can improve our services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Feedback Type</Label>
              <Select>
                <SelectTrigger id="feedback-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="praise">Praise</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts with us"
                rows={4}
              />
            </div>
            
            <Button type="submit" variant="outline" className="w-full">
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">How do I change my password?</h3>
            <p className="text-sm text-muted-foreground">
              You can change your password in the Settings section of your dashboard. Click on "Settings" in the sidebar, then navigate to the "Security" tab.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">How do I upgrade my subscription?</h3>
            <p className="text-sm text-muted-foreground">
              You can upgrade your subscription in the Subscription section. Choose the plan that best fits your needs and follow the payment instructions.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">What happens when my trial ends?</h3>
            <p className="text-sm text-muted-foreground">
              When your trial ends, you'll need to choose a subscription plan to continue using our services. Don't worry, we'll send you reminders before your trial expires.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">How can I cancel my subscription?</h3>
            <p className="text-sm text-muted-foreground">
              You can cancel your subscription in the Subscription section. Please note that cancellations take effect at the end of your current billing cycle.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full">
            View All FAQs
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SupportSection;
