import { useState } from 'react';
import Chatbot from './Chatbot';
import './FloatingChatBot.css';

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-chatbot">
      {!isOpen && (
        <button
          className="chat-bubble"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {
        isOpen && <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <span>Chat with Yugi</span>
          <button
            className="chat-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            ❌
          </button>
        </div>
        <Chatbot />
      </div>
      }

      
    </div>
  );
};

export default FloatingChatBot;
