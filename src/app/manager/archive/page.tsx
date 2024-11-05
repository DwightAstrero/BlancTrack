'use client';

import React, { useEffect, useState } from 'react';
import supabase from '../../../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

const Archive = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [taskType, setTaskType] = useState<string>('');
  const [employee, setEmployee] = useState<string>('');
  const [employees, setEmployees] = useState<User[]>([]);
  const router = useRouter();
  const [managerName, setManagerName] = useState('');

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

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const { data, error } = await supabase
        .from('task')
        .select('*')
        .eq('status', 'Completed');

      if (error) {
        console.error('Error fetching completed tasks:', error);
      } else {
        setCompletedTasks(data || []);
        setFilteredTasks(data || []);
      }
    };

    fetchCompletedTasks();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('user')
        .select('id, firstname, lastname, email');

      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data || []);
      }
    };

    fetchEmployees();
  }, []);

  const handleFilterChange = () => {
    const filtered = completedTasks.filter(task => {
      const withinDateRange =
        (!startDate || new Date(task.dueDate) >= new Date(startDate)) &&
        (!endDate || new Date(task.dueDate) <= new Date(endDate));

      const matchesTaskType = !taskType || task.priorityLevel === taskType;
      const matchesEmployee = !employee || task.staff === employee;

      return withinDateRange && matchesTaskType && matchesEmployee;
    });

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [startDate, endDate, taskType, employee]);

  return (
    <div className="min-h-screen w-full bg-brand-cream flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-8">Archived Tasks</h1>
      <Link href="/manager">
        <button className="px-4 py-2 mb-4 font-medium text-white bg-brand-brown hover:bg-brand-lgreen">
          Back to Dashboard ⏪
        </button>
      </Link>

      {/* Filter Options */}
      <div className="mb-4 flex flex-row space-x-6">
        <div className="flex flex-col">
          <label htmlFor="start-date" className="block mb-1 font-bold">Start Date</label>
          <input 
            id="start-date"
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            className="border border-gray-300 rounded p-2 h-10"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end-date" className="block mb-1 font-bold">End Date</label>
          <input 
            id="end-date"
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
            className="border border-gray-300 rounded p-2 h-10"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="task-type" className="block mb-1 font-bold">Task Type</label>
          <select 
            id="task-type"
            value={taskType} 
            onChange={e => setTaskType(e.target.value)} 
            className="border border-gray-300 rounded p-2 h-10"
          >
            <option value="">All</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="employee" className="block mb-1 font-bold">Employee</label>
          <select 
            id="employee"
            value={employee} 
            onChange={e => setEmployee(e.target.value)} 
            className="border border-gray-300 rounded p-2 h-10"
          >
            <option value="">All</option>
            {employees.map(emp => (
              <option key={emp.id} value={`${emp.firstname} ${emp.lastname}`}>
                {emp.firstname} {emp.lastname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 gap-6">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="p-4 rounded shadow bg-lime-200"
            >
              <h2 className="text-lg font-bold mb-2">{task.title}</h2>
              <p className="text-sm text-gray-600 mb-2">Description: {task.description}</p>
              <p className="text-sm text-gray-600 mt-5">Status: {task.status}</p>
              <p className="text-sm text-gray-600 mt-2">Due Date: {task.dueDate}</p>
              <p className="text-sm text-gray-600 mt-2">Priority: {task.priorityLevel}</p>
              <p className="text-sm text-gray-600 mt-5">Created by: {task.manager}</p>
              <p className="text-sm text-gray-600 mt-3">Assigned to: {task.staff}</p>
              <p className="text-sm text-gray-600 mt-5">Note: {task.note || 'None'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Archive;
