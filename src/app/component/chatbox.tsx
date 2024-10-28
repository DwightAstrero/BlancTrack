// Chatbox.tsx
import React, { useState } from 'react';

interface ChatboxProps {
  activeChat: { name: string; messages: { sender: string; content: string }[] }; // Updated to track messages
  isChatOpen: boolean;
  closeChatbox: () => void;
  index: number;
  totalChatCount: number;
}

const Chatbox: React.FC<ChatboxProps> = ({ activeChat, isChatOpen, closeChatbox, index, totalChatCount }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      // Send message logic (you might need to lift this state up to MessengerSidebar)
      activeChat.messages.push({ sender: 'userFirstName userLastName', content: newMessage }); // TODO: replace with actual logged-in user name
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
          Chat with {activeChat.name}
        </div>
        <div className="p-4" style={{ height: '300px', overflowY: 'scroll' }}>
          {/* Display messages */}
          {activeChat.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 p-2 rounded-lg ${
                msg.sender === 'User' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.content}
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
