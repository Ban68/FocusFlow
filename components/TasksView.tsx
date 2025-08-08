
import React, { useState } from 'react';
import type { Task } from '../types';
import { ICONS } from '../constants';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskItem: React.FC<{
  task: Task;
  onToggleToday: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ task, onToggleToday, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
      <div>
        <p className="font-medium text-white">{task.title}</p>
        <p className="text-sm text-slate-400">Est. Pomodoros: {task.pomodoros}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onToggleToday(task.id)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${task.isToday ? 'bg-cyan-500 text-slate-900 font-semibold' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
        >
          {task.isToday ? 'Today' : 'Add to Today'}
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
          {ICONS.TRASH}
        </button>
      </div>
    </div>
  );
};

const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomos, setNewTaskPomos] = useState(1);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: newTaskTitle.trim(),
        pomodoros: newTaskPomos,
        pomodorosCompleted: 0,
        isToday: false,
        completed: false,
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setNewTaskPomos(1);
    }
  };

  const handleToggleToday = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, isToday: !t.isToday } : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
  
  const todayTasks = tasks.filter(t => t.isToday && !t.completed);
  const inventoryTasks = tasks.filter(t => !t.isToday && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex items-center space-x-4">
              <label htmlFor="pomos" className="text-slate-300">Est. Pomodoros:</label>
              <input
                type="number"
                id="pomos"
                value={newTaskPomos}
                onChange={(e) => setNewTaskPomos(Math.max(1, parseInt(e.target.value, 10)))}
                min="1"
                className="w-20 bg-slate-700 text-white p-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button type="submit" className="w-full flex justify-center items-center space-x-2 bg-cyan-500 text-slate-900 font-bold p-3 rounded-lg hover:bg-cyan-400 transition-colors">
              {ICONS.PLUS} <span>Add to Inventory</span>
            </button>
          </form>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4">To-Do Today</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {todayTasks.length > 0 ? todayTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggleToday={handleToggleToday} onDelete={handleDeleteTask} />
                )) : <p className="text-slate-400">No tasks for today.</p>}
            </div>
        </div>

        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4">Activity Inventory</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {inventoryTasks.length > 0 ? inventoryTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggleToday={handleToggleToday} onDelete={handleDeleteTask} />
                )) : <p className="text-slate-400">Inventory is empty. Add a task!</p>}
            </div>
        </div>
         <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 opacity-60">
            <h2 className="text-xl font-bold text-white mb-4">Completed</h2>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {completedTasks.length > 0 ? completedTasks.map(task => (
                   <div key={task.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg text-slate-500 line-through">
                      <p>{task.title}</p>
                   </div>
                )) : <p className="text-slate-500">No completed tasks yet.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TasksView;
