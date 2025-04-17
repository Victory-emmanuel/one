import { useEffect, useRef } from 'react';
// TypeScript declarations for JotForm are in src/types/jotform.d.ts

// Function to create a fallback embed if the JotForm script fails to load
const createFallbackEmbed = (agentId: string, container: HTMLElement) => {
  // Clear the container
  container.innerHTML = '';

  // Create an iframe element
  const iframe = document.createElement('iframe');
  iframe.id = `JotFormIFrame-${agentId}`;
  iframe.title = 'Marketing Lot Chat';
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('allow', 'geolocation; microphone; camera; fullscreen');
  iframe.src = `https://agent.jotform.com/${agentId}?embedMode=iframe&background=1&shadow=1`;
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
      window.jotformEmbedHandler(`iframe[id='JotFormIFrame-${agentId}']`, 'https://www.jotform.com');
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

interface JotFormChatProps {
  containerId?: string;
  debug?: boolean;
}

const JotFormChat = ({ containerId = 'jotform-agent-container', debug = false }: JotFormChatProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;

    // Get the container element
    const jotformContainer = document.getElementById(containerId);
    if (!jotformContainer) {
      console.error(`JotForm container with ID "${containerId}" not found`);
      return;
    }

    if (debug) {
      console.log(`JotForm container found with ID "${containerId}"`);
      console.log('JotForm container element:', jotformContainer);
    }

    // Set the ID that JotForm expects
    // Use the environment variable or fall back to the hardcoded value
    const agentId = import.meta.env.VITE_JOTFORM_AGENT_ID || '01960593248a7d43a80dbeba645716245d9a';

    if (debug) {
      console.log('JotForm agent ID:', agentId);
      console.log('Using environment variable:', !!import.meta.env.VITE_JOTFORM_AGENT_ID);
    }

    // Set the container ID to match JotForm's expected format
    jotformContainer.id = `JotformAgent-${agentId}`;

    // Load the JotForm script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
    script.async = true;

    // Set a timeout to detect if the script fails to load
    const timeoutId = setTimeout(() => {
      console.warn('JotForm script load timeout - falling back to direct embed');
      createFallbackEmbed(agentId, jotformContainer);
    }, 5000); // 5 seconds timeout

    // Initialize JotForm when the script is loaded
    script.onload = () => {
      // Clear the timeout since the script loaded successfully
      clearTimeout(timeoutId);
      if (window.AgentInitializer) {
        console.log('Initializing JotForm with agent ID:', agentId);

        window.AgentInitializer.init({
          agentRenderURL: `https://agent.jotform.com/${agentId}`,
          rootId: `JotformAgent-${agentId}`,
          formID: agentId,
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
      } else {
        console.error('JotForm AgentInitializer not found');
      }
    };

    // Add the script to the document
    document.body.appendChild(script);

    // Handle script load errors
    script.onerror = () => {
      console.error('Failed to load JotForm script - falling back to direct embed');
      clearTimeout(timeoutId);
      createFallbackEmbed(agentId, jotformContainer);
    };

    // Clean up function
    return () => {
      clearTimeout(timeoutId);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  // Add a resize handler to ensure the JotForm chat widget is properly positioned
  useEffect(() => {
    const handleResize = () => {
      // Force re-render of JotForm chat widget on window resize
      const container = document.getElementById('jotform-agent-container');
      if (container && container.style.display !== 'none') {
        container.style.display = 'none';
        setTimeout(() => {
          container.style.display = 'block';
        }, 100);
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default JotFormChat;
