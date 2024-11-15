import React from 'react';
import { MessageCircle, Fish } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md ${
        isUser ? 'bg-blue-600' : 'bg-gray-100'
      }`}>
        {isUser ? (
          <MessageCircle className="h-5 w-5 text-white" />
        ) : (
          <Fish className="h-5 w-5 text-gray-600" />
        )}
      </div>
      <div className={`relative flex-1 space-y-2 overflow-hidden px-1 ${
        isUser ? 'text-right' : ''
      }`}>
        <div className={`inline-block rounded-lg px-4 py-2 ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
        }`}>
          {message.content}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((url, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img src={url} alt={`Attachment ${index + 1}`} className="max-w-full h-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}