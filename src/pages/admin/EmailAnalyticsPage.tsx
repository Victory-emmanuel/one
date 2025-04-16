import AdminLayout from '@/components/admin/AdminLayout';
import EmailAnalyticsSection from '@/components/admin/EmailAnalyticsSection';

const EmailAnalyticsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email & Campaign Analytics</h2>
          <p className="text-muted-foreground">
            Track your email marketing performance
          </p>
        </div>
        
        <EmailAnalyticsSection />
      </div>
    </AdminLayout>
  );
};

export default EmailAnalyticsPage;
