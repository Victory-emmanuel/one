import { useState, useEffect } from 'react';
import { fileToDataUrl } from '@/utils/fileToDataUrl';
// import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2, PaperclipIcon, Calendar, MessageSquare, AlertCircle, CheckCircle2, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  created_at: string;
  attachments: {
    name: string;
    url: string;
    type: string;
  }[] | null;
  replies: TicketReply[];
}

interface TicketReply {
  id: string;
  ticket_id: string;
  user_id: string;
  is_admin: boolean;
  reply_text: string;
  created_at: string;
  attachments: {
    name: string;
    url: string;
    type: string;
  }[] | null;
  profile?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface TicketCardProps {
  ticket: SupportTicket;
  formatDate: (date: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
  getStatusIcon: (status: string) => JSX.Element;
  getInitials: (name: string) => string;
}

const TicketCard = ({ ticket, formatDate, getStatusBadge, getStatusIcon, getInitials }: TicketCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="bg-gray-50 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(ticket.status)}
            <span className="font-medium">{ticket.subject}</span>
            {getStatusBadge(ticket.status)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(ticket.created_at)}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Category: {ticket.category}</span>
          <span className="text-muted-foreground">
            {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Message:</h4>
            <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Attachments:</h4>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors"
                  >
                    <PaperclipIcon className="h-4 w-4 mr-1" />
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {ticket.replies.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                Responses
              </h4>
              <div className="space-y-4">
                {ticket.replies.map((reply) => (
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
                    <p className="text-sm whitespace-pre-wrap">{reply.reply_text}</p>

                    {reply.attachments && reply.attachments.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {reply.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-1 bg-gray-100 rounded-md text-xs hover:bg-gray-200 transition-colors"
                            >
                              <PaperclipIcon className="h-3 w-3 mr-1" />
                              {attachment.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SupportSection = () => {
  const { user, profile } = useAuth();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);

      // Fetch tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      // Fetch replies for each ticket
      const ticketsWithReplies = await Promise.all(
        ticketsData.map(async (ticket) => {
          const { data: repliesData, error: repliesError } = await supabase
            .from('support_ticket_replies')
            .select('*, profile:profiles(full_name, avatar_url)')
            .eq('ticket_id', ticket.id)
            .order('created_at', { ascending: true });

          if (repliesError) throw repliesError;

          return {
            ...ticket,
            replies: repliesData || []
          };
        })
      );

      setTickets(ticketsWithReplies);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Error fetching tickets',
        description: 'Could not load your support tickets.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      // Convert attachments to data URLs
      let attachmentData = [];

      if (attachments.length > 0) {
        try {
          // Process each attachment
          for (const file of attachments) {
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
              toast({
                title: 'File too large',
                description: `File ${file.name} is too large. Maximum size is 5MB.`,
                variant: 'destructive',
              });
              continue;
            }

            // Convert file to data URL
            const dataUrl = await fileToDataUrl(file);

            attachmentData.push({
              name: file.name,
              url: dataUrl,
              type: file.type
            });
          }
        } catch (error) {
          console.error('Error processing attachments:', error);
          throw new Error('Failed to process attachments. Please try again.');
        }
      }

      // Create support ticket
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id,
          subject,
          category,
          message,
          status: 'open',
          attachments: attachmentData.length > 0 ? attachmentData : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      // Reset form
      setSubject('');
      setCategory('');
      setMessage('');
      setAttachments([]);

      // Refresh tickets
      fetchTickets();

      toast({
        title: 'Support ticket submitted',
        description: 'We\'ve received your request and will get back to you soon.',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting your support ticket.';
      toast({
        title: 'Error submitting ticket',
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-500">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
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
          <CardTitle>Your Support Tickets</CardTitle>
          <CardDescription>
            View and manage your support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Tickets</TabsTrigger>
              <TabsTrigger value="resolved">Resolved Tickets</TabsTrigger>
              <TabsTrigger value="all">All Tickets</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
                </div>
              ) : tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You don't have any active support tickets.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets
                    .filter(ticket => ticket.status === 'open' || ticket.status === 'in_progress')
                    .map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} formatDate={formatDate} getStatusBadge={getStatusBadge} getStatusIcon={getStatusIcon} getInitials={getInitials} />
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
                </div>
              ) : tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You don't have any resolved support tickets.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets
                    .filter(ticket => ticket.status === 'resolved' || ticket.status === 'closed')
                    .map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} formatDate={formatDate} getStatusBadge={getStatusBadge} getStatusIcon={getStatusIcon} getInitials={getInitials} />
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't submitted any support tickets yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} formatDate={formatDate} getStatusBadge={getStatusBadge} getStatusIcon={getStatusIcon} getInitials={getInitials} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
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
    </div>
  );
};

export default SupportSection;
