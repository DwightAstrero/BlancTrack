// MessengerSidebar.tsx

//TODO: Messages actually working, a history display of messages, and a textbox to write messages.
import React, { useState } from 'react';

const MessengerSidebar = ({ openChat }: { openChat: (name: string, message: string) => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
// TODO: Messages are truncated in sidebar.
  const chatList = [
    { name: 'Steph Curry', latestMessage: 'Hey! How’s the report going?' },
    { name: 'Tyson Mcflurry', latestMessage: 'Don’t forget the meeting at 3...' },
    { name: 'Ronald McDonald', latestMessage: 'Can you review this document?' },
  ];

  return (
    <div>
      {/* Messenger button to open sidebar */}
      <button
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full"
        onClick={toggleSidebar}
      >
        <span className="font-bold">Chat</span>
      </button>

      {/* Messenger Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg font-bold">Chats</h2>
          {/* Close button */}
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
              onClick={() => openChat(chat.name, chat.latestMessage)}
            >
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-gray-400 truncate">{chat.latestMessage}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessengerSidebar;
