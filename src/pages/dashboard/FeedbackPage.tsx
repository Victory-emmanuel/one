import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FeedbackSection from '@/components/dashboard/FeedbackSection';

const FeedbackPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feedback</h2>
          <p className="text-muted-foreground">
            Share your thoughts and suggestions with us
          </p>
        </div>
        
        <FeedbackSection />
      </div>
    </DashboardLayout>
  );
};

export default FeedbackPage;
