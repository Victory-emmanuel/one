
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Initialize JotForm Chat
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.AgentInitializer) {
        window.AgentInitializer.init({
          agentRenderURL: "https://agent.jotform.com/01960593248a7d43a80dbeba645716245d9a",
          rootId: "JotformAgent-01960593248a7d43a80dbeba645716245d9a",
          formID: "01960593248a7d43a80dbeba645716245d9a",
          queryParams: ["skipWelcome=1", "maximizable=1"],
          domain: "https://www.jotform.com",
          isDraggable: false,
          background: "linear-gradient(180deg, #0066ff 0%, #ff6b35 100%)",
          buttonBackgroundColor: "#8797FF",
          buttonIconColor: "#01091B",
          variant: false,
          customizations: {
            "greeting": "Yes",
            "greetingMessage": "Hi! How can I assist you?",
            "openByDefault": "No",
            "pulse": "Yes",
            "position": "right",
            "autoOpenChatIn": "0"
          },
          isVoice: false,
        });
      }
    };

    // Initialize ConvertKit Newsletter Form
    const convertKitScript = document.createElement('script');
    convertKitScript.src = 'https://crafty-creator-5068.kit.com/5808df4393/index.js';
    convertKitScript.async = true;
    convertKitScript.setAttribute('data-uid', '5808df4393');
    
    // Find the element where we want to add the ConvertKit form
    const newsletterFormContainer = document.getElementById('convertkit-newsletter-form');
    if (newsletterFormContainer) {
      newsletterFormContainer.appendChild(convertKitScript);
    }

    return () => {
      // Clean up the scripts when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (convertKitScript.parentNode) {
        convertKitScript.parentNode.removeChild(convertKitScript);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
