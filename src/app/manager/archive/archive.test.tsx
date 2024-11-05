// File: /manager/archive/page.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import Archive from './page';
import { useRouter } from 'next/navigation';

jest.mock('../../../lib/supabaseClient', () => {
  return {
    __esModule: true,
    default: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { firstname: 'John', lastname: 'Doe' },
        error: null,
      }),
    },
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Archive Component Rendering', () => {
  it('renders the Archive component', async () => {
    await act(async () => {
      render(<Archive />);
    });
    const headingElement = screen.getByText(/Archived Tasks/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('renders the filter inputs', async () => {
    await act(async () => {
      render(<Archive />);
    });
    const startDateInput = screen.getByLabelText(/Start Date/i);
    expect(startDateInput).toBeInTheDocument();

    const endDateInput = screen.getByLabelText(/End Date/i);
    expect(endDateInput).toBeInTheDocument();

    const taskTypeSelect = screen.getByLabelText(/Task Type/i);
    expect(taskTypeSelect).toBeInTheDocument();

    const employeeSelect = screen.getByLabelText(/Employee/i);
    expect(employeeSelect).toBeInTheDocument();
  });

  it('renders filter options for task types', async () => {
    await act(async () => {
      render(<Archive />);
    });
    const taskTypeSelect = screen.getByLabelText(/Task Type/i);
    expect(taskTypeSelect).toHaveTextContent('All');
    expect(taskTypeSelect).toHaveTextContent('High Priority');
    expect(taskTypeSelect).toHaveTextContent('Medium Priority');
    expect(taskTypeSelect).toHaveTextContent('Low Priority');
  });

  it('renders filter options for employees', async () => {
    await act(async () => {
      render(<Archive />);
    });
    const employeeSelect = screen.getByLabelText(/Employee/i);
    expect(employeeSelect).toHaveTextContent('All');
  });
});
