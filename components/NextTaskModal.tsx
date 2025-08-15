import React from 'react';
import type { Task } from '../types';

interface NextTaskModalProps {
  isOpen: boolean;
  tasks: Task[];
  onSelect: (taskId: string) => void;
  onClose: () => void;
}

const NextTaskModal: React.FC<NextTaskModalProps> = ({ isOpen, tasks, onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">Select Next Task</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <button
                key={task.id}
                onClick={() => onSelect(task.id)}
                className="w-full text-left px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200"
              >
                {task.title}
              </button>
            ))
          ) : (
            <p className="text-slate-400">No tasks available.</p>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextTaskModal;
