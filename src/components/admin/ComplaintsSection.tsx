import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MessageSquare, ThumbsUp, ThumbsDown, Filter, Calendar, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ComplaintsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample feedback data
  const [feedbackItems, setFeedbackItems] = useState([
    {
      id: '1',
      type: 'complaint',
      text: 'The dashboard is loading very slowly on my computer. It takes almost 30 seconds to load the analytics page.',
      user: {
        id: '101',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: ''
      },
      date: '2023-04-15',
      status: 'pending',
      replies: []
    },
    {
      id: '2',
      type: 'suggestion',
      text: 'It would be great if you could add a dark mode option to the dashboard. It would be easier on the eyes when working late.',
      user: {
        id: '102',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: ''
      },
      date: '2023-04-12',
      status: 'pending',
      replies: []
    },
    {
      id: '3',
      type: 'complaint',
      text: 'I\'m having trouble exporting my reports to PDF. The button doesn\'t seem to work on Firefox.',
      user: {
        id: '103',
        name: 'Robert Johnson',
        email: 'robert.johnson@example.com',
        avatar: ''
      },
      date: '2023-04-10',
      status: 'resolved',
      replies: [
        {
          id: 'r1',
          text: 'Thank you for reporting this issue. We\'ve fixed the PDF export functionality for Firefox in our latest update. Please refresh your browser and try again.',
          date: '2023-04-11',
          admin: true
        }
      ]
    },
    {
      id: '4',
      type: 'praise',
      text: 'I love the new analytics dashboard! It\'s so much easier to use than the previous version. Great job!',
      user: {
        id: '104',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        avatar: ''
      },
      date: '2023-04-08',
      status: 'acknowledged',
      replies: [
        {
          id: 'r2',
          text: 'Thank you for your kind words! We\'re glad you\'re enjoying the new analytics dashboard.',
          date: '2023-04-09',
          admin: true
        }
      ]
    },
    {
      id: '5',
      type: 'suggestion',
      text: 'It would be helpful to have a way to schedule reports to be sent automatically to my email on a weekly basis.',
      user: {
        id: '105',
        name: 'Michael Wilson',
        email: 'michael.wilson@example.com',
        avatar: ''
      },
      date: '2023-04-05',
      status: 'in_progress',
      replies: [
        {
          id: 'r3',
          text: 'Great suggestion! We\'re actually working on implementing scheduled reports in our next update. We\'ll let you know when it\'s available.',
          date: '2023-04-06',
          admin: true
        }
      ]
    }
  ]);
  
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
  
  const handleReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText('');
    setIsReplying(true);
  };
  
  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter a reply.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would add the reply to your database
      // For now, we'll just simulate adding a reply
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReply = {
        id: `r${Math.floor(Math.random() * 1000)}`,
        text: replyText,
        date: new Date().toISOString().split('T')[0],
        admin: true
      };
      
      const updatedFeedback = feedbackItems.map(item => {
        if (item.id === selectedFeedback.id) {
          return {
            ...item,
            status: 'acknowledged',
            replies: [...item.replies, newReply]
          };
        }
        return item;
      });
      
      setFeedbackItems(updatedFeedback);
      
      setIsReplying(false);
      
      toast({
        title: 'Reply sent',
        description: 'Your reply has been sent successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error sending reply',
        description: error.message || 'An error occurred while sending your reply.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateStatus = async (feedbackId, newStatus) => {
    try {
      // In a real app, you would update the status in your database
      // For now, we'll just simulate updating the status
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedFeedback = feedbackItems.map(item => {
        if (item.id === feedbackId) {
          return {
            ...item,
            status: newStatus
          };
        }
        return item;
      });
      
      setFeedbackItems(updatedFeedback);
      
      toast({
        title: 'Status updated',
        description: `Feedback status has been updated to ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error updating status',
        description: error.message || 'An error occurred while updating the status.',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status) => {
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
  
  const getTypeIcon = (type) => {
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
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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
                {filteredFeedback.length === 0 ? (
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
    </motion.div>
  );
};

export default ComplaintsSection;
