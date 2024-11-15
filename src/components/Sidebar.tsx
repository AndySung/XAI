import React from 'react';
import { PlusCircle, MessageSquare, Trash2 } from 'lucide-react';
import { ChatHistory } from '../types';

interface SidebarProps {
  chats: ChatHistory[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export function Sidebar({ chats, activeChat, onNewChat, onSelectChat, onDeleteChat }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
              activeChat === chat.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{chat.title}</div>
              <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
            >
              <Trash2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}