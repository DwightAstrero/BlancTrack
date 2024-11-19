import React from 'react';

interface Task {
  title: string;
  dueDate: string;
}

interface DeadlinePopupProps {
  tasks: Task[];
  close: () => void; // Prop to close the popup
}

const DeadlinePopup: React.FC<DeadlinePopupProps> = ({ tasks, close }) => {
  return (
    <div className="fixed top-0 right-0 m-4 p-4 bg-red-500 text-white rounded-lg shadow-lg z-50 w-72">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Approaching Deadlines!</h3>
        <button onClick={close} className="text-white font-bold text-xl">&times;</button>
      </div>
      <div>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index} className="mb-3">
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm">Deadline: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-sm">No tasks with approaching deadlines.</p>
        )}
      </div>
    </div>
  );
};

export default DeadlinePopup;
