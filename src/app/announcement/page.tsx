'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../lib/supabaseClient';
import MessengerSidebar from '../component/MessengerSidebar';
import LeftSidebar from '../component/leftSidebar';
interface Announcement {
  id: number;
  title: string;
  description: string;
  author: string;
  created_at: string;
};

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [position, setPosition] = useState('');
  const [userId, setUserId] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [activeChat, setActiveChat] = useState<{ name: string; message: string } | null>(null);  //CHAT
  const [ping, setPing] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const isValidRedirect = async () => {
      const email = localStorage.getItem('userEmail');
      
      if (!email) {
        router.push('/');
      }
    };

    isValidRedirect();
  }, []);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const { data: announcements, error } = await supabase.from('announcement').select('*');
        if (error) {
          throw error;
        }
        setAnnouncements(announcements || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    }

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    async function fetchPosition() {
      const email = localStorage.getItem('userEmail');
      try {
        const { data, error } = await supabase.from('user').select('position').eq('email', email).single();
        if (error) {
          throw error;
        }
        setPosition(data.position);
      } catch (error) {
        console.error('Error fetching position:', error);
      }
    }

    fetchPosition();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const email = localStorage.getItem('userEmail');
      const { data, error } = await supabase.from('user').select('id').eq('email', email).single();

      if (error) {
        console.error('Error:', error.message);
        return;
      }
      if (data) {
        setUserId(data.id);
      }
    };

    fetchUserId();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openChat = (name: string, message: string) => {
    setActiveChat({ name, message });
    setIsChatOpen(true);
  };

  useEffect(() => { // update notifications circle
    const tempPing = localStorage.getItem('ping');
    if(tempPing)
      setPing(parseInt(tempPing));
  });

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="relative">
        {/* Sidebar */}
        <LeftSidebar isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        userId={userId} onClose={function (): void {
          throw new Error('Function not implemented.');
        } }
        position={position} ping={ping}                    /> 

        {/* Main Content */}
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Announcements</h1>
          <div className="space-y-4">
            {announcements.map(announcement => (
              <div key={announcement.id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <h2 className="text-lg font-bold mb-2">{announcement.title}</h2>
                <p className="text-sm text-gray-600">{announcement.description}</p>
                <h3 className="text-sm text-gray-600 mt-5">Published by {announcement.author} on {announcement.created_at}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messenger Sidebar */}
      <MessengerSidebar openChat={openChat} />

      {/* Chatbox */}
      {activeChat && (
        <div className={`fixed bottom-0 right-0 w-96 transition-transform duration-300 transform ${isChatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-white border border-gray-300 rounded-t-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-800 text-white cursor-pointer" onClick={() => setIsChatOpen(false)}>
              Chat with {activeChat.name}
            </div>
            <div className="p-4" style={{ height: '300px', overflowY: 'scroll' }}>
              {/* Display messages */}
              <div className="message">{activeChat.message}</div>
            </div>
          </div>
          <div className="bg-gray-800 h-4 shadow-inner"></div>
        </div>
      )}
    </div>
    
  );
};

export default AnnouncementsPage;