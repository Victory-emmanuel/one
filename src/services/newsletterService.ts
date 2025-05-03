import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  campaign_id?: string;
  created_at: string;
  source_page: string;
  referrer?: string;
  consent: boolean;
  device_info?: {
    userAgent?: string;
    screenSize?: string;
    language?: string;
    platform?: string;
  };
  custom_fields?: Record<string, any>;
}

export interface SubscriptionStats {
  totalSubscribers: number;
  lastMonthSubscribers: number;
  growthRate: number;
  conversionRate: number;
  topSources: { source: string; count: number }[];
  recentSubscribers: NewsletterSubscriber[];
  subscribersByDate: { date: string; count: number }[];
}

/**
 * Subscribe a user to the newsletter
 */
export const subscribeToNewsletter = async (
  email: string,
  sourcePage: string,
  name?: string,
  campaignId?: string,
  referrer?: string,
  customFields?: Record<string, any>
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    // Check if email already exists
    const { data: existingSubscribers, error: queryError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email);

    if (queryError) {
      console.error('Error checking existing subscriber:', queryError);
    }

    if (existingSubscribers && existingSubscribers.length > 0) {
      return {
        success: false,
        message: 'This email is already subscribed to our newsletter.'
      };
    }

    // Collect device info
    const deviceInfo = {
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      platform: navigator.platform
    };

    // Create new subscriber
    const newSubscriber = {
      id: uuidv4(),
      email,
      name: name || null,
      campaign_id: campaignId || null,
      created_at: new Date().toISOString(),
      source_page: sourcePage,
      referrer: referrer || document.referrer || null,
      consent: true,
      device_info: deviceInfo,
      custom_fields: customFields || null
    };

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([newSubscriber])
      .select();

    if (error) throw error;

    return {
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      data
    };
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      message: error.message || 'Failed to subscribe. Please try again later.'
    };
  }
};

/**
 * Get newsletter subscription statistics
 */
export const getNewsletterStats = async (): Promise<SubscriptionStats | null> => {
  try {
    // Get all subscribers
    const { data: allSubscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!allSubscribers || allSubscribers.length === 0) {
      return {
        totalSubscribers: 0,
        lastMonthSubscribers: 0,
        growthRate: 0,
        conversionRate: 0,
        topSources: [],
        recentSubscribers: [],
        subscribersByDate: []
      };
    }

    // Calculate last month subscribers
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthSubscribers = allSubscribers.filter(
      sub => new Date(sub.created_at) >= oneMonthAgo
    ).length;

    // Calculate growth rate (comparing to previous month)
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const previousMonthSubscribers = allSubscribers.filter(
      sub => new Date(sub.created_at) >= twoMonthsAgo && new Date(sub.created_at) < oneMonthAgo
    ).length;

    const growthRate = previousMonthSubscribers === 0
      ? lastMonthSubscribers * 100
      : ((lastMonthSubscribers - previousMonthSubscribers) / previousMonthSubscribers) * 100;

    // Calculate top sources
    const sourceCounts: Record<string, number> = {};
    allSubscribers.forEach(sub => {
      const source = sub.source_page || 'Unknown';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const topSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get recent subscribers
    const recentSubscribers = allSubscribers.slice(0, 10);

    // Group subscribers by date
    const subscribersByDate: Record<string, number> = {};
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Initialize all dates in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      subscribersByDate[dateStr] = 0;
    }

    // Count subscribers by date
    allSubscribers.forEach(sub => {
      const date = new Date(sub.created_at).toISOString().split('T')[0];
      if (new Date(date) >= last30Days) {
        subscribersByDate[date] = (subscribersByDate[date] || 0) + 1;
      }
    });

    // Convert to array and sort by date
    const subscribersByDateArray = Object.entries(subscribersByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Estimate conversion rate (subscribers / total visitors)
    // Since we don't have actual visitor data, we'll use a placeholder
    // In a real app, you would integrate with analytics API
    const estimatedVisitors = allSubscribers.length * 10; // Assuming 10% conversion rate
    const conversionRate = (allSubscribers.length / estimatedVisitors) * 100;

    return {
      totalSubscribers: allSubscribers.length,
      lastMonthSubscribers,
      growthRate: parseFloat(growthRate.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      topSources,
      recentSubscribers,
      subscribersByDate: subscribersByDateArray
    };
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return null;
  }
};

/**
 * Get all newsletter subscribers
 */
export const getAllSubscribers = async (): Promise<NewsletterSubscriber[]> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
};

/**
 * Convert subscribers to CSV format
 */
export const subscribersToCSV = (subscribers: NewsletterSubscriber[]): string => {
  if (!subscribers || subscribers.length === 0) {
    return 'email,name,created_at,source_page,referrer,consent\n';
  }

  // CSV header
  const header = 'email,name,created_at,source_page,referrer,consent\n';

  // CSV rows
  const rows = subscribers.map(sub => {
    const email = sub.email || '';
    const name = sub.name || '';
    const created_at = sub.created_at || '';
    const source_page = sub.source_page || '';
    const referrer = sub.referrer || '';
    const consent = sub.consent ? 'Yes' : 'No';

    // Escape fields that might contain commas
    return `"${email}","${name}","${created_at}","${source_page}","${referrer}","${consent}"`;
  }).join('\n');

  return header + rows;
};

/**
 * Download subscribers as CSV file
 */
export const downloadSubscribersCSV = async (): Promise<boolean> => {
  try {
    const subscribers = await getAllSubscribers();
    const csv = subscribersToCSV(subscribers);

    // Create a blob and download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error downloading CSV:', error);
    return false;
  }
};
