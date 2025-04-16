import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SettingsSection from '@/components/dashboard/SettingsSection';

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <SettingsSection />
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
