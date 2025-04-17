import { useEffect, useRef } from 'react';

// This component provides a direct implementation of the JotForm chat widget
// without relying on environment variables
const DirectJotFormChat = () => {
  const initialized = useRef(false);
  const AGENT_ID = '01960593248a7d43a80dbeba645716245d9a';

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    
    console.log('Initializing DirectJotFormChat with agent ID:', AGENT_ID);
    
    // Create a container for the JotForm chat widget
    let container = document.getElementById(`JotformAgent-${AGENT_ID}`);
    
    // If the container doesn't exist, create it
    if (!container) {
      container = document.createElement('div');
      container.id = `JotformAgent-${AGENT_ID}`;
      document.body.appendChild(container);
      console.log('Created JotForm container with ID:', container.id);
    }
    
    // Load the JotForm script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Initialize JotForm when the script is loaded
    script.onload = () => {
      console.log('JotForm script loaded');
      
      if (window.AgentInitializer) {
        console.log('AgentInitializer found, initializing...');
        
        window.AgentInitializer.init({
          agentRenderURL: `https://agent.jotform.com/${AGENT_ID}`,
          rootId: `JotformAgent-${AGENT_ID}`,
          formID: AGENT_ID,
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
        
        initialized.current = true;
        console.log('JotForm chat widget initialized');
      } else {
        console.error('AgentInitializer not found, falling back to iframe embed');
        createFallbackEmbed();
      }
    };
    
    // Handle script load errors
    script.onerror = () => {
      console.error('Failed to load JotForm script, falling back to iframe embed');
      createFallbackEmbed();
    };
    
    // Create a fallback embed if the JotForm script fails to load
    const createFallbackEmbed = () => {
      if (!container) return;
      
      // Clear the container
      container.innerHTML = '';
      
      // Create an iframe element
      const iframe = document.createElement('iframe');
      iframe.id = `JotFormIFrame-${AGENT_ID}`;
      iframe.title = 'Marketing Lot Chat';
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('allow', 'geolocation; microphone; camera; fullscreen');
      iframe.src = `https://agent.jotform.com/${AGENT_ID}?embedMode=iframe&background=1&shadow=1`;
      iframe.frameBorder = '0';
      iframe.style.position = 'fixed';
      iframe.style.bottom = '20px';
      iframe.style.right = '20px';
      iframe.style.width = '70px';
      iframe.style.height = '70px';
      iframe.style.minWidth = '70px';
      iframe.style.minHeight = '70px';
      iframe.style.maxWidth = '90vw';
      iframe.style.maxHeight = '90vh';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '50%';
      iframe.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      iframe.style.zIndex = '9999';
      iframe.style.overflow = 'hidden';
      iframe.style.transition = 'all 0.3s ease';
      
      // Add the iframe to the container
      container.appendChild(iframe);
      
      // Create a script to handle the iframe
      const handlerScript = document.createElement('script');
      handlerScript.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
      handlerScript.async = true;
      handlerScript.onload = () => {
        // @ts-ignore - JotForm embed handler is not typed
        if (window.jotformEmbedHandler) {
          // @ts-ignore
          window.jotformEmbedHandler(`iframe[id='JotFormIFrame-${AGENT_ID}']`, 'https://www.jotform.com');
        }
      };
      
      document.body.appendChild(handlerScript);
      
      // Add click handler to expand the chat
      iframe.addEventListener('click', () => {
        if (iframe.style.width === '70px') {
          iframe.style.width = '350px';
          iframe.style.height = '500px';
          iframe.style.borderRadius = '10px';
        } else {
          iframe.style.width = '70px';
          iframe.style.height = '70px';
          iframe.style.borderRadius = '50%';
        }
      });
    };
    
    // Clean up function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  return null;
};

export default DirectJotFormChat;
