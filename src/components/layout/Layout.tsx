
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
          agentRenderURL: `https://agent.jotform.com/${import.meta.env.VITE_JOTFORM_AGENT_ID}`,
          rootId: `JotformAgent-${import.meta.env.VITE_JOTFORM_AGENT_ID}`,
          formID: import.meta.env.VITE_JOTFORM_AGENT_ID,
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
    const formId = import.meta.env.VITE_CONVERTKIT_NEWSLETTER_FORM_ID;
    convertKitScript.src = `https://crafty-creator-5068.kit.com/${formId}/index.js`;
    convertKitScript.async = true;
    convertKitScript.setAttribute('data-uid', formId);

    // Find the element where we want to add the ConvertKit form
    const newsletterFormContainer = document.getElementById('convertkit-newsletter-form');
    if (newsletterFormContainer) {
      newsletterFormContainer.appendChild(convertKitScript);
    }

    // Initialize ConvertKit Popup Form
    const popupFormId = import.meta.env.VITE_CONVERTKIT_POPUP_FORM_ID;
    const popupScript = document.createElement('script');
    popupScript.src = `https://crafty-creator-5068.kit.com/${popupFormId}/index.js`;
    popupScript.async = true;
    popupScript.setAttribute('data-uid', popupFormId);
    document.body.appendChild(popupScript);

    return () => {
      // Clean up the scripts when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (convertKitScript.parentNode) {
        convertKitScript.parentNode.removeChild(convertKitScript);
      }
      if (popupScript.parentNode) {
        popupScript.parentNode.removeChild(popupScript);
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
