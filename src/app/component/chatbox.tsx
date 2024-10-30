// Chatbox.tsx
'use client'
import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';

interface ChatboxProps {
  activeChat: { id: BigInteger; user1: string; user2: string; messages: { sender: string; content: string }[] };
  isChatOpen: boolean;
  closeChatbox: () => void;
  index: number;
  totalChatCount: number;
}

const Chatbox: React.FC<ChatboxProps> = ({ activeChat, isChatOpen, closeChatbox, index, totalChatCount }) => {
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    const fetchAuthorName = async () => {
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

      setUsername(data?.id);
    }; 
    fetchAuthorName();
  }, []);

  useEffect(() => {
    const fetchRecipient = async () => {
      var recipientId;
      console.log(username);
      if (username === activeChat.user2) 
        recipientId = activeChat.user1;
      else recipientId = activeChat.user2;

      const { data, error } = await supabase
        .from('user')
        .select('firstname, lastname')
        .eq('id', recipientId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      const fName = data?.firstname;
      const lName = data?.lastname;
      const fullName = `${fName} ${lName}`;

      setRecipient(fullName);
    }; 
    fetchRecipient();
  }, [username]);

  // TODO: set to update database
  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      console.log({
        chatId: activeChat.id,
        newMessage: newMessage,
        userId: username
      });
      
      /* const { data, error } = await supabase
      .rpc('add_message', {
        'chatId': activeChat.id,
        'newMessage': newMessage,
        'userId': username
      }); 

      const newMessageData = {
        sender: username,
        content: newMessage,
      }*/

      activeChat.messages.push({ sender: username, content: newMessage });
      setNewMessage('');

      const { error } = await supabase
      .from('chat')
      .update({ messages: activeChat.messages }) // Use the updated messages
      .eq('id', activeChat.id);

      if (error) {
        console.error('Error updating messages:', error);
        return;
      }
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
          {recipient} {/* /////activeChat.name//////////////////////////// */}
        </div>
        <div className="p-4" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
          {/* Display messages */}
          {activeChat.messages.map((msg, idx) => (
            <div key={idx} className={`my-2 flex flex-col`}>
              {msg.sender !== username && (
                // ///////////////////////msg.sender/////////////////////////////
                <span className="text-gray-500 text-xs mb-1">{recipient}</span> // Display name for other users
              )}
              <div
                className={`p-2 ${
                  msg.sender === username
                    ? 'bg-blue-200 text-blue-800 ml-auto rounded-tl-lg rounded-tr-lg rounded-bl-lg' // User message (right-aligned, rounded top and left)
                    : 'bg-gray-200 text-gray-800 mr-auto rounded-tl-lg rounded-tr-lg rounded-br-lg' // Other user message (left-aligned, rounded top and right)
                }`}
                style={{ maxWidth: '75%', wordBreak: 'break-word' }} // Set maximum width for messages
              >
                <strong>{msg.sender === username ? '' : ''}</strong> {msg.content} {/* No strong tag for user */}
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
