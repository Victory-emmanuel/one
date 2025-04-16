import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { Loader2, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

const FeedbackSection = () => {
  const { user } = useAuth();
  
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [satisfaction, setSatisfaction] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackType || !feedbackText) {
      toast({
        title: 'Missing information',
        description: 'Please select a feedback type and enter your feedback.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this feedback to your backend
      // For now, we'll just simulate a successful submission
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFeedbackType('');
      setFeedbackText('');
      setSatisfaction('');
      setRating(null);
      
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback! We appreciate your input.',
      });
    } catch (error: any) {
      toast({
        title: 'Error submitting feedback',
        description: error.message || 'An error occurred while submitting your feedback.',
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
          <CardTitle>Share Your Feedback</CardTitle>
          <CardDescription>
            We value your input! Help us improve our services by sharing your thoughts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Feedback Type</Label>
              <Select value={feedbackType} onValueChange={setFeedbackType} required>
                <SelectTrigger id="feedback-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="praise">Praise</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback-text">Your Feedback</Label>
              <Textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts, ideas, or concerns with us"
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Overall Satisfaction</Label>
              <RadioGroup value={satisfaction} onValueChange={setSatisfaction} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="satisfied" id="satisfied" />
                  <Label htmlFor="satisfied" className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                    Satisfied
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neutral" id="neutral" />
                  <Label htmlFor="neutral">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dissatisfied" id="dissatisfied" />
                  <Label htmlFor="dissatisfied" className="flex items-center">
                    <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                    Dissatisfied
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Rate Our Service (1-5 stars)</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating && star <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Previous Feedback</CardTitle>
          <CardDescription>
            View your previously submitted feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven't submitted any feedback yet.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeedbackSection;
