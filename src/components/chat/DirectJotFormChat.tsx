import { useEffect, useRef } from 'react';
import { initJotFormChat } from '@/services/jotform.service';

interface DirectJotFormChatProps {
  debug?: boolean;
}

/**
 * This component provides a direct implementation of the JotForm chat widget
 * without relying on environment variables
 */
const DirectJotFormChat = ({ debug = false }: DirectJotFormChatProps) => {
  const cleanupRef = useRef<(() => void) | null>(null);
  const AGENT_ID = '01960593248a7d43a80dbeba645716245d9a';

  useEffect(() => {
    // Initialize the JotForm chat widget
    cleanupRef.current = initJotFormChat({
      agentId: AGENT_ID,
      containerId: 'jotform-agent-container',
      debug
    });

    // Clean up function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [debug]);

  return null;
};

export default DirectJotFormChat;
