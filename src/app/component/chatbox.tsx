'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';

interface ChatboxProps {
  activeChat: { id: BigInteger; user1: string; user2: string; messages: { sender: string; content: string }[]; recipient: string };
  isChatOpen: boolean;
  closeChatbox: () => void;
  index: number;
  totalChatCount: number;
}

const Chatbox: React.FC<ChatboxProps> = ({ activeChat, isChatOpen, closeChatbox, index, totalChatCount }) => {
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');

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

      setUserId(data?.id);
    };
    fetchAuthorName();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      activeChat.messages.push({ sender: userId, content: newMessage });
      setNewMessage('');

      const { error } = await supabase
        .from('chat')
        .update({ messages: activeChat.messages })
        .eq('id', activeChat.id);

      if (error) {
        console.error('Error updating messages:', error);
        return;
      }
    }
  };

  return (
    <div
      className={`w-96 transition-transform duration-300 transform ${
        isChatOpen ? 'translate-x-0' : 'translate-y-full'
      }`}
      style={{
        position: 'fixed',
        bottom: 0,
        right: `${index * 390}px`, // Adjust this spacing as needed for your layout
        zIndex: totalChatCount - index,
        flexShrink: 0,
      }}
    >
      <div className="bg-white border border-gray-300 rounded-t-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-800 text-white cursor-pointer" onClick={closeChatbox}>
          {activeChat.recipient}
        </div>
        <div className="p-4" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
          {activeChat.messages.length > 0 &&
            activeChat.messages.map((msg, idx) => (
              <div key={idx} className="my-2 flex flex-col">
                {msg.sender !== userId && (
                  <span className="text-gray-500 text-xs mb-1">{activeChat.recipient}</span>
                )}
                <div
                  className={`p-2 ${
                    msg.sender === userId
                      ? 'bg-blue-200 text-blue-800 ml-auto rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                      : 'bg-gray-200 text-gray-800 mr-auto rounded-tl-lg rounded-tr-lg rounded-br-lg'
                  }`}
                  style={{ maxWidth: '75%', wordBreak: 'break-word' }}
                >
                  {msg.content}
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
          <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </div>
      </div>
      <div className="bg-gray-800 h-4 shadow-inner"></div>
    </div>
  );
};

export default Chatbox;
