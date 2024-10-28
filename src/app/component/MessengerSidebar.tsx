// MessengerSidebar.tsx
'use client'

import React, { useState, useEffect } from 'react';
import Chatbox from '../component/chatbox'; // Import the Chatbox component
import supabase from '../../lib/supabaseClient';

const MessengerSidebar = ({ openChat }: { openChat: (name: string, message: string) => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChats, setActiveChats] = useState<{ user1: string; user2: string; messages: { sender: string; content: string }[] }[]>([]);
  // const [chatList, setChatList] = useState<{ name: string; latestMessage: string }[]>([]);
  const [chatList, setChatList] = useState<{ user1: string; user2: string; messages: { sender: string; content: string }[] }[]>([]);
  const [userId, setUserId] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => { //get current user id
    const fetchId = async () => {
      const email = localStorage.getItem('userEmail');

      const { data, error } = await supabase
        .from('user')
        .select('id')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      setUserId(data?.id);
      setChatList([ // temp vals
        { "user1": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "user2": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "messages": [{"sender": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "content": "my savior"}, {"sender": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "content": "galyeonhan yeonghon-iyeo"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "i don't believe"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "you're a liar"}]},
        { "user1": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "user2": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "messages": [{"sender": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "content": "oh in a blink gone"}, {"sender": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "content": "blink gone"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "eorchusseo eopseo"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "blink and gone"}]}
      ]); 
    };
    fetchId;
  }, []);

  useEffect(() => { 
    const fetchChats = async () => {  
      const thisuserId = userId;
      const { data, error } = await supabase
        .from('chat')
        .select('user1, user2, messages')
        .eq('user1', thisuserId);
  
      if (error) {
        console.error('Error fetching chat data:', error);
        return;
      }

      console.log('test');
      console.log(data);
  
      setChatList(prevChatList => [...prevChatList, ...data]); 
      setChatList([ // temp vals
        { "user1": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "user2": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "messages": [{"sender": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "content": "my savior"}, {"sender": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "content": "galyeonhan yeonghon-iyeo"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "i don't believe"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "you're a liar"}]},
        { "user1": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "user2": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "messages": [{"sender": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "content": "oh in a blink gone"}, {"sender": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "content": "blink gone"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "notchil su eopseo"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "blink and gone"}]}
      ]); 
    };
    fetchChats();
  }, [userId]);
  
  useEffect(() => {
    // TODO: retrieve chats with current user from db
    setChatList([ // temp vals
      { "user1": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "user2": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "messages": [{"sender": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "content": "my savior"}, {"sender": "14669c02-1892-4d56-a2a5-8bfae226b4e3", "content": "galyeonhan yeonghon-iyeo"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "i don't believe"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "you're a liar"}]},
      { "user1": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "user2": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "messages": [{"sender": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "content": "oh in a blink gone"}, {"sender": "9a745b4a-e38a-4adf-b65b-ebbf5ee78d1d", "content": "blink gone"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "notchil su eopseo"}, {"sender": "f67c517f-df5b-4d5d-bfc0-69387e21af6e", "content": "blink and gone"}]}
    ]);
  }, []);

  // TODO: fix user2
  const handleChatClick = (user2: string, user1: string, messages: { sender: string; content: string }[]) => {
    // Add the new chat to the active chats if it's not already there
    const existingChat = activeChats.find(chat => chat.user2 === user2);
    if (!existingChat) {
      setActiveChats([...activeChats, { user1, user2, messages}]);
    }
  };

  // TODO: fix user2
  const closeChatbox = (name: string) => {
    // Remove the chat from active chats
    setActiveChats(activeChats.filter(chat => chat.user2 !== name));
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
              key={chat.user2}
              className="cursor-pointer p-2 hover:bg-gray-700"
              onClick={() => handleChatClick(chat.user2, chat.user1, chat.messages)} // TODO: replace user2 with recipient, user1 below with latestmsg
            >
              <div className="font-semibold">{chat.user2}</div>
              <div className="text-sm text-gray-400 truncate">{chat.user1}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Multiple Chatboxes */}
      {activeChats.map((chat, index) => (
        <Chatbox 
          key={chat.user2} // TODO: replace with recipient
          activeChat={chat} 
          isChatOpen={true} // All chatboxes are open by default
          closeChatbox={() => closeChatbox(chat.user2)} // TODO: replace with recipient
          index={index} 
          totalChatCount={activeChats.length} // Pass total count of chatboxes
        />
      ))}
    </div>
  );
};

export default MessengerSidebar;
