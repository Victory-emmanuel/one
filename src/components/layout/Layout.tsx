
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from '@/components/ui/toaster';
import DirectJotFormChat from '@/components/chat/DirectJotFormChat';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {

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
      // No JotForm cleanup needed here as it's handled by the JotFormChat component
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
      <DirectJotFormChat debug={false} />
    </div>
  );
};

export default Layout;
