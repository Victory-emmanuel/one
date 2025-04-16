import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SubscriptionSection from '@/components/dashboard/SubscriptionSection';

const SubscriptionPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscription</h2>
          <p className="text-muted-foreground">
            Manage your subscription plan and billing information
          </p>
        </div>
        
        <SubscriptionSection />
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
