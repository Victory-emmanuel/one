import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileSection from '@/components/dashboard/ProfileSection';

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your personal information and how others see you
          </p>
        </div>
        
        <ProfileSection />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
