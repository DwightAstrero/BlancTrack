import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Archive from '../../src/app/manager/archive/page'; 
import { useRouter } from 'next/navigation'; 
import supabase from '../../src/lib/supabaseClient'; 
import '@testing-library/jest-dom';

jest.mock('../../src/lib/supabaseClient', () => ({
  from: jest.fn(() => ({
    select: jest.fn(),
    eq: jest.fn(),
    single: jest.fn(),
  })),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Archive Component', () => {
  it('should render and display tasks', async () => {
    const mockManagerData = {
      data: { firstname: 'Chapo', lastname: 'Burrito' },
      error: null,
    };

    const mockTasksData = [
      {
        id: 1,
        title: 'Do Task',
        description: 'Complete the task',
        status: 'Completed',
        dueDate: '2024-12-01',
        priorityLevel: 'High',
        staff: 'Jaylen Brown',
        manager: 'Chapo Burrito',
        createdAt: '2024-11-01',
        note: 'DO ASAP PLS!',
      },
    ];

    const mockEmployeesData = [
      { id: 1, firstname: 'Jaylen', lastname: 'Brown', email: 'jaylen@gmail.com' },
    ];

    supabase.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          single: () => mockManagerData,
        }),
      }),
    }));
    supabase.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          data: mockTasksData,
          error: null,
        }),
      }),
    }));
    supabase.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          data: mockEmployeesData,
          error: null,
        }),
      }),
    }));

    useRouter.mockReturnValue({
      query: {},
    });

    render(<Archive />);

    await waitFor(() => expect(screen.getByText('Archived Tasks')).toBeInTheDocument());
    expect(screen.getByText('Do Task')).toBeInTheDocument();
    expect(screen.getByText('Description: Complete the task')).toBeInTheDocument();
    expect(screen.getByText('Assigned to: Jaylen Brown')).toBeInTheDocument();
    expect(screen.getByText('Created by: Chapo Burrito')).toBeInTheDocument();
    expect(screen.getByText('Due Date: 2024-12-01')).toBeInTheDocument();

    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Employee')).toBeInTheDocument();
  });
});