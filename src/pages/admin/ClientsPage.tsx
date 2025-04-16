import AdminLayout from '@/components/admin/AdminLayout';
import ClientsSection from '@/components/admin/ClientsSection';

const ClientsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Client Management</h2>
          <p className="text-muted-foreground">
            View and manage all clients in your system
          </p>
        </div>
        
        <ClientsSection />
      </div>
    </AdminLayout>
  );
};

export default ClientsPage;
