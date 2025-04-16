import AdminLayout from '@/components/admin/AdminLayout';
import SubscriptionsSection from '@/components/admin/SubscriptionsSection';

const SubscriptionsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscription Management</h2>
          <p className="text-muted-foreground">
            Manage pricing plans and subscriptions
          </p>
        </div>
        
        <SubscriptionsSection />
      </div>
    </AdminLayout>
  );
};

export default SubscriptionsPage;
