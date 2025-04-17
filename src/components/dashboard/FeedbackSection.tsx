import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { Loader2, ThumbsUp, ThumbsDown, Star, MessageSquare, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface FeedbackItem {
  id: string;
  feedback_type: string;
  feedback_text: string;
  satisfaction: string | null;
  rating: number | null;
  created_at: string;
  replies: FeedbackReply[];
}

interface FeedbackReply {
  id: string;
  feedback_id: string;
  user_id: string;
  is_admin: boolean;
  reply_text: string;
  created_at: string;
  profile?: {
    full_name: string;
    avatar_url: string | null;
  };
}

const FeedbackSection = () => {
  const { user, profile } = useAuth();

  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [satisfaction, setSatisfaction] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFeedback();
    }
  }, [user]);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);

      // Fetch feedback items
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;

      // Process each feedback item to include replies
      const processedFeedback = [];

      for (const feedback of feedbackData) {
        // Fetch replies for this feedback
        const { data: repliesData, error: repliesError } = await supabase
          .from('feedback_replies')
          .select('*')
          .eq('feedback_id', feedback.id)
          .order('created_at', { ascending: true });

        if (repliesError) throw repliesError;

        // Process replies to include profile information
        const processedReplies = [];

        if (repliesData && repliesData.length > 0) {
          for (const reply of repliesData) {
            let profileInfo = { full_name: 'Admin', avatar_url: null };

            // Only fetch profile if it's not an admin reply
            if (!reply.is_admin && reply.user_id) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', reply.user_id)
                .single();

              if (profileData) {
                profileInfo = profileData;
              }
            }

            processedReplies.push({
              ...reply,
              profile: profileInfo
            });
          }
        }

        // Add this feedback with its replies to the result
        processedFeedback.push({
          ...feedback,
          replies: processedReplies
        });
      }

      setFeedbackItems(processedFeedback);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching feedback:', error);
      toast({
        title: 'Error fetching feedback',
        description: 'Could not load your feedback history.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      // Insert feedback into the database
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id,
          feedback_type: feedbackType,
          feedback_text: feedbackText,
          satisfaction: satisfaction || null,
          rating: rating,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      // Reset form
      setFeedbackType('');
      setFeedbackText('');
      setSatisfaction('');
      setRating(null);

      // Refresh feedback list
      fetchFeedback();

      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback! We appreciate your input.',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error submitting feedback',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
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
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
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
            View your previously submitted feedback and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
            </div>
          ) : feedbackItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't submitted any feedback yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbackItems.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${item.feedback_type === 'complaint' ? 'bg-red-500' : item.feedback_type === 'suggestion' ? 'bg-blue-500' : 'bg-green-500'}`}>
                          {item.feedback_type.charAt(0).toUpperCase() + item.feedback_type.slice(1)}
                        </Badge>
                        {item.rating && (
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < item.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                    <p className="text-sm">{item.feedback_text}</p>
                    {item.satisfaction && (
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">Satisfaction:</span>
                        {item.satisfaction === 'satisfied' ? (
                          <span className="flex items-center text-green-500">
                            <ThumbsUp className="h-4 w-4 mr-1" /> Satisfied
                          </span>
                        ) : item.satisfaction === 'dissatisfied' ? (
                          <span className="flex items-center text-red-500">
                            <ThumbsDown className="h-4 w-4 mr-1" /> Dissatisfied
                          </span>
                        ) : (
                          <span>Neutral</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {item.replies && item.replies.length > 0 && (
                    <div className="p-4 border-t">
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Responses
                      </h4>
                      <div className="space-y-4">
                        {item.replies.map((reply) => (
                          <div key={reply.id} className={`p-3 rounded-md ${reply.is_admin ? 'bg-marketing-blue/10' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={reply.profile?.avatar_url || ''} />
                                <AvatarFallback>{getInitials(reply.profile?.full_name || 'Admin')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium flex items-center">
                                  {reply.profile?.full_name || 'Admin'}
                                  {reply.is_admin && (
                                    <Badge variant="outline" className="ml-2 bg-marketing-blue text-white text-xs">
                                      Admin
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(reply.created_at)}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm">{reply.reply_text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSection;
