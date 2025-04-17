interface JotFormCustomizations {
  greeting?: string;
  greetingMessage?: string;
  openByDefault?: string;
  pulse?: string;
  position?: string;
  autoOpenChatIn?: string;
}

interface JotFormAgentInitializerOptions {
  agentRenderURL: string;
  rootId: string;
  formID: string;
  queryParams?: string[];
  domain?: string;
  isDraggable?: boolean;
  background?: string;
  buttonBackgroundColor?: string;
  buttonIconColor?: string;
  variant?: boolean | string;
  customizations?: JotFormCustomizations;
  isVoice?: boolean;
}

interface JotFormAgentInitializer {
  init: (options: JotFormAgentInitializerOptions) => void;
}

interface Window {
  AgentInitializer?: JotFormAgentInitializer;
}
