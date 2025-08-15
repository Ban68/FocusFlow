
import React, { useState } from 'react';
import type { Task } from '../types';
import { ICONS } from '../constants';
import TaskItem from './TaskItem';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomos, setNewTaskPomos] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPomos, setEditPomos] = useState(1);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const maxPriority = tasks.reduce((max, t) => Math.max(max, t.priority), 0);
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: newTaskTitle.trim(),
        pomodoros: newTaskPomos,
        pomodorosCompleted: 0,
        isToday: false,
        completed: false,
        priority: maxPriority + 1,
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

  const handleEditTask = (id: string, title: string, pomodoros: number) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, title, pomodoros, completed: t.pomodorosCompleted >= pomodoros }
        : t
    ));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditPomos(task.pomodoros);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTaskId && editTitle.trim()) {
      handleEditTask(editingTaskId, editTitle.trim(), editPomos);
      setEditingTaskId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const swapTaskPriority = (id1: string, id2: string) => {
    setTasks(prev => {
      const task1 = prev.find(t => t.id === id1);
      const task2 = prev.find(t => t.id === id2);
      if (!task1 || !task2) return prev;
      return prev.map(t => {
        if (t.id === id1) return { ...t, priority: task2.priority };
        if (t.id === id2) return { ...t, priority: task1.priority };
        return t;
      });
    });
  };
  
  const todayTasks = tasks.filter(t => t.isToday && !t.completed).sort((a, b) => a.priority - b.priority);
  const inventoryTasks = tasks.filter(t => !t.isToday && !t.completed).sort((a, b) => a.priority - b.priority);
  const completedTasks = tasks.filter(t => t.completed).sort((a, b) => a.priority - b.priority);

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
                  {todayTasks.length > 0 ? todayTasks.map((task, index) => (
                    editingTaskId === task.id ? (
                      <form key={task.id} onSubmit={handleSaveEdit} className="flex flex-col space-y-2 p-3 bg-slate-800 rounded-lg">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-slate-700 text-white p-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editPomos}
                            min={1}
                            onChange={(e) => setEditPomos(Math.max(1, parseInt(e.target.value, 10)))}
                            className="w-20 bg-slate-700 text-white p-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                          <div className="ml-auto space-x-2">
                            <button type="submit" className="px-3 py-1 text-sm rounded-full bg-cyan-500 text-slate-900 font-semibold">
                              Save
                            </button>
                            <button type="button" onClick={handleCancelEdit} className="px-3 py-1 text-sm rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <TaskItem
                        key={task.id}
                        title={task.title}
                        progress={{ current: task.pomodorosCompleted, total: task.pomodoros }}
                        actions={
                          <>
                            {index > 0 && (
                              <button onClick={() => swapTaskPriority(task.id, todayTasks[index - 1].id)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                                {ICONS.ARROW_UP}
                              </button>
                            )}
                            {index < todayTasks.length - 1 && (
                              <button onClick={() => swapTaskPriority(task.id, todayTasks[index + 1].id)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                                {ICONS.ARROW_DOWN}
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleToday(task.id)}
                              className={`px-3 py-1 text-sm rounded-full transition-colors ${task.isToday ? 'bg-cyan-500 text-slate-900 font-semibold' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                            >
                              {task.isToday ? 'Today' : 'Add to Today'}
                            </button>
                            <button onClick={() => startEditing(task)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                              {ICONS.EDIT}
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                              {ICONS.TRASH}
                            </button>
                          </>
                        }
                        className="bg-slate-800"
                      />
                    )
                  )) : <p className="text-slate-400">No tasks for today.</p>}
              </div>
          </div>

        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4">Activity Inventory</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {inventoryTasks.length > 0 ? inventoryTasks.map((task, index) => (
                    editingTaskId === task.id ? (
                      <form key={task.id} onSubmit={handleSaveEdit} className="flex flex-col space-y-2 p-3 bg-slate-800 rounded-lg">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-slate-700 text-white p-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editPomos}
                            min={1}
                            onChange={(e) => setEditPomos(Math.max(1, parseInt(e.target.value, 10)))}
                            className="w-20 bg-slate-700 text-white p-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                          <div className="ml-auto space-x-2">
                            <button type="submit" className="px-3 py-1 text-sm rounded-full bg-cyan-500 text-slate-900 font-semibold">
                              Save
                            </button>
                            <button type="button" onClick={handleCancelEdit} className="px-3 py-1 text-sm rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <TaskItem
                        key={task.id}
                        title={task.title}
                        progress={{ current: task.pomodorosCompleted, total: task.pomodoros }}
                        actions={
                          <>
                            {index > 0 && (
                              <button onClick={() => swapTaskPriority(task.id, inventoryTasks[index - 1].id)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                                {ICONS.ARROW_UP}
                              </button>
                            )}
                            {index < inventoryTasks.length - 1 && (
                              <button onClick={() => swapTaskPriority(task.id, inventoryTasks[index + 1].id)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                                {ICONS.ARROW_DOWN}
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleToday(task.id)}
                              className={`px-3 py-1 text-sm rounded-full transition-colors ${task.isToday ? 'bg-cyan-500 text-slate-900 font-semibold' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                            >
                              {task.isToday ? 'Today' : 'Add to Today'}
                            </button>
                            <button onClick={() => startEditing(task)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                              {ICONS.EDIT}
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                              {ICONS.TRASH}
                            </button>
                          </>
                        }
                        className="bg-slate-800"
                      />
                    )
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
