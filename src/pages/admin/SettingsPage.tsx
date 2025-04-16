import AdminLayout from '@/components/admin/AdminLayout';
import AdminSettingsSection from '@/components/admin/AdminSettingsSection';

const AdminSettingsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile and application settings
          </p>
        </div>
        
        <AdminSettingsSection />
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
