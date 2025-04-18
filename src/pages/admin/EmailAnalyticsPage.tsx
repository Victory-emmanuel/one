import AdminLayout from '@/components/admin/AdminLayout';
import SimplifiedEmailAnalyticsSection from '@/components/admin/SimplifiedEmailAnalyticsSection';

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

        <SimplifiedEmailAnalyticsSection />
      </div>
    </AdminLayout>
  );
};

export default EmailAnalyticsPage;
