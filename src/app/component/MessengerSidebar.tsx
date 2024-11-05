// messengerSidebar.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import Chatbox from '../component/chatbox'; // Import the Chatbox component
import supabase from '../../lib/supabaseClient';

const MessengerSidebar = ({ openChat }: { openChat: (name: string, message: string) => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChats, setActiveChats] = useState<{ id: BigInteger; user1: string; user2: string; messages: { sender: string; content: string }[] }[]>([]);
  const [chatList, setChatList] = useState<{ id: BigInteger; user1: string; user2: string; messages: { sender: string; content: string }[] }[]>([]);
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]); // Temporary user list
  const [isSearchActive, setIsSearchActive] = useState(false); // Track if the search is active
  
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
    };
    fetchId();
  }, [userId]);

  useEffect(() => { // fetch current user chats from db
    const fetchChats = async () => {  
      const { data, error } = await supabase
        .from('chat')
        .select('*')
        .or(`user1.eq.${userId},user2.eq.${userId}`);
  
      if (error) {
        console.error('Error fetching chat data:', error);
        return;
      }
  
      setChatList(prevChatList => [...prevChatList, ...data]);
    };
    fetchChats();
  }, [userId]);

  // TODO: fix user2 (find matching/indicated chat)
  const handleChatClick = (id: BigInteger, user2: string, user1: string, messages: { sender: string; content: string }[]) => {
    // Add the new chat to the active chats if it's not already there
    const existingChat = activeChats.find(chat => chat.user2 === user2);
    if (!existingChat) {
      setActiveChats([...activeChats, {id, user1, user2, messages}]);
    }
  };

  // TODO: fix user2 (same as above)
  const closeChatbox = (name: string) => {
    // Remove the chat from active chats
    setActiveChats(activeChats.filter(chat => chat.user2 !== name));
  };

  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filtered results from a temporary user list
    const tempUsers = ['MJ', 'Steph Curry', 'Kobe', 'LeBron'];
    setSearchResults(tempUsers.filter(user => user.toLowerCase().includes(value.toLowerCase())));
  };

  // Handle clicking a search result
  const handleResultClick = (user: string) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchActive(false); // Hide search results after selection
    // TODO: Add the selected user to the active chats
    //handleChatClick(0, user, userId, []); // Not Working.
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
        
        {/* Search bar */}
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchActive(true)} // Show results when search bar is focused
            onBlur={() => setTimeout(() => setIsSearchActive(false), 150)} // Delay hiding to allow clicking
            placeholder="Search users..."
            className="w-full px-2 py-1 rounded bg-gray-800 text-white"
          />
          {isSearchActive && searchResults.length > 0 && (
            <div className="absolute w-56 bg-gray-800 border border-gray-700 mt-1 rounded shadow-lg">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        <ul className="mt-4 space-y-2 p-4">
          {chatList.map((chat) => (
            <li
              key={chat.user2}
              className="cursor-pointer p-2 hover:bg-gray-700"
              onClick={() => handleChatClick(chat.id, chat.user2, chat.user1, chat.messages)} // TODO: replace user2 with recipient, user1 below with latestmsg
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
