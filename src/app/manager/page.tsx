//manager
//page.tsx

'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import supabase from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import MessengerSidebar from '../component/MessengerSidebar';
import LeftSidebar from '../component/leftSidebar';
import DeadlinePopup from '../component/popups';

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

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [managerName, setManagerName] = useState('');
  const [position, setPosition] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [activeChat, setActiveChat] = useState<{ name: string; message: string } | null>(null);  //CHAT
  const [ping, setPing] = useState<number>(0);  // Variable to store approaching deadlines count
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
    if (position && position != 'manager') {
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

  const handleDelete = async (taskId: number) => {
    try {
      const { error } = await supabase.from('task').delete().eq('id', taskId);
      if (error) {
        throw error;
      }
      setTasks(tasks.filter(task => task.id !== taskId));
      closeModal();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    router.push('/login');
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
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
  };

  useEffect(() => {
    const fetchManagerName = async () => {
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

      const managerFirstName = data?.firstname;
      const managerLastName = data?.lastname;
      const managerFullName = `${managerFirstName} ${managerLastName}`;

      setManagerName(managerFullName);
    };

    fetchManagerName();
  }, []);


  const openChat = (name: string, message: string) => {
    setActiveChat({ name, message });
    setIsChatOpen(true);
  };

  const filteredTasks = tasks.filter(task => task.manager === managerName && (filterStatus ? task.status === filterStatus : true));

  const sortedTasks = filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const isDeadlineStatus = (task: Task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    const isApproachingDeadline =
      daysDiff >= 0 && daysDiff <= 5 && task.status !== 'Completed' && task.manager === managerName;

    const isOverdue =
      daysDiff < 0 && task.status !== 'Completed' && task.manager === managerName;

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
    <div className="min-h-screen w-full bg-brand-cream flex overflow-hidden">

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
            <select id="status-filter" className="w-48 p-2 border border-gray-300 rounded" onChange={handleFilterChange} value={filterStatus || ''}>
              <option value="">All</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
         
          {/* Archive Button */}
          <div className="flex-grow">
            <Link href="/manager/archive">
              <button className="px-4 py-2 border-2 border-red-500 bg-brand-brown text-white rounded hover:bg-brand-lgreen shadow-md hover:shadow-lg transition duration-300">
                Archive ?
              </button>
            </Link>
          </div>
            
          <div className="flex-grow"></div>
            <Link href="/manager/create-task">
                <h2 className="px-4 py-2 bg-brand-brown text-white rounded hover:bg-brand-lgreen">+Add</h2>
            </Link>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 gap-6">
            {sortedTasks.map(task => (
              <div key={task.id} className={`p-4 rounded shadow hover:shadow-md transition-shadow duration-200 cursor-pointer ${{'In Progress': 'bg-yellow-200', 'Completed': 'bg-lime-200', 'Not Started': 'bg-orange-200'}[task.status]}`}>
                <div>
                  <h2 className="text-lg font-bold mb-2">{task.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">Description: {task.description}</p>
                  <p className="text-sm text-gray-600 mt-5">Status: {task.status}</p>
                  <p className="text-sm text-gray-600 mt-2">Due Date: {task.dueDate}</p>
                  <p className="text-sm text-gray-600 mt-2">Priority: {task.priorityLevel}</p>
                  <p className="text-sm text-gray-600 mt-5">Created by: {task.manager}</p>
                  <p className="text-sm text-gray-600 mt-3">Assigned to: {task.staff}</p>
                  <p className="text-sm text-gray-600 mt-5">Note: {task.note || 'None'}</p>
                    
                  {/* Display "Approaching Deadlines" warning if applicable */}
                  {isDeadlineStatus(task).isApproachingDeadline && (
                      <p className="text-red-500 text-sm font-bold mt-2">Approaching Deadline!</p>
                    )}
                  {isDeadlineStatus(task).isOverdue && (
                      <p className="text-red-500 text-sm font-bold mt-2">Overdue!</p>
                    )}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Link href={`/manager/edit-task/${task.id}`} passHref>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                      </svg>
                    </button>
                  </Link>
                  <button onClick={() => openModal(task.id)} className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                <p className="mb-4">Are you sure you want to delete this task?</p>
                <div className="flex justify-end space-x-4">
                  <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                  <button onClick={() => handleDelete(selectedTaskId as number)} className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-400">Delete</button>
                </div>
              </div>
            </div>
          )}
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
          tasks={tasks.filter(task => task.manager === managerName && isDeadlineStatus(task).isApproachingDeadline)} // Filter tasks for the logged-in user
          title="Approaching Deadlines!"
        />
        )}
        {/* Overdue Popup */}
        {showOverduePopup && (
          <DeadlinePopup
            close={closeOverdue}
            tasks={tasks.filter(task => task.manager === managerName && isDeadlineStatus(task).isOverdue)} // Filter tasks for the logged-in user
            title="Overdue!"
          />
        )}
      </div>

    </div>
  );
};

export default ManagerDashboard;