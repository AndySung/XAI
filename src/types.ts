export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: string[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messages: Message[];
}