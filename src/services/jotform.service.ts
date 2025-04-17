/**
 * Service for JotForm integration
 */

export interface JotFormInitOptions {
  agentId: string;
  containerId?: string;
  debug?: boolean;
}

/**
 * Initialize the JotForm chat widget
 * @param options The initialization options
 * @returns A cleanup function
 */
export const initJotFormChat = (options: JotFormInitOptions): (() => void) => {
  const { agentId, containerId = 'jotform-agent-container', debug = false } = options;
  
  if (debug) {
    console.log('Initializing JotForm chat with options:', options);
  }
  
  // Create a container for the JotForm chat widget if it doesn't exist
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
    
    if (debug) {
      console.log('Created JotForm container with ID:', containerId);
    }
  }
  
  // Set the container ID to match JotForm's expected format
  const jotformContainerId = `JotformAgent-${agentId}`;
  container.id = jotformContainerId;
  
  if (debug) {
    console.log('Set JotForm container ID to:', jotformContainerId);
  }
  
  // Load the JotForm script
  const script = document.createElement('script');
  script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
  script.async = true;
  
  // Set a timeout to detect if the script fails to load
  const timeoutId = setTimeout(() => {
    if (debug) {
      console.warn('JotForm script load timeout - falling back to direct embed');
    }
    createFallbackEmbed(agentId, container as HTMLElement, debug);
  }, 5000); // 5 seconds timeout
  
  // Initialize JotForm when the script is loaded
  script.onload = () => {
    // Clear the timeout since the script loaded successfully
    clearTimeout(timeoutId);
    
    if (window.AgentInitializer) {
      if (debug) {
        console.log('AgentInitializer found, initializing...');
      }
      
      window.AgentInitializer.init({
        agentRenderURL: `https://agent.jotform.com/${agentId}`,
        rootId: jotformContainerId,
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
      
      if (debug) {
        console.log('JotForm chat initialized successfully');
      }
    } else {
      if (debug) {
        console.error('AgentInitializer not found, falling back to iframe embed');
      }
      createFallbackEmbed(agentId, container as HTMLElement, debug);
    }
  };
  
  // Handle script load errors
  script.onerror = () => {
    if (debug) {
      console.error('Failed to load JotForm script, falling back to iframe embed');
    }
    clearTimeout(timeoutId);
    createFallbackEmbed(agentId, container as HTMLElement, debug);
  };
  
  // Add the script to the document
  document.body.appendChild(script);
  
  // Add a resize handler to ensure the JotForm chat widget is properly positioned
  const handleResize = () => {
    // Force re-render of JotForm chat widget on window resize
    if (container && container.style.display !== 'none') {
      container.style.display = 'none';
      setTimeout(() => {
        if (container) {
          container.style.display = 'block';
        }
      }, 100);
    }
  };
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
  
  // Return a cleanup function
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', handleResize);
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
};

/**
 * Create a fallback embed if the JotForm script fails to load
 * @param agentId The JotForm agent ID
 * @param container The container element
 * @param debug Whether to enable debug logging
 */
const createFallbackEmbed = (agentId: string, container: HTMLElement, debug: boolean = false): void => {
  if (!container) return;
  
  if (debug) {
    console.log('Creating fallback JotForm embed');
  }
  
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
      
      if (debug) {
        console.log('JotForm iframe handler initialized');
      }
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
  
  if (debug) {
    console.log('Fallback JotForm embed created');
  }
};
