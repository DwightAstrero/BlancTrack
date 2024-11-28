'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import supabase from '../../../lib/supabaseClient';

const Select = dynamic(() => import('react-select'), { ssr: false });

const UpdateStatus = () => {
  const router = useRouter();
  const taskId = useParams().id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<{ label: string; value: string }>({ label: 'Select Status', value: '' });
  const [note, setNote] = useState('');
  const [position, setPosition] = useState('');
  const [task, setTask] = useState<any>(null);
  const [dependencies, setDependencies] = useState<any[]>([]);

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
    const fetchTask = async () => {
      const { data, error } = await supabase
        .from('task')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.error('Error fetching task:', error);
        return;
      }

      setTask(data);
      setTitle(data.title);
      setDescription(data.description);
      setStatus({ label: data.status, value: data.status });
      setNote(data.note || '');
      setDependencies(data.dependencies || []);
    };

    fetchTask();
  }, [taskId]);

  const handleStatusChange = (selectedOption: { label: string; value: string }) => {
    setStatus(selectedOption);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if all dependencies are complete if trying to set status to "Completed"
    if (status.value === 'Completed') {
      const incompleteDependencies = dependencies.filter((depId: string) => {
        const depTask = dependencies.find((t: any) => t.id.toString() === depId);
        return depTask && depTask.status !== 'Completed';
      });

      if (incompleteDependencies.length > 0) {
        alert('Dependencies still need to be finished.');
        return;
      }
    }

    const { error } = await supabase
      .from('task')
      .update({ status: status.value })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task status:', error);
      alert('An error occurred while updating the task status.');
      return;
    }

    router.push('/staff');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Update Task Status</h3>
        {task && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <Select
                id="status"
                name="status"
                value={status}
                onChange={(option) => handleStatusChange(option as { label: string; value: string })}
                options={[
                  { label: 'Not Started', value: 'Not Started' },
                  { label: 'In Progress', value: 'In Progress' },
                  { label: 'Completed', value: 'Completed' },
                ]}
              />
            </div>
            <div className="space-y-4">
              <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Update Status</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateStatus;