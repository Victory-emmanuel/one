/**
 * Service for support ticket operations
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface SupportTicket {
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

export interface TicketReply {
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

/**
 * Fetch support tickets for a user
 * @param userId The user ID
 * @returns Array of support tickets with replies
 */
export const fetchUserSupportTickets = async (userId: string): Promise<SupportTicket[]> => {
  try {
    // Fetch tickets
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ticketsError) throw ticketsError;

    // Fetch replies for each ticket
    const ticketsWithReplies = await Promise.all(
      ticketsData.map(async (ticket) => {
        // Fetch replies
        const { data: repliesData, error: repliesError } = await supabase
          .from('support_ticket_replies')
          .select('*')
          .eq('ticket_id', ticket.id)
          .order('created_at', { ascending: true });

        if (repliesError) throw repliesError;
        
        // Fetch profiles separately
        const userIds = repliesData.map(reply => reply.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);
          
        if (profilesError) throw profilesError;
        
        // Join replies with profiles
        const repliesWithProfiles = repliesData.map(reply => {
          const profile = profilesData.find(p => p.id === reply.user_id);
          return {
            ...reply,
            profile: profile || null
          };
        });

        return {
          ...ticket,
          replies: repliesWithProfiles || []
        };
      })
    );

    return ticketsWithReplies;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    toast({
      title: 'Error fetching tickets',
      description: 'Could not load your support tickets.',
      variant: 'destructive',
    });
    return [];
  }
};

/**
 * Create a new support ticket
 * @param userId The user ID
 * @param ticketData The ticket data
 * @returns The created ticket or null if failed
 */
export const createSupportTicket = async (
  userId: string,
  ticketData: {
    subject: string;
    category: string;
    message: string;
    attachments: { name: string; url: string; type: string }[] | null;
  }
): Promise<SupportTicket | null> => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        subject: ticketData.subject,
        category: ticketData.category,
        message: ticketData.message,
        status: 'open',
        attachments: ticketData.attachments,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    return data[0] as SupportTicket;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    toast({
      title: 'Error submitting ticket',
      description: 'An error occurred while submitting your support ticket.',
      variant: 'destructive',
    });
    return null;
  }
};
