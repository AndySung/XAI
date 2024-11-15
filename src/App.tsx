import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { Message, ChatState, ChatHistory } from './types';
import { Fish } from 'lucide-react';
import { saveChat, getChats, deleteChat } from './utils/storage';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_MESSAGE: Message = {
  role: 'system',
  content: 'You are 不会游泳的鱼XAI, a friendly and helpful AI assistant.',
  timestamp: Date.now(),
};

function App() {
  const [chats, setChats] = useState<ChatHistory[]>(getChats());
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [INITIAL_MESSAGE],
    isLoading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeChat) {
      const chat = chats.find(c => c.id === activeChat);
      if (chat) {
        setChatState(prev => ({ ...prev, messages: chat.messages }));
      }
    }
  }, [activeChat]);

  const handleNewChat = () => {
    const newChatId = uuidv4();
    const newChat: ChatHistory = {
      id: newChatId,
      title: 'New Chat',
      lastMessage: '',
      timestamp: Date.now(),
      messages: [INITIAL_MESSAGE],
    };
    setChats(prev => [...prev, newChat]);
    setActiveChat(newChatId);
    setChatState({
      messages: [INITIAL_MESSAGE],
      isLoading: false,
      error: null,
    });
  };

  const handleSendMessage = async (content: string, files: File[]) => {
    if (!activeChat) {
      handleNewChat();
    }

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments: files.map(file => URL.createObjectURL(file)),
    };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch('http://localhost:5173/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatState.messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const assistantMessage = await response.json();
      const newAssistantMessage: Message = {
        role: 'assistant',
        content: assistantMessage.content || 'No response',
        timestamp: Date.now(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, newAssistantMessage],
        isLoading: false,
      }));

      // Update chat history
      const updatedChat: ChatHistory = {
        id: activeChat || uuidv4(),
        title: content.slice(0, 30) || 'New Chat',
        lastMessage: newAssistantMessage.content.slice(0, 50),
        timestamp: Date.now(),
        messages: [...chatState.messages, userMessage, newAssistantMessage],
      };

      setChats(prev => {
        const updated = prev.map(chat =>
          chat.id === updatedChat.id ? updatedChat : chat
        );
        if (!prev.find(chat => chat.id === updatedChat.id)) {
          updated.push(updatedChat);
        }
        return updated;
      });

      saveChat(updatedChat);
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to get response from XAI. Please try again.',
      }));
    }
  };

  const handleDeleteChat = (id: string) => {
    deleteChat(id);
    setChats(prev => prev.filter(chat => chat.id !== id));
    if (activeChat === id) {
      setActiveChat(null);
      setChatState({
        messages: [INITIAL_MESSAGE],
        isLoading: false,
        error: null,
      });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChat}
        onDeleteChat={handleDeleteChat}
      />
      
      <div className="flex-1 flex flex-col bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <div className="flex items-center gap-2">
              <Fish className="h-8 w-8 text-blue-600 animate-bounce" />
              <h1 className="text-xl font-semibold text-gray-900">不会游泳的鱼XAI Chat</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 space-y-4 rounded-lg bg-white p-4 shadow-sm">
              {chatState.messages.filter(msg => msg.role !== 'system').length === 0 ? (
                <div className="text-center text-gray-500">
                  开始和不会游泳的鱼聊天吧！
                </div>
              ) : (
                chatState.messages
                  .filter(msg => msg.role !== 'system')
                  .map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))
              )}
              {chatState.isLoading && (
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                </div>
              )}
              {chatState.error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                  {chatState.error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="mx-auto max-w-4xl">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={chatState.isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;