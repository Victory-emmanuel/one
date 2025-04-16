import AdminLayout from '@/components/admin/AdminLayout';
import ComplaintsSection from '@/components/admin/ComplaintsSection';

const ComplaintsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Complaints & Suggestions</h2>
          <p className="text-muted-foreground">
            View and respond to client feedback
          </p>
        </div>
        
        <ComplaintsSection />
      </div>
    </AdminLayout>
  );
};

export default ComplaintsPage;
