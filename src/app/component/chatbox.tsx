// Chatbox.tsx
import React, { useState } from 'react';

interface ChatboxProps {
  activeChat: { name: string; messages: { sender: string; content: string }[] };
  isChatOpen: boolean;
  closeChatbox: () => void;
  index: number;
  totalChatCount: number;
}

const Chatbox: React.FC<ChatboxProps> = ({ activeChat, isChatOpen, closeChatbox, index, totalChatCount }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      activeChat.messages.push({ sender: 'User', content: newMessage }); // TODO: Replace with actual user details
      setNewMessage('');
    }
  };

  return (
    <div
      className={`fixed bottom-0 right-0 w-96 transition-transform duration-300 transform ${
        isChatOpen ? `translate-x-${index * 100}` : 'translate-y-full'
      }`}
      style={{ zIndex: totalChatCount - index }}
    >
      <div className="bg-white border border-gray-300 rounded-t-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-800 text-white cursor-pointer" onClick={closeChatbox}>
          {activeChat.name}
        </div>
        <div className="p-4" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
          {/* Display messages */}
          {activeChat.messages.map((msg, idx) => (
            <div key={idx} className={`my-2 flex flex-col`}>
              {msg.sender !== 'User' && (
                <span className="text-gray-500 text-xs mb-1">{msg.sender}</span> // Display name for other users
              )}
              <div
                className={`p-2 ${
                  msg.sender === 'User'
                    ? 'bg-blue-200 text-blue-800 ml-auto rounded-tl-lg rounded-tr-lg rounded-bl-lg' // User message (right-aligned, rounded top and left)
                    : 'bg-gray-200 text-gray-800 mr-auto rounded-tl-lg rounded-tr-lg rounded-br-lg' // Other user message (left-aligned, rounded top and right)
                }`}
                style={{ maxWidth: '75%', wordBreak: 'break-word' }} // Set maximum width for messages
              >
                <strong>{msg.sender === 'User' ? '' : ''}</strong> {msg.content} {/* No strong tag for user */}
              </div>
            </div>
          ))}
        </div>
        <div className="flex p-2 border-t border-gray-300">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-400 rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 p-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
      <div className="bg-gray-800 h-4 shadow-inner"></div>
    </div>
  );
};

export default Chatbox;
