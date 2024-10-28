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
}

const AdminDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [position, setPosition] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [activeChat, setActiveChat] = useState<{ name: string; message: string } | null>(null);  //CHAT
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
    const fetchPosition = async () => {
      const email = localStorage.getItem('userEmail');
      const { data, error } = await supabase
        .from('user')
        .select('position')
        .eq('email', email)
        .single();

      if (error) {
        throw error;
      }
      if (data) {
        setPosition(data.position);
      }
    };

    fetchPosition();
  }, []);

  useEffect(() => {
    if (position && position != 'admin') {
      router.push(`/${position}`);
    }
  }, [position]);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const { data: announcements, error } = await supabase
          .from('announcement')
          .select('*');

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
    const fetchUserId = async () => {
      const email = localStorage.getItem('userEmail');
      const { data, error } = await supabase
        .from('user')
        .select('id')
        .eq('email', email)
        .single();

      if (error) {
        throw error;
      }
      if (data) {
        setUserId(data.id);
      }
    };

    fetchUserId();
  }, []);

  const handleDelete = async () => {
    if (selectedAnnouncementId !== null) {
      try {
        const { error } = await supabase
          .from('announcement')
          .delete()
          .eq('id', selectedAnnouncementId);
          
        if (error) {
          throw error;
        }

        setAnnouncements(announcements.filter(announcement => announcement.id !== selectedAnnouncementId));
        setIsModalOpen(false);
        setSelectedAnnouncementId(null);

      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = (announcementId: number) => {
    setSelectedAnnouncementId(announcementId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncementId(null);
  };

  useEffect(() => {
    const fetchAuthorName = async () => {
      const fetchEmail = localStorage.getItem('userEmail');

      const { data, error } = await supabase
        .from('user')
        .select('firstname, lastname')
        .eq('email', fetchEmail)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      const authorFirstName = data?.firstname;
      const authorLastName = data?.lastname;
      const authorFullName = `${authorFirstName} ${authorLastName}`;

      setAuthorName(authorFullName);
    };

    fetchAuthorName();
  }, []);

  const filteredAnnouncements = announcements.filter(announcement => announcement.author === authorName);

  const openChat = (name: string, message: string) => {
    setActiveChat({ name, message });
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="relative">
        {/* Sidebar */}
        <LeftSidebar  isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    handleLogout={handleLogout}
                    userId={userId} onClose={function (): void {
                      throw new Error('Function not implemented.');
                    } }
                    position={position}
                    />

        {/* Main Content */}
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Announcements</h1>
          <div className="flex justify-end mb-4">
            <Link href="/announcement/create-announcement">
                <h2 className="px-4 py-2 bg-brand-brown text-white rounded hover:bg-brand-lgreen">+ Create New</h2>
            </Link>
          </div>
          <div className="space-y-4">
            {filteredAnnouncements.map(announcement => (
              <div key={announcement.id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <h2 className="text-lg font-bold mb-2">{announcement.title}</h2>
                <p className="text-sm text-gray-600">{announcement.description}</p>
                <h3 className="text-sm text-gray-600 mt-5">Published by {announcement.author} on {announcement.created_at}</h3>
                <div className="flex justify-end mt-4 space-x-2">
                  <Link href={`/announcement/edit-announcement/${announcement.id}`} passHref>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                      </svg>
                    </button>
                  </Link>
                    <button onClick={() => openModal(announcement.id)} className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this announcement?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-400">Delete</button>
            </div>
          </div>
        </div>
      )}

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

export default AdminDashboard;