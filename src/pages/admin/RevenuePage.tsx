import AdminLayout from '@/components/admin/AdminLayout';
import RevenueSection from '@/components/admin/RevenueSection';

const RevenuePage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Revenue & Financial Tracking</h2>
          <p className="text-muted-foreground">
            Track revenue, profits, and financial performance
          </p>
        </div>
        
        <RevenueSection />
      </div>
    </AdminLayout>
  );
};

export default RevenuePage;
