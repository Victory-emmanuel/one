
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="container-custom py-20 lg:py-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-9xl font-bold text-marketing-blue mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-600 max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="btn-primary text-lg">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
