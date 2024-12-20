'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import supabase from '@/lib/supabaseClient';
const CreateTask = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<{ label: string; value: string | null }>({ label: 'Select Status', value: null });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<{ label: string; value: string | null }>({ label: 'Select Priority', value: null });
  const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);
  const [staff, setStaff] = useState<{ label: string; value: string | null }>({ label: 'Select Staff', value: null });
  const [note, setNote] = useState('');
  const [position, setPosition] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date());
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);

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
    async function fetchStaff() {
      try {
        const { data: staff, error } = await supabase.from('user').select('firstname, lastname').eq('position', 'staff');
        if (error) {
          throw error;
        }
        const options = staff.map((member: any) => ({
          label: `${member.firstname} ${member.lastname}`,
          value: `${member.firstname} ${member.lastname}`
        }));
        setStaffOptions(options);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    }

    const fetchAllTasks = async () => {
      const { data, error } = await supabase.from('task').select('id, title, status, staff');
      if (error) {
        console.error('Error fetching all tasks:', error);
        return;
      }
      setAllTasks(data);
    };

    fetchStaff();
    fetchAllTasks();
  }, []);

  const handleDependencyChange = (taskId: string) => {
    setDependencies(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started':
        return '#FBD38D';
      case 'In Progress':
        return '#FEFCBF';
      case 'Completed':
        return '#D9F99D';
      default:
        return 'gray';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!status.value || !dueDate || !priority.value || !staff.value) {
      alert('Please fill out all of the fields.');
      return;
    }

    const email = localStorage.getItem('userEmail');
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('firstname, lastname')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return;
    }

    const managerName = `${user.firstname} ${user.lastname}`;

    const newTask = {
      title,
      description,
      status: status.value,
      dueDate: dueDate.toISOString(),
      priorityLevel: priority.value,
      staff: staff.value,
      manager: managerName,
      createdAt: createdAt.toISOString(),
      dependencies,
    };

    const { error } = await supabase.from('task').insert([newTask]);

    if (error) {
      console.error('Error creating task:', error);
      return;
    }

    router.push('/manager');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Create Task</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Select
              id="status"
              name="status"
              value={status}
              onChange={(selectedOption) => setStatus(selectedOption as { label: string; value: string })}
              options={[
                { label: 'Select Status', value: null },
                { label: 'Not Started', value: 'Not Started' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
              ]}
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
            <DatePicker
              id="dueDate"
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority Level</label>
            <Select
              id="priority"
              name="priority"
              value={priority}
              onChange={(selectedOption) => setPriority(selectedOption as { label: string; value: string })}
              options={[
                { label: 'Select Priority', value: null },
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
              ]}
            />
          </div>
          <div>
            <label htmlFor="staff" className="block text-sm font-medium text-gray-700">Assign To</label>
            <Select
              id="staff"
              name="staff"
              value={staff}
              onChange={(selectedOption) => setStaff(selectedOption as { label: string; value: string })}
              options={[
                { label: 'Select Staff', value: null },
                ...staffOptions
              ]}
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              id="note"
              name="note"
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="dependencies" className="block text-sm font-medium text-gray-700">Dependencies</label>
            <div>
              {allTasks
                .filter(task => task.staff === staff.value)
                .map(task => (
                  <div
                    key={task.id}
                    style={{
                      backgroundColor: getStatusColor(task.status),
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={dependencies.includes(task.id.toString())}
                      onChange={() => handleDependencyChange(task.id.toString())}
                      style={{ marginRight: '8px' }}
                    />
                    <span>{task.title}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-900">
              <p>Today is: {createdAt.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="space-y-4">
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Create Task</button>
          </div>
          <div className="text-sm text-center">
            <Link href="/manager">
              <h2 className="font-medium text-brand-dgreen">Return to dashboard</h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;