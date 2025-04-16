import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SupportSection from '@/components/dashboard/SupportSection';

const SupportPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Support</h2>
          <p className="text-muted-foreground">
            Get help with any issues you're experiencing
          </p>
        </div>
        
        <SupportSection />
      </div>
    </DashboardLayout>
  );
};

export default SupportPage;
