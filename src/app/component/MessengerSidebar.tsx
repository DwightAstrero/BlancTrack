// MessengerSidebar.tsx
import React, { useState } from 'react';
import Chatbox from '../component/chatbox'; // Import the Chatbox component

const MessengerSidebar = ({ openChat }: { openChat: (name: string, message: string) => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChats, setActiveChats] = useState<{ name: string; messages: { sender: string; content: string }[] }[]>([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const chatList = [
    { name: 'Steph Curry', latestMessage: 'Hey! How’s the report going?' },
    { name: 'Tyson Mcflurry', latestMessage: 'Don’t forget the meeting at 3...' },
    { name: 'Ronald McDonald', latestMessage: 'Can you review this document?' },
  ];

  const handleChatClick = (name: string, message: string) => {
    // Add the new chat to the active chats if it's not already there
    const existingChat = activeChats.find(chat => chat.name === name);
    if (!existingChat) {
      setActiveChats([...activeChats, { name, messages: [{ sender: name, content: message }] }]);
    }
  };

  const closeChatbox = (name: string) => {
    // Remove the chat from active chats
    setActiveChats(activeChats.filter(chat => chat.name !== name));
  };

  return (
    <div>
      <button
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full"
        onClick={toggleSidebar}
      >
        <span className="font-bold">Chat</span>
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg font-bold">Chats</h2>
          <button onClick={toggleSidebar} className="text-white hover:text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="mt-4 space-y-2 p-4">
          {chatList.map((chat) => (
            <li
              key={chat.name}
              className="cursor-pointer p-2 hover:bg-gray-700"
              onClick={() => handleChatClick(chat.name, chat.latestMessage)}
            >
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-gray-400 truncate">{chat.latestMessage}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Multiple Chatboxes */}
      {activeChats.map((chat, index) => (
        <Chatbox 
          key={chat.name} 
          activeChat={chat} 
          isChatOpen={true} // All chatboxes are open by default
          closeChatbox={() => closeChatbox(chat.name)} 
          index={index} 
          totalChatCount={activeChats.length} // Pass total count of chatboxes
        />
      ))}
    </div>
  );
};

export default MessengerSidebar;
