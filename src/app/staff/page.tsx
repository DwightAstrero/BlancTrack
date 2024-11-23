//staff
// page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../lib/supabaseClient';
import MessengerSidebar from '../component/MessengerSidebar';
import LeftSidebar from '../component/leftSidebar';
import DeadlinePopup from '../component/popups'; // Import the DeadlinePopup component

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  priorityLevel: string;
  staff: string;
  manager: string;
  createdAt: string;
  note: string;
}

const StaffDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [position, setPosition] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<{ name: string; message: string } | null>(null);
  const [ping, setPing] = useState<number>(0);
  const [showDeadlinePopup, setShowDeadlinePopup] = useState(false);
  const [showOverduePopup, setShowOverduePopup] = useState(false);
  const [approachingTasks, setApproachingTasks] = useState<Task[]>([]); // State for tasks with approaching deadlines
  const router = useRouter();

  useEffect(() => {
    const isValidRedirect = async () => {
      const email = localStorage.getItem('userEmail');
      
      if (!email) {
        router.push('/login');
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
    if (position && position !== 'staff') {
      router.push(`/${position}`);
    }
  }, [position]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data: tasks, error } = await supabase.from('task').select('*');
        if (error) {
          throw error;
        }
        setTasks(tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
  };

  useEffect(() => {
    const fetchStaffName = async () => {
      const fetchEmail = localStorage.getItem('userEmail');

      const { data, error } = await supabase.from('user').select('firstname, lastname').eq('email', fetchEmail).single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      const staffFirstName = data?.firstname;
      const staffLastName = data?.lastname;
      const staffFullName = `${staffFirstName} ${staffLastName}`;

      setStaffName(staffFullName);
    };

    fetchStaffName();
  }, []);

  const openChat = (name: string, message: string) => {
    setActiveChat({ name, message });
    setIsChatOpen(true);
  };

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

  const filteredTasks = tasks.filter(task => task.staff === staffName && (filterStatus ? task.status === filterStatus : true));

  const sortedTasks = filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const isDeadlineStatus = (task: Task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    const isApproachingDeadline =
      daysDiff >= 0 && daysDiff <= 5 && task.status !== 'Completed' && task.staff === staffName;

    const isOverdue =
      daysDiff < 0 && task.status !== 'Completed' && task.staff === staffName;

    return { isApproachingDeadline, isOverdue };
  };

  useEffect(() => {
    const countApproachingDeadlines = () => {
      const tasksWithDeadlines = tasks.filter(task => {
        return task.status !== 'Completed' && isDeadlineStatus(task).isApproachingDeadline;
      });

      const tasksOverdue = tasks.filter(task => {
        return task.status !== 'Completed' && isDeadlineStatus(task).isOverdue;
      });

      setApproachingTasks(tasksWithDeadlines);
      const ping = tasksWithDeadlines.length+tasksOverdue.length;
      setPing(ping);
      localStorage.setItem('ping', ping.toString());

      if (tasksWithDeadlines.length > 0)
        setShowDeadlinePopup(true);
      if (tasksOverdue.length > 0)
        setShowOverduePopup(true);
    };
    
    countApproachingDeadlines();
  }, [tasks]);

  const closePopup = () => {
    setShowDeadlinePopup(false);
  };

  const closeOverdue = () => {
    setShowOverduePopup(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex">

      {/* Sidebar */}
      <LeftSidebar  
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        userId={userId}
        position={position}
        ping={ping}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        } } />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-center mb-8">Task Dashboard</h1>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="status-filter" className="text-gray-700">Filter By Status:</label>
            <select id="status-filter" className="w-48 p-2 border border-gray-300 rounded" onChange={handleFilterChange} value={filterStatus || ''}>
              <option value="">All</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sortedTasks.map(task => (
              <div key={task.id} className={`p-4 rounded shadow hover:shadow-md transition-shadow duration-200 cursor-pointer ${{
                  'In Progress': 'bg-yellow-200',
                  'Completed': 'bg-lime-200',
                  'Not Started': 'bg-orange-200'
                }[task.status]}`}>
                <div>
                    <h2 className="text-lg font-bold mb-2">{task.title}</h2>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-600 mt-5">Status: {task.status}</p>
                    <p className="text-sm text-gray-600 mt-2">Due Date: {task.dueDate}</p>
                    <p className="text-sm text-gray-600 mt-2">Priority: {task.priorityLevel}</p>
                    <p className="text-sm text-gray-600 mt-5">Created by: {task.manager}</p>
                    <p className="text-sm text-gray-600 mt-3">Assigned to: {task.staff}</p>
                    <p className="text-sm text-gray-600 mt-5">Note: {task.note || 'None'}</p>

                    {isDeadlineStatus(task).isApproachingDeadline && (
                      <p className="text-red-500 text-sm font-bold mt-2">Approaching Deadline!</p>
                    )}
                    {isDeadlineStatus(task).isOverdue && (
                      <p className="text-red-500 text-sm font-bold mt-2">Overdue!</p>
                    )}
                </div>
                <div className="text-right mt-2">
                  <Link href={`/status/${task.id}`} passHref>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                      </svg>
                    </button>
                  </Link>
                </div>
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

      <div className="fixed flex flex-col right-0">
        {/* Deadline Popup */}
        {showDeadlinePopup && (
        <DeadlinePopup
          close={closePopup}
          tasks={tasks.filter(task => task.staff === staffName && isDeadlineStatus(task).isApproachingDeadline)} // Filter tasks for the logged-in user
          title="Approaching Deadlines!"
        />
        )}
        {/* Overdue Popup */}
        {showOverduePopup && (
          <DeadlinePopup
            close={closeOverdue}
            tasks={tasks.filter(task => task.staff === staffName && isDeadlineStatus(task).isOverdue)} // Filter tasks for the logged-in user
            title="Overdue!"
          />
        )}
      </div>

    </div>
  );
};

export default StaffDashboard;
