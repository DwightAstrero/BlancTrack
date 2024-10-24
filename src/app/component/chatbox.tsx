import React, { useState } from 'react';

const Chatbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle chatbox open/close state
  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* The small peeking rectangle */}
      {!isOpen && (
        <div
          onClick={toggleChatbox}
          className="w-16 h-8 bg-green-500 border-2 border-black text-black flex items-center justify-center cursor-pointer hover:bg-green-600 transition-all"
          style={{ borderRadius: '10px 10px 0 0' }}
        >
          Chat
        </div>
      )}

      {/* Expanded Chatbox */}
      {isOpen && (
        <div
          className="w-80 h-96 bg-cream border-2 border-black shadow-lg rounded-lg flex flex-col transition-all"
          style={{ borderRadius: '10px 10px 0 0' }}
        >
          {/* Chatbox header */}
          <div className="bg-green-500 text-black p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">Chatbox</h2>
            <button
              onClick={toggleChatbox}
              className="text-black hover:text-red-700"
            >
              Close
            </button>
          </div>

          {/* Chatbox body */}
          <div className="flex-1 bg-cream-light p-4 overflow-y-auto">
            {/* Chat messages go here */}
            <p>This is where the chat content goes...</p>
          </div>

          {/* Chatbox input */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
