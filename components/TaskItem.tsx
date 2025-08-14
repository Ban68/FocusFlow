import React from 'react';

interface TaskItemProps {
  title: string;
  progress?: {
    current: number;
    total: number;
  };
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, progress, actions, onClick, className = '' }) => {
  const percentage = progress && progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex-1">
        <p className="font-medium text-white">{title}</p>
        {progress && (
          <div className="flex items-center text-sm text-slate-400 mt-1">
            <span>{progress.current} / {progress.total}</span>
            <div className="w-full bg-slate-600 rounded-full h-1.5 ml-2">
              <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-2 ml-4">
          {actions}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
