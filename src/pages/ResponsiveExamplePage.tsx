import { ResponsiveExample } from '@/components/examples/ResponsiveExample';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ThemeToggleAdvanced } from '@/components/theme/ThemeToggleAdvanced';

const ResponsiveExamplePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Responsive Design Demo</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <ThemeToggleAdvanced />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto">
        <ResponsiveExample />
      </main>
      
      <footer className="bg-white dark:bg-gray-800 mt-12 py-6 text-center">
        <p>Custom Responsive Breakpoints Demo</p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          xx: 1px | xs: 400px | ss: 600px | sm: 800px | md: 1000px | lg: 1200px | xl: 1700px
        </div>
      </footer>
    </div>
  );
};

export default ResponsiveExamplePage;
