// messengerSidebar.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import Chatbox from '../component/chatbox'; // Import the Chatbox component
import supabase from '../../lib/supabaseClient';

const MessengerSidebar = ({ openChat }: { openChat: (name: string, message: string) => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChats, setActiveChats] = useState<{ id: BigInteger; user1: string; user2: string; messages: { sender: string; content: string }[]; recipient: string }[]>([]);
  const [chatList, setChatList] = useState<{ id: BigInteger; user1: string; user2: string; messages: { sender: string; content: string }[]; recipient: string; lastMessage: string }[]>([]);
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState<{ id: BigInteger; name: string }[]>([]);
  const [searchResults, setSearchResults] = useState<{ id: BigInteger; name: string }[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false); // Track if the search is active
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => { //get current user id and user list
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

  useEffect(() => { // get user list
    const fetchUsers = async () => {  
      var listUsers;
      const { data: users, error } = await supabase
        .from('user')
        .select('id, firstname, lastname')
        .neq('id', userId);

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      if(users)
        listUsers = 
          users.map((user: { id: BigInteger, firstname: string, lastname: string; }) => {
            return { id: user.id, name: `${user.firstname} ${user.lastname}` };
          });

      setUserList(listUsers);
      console.log(listUsers);
    };
    fetchUsers();
  }, [userId]);

  useEffect(() => { // fetch current user chats from db
    const fetchChats = async () => {  
      const { data: chatData, error } = await supabase
        .from('chat')
        .select('*')
        .or(`user1.eq.${userId},user2.eq.${userId}`);
  
      if (error) {
        console.error('Error fetching chat data:', error);
        return;
      }

      const recipientChats = await Promise.all( // add recipient name
        chatData.map(async (chats: { user1: string; user2: any; }) => {
          const recipientId = chats.user1 === userId ? chats.user2 : chats.user1;
    
          const { data, error } = await supabase
            .from('user')
            .select('firstname, lastname')
            .eq('id', recipientId)
            .single();
    
          if (error) {
            console.error('Error fetching recipient data:', error);
            return { ...chats, recipient: null }; 
          }

          return { ...chats, recipient: `${data?.firstname} ${data?.lastname}` };
        })
      );

      const finalChats = // add latest message
        recipientChats.map((chats: { messages: string | any[]; }) => {
          var lastMessage;
          if (chats?.messages.length > 0)
            lastMessage = chats?.messages[chats?.messages.length - 1].content;
          else lastMessage = "New chat";
          return { ...chats, lastMessage };
        }) 

      if(finalChats && (finalChats !== chatList))  
        setChatList(finalChats);
    };
    fetchChats(); 
  });

  const handleChatClick = (id: BigInteger, user2: string, user1: string, messages: { sender: string; content: string }[], recipient: string) => {
    // Add the new chat to the active chats if it's not already there
    const existingChat = activeChats.find(chat => chat.id.toString() === id.toString());
    if (!existingChat) {
      setActiveChats([...activeChats, {id, user1, user2, messages, recipient}]);
    }
  };

  const closeChatbox = (name: string) => {
    // Remove the chat from active chats
    setActiveChats(activeChats.filter(chat => chat.id.toString() !== name));
  };

  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    setSearchResults(userList.filter(user => user.name.toLowerCase().includes(value.toLowerCase())));
  };

  // Handle clicking a search result
  const handleResultClick = async (recipientId: BigInteger) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchActive(false); // Hide search results after selection

    const { data, error } = await supabase
      .from('chat')
      .insert([
        { user1: userId, user2: recipientId, messages: [] }
    ]);

    if (error) {
      console.error('Failed to add new chat:', error);
      return;
    }
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
              {searchResults.map((user, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(user.id)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                >
                  {user.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing chats */}
        <ul className="mt-4 space-y-2 p-4">
          {chatList.map((chat) => (
            <li
              key={chat.id.toString()}
              className="cursor-pointer p-2 hover:bg-gray-700"
              onClick={() => handleChatClick(chat.id, chat.user2, chat.user1, chat.messages, chat.recipient)}
            >
              <div className="font-semibold">{chat.recipient}</div>
              <div className="text-sm text-gray-400 truncate">{chat.lastMessage}</div> {/* todo */}
            </li>
          ))}
        </ul>
      </div>

      {/* Multiple Chatboxes */}
      {activeChats.map((chat, index) => (
        <Chatbox 
          key={chat.id.toString()}
          activeChat={chat} 
          isChatOpen={true} // All chatboxes are open by default
          closeChatbox={() => closeChatbox(chat.id.toString())}
          index={index} 
          totalChatCount={activeChats.length} // Pass total count of chatboxes
        />
      ))}
    </div>
  );
};

export default MessengerSidebar;
