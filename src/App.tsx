
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Public Pages
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import SupportPage from "./pages/dashboard/SupportPage";
import FeedbackPage from "./pages/dashboard/FeedbackPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ClientsPage from "./pages/admin/ClientsPage";
import SubscriptionsPage from "./pages/admin/SubscriptionsPage";
import RevenuePage from "./pages/admin/RevenuePage";
import ComplaintsPage from "./pages/admin/ComplaintsPage";
import EmailAnalyticsPage from "./pages/admin/EmailAnalyticsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => {
  // Microsoft Clarity initialization
  useEffect(() => {
    // Microsoft Clarity is initialized in the HTML head
    console.log("Microsoft Clarity tracking initialized");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/dashboard/subscription" element={<SubscriptionPage />} />
              <Route path="/dashboard/support" element={<SupportPage />} />
              <Route path="/dashboard/feedback" element={<FeedbackPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/clients" element={<ClientsPage />} />
              <Route path="/admin/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/admin/revenue" element={<RevenuePage />} />
              <Route path="/admin/complaints" element={<ComplaintsPage />} />
              <Route path="/admin/email-analytics" element={<EmailAnalyticsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
