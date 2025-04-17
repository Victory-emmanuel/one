import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MessageSquare, ThumbsUp, ThumbsDown, Filter, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FeedbackItem {
  id: string;
  user_id: string;
  feedback_type: string;
  feedback_text: string;
  satisfaction?: string | null;
  rating?: number | null;
  status?: string;
  created_at: string;
  updated_at?: string;
}

interface FeedbackReply {
  id: string;
  feedback_id: string;
  user_id: string;
  is_admin: boolean;
  reply_text: string;
  created_at: string;
  updated_at?: string;
}

interface UserProfile {
  id: string;
  full_name?: string | null;
  email?: string;
  avatar_url?: string | null;
}

interface ProcessedFeedback {
  id: string;
  type: string;
  text: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  date: string;
  status: string;
  replies: ProcessedReply[];
}

interface ProcessedReply {
  id: string;
  text: string;
  date: string;
  admin: boolean;
}

const ComplaintsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<ProcessedFeedback | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [feedbackItems, setFeedbackItems] = useState<ProcessedFeedback[]>([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      // First, get all client user IDs
      // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
      const { data: clientProfiles, error: clientsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'client');

      if (clientsError) {
        console.error('Error fetching client profiles:', clientsError);
        throw clientsError;
      }

      if (!clientProfiles || clientProfiles.length === 0) {
        console.log('No client profiles found');
        setFeedbackItems([]);
        return;
      }

      // Extract client IDs
      const clientIds = clientProfiles.map(profile => profile.id);
      console.log('Found client IDs:', clientIds);

      // Fetch all feedback from clients
      // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .in('user_id', clientIds)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
        throw feedbackError;
      }

      console.log('Fetched feedback data:', feedbackData?.length || 0, 'items');

      // Process each feedback item
      const processedFeedback: ProcessedFeedback[] = [];

      // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
      for (const feedback of feedbackData || []) {
        // Fetch user profile separately
        // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .eq('id', feedback.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user profile:', userError);
          // Continue with default user data
        }

        // Fetch replies
        // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
        const { data: repliesData, error: repliesError } = await supabase
          .from('feedback_replies')
          .select('*')
          .eq('feedback_id', feedback.id)
          .order('created_at', { ascending: true });

        if (repliesError) {
          console.error('Error fetching replies:', repliesError);
          // Continue with empty replies
        }

        // Process replies
        const processedReplies: ProcessedReply[] = [];

        if (repliesData && repliesData.length > 0) {
          // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
          for (const reply of repliesData) {
            processedReplies.push({
              id: reply.id,
              text: reply.reply_text,
              date: new Date(reply.created_at).toISOString().split('T')[0],
              admin: reply.is_admin
            });
          }
        }

        // Add processed feedback item
        processedFeedback.push({
          id: feedback.id,
          type: feedback.feedback_type,
          text: feedback.feedback_text,
          user: {
            id: feedback.user_id,
            // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
            name: userData?.full_name || 'Unknown User',
            // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
            email: userData?.email || '',
            // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
            avatar: userData?.avatar_url || ''
          },
          date: new Date(feedback.created_at).toISOString().split('T')[0],
          status: feedback.status || 'pending',
          replies: processedReplies
        });
      }

      setFeedbackItems(processedFeedback);
      console.log('Feedback items loaded:', processedFeedback.length);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching feedback:', error);
      toast({
        title: 'Error fetching feedback',
        description: 'Could not load feedback data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter feedback based on search query, type filter, and date filter
  const filteredFeedback = feedbackItems.filter(item => {
    const matchesSearch =
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    if (!matchesSearch || !matchesType) return false;

    if (dateFilter === 'all') return true;

    const itemDate = new Date(item.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (dateFilter) {
      case 'today':
        return diffDays <= 1;
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      default:
        return true;
    }
  });

  const handleReply = (feedback: ProcessedFeedback) => {
    setSelectedFeedback(feedback);
    setReplyText('');
    setIsReplying(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !selectedFeedback) {
      toast({
        title: 'Missing information',
        description: 'Please enter a reply.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Add the reply to the database
      // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
      const { data: replyData, error: replyError } = await supabase
        .from('feedback_replies')
        .insert({
          feedback_id: selectedFeedback.id,
          user_id: selectedFeedback.user.id, // This should be the admin's ID in a real app
          is_admin: true,
          reply_text: replyText,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (replyError) throw replyError;

      // Update the feedback status
      // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
      const { error: updateError } = await supabase
        .from('feedback')
        .update({ status: 'acknowledged' })
        .eq('id', selectedFeedback.id);

      if (updateError) throw updateError;

      // Refresh the feedback data
      await fetchFeedback();

      setIsReplying(false);
      setReplyText('');

      toast({
        title: 'Reply sent',
        description: 'Your reply has been sent successfully.',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error sending reply',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (feedbackId: string, newStatus: string) => {
    try {
      // Update the status in the database
      // @ts-ignore - Using any type because the database schema is not fully defined in TypeScript
      const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus })
        .eq('id', feedbackId);

      if (error) throw error;

      // Refresh the feedback data
      await fetchFeedback();

      toast({
        title: 'Status updated',
        description: `Feedback status has been updated to ${newStatus}.`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error updating status',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'acknowledged':
        return <Badge className="bg-blue-500">Acknowledged</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case 'suggestion':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'praise':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Complaints & Suggestions</CardTitle>
              <CardDescription>
                View and respond to client feedback
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search feedback..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="complaint">Complaints</SelectItem>
                    <SelectItem value="suggestion">Suggestions</SelectItem>
                    <SelectItem value="praise">Praise</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-marketing-blue" />
                    </TableCell>
                  </TableRow>
                ) : filteredFeedback.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No feedback found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeedback.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(feedback.type)}
                          <span className="ml-2 capitalize">{feedback.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="truncate">{feedback.text}</p>
                          {feedback.replies.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {feedback.replies.length} {feedback.replies.length === 1 ? 'reply' : 'replies'}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={feedback.user.avatar} alt={feedback.user.name} />
                            <AvatarFallback>{getInitials(feedback.user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{feedback.user.name}</div>
                            <div className="text-xs text-muted-foreground">{feedback.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.date}</TableCell>
                      <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleReply(feedback)}>
                            Reply
                          </Button>
                          <Select
                            value={feedback.status}
                            onValueChange={(value) => handleUpdateStatus(feedback.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="acknowledged">Acknowledged</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredFeedback.length} of {feedbackItems.length} feedback items
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={isReplying} onOpenChange={setIsReplying}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Feedback</DialogTitle>
            <DialogDescription>
              Respond to the client's feedback. They will be notified by email.
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedFeedback.user.avatar} alt={selectedFeedback.user.name} />
                    <AvatarFallback>{getInitials(selectedFeedback.user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{selectedFeedback.user.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedFeedback.date}</div>
                  </div>
                </div>
                <p className="text-sm">{selectedFeedback.text}</p>
              </div>

              {selectedFeedback.replies.length > 0 && (
                <div className="space-y-3">
                  <Label>Previous Replies</Label>
                  {selectedFeedback.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">Admin</div>
                          <div className="text-xs text-muted-foreground">{reply.date}</div>
                        </div>
                      </div>
                      <p className="text-sm">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={5}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReply} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reply'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintsSection;
